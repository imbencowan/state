import { runtime } from './runtime.js';
import { Label, InvoicePage, SoSPage, InventoryPage } from './models/output-classes.js';
import { sizeList } from './constants.js';
import { openModal } from './modal.js';

//////////////////////////////////////////////////////////////////////////////////////////////////
// generating box labels
	// prints a single order's label
export function printBoxLabel(order) {
	// console.log(order);
	if (!order.shirtsByStyle || order.shirtsByStyle.length === 0) {
		openModal("This order is empty");
		return;
	}
		// Access jsPDF from the global object
	const { jsPDF } = window.jspdf; 
	const doc = new jsPDF('p', 'mm', 'letter');
	genBoxLabel(doc, order, 0);
	
		// Generate a Blob URL and open it in a new tab
	const pdfBlob = doc.output("blob");
	const url = URL.createObjectURL(pdfBlob);
	window.open(url, "_blank", "noopener");
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
        const pdfBlob = doc.output("blob");
        const url = URL.createObjectURL(pdfBlob);
        window.open(url, "_blank", "noopener");
    } else {
            // if no incomplete orders, alert the user
        openModal("There are no incomplete orders.")
    }
}

	// actual label generation
function genBoxLabel(doc, order, originI, lblN = 1) {
	// drawLabelRects(doc);
	
	const lbl = new Label(doc, originI, order.getBoxTotal(), lblN);	
		
		// this one is rotated to be vertical along the left edge
	lbl.addSiteDivision(order.site, order.division);
	
		// start the horizontal rows
	lbl.centerTextInLabel(order.sportStr);
	
	lbl.lineY += 9;
	doc.setFontSize(18);
		// box the school name
	lbl.rectText(order.school.shortName, '#cfcfff', 'F');

	let minSize = order.getMinSize();
	let maxSize = order.getMaxSize();
	if ((maxSize - minSize) > 5) lbl.gridStep = 7.8;

	
	lbl.lineY += 8;
	lbl.addGridSizes(order.getMinSize(), order.getMaxSize());
	lbl.lineY += 4.5;
	doc.setFontSize(11);
	doc.text("Team Hoods:", lbl.alignX, lbl.lineY);
	
		// put in the team quantities
	if (order.getTeamStyle()) {
		lbl.addGridQuantities(order.getTeamStyle(), order.getMinSize(), order.getMaxSize());
	}
	
		// only do this if there are additional styles in order.shirtsByStyle
	if (order.shirtsByStyle.length > 1) {
		lbl.lineY += 8;
		doc.setTextColor('666666');
		doc.text("Additional", lbl.indentX, lbl.lineY);
			// omit Dairy Hoods
		order.getAddedStyles().forEach(style => {
			lbl.lineY += 6;
			doc.text(style.shortName, lbl.alignX, lbl.lineY);
			lbl.addGridQuantities(style, order.getMinSize(), order.getMaxSize());
		});
		doc.setFontSize(14);
		lbl.lineY += 9;
		doc.setTextColor('#000000');
		let txt = "Due: $" + order.due;
		if (!order.paid) {
			let txtWdth = doc.getTextWidth(txt);
			doc.setFillColor('#ffff00');
			doc.rect((lbl.lineX - 1), (lbl.lineY + 1), (txtWdth + 2), -7, "F");
		}
		doc.text(txt, lbl.lineX, lbl.lineY);
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
	if (lbl.totalShirts > 26) {
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
	const pdfBlob = doc.output("blob");
	const url = URL.createObjectURL(pdfBlob);
	window.open(url, "_blank", "noopener");
}

	// print a single sign off sheet
export function printSoSPDF(div) {
	if (!div) return;
	
		// Access jsPDF from the global object
	const { jsPDF } = window.jspdf; 
   const doc = new jsPDF('p', 'mm', 'letter');
	genSoS(doc, div);
	
		// Generate a Blob URL and open it in a new tab
	const pdfBlob = doc.output("blob");
	const url = URL.createObjectURL(pdfBlob);
	window.open(url, "_blank", "noopener");
}

	// actually generate each sign off sheet
function genSoS(doc, div) {
	const sos = new SoSPage(doc);
	const cursor = sos.cursor;
	
	// console.log(div.getMaxSize());
	
	const sosSizeList = sizeList.slice(0, 7);
	const addOnOrders = [];
	
	
		// +1 for the totals line
	const schoolLinesQ = (div.schoolOrders.length + 1);
	const addOnLinesQ = div.getTeamsWithAddOns().length;
		// if there are add ons, add 2 for the lines between
	if (addOnLinesQ.length > 0) addOnLinesQ += 3;
	
	let pageBreakLine;
	const totalPageLines = schoolLinesQ + addOnLinesQ;
	if (totalPageLines > 33) pageBreakLine = 33;
	
	
		// makes an object to hold totals for each line
	const sizeTotals = Object.fromEntries(sosSizeList.map(k => [k, 0]));
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
	doc.line(sos.colsX[4], topLineY, sos.colsX[sos.colsX.length -2], topLineY);
	
	sos.newLine();
	sos.col = 3;
	sos.textToCell('total');
	sosSizeList.forEach(s => {
		sos.textToCell(s);
	})
	
		// makes each team's line. a line number, school name, total shirts, and quantity for each size
	let i = 1;
	div.schoolOrders.forEach(order => {
			// draw a grid line
		doc.line(sos.alignX, (sos.cursor.y + 1), sos.colsX[sos.colsX.length - 2], (sos.cursor.y + 1));
		sos.newLine();
			// check if we need a second page
		if (cursor.y > sos.pageBreakY) {
				// go back up a line before drawing the vertical grid
			sos.newLine(-1);
				// draw the vertical grid
			for (let i = 4; i < (sos.colsX.length - 1); ++i) {
				doc.line(sos.colsX[i], topLineY, sos.colsX[i], (cursor.y + 1));
			}
			sos.addPage();
				// go up a line and draw the top line
			sos.newLine(-1)
			doc.line(sos.alignX, (sos.cursor.y + 1), sos.colsX[sos.colsX.length - 2], (sos.cursor.y + 1));
			sos.newLine();
			topLineY -= sos.lineStep;
		}
		sos.textToCell(i, 'right');
		const name = order.school.shortName;
		sos.textToCell(name, 'left');
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
		let total = (order.getTeamStyle()) ? order.getTeamStyle().getTotalQuantity() : 0;
		sos.textToCell(total);
		let teamStyle = order.getTeamStyle();
		if (teamStyle) {
			let shirts = teamStyle.sizeMap;
			sosSizeList.forEach(size => {
				let q = '-';
				if (shirts[size]) {
					q = shirts[size].quantity;
					sizeTotals[size] += shirts[size].quantity;
				}
				sos.textToCell(q);
			});
		}
		++i;
	});
		// the last line
	doc.line(sos.alignX, (sos.cursor.y + 1), sos.colsX[sos.colsX.length - 2], (sos.cursor.y + 1));
	
		// vertical grid lines
	for (let i = 4; i < (sos.colsX.length - 1); ++i) {
		doc.line(sos.colsX[i], topLineY, sos.colsX[i], (cursor.y + 1));
	}
		// totals line
	sos.newLine();
	doc.setTextColor(red);
	sos.col = 2;
	sos.textToCell('total', 'right');
	const totalSum = Object.values(sizeTotals).reduce((sum, val) => sum + val, 0);
	// sos.col = 10;
	// sos.textToCell(totalSum);
	doc.setTextColor(blue);
	sos.col = 3;
	sos.textToCell(totalSum);
	sosSizeList.forEach(size => {
		sos.textToCell(sizeTotals[size]);
	});
	
		// add ons
	sos.newLine(2);
		// check if one more line would push past the page break. if so, add new page
	if (cursor.y > sos.pageBreakY) sos.addPage();

	sos.lineStep = 5.5;
	doc.setTextColor(black);
	doc.text("add ons:", sos.alignX, cursor.y);
	sos.col = 4;
	sosSizeList.forEach(s => {
		sos.textToCell(s);
	});
	addOnOrders.forEach(order => {
		sos.newLine();
			// check if we've reached the end of the page
		if (cursor.y > sos.pageBreakY) {
			sos.addPage();
				// write a header
			doc.text("add ons:", sos.alignX, cursor.y);
			sos.col = 4;
			sosSizeList.forEach(s => {
				sos.textToCell(s);
			});
			sos.newLine();
		}
		const name = order.school.shortName;
		sos.textToCell(name, 'left');
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
			doc.text(redText, (sos.alignX + nameWidth + 4), cursor.y);
			doc.setTextColor(black);
		}
		order.getAddedStyles().forEach(style => {
			sos.col = 4;
			let shirts = style.sizeMap;
			sosSizeList.forEach(size => {
				let q = '';
				if (shirts[size]) {
					q = shirts[size].quantity;
					sizeTotals[size] += shirts[size].quantity;
				}
				sos.textToCell(q);
			});
		});
	});
}




//////////////////////////////////////////////////////////////////////////////////////////////////
// generating invoices
	// as named
export async function downloadInvoicePDF(order, type = "Invoice") {
	if (!order) order = runtime.activeOrder;
	console.log(order);

		// if there are no add ons, don't do any thing
	if (order.getAddedStyles().length === 0) return;
	
	const { jsPDF } = window.jspdf; 
   const doc = new jsPDF('p', 'mm', 'letter');
	
	genInvoicePDF(doc, order, type);
	
		// download the pdf
	const pdfBlob = doc.output("blob");
	const url = URL.createObjectURL(pdfBlob);

	const a = document.createElement("a");
	a.href = url;

	// let genderName = '';
	// if (runtime.stateEvent.sport.name.toLowerCase() === "soccer") genderName

	let suffix = '';
	if (type !== "Invoice") suffix = ` - ${type}`;

	a.download = `${order.school.shortName} ${runtime.stateEvent.sport.name} ${runtime.stateEvent.getRealYear()} Add Ons${suffix}`;

	document.body.appendChild(a); // Required for Firefox
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url); // Clean up
}

    // as named
export function printAllInvoices() {
	if (!runtime.stateEvent) return;
	
		// Access jsPDF from the global object
	const { jsPDF } = window.jspdf; 
    const doc = new jsPDF('p', 'mm', 'letter');
	
		// foreach site, foreach division, for each order, check order for add ons, collect if found
	runtime.stateEvent.eventSites.forEach(es => {
		es.esDivisions.forEach(esd => {
			esd.schoolOrders.forEach(so => {
				if (so.getAddedStyles().length !== 0) {
					genInvoicePDF(doc, so);
					doc.addPage();
				}
			});
		});
	});
		// delete the blank page added last
	doc.deletePage(doc.getNumberOfPages());
	
	
		// Generate a Blob URL and open it in a new tab
	const pdfBlob = doc.output("blob");
	const url = URL.createObjectURL(pdfBlob);
	window.open(url, "_blank", "noopener");
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
	
	let totalShirts = 0;
	let totalDollars = 0;
	
	invP.lineDown();
	for (const style of order.shirtsByStyle) {
		if (style.shortName != 'Dairy Hoods') {
			for (const shirt of style.sizes) {
					// can we use id rather than displayChar?
				// console.log(style.id, shirt.displayChar);
				let item = getItemByStyleIDSizeChar(style.id, shirt.displayChar);
				invP.cell(item.getInvoiceName(), 1, 2, 'left');
				invP.cell(String(shirt.quantity), 3);
				invP.cell(`$${item.price}`, 4);
				invP.cell(`$${shirt.quantity * item.price}`, 5, 1, 'right');
				invP.lineDown();
				totalShirts += shirt.quantity;
				totalDollars += (shirt.quantity * item.price);
			}
		}
	}
	
	
	invP.lineDown(2);
	doc.text(`Total Ordered:   ${totalShirts}`, invP.colsX[3], invP.lineY);
	
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

export async function printInventory(btn) {
	if (!btn) return;

		// get the eSite
	const cntnr = btn.closest('.invntryCntnr');
	const eSite = runtime.inventoriesBySite[cntnr.dataset.eSiteID];
	
		// Access jsPDF from the global object
	const { jsPDF } = window.jspdf; 
   const doc = new jsPDF('p', 'mm', 'letter');

		// generate the inventory
	genInventoryPDF(doc, eSite);
	
		// Generate a Blob URL and open it in a new tab
	const pdfBlob = doc.output("blob");
	const url = URL.createObjectURL(pdfBlob);
	window.open(url, "_blank", "noopener");
}

export async function printAllInventories(eSites) {

}

function genInventoryPDF(doc, eSite) {
	const page = new InventoryPage(doc);
	const cursor = page.cursor;
	

		// START page
	writeInventoryHeader(doc, page, cursor, eSite, 'START');
		// get the current y so we can reset to it
	const tableYInit = cursor.y;
	buildInventoryTable(doc, page, cursor, eSite);
		// reset the y to the top of the table
	cursor.y = tableYInit;
	fillInventoryTable(doc, page, cursor, eSite);
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
	inventorySoldAddendum(page);

}

function writeInventoryHeader(doc, page, cursor, eSite, sheet) {
		// write Inventory - /SHEET/, with an underline and selectie bolding
	let txt = 'Inventory - ';
	page.textToCell(txt, 'left');
	let w = doc.getTextWidth(txt);
	doc.setFont(undefined, 'bold');
	doc.text(sheet, (page.alignX + w + 2), cursor.y);
	w += doc.getTextWidth(sheet);
	doc.setFont(undefined, 'normal');
	doc.line((cursor.x + 2), (cursor.y + 1), (cursor.x + w + 2), (cursor.y + 1));

		// write sport - divisions / site, top right of the page
	let siteStr = eSite.sportName.toUpperCase();
	siteStr += ' ' + eSite.getDivisionsString();
	siteStr += ' / ' + eSite.site.name;
	page.col = 10;
	page.textToCell(siteStr, 'right', 'bold');
	
	page.newLine();
	page.col = 10;
		// write the employees for the site, a new line on the right of the page
	page.textToCell(eSite.getEmployeesString(), 'right');
}

function buildInventoryTable(doc, page, cursor, eSite) {
	const invSizeList = sizeList.slice(0, 6);

	const yGridStart = cursor.y + 2;
	page.hr();
	page.newLine();

		// head the table
	page.textToCell('item');
	page.textToCell('style');
	page.textToCell('color');
	invSizeList.forEach(s => {
		page.textToCell(s);
	});
	page.textToCell('total');

	page.hr();
		// a small step to divide the head of the table
	cursor.y += 1.5;

		// make each garment style's row. style name, styleCode, color, sizes, total
	eSite.structuredInventory.garments.forEach(s => {
		const youth = (s.style.sizingCategoryID === 2);
		const align = (youth) ? 'right' : 'left';

		page.hr();
		page.newLine();
		page.textToCell(s.style.inventoryName, align);
		page.textToCell(s.style.code);

		s.colors.forEach((c, i) => {
			page.textToCell(c.color.name);

				// skip the Small column for youth hoods
			if (s.style.id === 7) page.textToCell('---');

				// shift the cell over to '---' non existent youth sizes
			page.col += Object.keys(c.sizes).length;
				// '---' non existent youth sizes
			if (youth) {
				for (; page.col < 10;) { page.textToCell('---'); }
			}

				// if there are multiple colors, start the next color at column 3
			if (i < s.colors.length - 1) {
				page.hr(page.colsX[3]);
				page.newLine();
				page.col = 3;
			}
		});
	});

		// close the table
	page.hr();
		// vertical grid lines
	const ySizesBreak = (cursor.y + 2);
	page.colsX.forEach(x => {
		doc.line(x, yGridStart, x, ySizesBreak);
	});

		// a row for garments total
	page.newLine();
	page.textToCell('total', 'right', 'bold');

		// put in a separator
	page.hr();
	cursor.y += 1.5;
	page.hr();

		// make each accesory style's row. style name, total. // hats, beanies, etc
	eSite.structuredInventory.accessories.forEach(a => {
		page.hr();
		page.newLine();
		page.textToCell(a.style.inventoryName, 'left');
	});

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

		// make each garment style's row. style name, styleCode, color, sizes, total
	eSite.structuredInventory.garments.forEach(s => {
		page.newLine();

		s.colors.forEach((c, i) => {
			page.col = 4;
			let total = 0;

				// skip the Small column for youth hoods
			if (s.style.id === 7) ++page.col;

				// put in values for each size
			Object.values(c.sizes).forEach(z => {
				page.textToCell(z.quantity);
				total += z.quantity;
			});
				// put in the total
			page.col = 10;
			page.textToCell(total);
			gTotal += total;

				// if there are multiple colors, start the next color at column 3
			if (i < s.colors.length - 1) page.newLine();
		});
	});

		// row for garments total
	page.newLine();
		// move to the last column
	page.col = 10;
	page.textToCell(gTotal);

		// put in a separator
	cursor.y += 1.5;

		// make each accesory style's row. style name, total. // hats, beanies, etc
	eSite.structuredInventory.accessories.forEach(a => {
		page.newLine();
		page.col = 10;
		page.textToCell(a.quantity);
	});
}

function inventoryStartAddendum(doc, page, cursor, eSite) {
	page.newLine(2);
	eSite.transfers.forEach(t => {
		let name = t.transfer.inventoryName ?? t.transfer.transferName;
		if (name === 'sport events') name = name.replace("sport", eSite.sportName);

		const qtyText = (t.quantity < 10) ? t.quantity + ' SET' : t.quantity;

		page.textToCell(name);
		page.textToCell(qtyText);
		page.newLine();
	});


	// page.textToCell('transfers');
	// page.textToCell('150');

	// page.newLine(2);
	// page.textToCell('STATE CHAMPIONS');
	// page.textToCell('50');
	// page.newLine();
	// page.textToCell('STATE CHAMPION');
	// page.textToCell('50');

	// page.newLine(2);
	// page.textToCell('BACK TO BACK');
	// page.textToCell('50');
	// page.newLine();
	// page.textToCell('3-PEAT');
	// page.textToCell('50');
	// page.newLine();
	// page.textToCell('3X, 4X, 5X...');
	// page.textToCell('50');

	// page.newLine(2);
	// page.textToCell('small golf logo');
	// page.textToCell('40');

	// page.newLine(2);
	// page.textToCell('MOM/DAD/ETC');
	// page.textToCell('SET');
	// page.newLine();
	// page.textToCell('school names');
	// page.textToCell('SET');
}

function inventoryEndAddendum(page) {
	page.newLine(3);
	page.textToCell('List any misprints below (style / color / size / quantity):', 'left');
	page.hr();
	// page.textToCell('STYLE');
	// page.textToCell('COLOR');
	// page.textToCell('SIZE');
	// page.textToCell();
}

function inventorySoldAddendum(page) {
	page.newLine(2);
	page.textToCell('transfers');

	page.newLine(2);
	page.textToCell('STATE CHAMPION(S)');

	page.newLine(2);
	page.textToCell('BACK TO BACK /');
	page.newLine();
	page.textToCell('3-PEAT');

	page.newLine(2);
	page.textToCell('#s');

	page.newLine(2);
	page.textToCell('MOM, DAD, (TUB)');
	// page.newLine();
	// page.textToCell('swimming events');

	page.newLine(2);
	page.textToCell('school names');

	page.newLine(2);
	page.textToCell('Total $$');

	page.newLine(2);
	page.textToCell('hours');

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
    const pdfBlob = doc.output("blob");
    const url = URL.createObjectURL(pdfBlob);
    window.open(url, "_blank", "noopener");
}




/////////////////////////////////////////////////////////////////////////////////////////////////
// get total shirts for an event
	// unimplemented, place holder
export function genIHSAATotals() {
	console.log('IHSAA totals');
}