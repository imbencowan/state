import { runtime } from './runtime.js';
import { Label, InvoicePage, SoSPage, InventoryPage, labelPage } from './models/output-classes.js';
import { sizeList, ADULT_HOOD_STYLE_ID } from './constants.js';
import { modal, childModal } from './modal.js';
import { EventSite } from './models/db-classes.js';
import * as Helpers from './printHelpers.js';

//////////////////////////////////////////////////////////////////////////////////////////////////
// generating box labels
	// prints a single order's label
export function printBoxLabel({ order }) {
	// console.log(order);
	if (order.oItems.length === 0) {
		modal.open("This order is empty");
		return;
	}
		// Access jsPDF from the global object
	const { jsPDF } = window.jspdf; 
	const doc = new jsPDF('p', 'mm', 'letter');
	genBoxLabel(doc, order, 0);
	
		// Generate a Blob URL and open it in a new tab
	Helpers.openBlobInNewTab(doc);
}

	// prints labels for all orders not marked complete
export function printUndoneBoxLabels() {
		// get all incomplete orders
	let orders = runtime.stateEvent.getUndoneOrders();
        // check if there are any
    if (orders.length > 0) {
            // format is jsPDF(orientation, unit, format); 'p' = portrait
        const { jsPDF } = window.jspdf; 
        const doc = new jsPDF('p', 'mm', 'letter');
        
            // add a page as necessary
        let totalPageLabels = 0;
        for (let i = 0; i < orders.length; i++) {
            const count = genBoxLabel(doc, orders[i], (totalPageLabels % 4));
            totalPageLabels += count;
            
            if (((totalPageLabels % 4) === 0) && (i < orders.length - 1)) doc.addPage();
        }
         	// Generate a Blob URL and open it in a new tab
			Helpers.openBlobInNewTab(doc);
    } else {
            // if no incomplete orders, alert the user
        modal.open("There are no incomplete orders.")
    }
}

	// actual label generation
function genBoxLabel(doc, order, originI, lblN = 1) {
	// drawLabelRects(doc);
	
	const lbl = new Label(doc, originI, order.getBoxTotal(), lblN);	
		
		// this one is rotated to be vertical along the left edge
	lbl.addSiteDivision(order.site, order.division);
	
		// start the horizontal rows
	lbl.centerTextInLabel(order.sportStr, order.sportLblClr);
	
	lbl.lineY += 9;
	doc.setFontSize(18);
		// box the school name
	lbl.rectText(order.school.shortName, '#bce0ff', 'F');

	let minSize = order.getMinSize();
	let maxSize = order.getMaxSize();
	let szCnt = maxSize - minSize;
		// we should expand on this
	if (szCnt > 5) lbl.gridStep = 7.8;


		// label team line
	lbl.lineY += 8;
	lbl.addGridSizes(minSize, maxSize);
	
	const teamStyle = order.getTeamStyle();
	
		// put in the team quantities
	if (teamStyle) {
		lbl.lineY += 4.5;
		doc.setFontSize(11);
		doc.text("Team Hoods:", lbl.alignX, lbl.lineY);
		for (const color of Object.values(teamStyle.colors)) {
			lbl.addGridQuantities(Object.values(color.sizeMap), minSize, maxSize);
		}
	}
	
		// only do this if there are additional styles/transfers in order.
	if (order.hasAddOns()) {
		doc.setTextColor('666666');
		
		const addedStyles = Object.values(order.getAddedStyles());

			// allocate 1 line for transfers, if there are any	
		let trnsfrLines = (order.oTransfers.length) ? 1 : 0;
			// only print 'Additional' if space permits
		if ((addedStyles.length + trnsfrLines) < 5) {
			lbl.lineY += 8;
			doc.text("Additional", lbl.indentX, lbl.lineY);
		}

			// make each line of added shirts, if there are any
		if (addedStyles.length) {
			addedStyles.forEach(style => {
				lbl.lineY += 6;
				doc.text(style.style.shortName, lbl.alignX, lbl.lineY);
				for (const color of Object.values(style.colors)) {
					lbl.addGridQuantities(Object.values(color.sizeMap), order.getMinSize(), order.getMaxSize());
				}
			});
		}
			// make a line for the number of transfers added
				// adding a line for each potential transfer is beyond the scope of this label. 
					// itemization is for the invoice
						// this label specifies what is in this box, and a total number of transfers accomplishes that
		if (order.oTransfers.length) {
			let ttlTrnsfrs = 0
			order.oTransfers.forEach(t => {
				ttlTrnsfrs += t.quantity;
			});
			lbl.lineY += 6;
			doc.text('transfers', lbl.alignX, lbl.lineY);
			lbl.addGridTotal(ttlTrnsfrs, szCnt);
		}
		doc.setFontSize(14);
		lbl.lineY += 9;
		doc.setTextColor('#000000');
			// write amount due for add ons
		let txt = "Due: $" + order.due;
		if (!order.paid) {
			let txtWdth = doc.getTextWidth(txt);
			doc.setFillColor('#ffff00');
			doc.rect((lbl.lineX - 1), (lbl.lineY + 1), (txtWdth + 2), -7, "F");
		}
		doc.text(txt, lbl.lineX, lbl.lineY);
			// if order is paid, mark PAID
		if (order.paid) {
			doc.setTextColor('#ff0000'); // red
			let txtWdth = doc.getTextWidth(txt);
			doc.text(" PAID", lbl.lineX + txtWdth, lbl.lineY);
			doc.setTextColor('#000000'); // Black
		}
	}
		// more printing, separate for readability
	addReturnWarning(doc, lbl);
	
	lbl.addBoxSymbol();
		
		// handle box size and additional labels for multiple boxes
	if (lbl.totalShirts > 28) {
			// print box x/y
		lbl.addBoxX();
			// if this is not the last box of the order, print the label for the next box of the order
		if (lbl.totalLabels > lbl.lblN) {
			const nextOrigin = (++originI % 4);
			if (nextOrigin == 0) doc.addPage(); 
			genBoxLabel(doc, order, nextOrigin, ++lblN);
		}
	}

		// allows printUndoneBoxLabels to know where to position the next label. necessary for multi box orders
	return lbl.totalLabels;
}

	// pdf addendum in it's own function for readability
function addReturnWarning(doc, lbl) {
	lbl.lineX = lbl.alignX;
	lbl.lineY = lbl.origin.y + 75;
	
	doc.line(lbl.lineX, lbl.lineY, (lbl.oX + lbl.width - lbl.padding), lbl.lineY)
	lbl.lineY += 7;
	
	doc.setTextColor(255, 0, 0); // red
	// doc.setFont('helvetica', 'bold');
	doc.setFontSize(18);
	lbl.centerTextInLabel("NO EXCHANGES");
		// switch the text back
	doc.setFont('helvetica', 'normal');
	doc.setTextColor(0, 0, 0); // black
	lbl.lineY += 4.5;
	
	
	doc.setFontSize(10);
	const explnTxt = "All orders are pre-printed to the specifications of the order submitted by your administrator.";
	const maxWidth = lbl.width - lbl.offsetX - lbl.padding;
		// multi line
	let lines = doc.splitTextToSize(explnTxt, maxWidth);
	doc.text(lines, lbl.lineX, lbl.lineY);
	
	lbl.lineY += 12;
	doc.setFontSize(12);
	const rtrnTxt = "Please verify contents before distributing. If there are any discrepancies between the contents in the box " +
						 "and the printed label on the box the ENTIRE order and box must be returned";

	
	lines = doc.splitTextToSize(rtrnTxt, maxWidth);
	// const lineHeight = doc.getFontSize() / doc.internal.scaleFactor + 2; // add padding between lines if needed

	let underlineWord = "ENTIRE";
	let x = lbl.lineX;
	let y = lbl.lineY;

	lines.forEach((line, i) => {
		doc.text(line, x, y);
		if (line.includes(underlineWord)) {
				// Find offset of the word within the line
			const parts = line.split(underlineWord);
			const beforeWidth = doc.getTextWidth(parts[0]);
			const wordWidth = doc.getTextWidth(underlineWord);

				// Draw underline under the word
			const underlineY = y + 0.7; // a little below baseline
			doc.line(x + beforeWidth, underlineY, x + beforeWidth + wordWidth, underlineY);
		}

		y += 5;
	});
}

	// currently commented out, useful if you want to see the label areas on the generated pdf
function drawLabelRects(doc) {
	labelPage.origins.forEach(coord => {
		doc.rect(coord.x, coord.y, labelPage.labelWidth, labelPage.labelHeight);
	});
}

//////////////////////////////////////////////////////////////////////////////////////////////////
// generating sign of sheets (SoS)
	// print all sign off sheets
export function printAllSoSPDF() {
	if (!runtime.stateEvent) return;
	
		// Access jsPDF from the global object
	const { jsPDF } = window.jspdf; 
   const doc = new jsPDF('p', 'mm', 'letter');
	
	
	for (let i = 0; i < runtime.stateEvent.eventSites.length; ++i) {
		let es = runtime.stateEvent.eventSites[i];
		for (let j = 0; j < es.esDivisions.length; ++j) {
			genSoS(doc, es.esDivisions[j]);
			if ((i < runtime.stateEvent.eventSites.length - 1) || (j < es.esDivisions.length - 1)) {
				doc.addPage();
			}
		}
	}
	
		// Generate a Blob URL and open it in a new tab
	Helpers.openBlobInNewTab(doc);
}

	// print a single sign off sheet
export function printSoSPDF(div) {
	if (!div) return;
	
		// Access jsPDF from the global object
	const { jsPDF } = window.jspdf; 
   const doc = new jsPDF('p', 'mm', 'letter');
	genSoS(doc, div);
	
		// Generate a Blob URL and open it in a new tab
	Helpers.openBlobInNewTab(doc);
}

	// actually generate each sign off sheet
function genSoS(doc, div) {
	const sos = new SoSPage(doc);
	const cursor = sos.cursor;
	
	// console.log(div.getMaxSize());
	
	sos.sizeList = sizeList.slice(0, 7);

	const addOnOrders = [];
	
	
		// makes an object to hold totals for each line
	const sizeTotals = Object.fromEntries(sos.sizeList.map(k => [k, 0]));
	const red = '#ff0000';
	const blue = '#0000ff';
	const black = '#000000';
	
	doc.setTextColor(red);
	doc.setFontSize(14);
	let sportTxt = runtime.stateEvent.sport.name.toUpperCase()
	doc.text(runtime.stateEvent.sport.name.toUpperCase(), cursor.x, cursor.y);
	
	doc.setTextColor(blue);
	let x = cursor.x + doc.getTextWidth(sportTxt) + 10;
	doc.text(div.division.name, x, cursor.y);
	
	
	doc.setTextColor(black);
	doc.setFontSize(11);
	
	let topLineY = cursor.y + 1;

	makeSoSGridHead(doc, sos, topLineY);
	
		// makes each team's line. a line number, school name, total shirts, and quantity for each size
	let i = 1;
	div.schoolOrders.forEach(order => {
		sos.newLine();
			// check if we need an additional page
		if (cursor.y > sos.pageBreakY) {
				// go back up a line before drawing the vertical grid
			sos.newLine(-1);
				// draw the vertical grid to finish the page
			makeSoSGridVert(doc, sos, topLineY, cursor);

			sos.addPage();
				// make the header for the new page
			makeSoSGridHead(doc, sos, topLineY);
				//make the first horizontal line before continueing 
			doc.line(sos.alignX, (sos.cursor.y + 1), sos.colsX[sos.colsX.length - 2], (sos.cursor.y + 1));
			sos.newLine();
		}
		sos.textToCell({ text: i, align: 'right' });
		const name = order.school.shortName;
		sos.textToCell({ text: name, align: 'left' });
		if (order.hasAddOns()) {
			addOnOrders.push(order);
			doc.setTextColor(red);
			let redText;
			let nameWidth = doc.getTextWidth(name);
			if (!order.paid) {
				redText = `(due $${order.due})`;
			} else {
				redText = 'PAID';
			}
			doc.text(redText, (sos.colsX[2] + nameWidth + 4), cursor.y);
			doc.setTextColor(black);
		}
		let total = (order.getTeamStyle()) ? order.getTeamStyle().getTotalQuantity() : order.qualifiers;
		sos.textToCell({ text: total });
		let teamStyle = order.getTeamStyle();
		if (teamStyle) {
			let shirts = teamStyle.sizeMap;
			sos.sizeList.forEach(size => {
				let q = '-';
				if (shirts[size]) {
					q = shirts[size].quantity;
					sizeTotals[size] += shirts[size].quantity;
				}
				sos.textToCell({ text: q });
			});
		}
			// draw a grid line
		doc.line(sos.alignX, (sos.cursor.y + 1), sos.colsX[sos.colsX.length - 2], (sos.cursor.y + 1));
		++i;
	});
	
		// vertical grid lines
	makeSoSGridVert(doc, sos, topLineY, cursor);

		// totals line. probably unnecessary on the actual SoS?
	sos.newLine();
	sos.col = 2;
	sos.textToCell({ text: 'total', align: 'right', color: red });
	const totalSum = Object.values(sizeTotals).reduce((sum, val) => sum + val, 0);
		// the actual totals
	sos.col = 3;
	sos.textToCell({ text: totalSum, color: blue });
	sos.sizeList.forEach(size => {
		sos.textToCell({ text: sizeTotals[size] });
	});
	
		// add ons
	sos.newLine(2);
		// check if one more line would push past the page break. if so, add new page
	if (cursor.y > sos.pageBreakY) sos.addPage();

	sos.lineStep = 5.5;
	doc.text("add ons:", sos.alignX, cursor.y);
	sos.col = 4;
	sos.sizeList.forEach(s => {
		sos.textToCell({ text: s });
	});
	sos.newLine();

	addOnOrders.forEach(order => {
			// check if we've reached the end of the page
		if (cursor.y > sos.pageBreakY) {
			sos.addPage();
				// write a header
			doc.text("add ons:", sos.alignX, cursor.y);
			sos.col = 4;
			sos.sizeList.forEach(s => {
				sos.textToCell({ text: s });
			});
			sos.newLine();
		}

			// print the school name
		const name = order.school.shortName;
		sos.textToCell({ text: name, align: 'left' });
			// print the amount due, or 'PAID'
		doc.setTextColor(red);
		let redText;
		let nameWidth = doc.getTextWidth(name);
		if (!order.paid) {
			redText = `(due $${order.due})`;
		} else {
			redText = 'PAID';
		}
		doc.text(redText, (sos.alignX + nameWidth + 4), cursor.y);
			// reset to black
		doc.setTextColor(black);
		
		const addedStyles = order.getAddedStyles();
		addedStyles.forEach(style => {
			if ((style.id != ADULT_HOOD_STYLE_ID) || (addedStyles.length > 1)) {
				sos.col = 3;
				sos.textToCell({ text: style.shortName, align: 'right' });
			}
			sos.col = 4;
			let shirts = style.sizeMap;
			sos.sizeList.forEach(size => {
				let q = '';
				if (shirts[size]) {
					q = shirts[size].quantity;
					sizeTotals[size] += shirts[size].quantity;
				}
				sos.textToCell({ text: q });
			});
			sos.newLine();
		});

		if (order.oTransfers.length) {
			sos.col = 3;
			sos.textToCell({ text: 'Transfers', align: 'right' });
			sos.col = 4;
			sos.textToCell({ text: order.getTotalTransfers() });
			sos.newLine();
		}
	});
} 

function makeSoSGridHead(doc, sos, y){
	doc.line(sos.colsX[4], y, sos.colsX[sos.colsX.length -2], y);

	sos.newLine();
	sos.col = 3;
	sos.textToCell({ text: 'total' });
	sos.sizeList.forEach(s => {
		sos.textToCell({ text: s });
	});

		// draw the first grid line
	doc.line(sos.alignX, (sos.cursor.y + 1), sos.colsX[sos.colsX.length - 2], (sos.cursor.y + 1));
}

function makeSoSGridVert(doc, sos, topY, cursor) {
	for (let i = 4; i < (sos.colsX.length - 1); ++i) {
		doc.line(sos.colsX[i], topY, sos.colsX[i], (cursor.y + 1));
	}
}




//////////////////////////////////////////////////////////////////////////////////////////////////
// generating invoices
	// as named
export async function downloadInvoicePDF({ order, type = "Invoice" }) {
	if (!order) order = runtime.activeOrder;

		// if there are no add ons, don't do any thing
	if (!order.hasAddOns()) return;
	
	const { jsPDF } = window.jspdf; 
   const doc = new jsPDF('p', 'mm', 'letter');
	
	genInvoicePDF(doc, order, type);

	// let genderName = '';
	// if (runtime.stateEvent.sport.name.toLowerCase() === "soccer") genderName

	let suffix = '';
	if (type !== "Invoice") suffix = ` - ${type}`;

	const fileName = `${order.school.shortName} ${runtime.stateEvent.sport.name} ${runtime.stateEvent.getRealYear()} Add Ons${suffix}`;

	Helpers.downloadPDF(doc, fileName);
}

    // as named
export function printAllInvoices() {
	if (!runtime.stateEvent) return;

	const invoices = [];
		// foreach site, foreach division, for each order, check order for add ons, collect if found
	runtime.stateEvent.eventSites.forEach(es => {
		es.esDivisions.forEach(esd => {
			esd.schoolOrders.forEach(so => {
				if (so.getAddedStyles().length !== 0) invoices.push(so);
			});
		});
	});


	if ( invoices.length === 0) {
		modal.open("This event has no invoices");
	} else {
			// Access jsPDF from the global object
		const { jsPDF } = window.jspdf; 
		const doc = new jsPDF('p', 'mm', 'letter');

		invoices.forEach((so, index) => {
			genInvoicePDF(doc, so);
			if (index < invoices.length - 1) doc.addPage();
		});

			// Generate a Blob URL and open it in a new tab
		Helpers.openBlobInNewTab(doc);
	}
}

    // actual invoice generation
async function genInvoicePDF(doc, order, type = "Invoice") {
	let invP = new InvoicePage(doc);
	const currentFont = doc.getFont().fontName;
	
	const date = new Date();
	const strDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
	const invTypeU = type.toUpperCase();
	const ordrNmbrSfx = (order.invoiceVersion) ? '-' + order.invoiceVersion : '';
	const invNmbr = (String(order.id) + ordrNmbrSfx);
	
	doc.setFont(currentFont, 'bold');
	invP.centerTextInPage("****** " + invTypeU + " ******")
	doc.setFont(currentFont, 'normal');
	invP.lineY += (2 * invP.lineStep);
	
	doc.text("McU SPORTS", invP.alignX, invP.lineY);
	doc.text((invTypeU + " NUMBER:"), invP.colsX[3], invP.lineY);
		// puts text in a cell. position is determined by provided column, and current lineY. arguments are (text, colsX[])
	invP.cell(invNmbr, 4);
	invP.lineDown();
	doc.text("822 W JEFFERSON", invP.alignX, invP.lineY);
	doc.text((invTypeU + " DATE:"), invP.colsX[3], invP.lineY);
	invP.cell(strDate, 4);
	invP.lineDown();
	doc.text("BOISE, ID 83702", invP.alignX, invP.lineY);
	
	invP.lineDown(2);
	doc.text("ORDER NUMBER:", invP.colsX[3], invP.lineY);
	invP.cell(invNmbr, 4);
	invP.lineDown();
	doc.text("ORDER DATE:", invP.colsX[3], invP.lineY);
	invP.cell(strDate, 4);
	invP.lineDown();
	doc.text("SALESPERSON:", invP.colsX[3], invP.lineY);
	invP.cell("Ben", 4);
	invP.lineDown();
	doc.text("CUSTOMER #:", invP.colsX[3], invP.lineY);
	invP.cell(order.school.getSchoolCode(), 4);
	
	invP.lineDown(3);
	doc.setFont(currentFont, 'bold');
	doc.text("SOLD TO:", invP.colsX[1], invP.lineY);
	doc.text("SHIP TO:", invP.colsX[3], invP.lineY);
	doc.setFont(currentFont, 'normal');
	
	invP.drawAddressBox();
	
	invP.lineDown();
	doc.text(order.school.name, invP.colsX[1], invP.lineY);
	doc.text(order.school.name, invP.colsX[3], invP.lineY);
	invP.lineDown();
	doc.text(order.school.addressPhysical, invP.colsX[1], invP.lineY);
	doc.text(order.school.addressPhysical, invP.colsX[3], invP.lineY);
	invP.lineDown();
	doc.text(order.school.addressLine2, invP.colsX[1], invP.lineY);
	doc.text(order.school.addressLine2, invP.colsX[3], invP.lineY);
	
	invP.lineDown(3);
	doc.text("CONFIRM TO:", invP.colsX[1], invP.lineY);
	invP.cell(order.school.ad.name, 2);
	invP.lineDown();
	doc.text("COMMENT: PH#", invP.colsX[1], invP.lineY);
	invP.cell(order.school.ad.phone, 2);
	
	invP.lineDown(3);
	doc.setFont(currentFont, 'bold');
	doc.text("ITEM", invP.colsX[1], invP.lineY);
	doc.text("ORDERED", invP.colsX[3], invP.lineY);
	doc.text("PRICE", invP.colsX[4], invP.lineY);
	doc.text("AMOUNT", invP.colsX[5], invP.lineY);
	doc.setFont(currentFont, 'normal');
	
	let totalItems = 0;
	let totalDollars = 0;
	
	invP.lineDown();
		// first list shirts ordered
	for (const style of Object.values(order.getAddedStyles())) {
		for (const color of Object.values(style.colors)) {
			for (const soi of Object.values(color.sizeMap)) {
					// can we use id rather than displayChar?
				// console.log(style.id, shirt.displayChar);
				let item = soi.item;
				invP.cell(item.getInvoiceName(), 1, 2, 'left');
				invP.cell(String(soi.quantity), 3);
				invP.cell(`$${item.price}`, 4);
				invP.cell(`$${soi.quantity * item.price}`, 5, 1, 'right');
				invP.lineDown();
				totalItems += soi.quantity;
				totalDollars += (soi.quantity * item.price);
			}
		}
	}
		// now list any transfers
	for (const oTrnsfr of order.oTransfers) {
				let quantPrice = oTrnsfr.quantity * oTrnsfr.price;

				invP.cell(Helpers.getTransferInvoiceName(oTrnsfr.transfer), 1, 2, 'left');
				invP.cell(String(oTrnsfr.quantity), 3);
				invP.cell(`$${oTrnsfr.price}`, 4);
				invP.cell(`$${quantPrice}`, 5, 1, 'right');
				invP.lineDown();
				totalItems += oTrnsfr.quantity;
				totalDollars += (quantPrice);
	}
	
	
	invP.lineDown(2);
	doc.text(`Total Ordered:   ${totalItems}`, invP.colsX[3], invP.lineY);
	
	invP.lineDown();
	doc.line(invP.colsX[3], invP.lineY, invP.colsX[4], invP.lineY);
	invP.lineDown();
	doc.setFont(currentFont, 'bold');
	doc.text("INVOICE TOTAL:", invP.colsX[3], invP.lineY);
	doc.text(`$${totalDollars}`, invP.colsX[5], invP.lineY);
	doc.setFont(currentFont, 'normal');
	
	invP.lineDown(2);

	let gndrStr = '';
		console.log(order);
	if ((order.genderID !== null) && (Number(order.genderID) < 3)) {
		if (Number(order.genderID) === 1) gndrStr = "Boys ";
		if (Number(order.genderID) === 2) gndrStr = "Girls ";
	}
	let str = `${gndrStr}${runtime.stateEvent.sport.name} ${runtime.stateEvent.startDate.getFullYear()}`
	invP.centerTextInPage(str);
}

	// helper for invoice generation
function getItemByStyleIDSizeChar(styleID, displayChar) {
	const allItems = runtime.allItems.getSync();
   for (const key in allItems) {
	  const item = allItems[key];
	  if (item.style.id === styleID && item.size.displayChar === displayChar) {
		 return item;
	  }
   }
   return null;
}




//////////////////////////////////////////////////////////////////////////////////////////////////
// generating inventories
const inventoryStates = ['START', 'END', 'SOLD'];

	// pages parameter allows printing just the start page
export async function printInventories({ pages = 3, eSites = runtime.stateEvent.eventSites }) {
		// validate eSites is an array of EventSite objects
   if (!Array.isArray(eSites) || !eSites.every(es => es instanceof EventSite)) {
      modal.open("Invalid event sites data.");
      return;
   }

		// Access jsPDF from the global object
	const { jsPDF } = window.jspdf; 
   const doc = new jsPDF('p', 'mm', 'letter');

		// generate the sheets for each site
	eSites.forEach((es, i) => {
		genInventoryPDF(doc, es, pages);
			// add a page for each inventory but the last
		if (i < eSites.length - 1) doc.addPage();
	});

		// Generate a Blob URL and open it in a new tab
	Helpers.openBlobInNewTab(doc);
}

function genInventoryPDF(doc, eSite, pages) {
	const page = new InventoryPage(doc);
	const cursor = page.cursor;
	
		// do START page for any call

		// START page
	writeInventoryHeader(doc, page, cursor, eSite, 'START');
		// get the current y so we can reset to it
	const tableYInit = cursor.y;
		// build the table for the starting inventory
	buildInventoryTable(doc, page, cursor, eSite);
		// reset the y to the top of the table
	cursor.y = tableYInit;
	fillInventoryTable(doc, page, cursor, eSite);

		// print all pages if we didn't call for just page 1
	if (pages !== 1) {
		inventoryStartAddendum(doc, page, cursor, eSite);

			// END page
		page.addPage();
		writeInventoryHeader(doc, page, cursor, eSite, 'END');
		buildInventoryTable(doc, page, cursor, eSite);
		inventoryEndAddendum(page);

			// SOLD page
		page.addPage();
		writeInventoryHeader(doc, page, cursor, eSite, 'SOLD');
		buildInventoryTable(doc, page, cursor, eSite);
		inventorySoldAddendum(page, eSite);
	}

}

function writeInventoryHeader(doc, page, cursor, eSite, sheet) {
		// write Inventory - /SHEET/, with an underline and selectie bolding
	let txt = 'Inventory - ';
	page.textToCell({ text: txt, align: 'left' });
	let w = doc.getTextWidth(txt);
	doc.setFont(undefined, 'bold');
	doc.text(sheet, (page.alignX + w + 2), cursor.y);
	w += doc.getTextWidth(sheet);
	doc.setFont(undefined, 'normal');
	doc.line((cursor.x + 2), (cursor.y + 1), (cursor.x + w + 2), (cursor.y + 1));

		// write sport - divisions / site, top right of the page
	let siteStr = runtime.stateEvent.sport.name.toUpperCase();
	siteStr += ' ' + eSite.getDivisionsString();
	siteStr += ' / ' + eSite.site.name;
	page.col = 10;
	page.textToCell({ text: siteStr, align: 'right', font: 'bold' });
	
	page.newLine();
	page.col = 10;
		// write the employees for the site, a new line on the right of the page
	page.textToCell({ text: eSite.getEmployeesString(), align: 'right' });
}

function buildInventoryTable(doc, page, cursor, eSite) {
	const invSizeList = sizeList.slice(0, 6);

	const yGridStart = cursor.y + 2;
	page.hr();
	page.newLine();

		// head the table
	page.textToCell({ text: 'item' });
	page.textToCell({ text: 'style' });
	page.textToCell({ text: 'color' });
	invSizeList.forEach(s => {
		page.textToCell({ text: s });
	});
	page.textToCell({ text: 'total' });

	page.hr();
		// a small step to divide the head of the table
	cursor.y += 1.5;

	const structInventory = eSite.getStructuredInventory();

		// make each garment style's row. style name, styleCode, color, sizes, total
	for (const s of structInventory.garments) {
		const youth = (s.sizingCategoryID === 2);
		const align = (youth) ? 'right' : 'left';

		page.hr(.4);
		page.newLine();
		page.textToCell({ text: s.inventoryName, align: align });
		page.textToCell({ text: s.code });

		Object.values(s.colors).forEach((c, i) => {
				// color the row for the garment color // x1, y1, x2, y2
			doc.setFillColor(c.hex);
			const w = page.colsX[11] - page.colsX[page.col];
			doc.rect(page.colsX[page.col], (page.cursor.y + 2), w, -page.lineStep, "F");

			page.textToCell({ text: c.name });

				// skip the Small column for youth hoods
			if (s.id === 7) page.textToCell({ text: '---' });

				// shift the cell over to '---' non existent youth sizes
			page.col += Object.keys(c.sizes).length;
				// '---' non existent youth sizes
			if (youth) {
				for (; page.col < 10;) { page.textToCell({ text: '---' }); }
			}

				// if there are multiple colors, start the next color at column 3
			if (i < Object.keys(s.colors).length - 1) {
				page.hr(null, page.colsX[3]);
				page.newLine();
				page.col = 3;
			}
		});
	}

		// close the table
	page.hr();
		// vertical grid lines
	const ySizesBreak = (cursor.y + 2);
	page.colsX.forEach(x => {
		doc.line(x, yGridStart, x, ySizesBreak);
	});

		// a row for garments total
	page.newLine();
	page.textToCell({ text: 'total', align: 'right', font: 'bold' });

		// put in a separator
	page.hr();
	cursor.y += 1.5;
	page.hr();

		// make each accesory style's row. style name, total. // hats, beanies, etc
	for (const a of structInventory.accessories) {
		page.hr();
		page.newLine();
		page.textToCell({ text: a.item.style.inventoryName, align: 'left' });
	}

		// close the table
	page.hr();
		// vertical grid lines
	page.sizelessCols.forEach(col => {
		doc.line(page.colsX[col], ySizesBreak, page.colsX[col], (cursor.y + 2));
	});
}

function fillInventoryTable(doc, page, cursor, eSite) {
	page.newLine();
		// a small step to divide the head of the table
	cursor.y += 1.5;

		// garments total
	let gTotal = 0;

	const structInventory = eSite.getStructuredInventory();

		// make each garment style's row. style name, styleCode, color, sizes, total
	for (const s of structInventory.garments) {
		page.newLine();

		Object.values(s.colors).forEach((c, i) => {
			page.col = 4;
			let total = 0;

				// skip the Small column for youth hoods
			if (s.id === 7) ++page.col;

				// put in values for each size
			Object.values(c.sizes).forEach(z => {
				page.textToCell({ text: z.startQ });
				total += z.startQ;
			});
				// put in the total
			page.col = 10;
			page.textToCell({ text: total });
			gTotal += total;

				// if there are multiple colors, start the next color at column 3
			if (i < Object.keys(s.colors).length - 1) page.newLine();
		});
	}

		// row for garments total
	page.newLine();
		// move to the last column
	page.col = 10;
	page.textToCell({ text: gTotal });

		// put in a separator
	cursor.y += 1.5;

		// make each accesory style's row. style name, total. // hats, beanies, etc
	for (const a of structInventory.accessories) {
		page.newLine();
		page.col = 10;
		page.textToCell({ text: a.startQ });
	}
}

function inventoryStartAddendum(doc, page, cursor, eSite) {
	page.newLine(2);
	eSite.transfers.forEach(t => {
		let name = t.transfer.inventoryName ?? t.transfer.transferName;
		if (name === 'sport events') name = name.replace("sport", eSite.sportName);
		if (name === 'sub events') name = name.replace("sub", runtime.stateEvent.sport.name.toLowerCase());

		const qtyText = (t.startQ < 10) ? t.startQ + ' SET' : t.startQ;

		page.textToCell({ text: name, align: 'left' });
		page.textToCell({ text: qtyText });
		page.newLine();
	});
}

function inventoryEndAddendum(page) {
	page.newLine(3);
	page.textToCell({ text: 'List any misprints below (style / color / size / quantity):', align: 'left' });
	page.hr();
}

function inventorySoldAddendum(page, eSite) {
	const trnsfrs = Object.values(eSite.getInventoryTransfers());
	const tNames = new Set(trnsfrs.map(t => t.transfer.transferName));
	// console.log(tNames);


		// print the transfers to record how many sold
	page.newLine(2);
	page.textToCell({ text: 'transfers', align: 'right' });

		// no site should have 'champion', or 'back to back', etc without 'champoins'. 
			// check for 'champions', print them all
	if (tNames.has("state champions")) {
		page.newLine(1.6);
		page.textToCell({ text: 'STATE CHAMPION(S)', align: 'right' });
		page.newLine(1.6);
		page.textToCell({ text: 'BACK TO BACK /', align: 'right' });
		page.newLine(.8);
		page.textToCell({ text: '3-PEAT', align: 'right' });
	}

	if (tNames.has("#s") && tNames.has("positions")) {
		page.newLine(1.6);
		page.textToCell({ text: '#s / positions', align: 'right' });
	} else if (tNames.has("#s")) {
		page.newLine(1.6);
		page.textToCell({ text: '#s', align: 'right' });
	}

		// group the misc $5 transfers
	page.newLine(1.6);
	page.textToCell({ text: 'MOM, DAD, (tub)', align: 'right' });
	if (trnsfrs.some(t => t.transfer.transferName === "small event logo")) {
		page.newLine(.8);
		page.textToCell({ text: 'small logos', align: 'right' });
	}
	if (trnsfrs.some(t => t.transfer.transferName === "sub events")) {
		page.newLine(.8);
		page.textToCell({ text: `${runtime.stateEvent.sport.name.toLowerCase()} events`, align: 'right' });
	}

	page.newLine(1.6);
	page.textToCell({ text: 'school names', align: 'right' });

	page.newLine(2);
	page.textToCell({ text: 'Total $$', align: 'right' });

	page.newLine(2);
	page.textToCell({ text: 'hours', align: 'right' });

}




//////////////////////////////////////////////////////////////////////////////////////////////////
// print all original messages
export function printOMessages() {
    if (!runtime.stateEvent) return;
    
        // Access jsPDF from the global object
    const { jsPDF } = window.jspdf; 
    const doc = new jsPDF('p', 'mm', 'letter');
    
    doc.setFontSize(13);
    doc.setFont('Times');
    
    const maxWidth = 180;
    const x = 18;
    const y = 23;
    
		// foreach order, print the mo.orderText. 
    runtime.stateEvent.eventSites.forEach(es => {
        es.esDivisions.forEach(esd => {
            esd.schoolOrders.forEach(so => {
                so.messageOrders.forEach(mo => {
                    let lines = doc.splitTextToSize(mo.orderText, maxWidth);
                    doc.text(lines, x, y);
                    doc.addPage();
                })
            });
        });
    });
		// delete the blank page added last
	doc.deletePage(doc.getNumberOfPages());
    
    
   	// Generate a Blob URL and open it in a new tab
	Helpers.openBlobInNewTab(doc);
}




/////////////////////////////////////////////////////////////////////////////////////////////////
// get total shirts for an event
	// unimplemented, place holder
export function genIHSAATotals() {
	console.log('IHSAA totals');
}

/////////////////////////////////////////////////////////////////////////////////////////////////
// season stock
export function printSeasonStockPDF(season, dateRange, stockRows) {
	if (!season || !Array.isArray(stockRows) || stockRows.length === 0) {
		modal.open("No season stock data found.");
		return;
	}

	const rows = buildSeasonStockRows(stockRows);
	if (rows.length === 0) {
		modal.open("No season stock data found.");
		return;
	}

	const { jsPDF } = window.jspdf;
	const doc = new jsPDF('p', 'mm', 'letter');
	const page = new InventoryPage(doc);
	page.colsX = [0, 20, 68, 102, 126, 150, 174, 202];
	page.lineStep = 5.6;

	writeSeasonStockHeader(doc, page, season, dateRange);
	writeSeasonStockTable(doc, page, rows);

	const orderRows = buildSeasonOrderRows(rows);
	if (orderRows.length > 0) {
		page.addPage();
		writeSeasonOrderTable(doc, page, orderRows);
	}

	page.addPage();
	writeSeasonHoodSizeTable(doc, page, rows);

		// Generate a Blob URL and open it in a new tab
	Helpers.openBlobInNewTab(doc);
}

function buildSeasonStockRows(stockRows) {
	const allItems = runtime.allItems.getSync();

	const rows = stockRows.map(row => {
		const item = allItems[row.itemID];
		if (!item) return null;

		
		const needed = Number(row.totalQ ?? 0);
		const stock = Number(row.stock ?? item.stock ?? 0);
		const shortage = Math.max(needed - stock, 0);
		const caseQ = Number(item.caseQ ?? 0);

		return {
			itemID: Number(row.itemID),
			item: item,
			style: item.style,
			color: item.color,
			size: item.size,
			stock: stock,
			needed: needed,
			shortage: shortage,
			order: caseQ > 0 ? Math.ceil(shortage / caseQ) : 0
		};
	}).filter(Boolean);

	rows.sort((a, b) => {
		const styleDiff = (a.style.listOrder ?? 999) - (b.style.listOrder ?? 999);
		if (styleDiff !== 0) return styleDiff;

		const colorDiff = a.color.name.localeCompare(b.color.name);
		if (colorDiff !== 0) return colorDiff;

		return sizeList.indexOf(a.size.displayChar) - sizeList.indexOf(b.size.displayChar);
	});

	return rows;
}

function writeSeasonStockHeader(doc, page, season, dateRange) {
	doc.setFont(undefined, 'bold');
	page.textToCell({ text: `${season.name} Stock`, align: 'left' });
	doc.setFont(undefined, 'normal');

	page.newLine();
	page.textToCell({ text: `${dateRange.start} to ${dateRange.end}`, align: 'left' });
	page.newLine(2);
}

function writeSeasonStockTable(doc, page, rows) {
	writeSeasonTable(doc, page, rows, {
		title: 'All Season Stock',
		headers: ['Style', 'Color', 'Size', 'Stock', 'Needed', 'Delta Cases'],
		colPositions: [1, 2, 3, 4, 5, 6],
		writeRow(page, row) {
			page.textToCell({ text: getSeasonStockSizeCell(row) });
			page.textToCell({ text: row.stock });
			page.textToCell({ text: row.needed });
			page.textToCell({ text: row.order });
		}
	});
}

function writeSeasonOrderTable(doc, page, rows) {
	writeSeasonTable(doc, page, rows, {
		title: 'To Order',
		headers: ['Style', 'Color', 'Size', 'Order'],
		colPositions: [1, 2, 3, 4],
		writeRow(page, row) {
			page.textToCell({ text: getSeasonStockSizeCell(row) });
			page.textToCell({ text: row.order });
		}
	});
}

function getSeasonStockSizeCell(row) {
	if (row.style.sizingCategoryID === 4) return '';
	return row.size.displayChar === 'O' ? '' : row.size.displayChar;
}

function buildSeasonOrderRows(rows) {
	const allItems = runtime.allItems.getSync();
	const merged = new Map();

	rows.forEach(row => {
		const targetItem = getSeasonOrderTargetItem(row, allItems);
		if (!targetItem) return;

		const key = targetItem.id;
		if (!merged.has(key)) {
			merged.set(key, {
				itemID: targetItem.id,
				item: targetItem,
				style: targetItem.style,
				color: targetItem.color,
				size: targetItem.size,
				nativeNeeded: 0,
				nativeStock: Number(targetItem.stock ?? 0),
				borrowNeeded: 0,
				borrowStock: 0,
				order: 0
			});
		}

		const targetRow = merged.get(key);
		if (row.style.shortName === 'Dairy Hoods' && targetItem.style?.shortName === 'Adult Hoods') {
			targetRow.borrowNeeded += row.needed;
			targetRow.borrowStock += row.stock;
		} else {
			targetRow.nativeNeeded += row.needed;
		}
	});

	const orderRows = Array.from(merged.values()).map(row => {
		const caseQ = Number(row.item.caseQ ?? 0);
		const isAshAdultHood = row.style?.shortName === 'Adult Hoods'
			&& row.color?.name?.toLowerCase().includes('ash');

		let totalOrderCases = 0;
		if (isAshAdultHood && row.borrowNeeded > 0) {
			const stockCases = toCases(row.nativeStock, caseQ, Math.floor);
			const nativeNeededCases = toCases(row.nativeNeeded, caseQ, Math.ceil);
			const borrowNeededCases = toCases(row.borrowNeeded, caseQ, Math.ceil);
			const borrowStockCases = toCases(row.borrowStock, caseQ, Math.floor);
			const canCoverNativeAndBorrow = row.nativeStock >= (row.nativeNeeded + row.borrowNeeded);

			totalOrderCases = canCoverNativeAndBorrow
				? 0
				: Math.max(nativeNeededCases - stockCases, 0) + Math.max(borrowNeededCases - borrowStockCases, 0);
		} else {
			const nativeShortage = Math.max(row.nativeNeeded - row.nativeStock, 0);
			const borrowShortage = Math.max(row.borrowNeeded - row.borrowStock, 0);
			const canCoverNativeAndBorrow = row.nativeStock >= (row.nativeNeeded + row.borrowNeeded);
			const totalUnits = canCoverNativeAndBorrow
				? nativeShortage
				: nativeShortage + borrowShortage;

			totalOrderCases = caseQ > 0 ? Math.ceil(totalUnits / caseQ) : 0;
		}

		row.order = totalOrderCases;
		return row;
	}).filter(row => row.order > 0);

	orderRows.sort((a, b) => {
		const styleDiff = (a.style.listOrder ?? 999) - (b.style.listOrder ?? 999);
		if (styleDiff !== 0) return styleDiff;

		const colorDiff = a.color.name.localeCompare(b.color.name);
		if (colorDiff !== 0) return colorDiff;

		return sizeList.indexOf(a.size.displayChar) - sizeList.indexOf(b.size.displayChar);
	});

	return orderRows;

	function toCases(quantity, caseQ, roundFn = Math.ceil) {
		if (!quantity) return 0;
		if (!caseQ) return quantity;
		return roundFn(quantity / caseQ);
	}
}

function getSeasonOrderTargetItem(row, allItems) {
	if (row.style.shortName !== 'Dairy Hoods') return row.item;

	return Object.values(allItems).find(item =>
		item.style?.shortName === 'Adult Hoods'
		&& item.color?.id === row.color.id
		&& item.size?.id === row.size.id
	) || row.item;
}

function writeSeasonHoodSizeTable(doc, page, rows) {
	const hoodData = buildSeasonHoodSizeData(rows);
	const hoodSizes = sizeList.slice(0, 7);

	page.colsX = [0, 20, 60, 80, 100, 120, 140, 160, 180, 200];
	page.lineStep = 6;

	doc.setFont(undefined, 'bold');
	page.textToCell({ text: 'Hood Size Summary', align: 'left' });
	doc.setFont(undefined, 'normal');
	page.newLine(2);

	const xStart = page.colsX[1];
	const xEnd = page.colsX[9];
	const yTop = page.cursor.y + 2;

	page.hr(.2, xStart, xEnd);
	page.newLine();
	page.col = 1;
		// why?
	page.textToCell({ text: '' });
	hoodSizes.forEach(size => page.textToCell({ text: size }));
	page.hr(.2, xStart, xEnd);

	const rowLabels = [
		['needHoods', 'Need Hoods'],
		['stockHoods', 'Stock Hoods'],
		['toGarage', 'To Garage'],
		['needDairy', 'Need Dairy'],
		['stockDairy', 'Stock Dairy'],
		['toBasement', 'To Basement'],
		['order', 'Order']
	];

	rowLabels.forEach(([key, label]) => {
		page.newLine();
		page.col = 1;
		page.textToCell({ text: label, align: 'left' });
		hoodSizes.forEach(size => {
			const value = hoodData[key][size];
			page.textToCell({ text: (value === 0 ? '' : value) });
		});
		page.hr(.2, xStart, xEnd);
	});

	const yBottom = page.cursor.y + 2.6;
	for (let i = 1; i <= 9; ++i) {
		doc.line(page.colsX[i], yTop, page.colsX[i], yBottom);
	}
}

function buildSeasonHoodSizeData(rows) {
	console.log(rows);
	const hoodSizes = sizeList.slice(0, 7);
	const data = {
		rawStockHoods: Object.fromEntries(hoodSizes.map(size => [size, 0])),
		rawNeedHoods: Object.fromEntries(hoodSizes.map(size => [size, 0])),
		stockHoods: Object.fromEntries(hoodSizes.map(size => [size, 0])),
		needHoods: Object.fromEntries(hoodSizes.map(size => [size, 0])),
		toGarage: Object.fromEntries(hoodSizes.map(size => [size, 0])),
		rawStockDairy: Object.fromEntries(hoodSizes.map(size => [size, 0])),
		rawNeedDairy: Object.fromEntries(hoodSizes.map(size => [size, 0])),
		stockDairy: Object.fromEntries(hoodSizes.map(size => [size, 0])),
		needDairy: Object.fromEntries(hoodSizes.map(size => [size, 0])),
		toBasement: Object.fromEntries(hoodSizes.map(size => [size, 0])),
		order: Object.fromEntries(hoodSizes.map(size => [size, 0])),
		hoodCaseQ: Object.fromEntries(hoodSizes.map(size => [size, 0])),
		dairyCaseQ: Object.fromEntries(hoodSizes.map(size => [size, 0]))
	};

	rows.forEach(row => {
		const size = row.size.displayChar;
		if (!hoodSizes.includes(size)) return;

		if (row.style.shortName === 'Adult Hoods' && row.color?.name?.toLowerCase().includes('ash')) {
			data.rawStockHoods[size] += row.stock;
			data.rawNeedHoods[size] += row.needed;
			data.stockHoods[size] += row.stock;
			data.needHoods[size] += row.needed;
			data.hoodCaseQ[size] = Number(row.item.caseQ ?? 0);
		}

		if (row.style.shortName === 'Dairy Hoods') {
			data.rawStockDairy[size] += row.stock;
			data.rawNeedDairy[size] += row.needed;
			data.stockDairy[size] += row.stock;
			data.needDairy[size] += row.needed;
			data.dairyCaseQ[size] = Number(row.item.caseQ ?? 0);
		}
	});

	console.log(data);

	hoodSizes.forEach(size => {
		const canCoverHoodsAndDairy = data.rawStockHoods[size] >= (data.rawNeedHoods[size] + data.rawNeedDairy[size]);

		// const hoodShortage = Math.max(data.needHoods[size] - data.stockHoods[size], 0);
		// const hoodSurplus = Math.max(data.stockHoods[size] - data.needHoods[size], 0);
		// const dairyShortage = Math.max(data.needDairy[size] - data.stockDairy[size], 0);

		// const totalOrderUnits = hoodShortage + Math.max(dairyShortage - hoodSurplus, 0);
		// data.order[size] = toCases(totalOrderUnits, data.hoodCaseQ[size] || data.dairyCaseQ[size]);
		data.stockHoods[size] = toCases(data.stockHoods[size], data.hoodCaseQ[size], Math.floor);
		data.needHoods[size] = toCases(data.needHoods[size], data.hoodCaseQ[size], Math.ceil);
		data.toGarage[size] = Math.max(0, data.needHoods[size] - data.stockHoods[size]);

		data.stockDairy[size] = toCases(data.stockDairy[size], data.dairyCaseQ[size], Math.floor);
		data.needDairy[size] = toCases(data.needDairy[size], data.dairyCaseQ[size], Math.ceil);
		data.toBasement[size] = canCoverHoodsAndDairy ? 0 : Math.max(0, data.needDairy[size] - data.stockDairy[size]);
		
		data.order[size] = canCoverHoodsAndDairy ? 0 : data.toBasement[size] + data.toGarage[size];
	});

	return data;

	function toCases(quantity, caseQ, roundFn = Math.ceil) {
   if (!quantity) return 0;
   if (!caseQ) return quantity;
   return roundFn(quantity / caseQ);
}
}

function writeSeasonTable(doc, page, rows, config) {
	let currentStyleID = null;
	let currentColorKey = null;
	let styleStartY = null;
	let colorStartY = null;
	let lastRowY = null;

	doc.setFont(undefined, 'bold');
	page.textToCell({ text: config.title, align: 'left' });
	doc.setFont(undefined, 'normal');
	page.newLine(2);

	writeSeasonStockTableHead(doc, page, config.headers, config.colPositions);

	rows.forEach((row, i) => {
		if (page.cursor.y > page.pageBreakY) {
			closeSeasonStockSpans(doc, page, config.colPositions, currentStyleID, currentColorKey, styleStartY, colorStartY, lastRowY);
			page.addPage();
			doc.setFont(undefined, 'bold');
			page.textToCell({ text: config.title, align: 'left' });
			doc.setFont(undefined, 'normal');
			page.newLine(2);
			writeSeasonStockTableHead(doc, page, config.headers, config.colPositions);
			currentStyleID = null;
			currentColorKey = null;
			styleStartY = null;
			colorStartY = null;
		}

		const colorKey = `${row.style.id}-${row.color.id}`;
		const showStyle = currentStyleID !== row.style.id;
		const showColor = currentColorKey !== colorKey;
		let hrStartX = page.colsX[config.colPositions[0]];
		if (!showStyle) hrStartX = page.colsX[config.colPositions[1]];
		if (!showColor) hrStartX = page.colsX[config.colPositions[2]];

		page.hr(.2, hrStartX, page.colsX[config.colPositions[config.colPositions.length - 1] + 1]);
		page.newLine();

		if (showStyle) {
			if (currentStyleID !== null && styleStartY !== null && lastRowY !== null) {
				drawSeasonStockSpan(doc, page.colsX[config.colPositions[0]], page.colsX[config.colPositions[1]], styleStartY, lastRowY);
			}

			currentStyleID = row.style.id;
			styleStartY = page.cursor.y;
			page.col = config.colPositions[0];
			page.textToCell({ text: row.style.shortName, 
					align: (row.style.sizingCategoryID === 2 ? 'right' : 'left') });
		} else {
			page.col = config.colPositions[1];
		}

		if (showColor) {
			if (currentColorKey !== null && colorStartY !== null && lastRowY !== null) {
				drawSeasonStockSpan(doc, page.colsX[config.colPositions[1]], page.colsX[config.colPositions[2]], colorStartY, lastRowY);
			}

			currentColorKey = colorKey;
			colorStartY = page.cursor.y;
			page.col = config.colPositions[1];
			page.textToCell({ text: row.color.name, align: 'left' });
		} else {
			page.col = config.colPositions[2];
		}

		page.col = config.colPositions[2];
		config.writeRow(page, row);
		lastRowY = page.cursor.y;

		if (i === rows.length - 1) {
			closeSeasonStockSpans(doc, page, config.colPositions, currentStyleID, currentColorKey, styleStartY, colorStartY, lastRowY);
		}
	});

	page.hr(.2, page.colsX[config.colPositions[0]], page.colsX[config.colPositions[config.colPositions.length - 1] + 1]);
}

function writeSeasonStockTableHead(doc, page, headers, colPositions) {
	const yGridStart = page.cursor.y + 2;

	page.hr(.2, page.colsX[colPositions[0]], page.colsX[colPositions[colPositions.length - 1] + 1]);
	page.newLine();
	headers.forEach((th, i) => {
		page.col = colPositions[i];
		page.textToCell({ text: th });
	});
	page.hr(.2, page.colsX[colPositions[0]], page.colsX[colPositions[colPositions.length - 1] + 1]);

	page._seasonStockGridStartY = yGridStart;
	page._seasonStockGridEndY = page.cursor.y + 2;
}

function drawSeasonStockSpan(doc, x1, x2, startY, endY) {
	if (startY == null || endY == null) return;

	doc.rect(x1, startY - 3.2, x2 - x1, (endY - startY) + 5.8);
}

function closeSeasonStockSpans(doc, page, colPositions, currentStyleID, currentColorKey, styleStartY, colorStartY, lastRowY) {
	if (currentStyleID !== null && styleStartY !== null && lastRowY !== null) {
		drawSeasonStockSpan(doc, page.colsX[colPositions[0]], page.colsX[colPositions[1]], styleStartY, lastRowY);
	}

	if (currentColorKey !== null && colorStartY !== null && lastRowY !== null) {
		drawSeasonStockSpan(doc, page.colsX[colPositions[1]], page.colsX[colPositions[2]], colorStartY, lastRowY);
	}

	const gridStart = page._seasonStockGridStartY;
	const gridEnd = lastRowY ? lastRowY + 2.6 : page._seasonStockGridEndY;
	page.colsX.slice(colPositions[0], colPositions[colPositions.length - 1] + 2).forEach(x => {
		doc.line(x, gridStart, x, gridEnd);
	});
}
