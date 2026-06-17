/////////////////////////////////////////////////////////////////////////////////////////////
// js functions for the event page
import { runtime } from '../runtime.js';
import { myFetch } from '../fetch.js';
import { sizeList } from '../constants.js';
import { ActionRequest } from '../models/other-classes.js';
import { StateEvent, SchoolOrder, InventoryTransfer } from '../models/db-classes.js';
import { openModal, closeModal } from '../modal.js';
import { buildElement, parseToInstancesArr } from '../utilities.js';
import { printBoxLabel, printUndoneBoxLabels, downloadInvoicePDF, printAllInvoices, printSoSPDF, printAllSoSPDF, 
			printOMessages, genIHSAATotals, printInventories } from '../print.js';
import { buildActionButton, buildIcon, makeSubmitCancelButtons } from './page-utils.js';


export async function goToEventPage(sport) {
		// get the current school year
	const sixMonthsAgo = new Date();
	sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
	let year = sixMonthsAgo.getFullYear() % 100;
		// but reset it based off the select. the previous year calculation is really a fall back
	if (document.getElementById("selectYear")) year = document.getElementById("selectYear").value;

	let sportID = sport[1];

		// pull data
	let request = new ActionRequest('showEventBySportAndYear', 'Event', { 'year': year, 'sportID': sportID });
	let responseJSON = await myFetch(request);
	
	// document.getElementById("display").innerHTML = responseJSON.html;
	
		// reset mode on load
	runtime.activeMode = null;
	

	if (responseJSON.data !== null) {
		runtime.stateEvent = StateEvent.fromJSON(responseJSON.data);

		const pageContent = buildEventPage(runtime.stateEvent);
		// console.log(pageContent);

		// document.getElementById("display2").replaceChildren(pageContent);
		document.getElementById("display").replaceChildren(pageContent);

			// ATTACH EVENT LISTENERS 
		addEventPageFunctionality();
	}	
}

export function buildEventPage(data) {
		// a container
	const cntnr = buildElement("div", { id: "eventContainer" });

		// attach a header, the buttons at the top of the page, tabs for viewing event data
	attachSportHeader(cntnr, data);
	attachTabs(cntnr, data);

	return cntnr;
}

	// builds the inner page header
function attachSportHeader(cntnr, data) {
	const sport = data.sport.name;
	const year = data.startDate.toLocaleDateString("en-US", { year: "numeric" });
	const h = buildElement("h1", { text: sport + " " + year});
	cntnr.appendChild(h);
}

function attachTabs(parent, data) {

   const tabs = [
      { id: "orders", label: "Orders", build: attachOrdersPanel },
      { id: "inventory", label: "Inventory", build: attachInventoryPanel },
      { id: "reports", label: "Reports", build: attachReportsPanel }
   ];

   const nav = buildElement("nav", { classes: ["eventTabNav"] });
   const panels = buildElement("div", { classes: ["tabPanels"] });

   tabs.forEach((tab, i) => {
			// a button for switching tabs
      const btn = buildElement("button", {
         text: tab.label,
         dataset: { tab: tab.id }
      });
			// the panel that will hold the tab's display
      const panel = buildElement("div", {
         classes: ["tabPanel"],
         dataset: { tab: tab.id }
      });

			// the first tab will be active and built
      if (i === 0) {
         btn.classList.add("active");
         panel.classList.add("active");
         	// build first tab immediately
         tab.build(panel, data);
         panel.dataset.built = "true";
      }

      nav.append(btn);
      panels.append(panel);
   });

		// listener switches tabs, including building them on first access
   nav.addEventListener("click", e => {
			// exit if a tab button wasn't clicked
      if (!e.target.matches("button")) return;

      const tabID = e.target.dataset.tab;

			// remove active from any tab
      nav.querySelectorAll("button").forEach(b => b.classList.remove("active"));
      panels.querySelectorAll(".tabPanel").forEach(p => p.classList.remove("active"));

			// mark the target as active
      const panel = panels.querySelector(`[data-tab="${tabID}"]`);
      e.target.classList.add("active");
      panel.classList.add("active");

      	// lazy build. calls the build function if the panel has not yet been built.
      if (!panel.dataset.built) {
				// get the tab and build the panel
         const tab = tabs.find(t => t.id === tabID);
         tab.build(panel, data);
				// mark built as true now
         panel.dataset.built = "true";
      }
   });

   parent.append(nav, panels);
}


function attachOrdersPanel(panel, data) {
	attachOrdersTopButtons(panel, data);
	attachNeededTable(panel, data);
	attachOrders(panel, data);
	attachCommentTable(panel, data);
}

	// builds buttons for the top of the page for various print options 
function attachOrdersTopButtons(cntnr) {
	const buttons = [
		{ type: "genBoxLabels", title: "print all undone box labels", icon: "print", text: " Undone Labels", 
			classes: ["genUndoneBoxLabelsBtn"] },
		{ type: "printAllSoSPDF", title: "print all site's sign off sheets", icon: "print", text: " All SoS", 
			classes: ["printAllSoSPDF"] },
		{ type: "printInvoices", title: "print all invoices", icon: "print", text: " Invoices", 
			classes: ["printInvoicesBtn"] },
		{ type: "printMessages", title: "print order messages", icon: "print", text: " Messages", 
			classes: ["printMessagesBtn"] },
		{ type: "printTotals", title: "print shirt totals", icon: "print", text: " Totals", 
			classes: ["printTotalsBtn"] },
		{ type: "newOrder", title: "add an order", text: "+ Order", classes: ["newOrderBtn"] },
		{ type: "uploadQlfrs", title: "upload qualifiers", icon: "upload", text: " Qualifiers", 
			classes: ["uploadQlfrs"] },
		{ type: "showAllSchoolsAZ", title: "show A-Z list of all schools", icon: "visibility", text: " A-Z Schools", 
			classes: ["showAllSchoolsAZ"] }
	];

	const btnElements = buttons.map(buildActionButton);
	const h = buildElement("h1", { children: btnElements });
	const btnCntnr = buildElement("div", { classes: "buttonContainer", children: [h] });
	cntnr.appendChild(btnCntnr);
}

	// builds a table that displays how many shirts of each size are still incomplete
function attachNeededTable(cntnr, data) {
		// a list for the table headers
	let thNames = [...sizeList, 'Total'];
	let ths = [];

		// build the actual <th>s and thead
	thNames.forEach(name => {
		ths.push(buildElement("th", { text: name }));
	});
	const thRow = buildElement("tr", { children: ths });
	const thead = buildElement("thead", { children: thRow });

	const needRow = buildNeedRow(data);
	const tbody = buildElement("tbody", { children: needRow });
	
		// build the table and a label
	const t = buildElement("table", { id: "needTable", classes: [ "needTable" ], children: [ thead, tbody ] });
	const p = buildElement("p", { text: "We still need: " });

		// attach to the container
	const div = buildElement("div", { id: "needContainer", children: [ p, t ] });
		
			// get quantities from the StateEvent
	const needSizes = data.getNeededSizes();
		// hide if empty
	if (needSizes.total === 0) div.classList.add('hidden');

	cntnr.appendChild(div);
}

function buildNeedRow(data) {
	let sizeChars = [...sizeList, 'total'];
		// get quantities from the StateEvent
	const needSizes = data.getNeededSizes();
	let needTDs = [];
		// build each td
	sizeChars.forEach(n => {
		const txt = needSizes[n] === 0 ? "-" : needSizes[n];
		needTDs.push(buildElement("td", { title: n, text: txt }));
	});

		// put the cells in a row, the row in a tbody
	const needRow = buildElement("tr", { children: needTDs });

	return needRow;
}

	// attach the actual orders. for each division for each site, make a table with a row for each school order
function attachOrders(cntnr, data) {
		// a container
	const ordersDiv = buildElement("div", { id: "ordersContainer" });

		// for each EventSite
	data.eventSites.forEach(es => {
			// a site header
		const siteH2 = buildElement("h2", { text: es.site.name, dataset: { eventSiteId: es.id } });
		ordersDiv.appendChild(siteH2);

			// for each EventSiteDivision
		es.esDivisions.forEach(esd => {
				// a button to print a site's sign off sheets
			const sosBtn = buildElement("button", { 
				classes: [ "topLevelButton", "clickable", "printSoSPDF" ],
				dataset: { btnType: "printSoSPDF", eshdid: esd.id },
				children: [ buildIcon("print"), " SoS" ]
			 });

				// a division header
			const divisionH3 = buildElement("h3", { 
				text: (esd.division.name + " " + es.getGenderName()), 
				children: sosBtn, 
				dataset: { eventSiteDivisionId: esd.id } 
			});
			ordersDiv.appendChild(divisionH3);

				// if there are orders, put them in a table
			if (esd.schoolOrders.length) {	
					// the table, empty
				const table = buildOrdersTable(esd.schoolOrders, data.id, es.id, esd.id);
				
					// put the table in a container
				const tableDiv = buildElement("div", { classes: "table-container", children: table });
				ordersDiv.appendChild(tableDiv);
			}
		});
	});

	cntnr.appendChild(ordersDiv);
}

function buildOrdersTable(orders, eventID, esID, esdID) {
	const thead = buildOrdersThead();		
		// the table, empty
	const table = buildElement("table", { classes: "orderTable", children: thead, 
						dataset: { eventId: eventID, eventSiteId: esID, eventSiteDivisionId: esdID } });
		// fill the table body
	buildOrdersTbodies(table, orders);

	return table;
}

function buildOrdersThead() {
		let ths = [];
		ths.push(buildElement("th", { text: "School" }));
		sizeList.forEach(s => {
			ths.push(buildElement("th", { text: s }));
		});
		ths.push(buildElement("th", { text: "Total" }));
			// a "..." icon for the final th
		ths.push(buildElement("th", { children: buildIcon("more_horiz") }));

		const thRow = buildElement("tr", { children: ths });
		
		return buildElement("thead", { children: thRow });
	}

function buildOrdersTbodies(table, orders) {
		// we'll need this for a data- in the trs
	const allStyles = runtime.allStyles.getSync();
	const teamStyleID = Object.values(allStyles).find(style => style.shortName === "Dairy Hoods").id;

	orders.forEach(so => {
		const teamShirts = so.getTeamStyle();

		let tds = [];

			// first td, the school name
		tds.push(buildElement("td", {
				// include id and fileName in title text for qol
			title: (so.id + " / " + so.getMessageFileNames()), 
			text: so.school.shortName
		}));
			// then the sizes
		makeSizeTDs(tds, teamShirts, '-');
			// then the total
		let totalText = so.getDairyTotal();
			// add "/ qualifiers" if totals != qualifiers
		if (so.qualifiers && (so.qualifiers != so.getDairyTotal())) totalText += "/" + so.qualifiers;
		tds.push(buildElement("td", { title: 'total', text: totalText }));

			// make an input to stick at the end
		const chkBx = buildElement("input", { classes: 'orderChckBx', 
			id: ('check' + so.id), 
			title: 'mark order complete'
		});
		chkBx.type = 'checkbox';
		chkBx.name = ('check' + so.id);
		chkBx.value = so.id;
		if (so.completeness === 1) chkBx.checked = true;
	

			// and then we can put the buttons in the last cell
		tds.push(buildElement("td", { children: [
			makeRowIconButton('add', 'addAddOns', 'add add ons'),
			makeRowIconButton('edit', 'editSizes', 'edit the quantities'),
			makeRowIconButton('mail', 'showMessage', 'view the original message'),
			makeRowIconButton('article', 'printLabel', 'print box label'),
			makeRowIconButton('request_quote', 'dlInvoice', 'download invoice'),
			makeRowIconButton('more_horiz', 'showMore', 'show more options'),
			chkBx
		] }));

			// build the first row
		const trs = [];
		trs.push(buildElement("tr", { dataset: { styleID: teamStyleID }, children: tds }));
			// if there are any add on shirts, make rows for them
		if (so.hasAddedShirts()) trs.push(...buildAddedStyleRows(so));
			// if there are any add on transfers, make rows for them
		if (so.hasAddedTransfers()) trs.push(...buildAddedTransferRows(so));


		const tbody = buildElement("tbody", { 
			id: ('row' + so.id),
			classes: getRowCompletenessClass(so), 
			dataset: { schoolOrderId: so.id },
			children: trs 
		});
		table.appendChild(tbody);
	});
}

	// returns an array of rows, one for each added style for a SchoolOrder
function buildAddedStyleRows(so) {
	const trs = [];

	for (const aStyle of so.getAddedStyles()) {
		let tds = [];

			// first td, the style name
		tds.push(buildElement("td", {	text: aStyle.shortName }));
			// then the sizes
		makeSizeTDs(tds, aStyle);
			// then the total
		let sTotal = 0
		for (const s of aStyle.sizes) {
			sTotal += s.quantity;
		}
		tds.push(buildElement("td", { title: 'total', text: sTotal }));
			// an empty td to fill the table
		tds.push(buildElement("td"));

			// make the row
		trs.push(buildElement("tr", { classes: "addOnRow", dataset: { styleID: aStyle.id }, children: tds }));
	}

	return trs;
}

	// use this to force all shirt rows through the same construction, so they have the same attributes
function makeSizeTDs(tds, shirts, emptyValue = '') {
	for (const s of sizeList) {
		tds.push(buildElement("td", { 
			title: s, 
			dataset: { displayChar: s }, 
			text: (shirts?.sizeMap[s]?.quantity || emptyValue) 
		}));
	}
}

	// returns an array of rows, one row for each transfer added to a SchoolOrder
function buildAddedTransferRows(so) {
	const trs =[];
	for (const t of so.oTransfers) {
		let tds = [];

			// td the transfer name
		tds.push(buildElement("td", { text: 'Transfer - ' + t.transfer.transferName }));
			// skip the sizes
		tds.push(buildElement("td", { dataset: { blankCell: true }, attrs: { colspan: sizeList.length } }));
			// then the quantity in the total column
		tds.push(buildElement("td", { title: 'total', text: t.quantity }));
			// an empty td to fill the table
		tds.push(buildElement("td"));

			// make the row
		trs.push(buildElement("tr", { classes: "addOnRow", dataset: { transferID: t.transfer.id }, children: tds }));
	}

	return trs;
}

function getRowCompletenessClass(order) {
	let trClass = '';
		// order matters here. check the 'nature' of the order before looking at completeness, as they are independent
			// ie, a row that isOver() could have been marked complete before receiving qualifier data
				// unOrdered and over override .completeness for display, but are wrong to store in .completeness
	if (order.getDairyTotal() === 0) {
		trClass = 'unOrderedRow';
	} else if (order.isOver()) {
		trClass = 'overRow';
	} else if (order.completeness == 0) {
		trClass = 'unDoneRow';
	} else if (order.completeness == 1) {
		trClass = 'doneRow';
	} else if (order.completeness == 2) {
		trClass = 'partDoneRow';
	}

	return trClass;
}

function makeRowIconButton(type, iClass, title) {
	let classes = [ 'material-icons', 'clickable', 'order-action' ];
	classes.push(iClass);

	return buildElement("span", { classes: classes, title: title, text: type });
}

function attachCommentTable(cntnr, data) {
	const unhandledComments = data.getUnhandledComments();

	if (unhandledComments.length) {
		let chldrn = [];

			// first a br for spacing
		chldrn.push(buildElement("br"));
			// a header
		chldrn.push(buildElement("h2", { text: "Comments" }));

			// the table
				// the thead
		let ths = [
			buildElement("th", { text: "School" }),
			buildElement("th", { text: "Division" }),
			buildElement("th", { text: "Comment" }),
			buildElement("th", { text: "Handled" })
		];
		const thRow = buildElement("tr", { children: ths });
		const thead = buildElement("thead", { children: thRow });
				// the tbody
		let cRows = [];
		for (const c of unhandledComments) {
			let tds = [];
				// school name, division, comment
			tds.push(buildElement("td", { title: c.soID, text: c.schoolName }));
			tds.push(buildElement("td", { text: c.divName }));
			tds.push(buildElement("td", { text: c.comment }));
				// a checkbox, to mark the comment being handled
			const chkBx = buildElement("input", { classes: "commentChckBx", dataset: { orderId: c.moID } });
			chkBx.type = "checkbox";
			tds.push(buildElement("td", { children: chkBx }));

				// build the row
			cRows.push(buildElement("tr", { children: tds }));
		}
			// the actual body
		const tbody = buildElement("tbody", { children: cRows });
			// the table
		chldrn.push(buildElement("table", { id: "commentsTable", children: [ thead, tbody ] }));
		
			// attach every thing to the cntnr
		const cmmntDiv = buildElement("div", { id: "commentTableDiv", children: chldrn });
		cntnr.appendChild(cmmntDiv);
	}
}


async function attachInventoryPanel(panel) {
	attachInventoryTopButtons(panel);

		// first, ensure the appropriate data
	await runtime.stateEvent.loadInventories(runtime.allItems, runtime.allTransfers);

		// build inventory tables for each site
	for (const es of runtime.stateEvent.eventSites) {
			// some buttons for each inventory, to edit, and to fill
		const btns = buildInventorySiteButtons(es.id);
			// a button container
		const btnDiv = buildElement("div", { classes: [ 'invntryBtnCntnr', 'inline' ], children: btns });

			// a site header, with those buttons
		const hTxt = es.site.name + ' ' + es.getDivisionsString();
		const siteH2 = buildElement("h2", { text: hTxt, children: [ btnDiv ] });
		
		panel.appendChild(siteH2);
			// the table
		panel.appendChild(buildInventoryTable(es.getStructuredInventory(), runtime.stateEvent.id, es.id));
	}
}

	// builds buttons for the top of the page for various print options 
function attachInventoryTopButtons(cntnr) {
	const buttons = [
		{ type: "printAllInvetoriesPage1", title: "print all site's starting inventory", icon: "print",
			text: " All Page 1", classes: ["printAllInventoriesPage1Btn"] },
		{ type: "printAllInventories", title: "print all site's inventory sheets", icon: "print", 
			text: " All Full", classes: ["printAllInventoriesBtn"] }
	];

	const btnElements = buttons.map(buildActionButton);
	const h = buildElement("h1", { children: btnElements });
	const btnCntnr = buildElement("div", { classes: "buttonContainer", children: [h] });
	cntnr.appendChild(btnCntnr);
}

function buildInventorySiteButtons(esID) {
	const btnConfigs = [
		{ type: "printSiteInvetoryPage1", title: "print site's starting inventory", icon: "print", text: " Page 1", 
			classes: [ "inventory-action", "printSiteInventoryPage1Btn" ], datasetExtra: { eventSiteID: esID } },
		{ type: "printSiteInventory", title: "print site's inventory sheets", icon: "print", text: " Full", 
			classes: [ "inventory-action", "printSiteInventoryBtn" ], datasetExtra: { eventSiteID: esID } },
		{ type: "editInventory", title: "edit inventory", icon: "edit", text: " Edit", 
			classes: ["inventory-action", "editInventoryBtn"], datasetExtra: { eventSiteID: esID } },
		{ type: "fillInventory", title: "fill inventory", icon: "edit", text: " Fill", 
			classes: ["inventory-action", "fillInventoryBtn"], datasetExtra: { eventSiteID: esID } },
		{ type: "addItem", title: "add an item", text: "+ Item", classes: ["inventory-action", "addItemBtn"], 
			datasetExtra: { eventSiteID: esID } },
		{ type: "addTransfer", title: "add a transfer type", text: "+ Transfer", 
			classes: ["inventory-action", "addTransferBtn"], datasetExtra: { eventSiteID: esID } }
	];

	return btnConfigs.map(buildActionButton);
}


function buildInventoryTable(inventory, eventID, esID) {
	const thead = buildInventoryThead();
	const tbody = buildElement("tbody");		
		// fill the table body
	buildInventoryGarmentsRows(tbody, inventory.garments);
	buildInventoryAccessoriesRows(tbody, inventory.accessories);
	buildInventoryTransfersRows(tbody, inventory.transfers);
	console.log(inventory.transfers);
		// the table, empty
	const table = buildElement("table", { classes: "inventoryTable", children: [ thead, tbody ], 
													dataset: { eventId: eventID, eventSiteID: esID } });

	return table;
}

function buildInventoryThead() {
	let ths = [];
	ths.push(buildElement("th", { text: "Item", classes: 'left' }));
	ths.push(buildElement("th", { text: "Color", classes: 'left' }));
	sizeList.forEach(s => {
		ths.push(buildElement("th", { text: s, classes: 'center' }));
	});
	ths.push(buildElement("th", { text: "Total", classes: 'right' }));

	const thRow = buildElement("tr", { children: ths });
	
	return buildElement("thead", { children: thRow });
}

	// build garment rows with style, color, size quantities and total
function buildInventoryGarmentsRows(tbody, garments) {
	for (const style of garments) {
			// an identifier to right align youth styles
		const align = style.sizingCategoryID === 2 ? 'right' : 'left';

			// simplify an identifier
		const colors = Object.values(style.colors);

			// iterate over colors
		colors.forEach((color, i) => {
			const tds = [];

				// include style only on the first row
			if (i === 0) tds.push(buildElement("td", { 
				text: style.shortName, 
				attrs: { rowspan: colors.length }, 
				classes: align
			}));
				// color td
			tds.push(buildElement("td", { text: color.name }));

				// container to increment
			let total = 0;
				// make tds for each size
			sizeList.forEach(char => { 
					// only do sizes that exist for the style
				if (char in color.sizes) {
					const size = color.sizes[char];
					const q = size.startQ || 0;
					total += q;
					const qStr = size.startQ || '';
						// "size" here is representing an InventoryItem. size.id is the id for a row in the apparel db table
					tds.push(buildElement("td", { text: qStr, classes: 'right', title: char, dataset: { 
						itemID: size.item.id, 
						invItemID: size.id, 
						oValue: qStr 
					} }));
				} else {
						// if there isn't a size for this style (youth)
					tds.push(buildElement("td", { text: "---", classes: "center" }));
				}
			});

				// finally the total
			tds.push(buildElement("td", { text: total, dataset: { totalCell: true } }));

				// attach the row
			const tr = buildElement("tr", { children: tds, classes: 'shirtRow' });
			tbody.appendChild(tr);
		});
	}
}

function buildInventoryAccessoriesRows(tbody, accessories) {
	for (const a of accessories) {
		const tds = [];
		tds.push(buildElement("td", { text: a.item.style.shortName }));
		tds.push(buildElement("td", { text: a.item.color.name }));
		tds.push(buildElement("td", { attrs: { colspan: 7 } }));
		tds.push(buildElement("td", { text: a.startQ, dataset: {
			itemID: a.itemID,
			invItemID: a.id,
			oValue: a.startQ
		} }));

			// attach the row
		const tr = buildElement("tr", { children: tds });
		tbody.appendChild(tr);
	}
}

function buildInventoryTransfersRows(tbody, transfers) {
	for (const t of Object.values(transfers)) {
		const tds = [];
		tds.push(buildElement("td", { text: t.transfer.inventoryName }));
		tds.push(buildElement("td", { attrs: {colspan: 8} }));
		tds.push(buildElement("td", { text: t.startQ, dataset: {
			transferID: t.transferID,
			invTransferID: t.id,
			oValue: t.startQ
		} }));

			// attach the row
		const tr = buildElement("tr", { children: tds });
		tbody.appendChild(tr);
	}
}

function attachReportsPanel(tab, data) {
	
}


	// attaches event listeners
export function addEventPageFunctionality() {
	// taking this out. it should be in initialization.js now and unnecessary. leaving commented just in case
		// PRE LOAD 
	// runtime.allItems.load();



	const container = document.getElementById('eventContainer');

		// this is one listener that handles clicks for all buttons on the event page
			// may be should move top level buttons to a more specific listener
		//////////////////////////////////////////////////////////////////////////////////////////////////////
	container.addEventListener('click', function(event) {
			// qualify the target, some buttons have span children
		const btn = event.target.closest('button');
		const spn = event.target.closest('span');

			// prioritize buttons if found. if not, we've got a naked span to use
		const target = btn || spn;
		if (!target) return;

			////////////////// call the correct function for the click by checking the target ////////////////////
			
			// order-action related. buttons for: AddOns, Editing, ShowingMessage, PrintingLabel, DownloadingInvoice 
				// also Submitting and Canceling those actions
		if (target.classList.contains('order-action')) {
				// get the order to pass
			const order = getOrderFromTableButton(target);

				// define actions. 'selector': function to call
			const orderActions = {
				'span.editSizes': () => { if (!runtime.activeMode) showEditSizeInputs(order); },
				'span.addAddOns': () => {
					if (!runtime.activeMode || runtime.activeMode === 'add') showAddOnInputs(order);
				},
				'span.showMessage': () => showOMessage(order),
				'span.printLabel': () => { if (!runtime.activeMode) printBoxLabel(order); },
				'span.dlInvoice': () => { if (!runtime.activeMode) downloadInvoicePDF(order); },
				'span.showMore' : () => showMoreRowOptions(order),
				'button.submitAddOns': () => submitAddOns(target, order),
				'button.submitEdit': () => submitSizeEdit(target, order),
				'button.cancelAddOns': () => cancelAddOns(target),
				'button.cancelEdit': () => cancelSizeEdit(target)
			};

				// check if the target matches any of the above selectors, call it's function and exit if so
			for (const sel in orderActions) {
				if (target.matches(sel)) {
					orderActions[sel]();
					return;
				}
			}
			return; // nothing matched, exit. this will skip the rest of the listener
		} else if (target.classList.contains('inventory-action')) {
			const eSite = runtime.stateEvent.getEventSiteByID(target.dataset.eventSiteID);
			const inventoryActions = {
				'.editInventoryBtn': () => showEditInventory(target),
				'.fillInventoryBtn': () => showFillInventory(target),
				'button.printSiteInventoryPage1Btn': () => printInventories({ pages: 1, eSites: [ eSite ] }),
				'button.printSiteInventoryBtn': () => printInventories({ pages: 3, eSites: [ eSite ] }),
				'.submitInventoryEdit': () => submitInventoryEdit(target),
				'.cancelInventoryEdit': () => cancelInventoryEdit(target), 
				'.submitInventoryFill': () => submitInventoryFill(target),
				'.cancelInventoryFill': () => cancelInventoryFill(target),
				'.addTransferBtn': () => showAddTransfer(target),
				'.addItemBtn': () => showAddItem(target)
			};

				// check if the target matches any of the above selectors, call it's function and exit if so
			for (const sel in inventoryActions) {
				if (target.matches(sel)) {
					inventoryActions[sel]();
					return;
				}
			}
			return; // nothing matched, exit. this will skip the rest of the listener
		} else {
				// top-level buttons. 'selector': function to call
			const topLevelActions = {
					// orders panel actions
				'button.genUndoneBoxLabelsBtn': () => printUndoneBoxLabels(),
				'button.genTotalsBtn': () => genIHSAATotals(),
				'button.printInvoicesBtn': () => printAllInvoices(),
				'button.printMessagesBtn': () => printOMessages(),
				'button.printTotalsBtn': () => printTotals(),
				'button.newOrderBtn': () => makeBlankOrder(),
				'button.printAllSoSPDF': () => printAllSoSPDF(),
				'button.printSoSPDF': () => printSoSPDF(runtime.stateEvent.getDivisionByID(target.dataset.eshdid)),
				'button.uploadQlfrs': () => showQlfrsUpld(),
				'button.showAllSchoolsAZ': () => showAllSchoolsAZ(),
					// inventory panel actions
						// pass an argument to print only page 1 of each inventory
				'button.printAllInventoriesPage1Btn': () => printInventories({ pages: 1 }),
				'button.printAllInventoriesBtn': () => printInventories({ pages: 3 })
			};

			for (const sel in topLevelActions) {
				if (target.matches(sel)) {
					topLevelActions[sel]();
					return;
				}
			}
		}
	});

	
		// next a listener for the inputs to ensure integer values
	container.addEventListener('input', (e) => {
		if (e.target.matches('input[type="number"]')) {
			e.target.value = e.target.value.replace(/[^\d-]/g, '');
		}
	});
	
		// toggleOrderCompleteness listeners
	container.addEventListener('change', function(event) {
		if (event.target.matches('input.orderChckBx')) {
			toggleOrderCompleteness(event.target, getOrderFromTableButton(event.target));
		} else if (event.target.matches('input.commentChckBx')) {
			changeCommentHandled(event.target);
		}
	});


	const modal = document.getElementById('myModal');
	modal.addEventListener('click', function(event) {
		const target = event.target;
		const rowOptions = {
			'button.quote' : () => { downloadInvoicePDF(null, "Quote"); },
			'button.receipt' : () => { downloadInvoicePDF(null, "Receipt"); }
		};

		for (const sel in rowOptions) {
			if (target.matches(sel)) {
				rowOptions[sel]();
				return;
			}
		}
	});
}


/////////////////// functions for acquiring an order from a DOM event. target will have a data-attribute for reference
		// get an order from the big ol runtime.stateEvent object
function getOrderFromTableButton(target) {
	if (runtime.stateEvent) {
			// get ids from data-attributes
		const orderID = Number(target.closest('tbody').getAttribute('data-school-order-id'));
		const divID = Number(target.closest('table').getAttribute('data-event-site-division-id'));
		const eventSiteID = Number(target.closest('table').getAttribute('data-event-site-id'));
	
		return getOrderByIDs(eventSiteID, divID, orderID);
	}
}
		
function getOrderByIDs(eventSiteID, divID, orderID) {
	if (runtime.stateEvent) {
			// get the site, then division, then order. return null if not found
		const eventSite = runtime.stateEvent.eventSites.find(eSite => eSite.id === eventSiteID);
		if (!eventSite) return null;
		
		const division = eventSite.esDivisions.find(div => div.id === divID);
		if (!division) return null;

		const order = division.schoolOrders.find(order => order.id === orderID);

			// make add on gender strings if necessary
		let divGenderStr = '';
		if (eventSite.gender) divGenderStr += ' ' + eventSite.gender.name;
		let sportGenderStr = '';
		if (order.genderID !== null) {
				if (order.genderID === 1) sportGenderStr += 'Boys ';
				if (order.genderID === 2) sportGenderStr += 'Girls ';
		}
		
			// hacky
				// but may be not in a bad way? how else would i transmit all this? sending div, site, and sport args also?
				// this is actually kind of clean considering the alternatives for getting this info where it needs to be.
		order.division = division.division.name + divGenderStr;
		order.site = eventSite.site.name;
		order.sportStr =  sportGenderStr + runtime.stateEvent.sport.name;
		order.sportLblClr = runtime.stateEvent.sport.labelColor;
		
		return order || null;
	}
}



/////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////
////////////////// functions for editing orders in the page

function showAddOnInputs(order) {
		// set mode. prevents edit being called while this is open
	runtime.activeMode = 'add';

		// get the parent element with the specified data attribute
			// the parent is a tbody that can hold multiple rows
	const prnt = document.querySelector(`[data-school-order-id="${order.id}"]`);
	if (prnt) {
			// don't add more rows than there are styles (9)
		if (prnt.querySelectorAll('tr').length < 9) {
			const tds = [];
			
				// create the style select
					// send the parent so we can omit options that already exist
			const newSlct = buildAddOnSelect(prnt);
			tds.push(buildElement("td", { children: newSlct }));

			const valueType = parseAddOnOption(newSlct.value).table;
			const valueID = parseAddOnOption(newSlct.value).id;
			
				// create the tds for the middle columns 
			if (valueType == 'styles') {
					// make tds for each size, put inputs in the ones that belong to this style/color combo
				for (const s of sizeList) {
					tds.push(buildElement("td", { title: s, dataset: { displayChar: s } }));
				}
			}
			
				// submit/cancel td	// this goes in the 'total' column, and we need that title later for editing quantities
			const btnTD = buildElement("td", { title: 'total' });
				// put submit and cancel buttons in the btnTD, unless there already is one
			if (prnt.querySelector('button.submitAddOns') === null) {
				makeSubmitCancelButtons(btnTD, prnt, 'order', 'AddOns');
			}
			tds.push(btnTD);
			
				// a final empty cell to maintain form // for where row options go
			tds.push(buildElement("td"));

				// Append the newly created <tr> to the <tbody>
					// create a variable for focus
			const newTR = buildElement("tr", { classes: 'addOnRow', children: tds });

				// now that we have a row, we can use the existing function to insert the inputs
			makeSizeInputs(newTR, valueType, valueID);

			prnt.appendChild(newTR);
			
				// give focus to the first input
			newTR.querySelector('input')?.focus();
		}
	} else {
		console.error(`Element with data-school-order-id="${order.id}" not found.`);
	}
}

async function submitAddOns(target, order) {
	const tbody = target.closest('tbody');
		// get an array of rows with select elements
	const rows = Array.from(tbody.querySelectorAll('tr')).filter(row => row.querySelector('select'));
		// check if the multiple styles are duplicate
	if (checkDuplicateAddedStyles(rows)) {
		openModal("Two of your styles to add are identical, fix this before submitting");
		return;
	}
	
		// get the additions
	const addItems = [];
	const addTransfers = [];
	rows.forEach((row) => {
			// get the itemID
		const value = row.querySelector('select').value;
		const tbl = parseAddOnOption(value).table;
		const id = Number(parseAddOnOption(value).id);

		const inputs = Array.from(row.querySelectorAll('input[type="number"]'))
				.filter(input => parseInt(input.value, 10) > 0);

		if (tbl == 'styles') {
			const style = runtime.allStyles.getByID(id);

				// get the inputs
			inputs.forEach((input) => {
					// match quantities with itemIDs, then push them to an array
				const sizeID = input.dataset.sizeID;
					// get the item based on style/color/size
				const item = runtime.allItems.getByStyleColorSize(style.id, style.defaultColor.id, sizeID);
				const shirt = {
					itemID: item.id,
					quantity: input.value
				};
				addItems.push(shirt);
			});
		} else if (tbl == 'transfers') {
			addTransfers.push({
				transferID: id,
				quantity: inputs[0].value
			});
		}
	});
	
		// cancel if no thing was input
	if (addItems.length === 0 && addTransfers.length === 0) {
		cancelAddOns(target);
		return;
	}
	
		// send it to the server
	const data = {'orderID': order.id, 'addItems': addItems, 'addTransfers': addTransfers };
	let request = new ActionRequest('addAddOns', 'SchoolOrder', data);
	let responseJSON = await myFetch(request);
	
	if (responseJSON.success) {
		order.updateFromJSON(responseJSON.data.newOrder);
		cleanInputRows(rows);
			// exit 'add' mode
		runtime.activeMode = null;
	}
}

function cancelAddOns(target) {
	const tbody = target.closest('tbody');
   const rows = Array.from(tbody.querySelectorAll('tr'));

   rows.forEach(row => {
      if (row.querySelector('select')) {
         row.remove();
      }
   });
		// exit add on mode
	runtime.activeMode = null;
}

function buildAddOnSelect(prnt) {
			// we should be doing this from the actual order, not the DOM, yeah?
		// get the styles that have already been added. get the rows with the attribute, then pull the ids with .map()
	const styleRows = Array.from(prnt.querySelectorAll('tr[data-style-i-d]'))
	const preStyleIDs = styleRows.map(tr => Number(tr.getAttribute('data-style-i-d')));
	
	const newSlct = document.createElement('select');
		//add styles to the select
	const stylesArr = Object.values(runtime.allStyles.getSync());
	stylesArr.forEach((style) => {
			// exclude the preexisting styles
		if (!preStyleIDs.includes(style.id)) {
			const newOptn = document.createElement('option');
			newOptn.textContent = style.shortName;
			newOptn.value = makeAddOnValue('styles', style.id);
			newSlct.appendChild(newOptn);
		}
	});

		//add transfers to the select
	const transferRows = Array.from(prnt.querySelectorAll('tr[data-transfer-i-d]'))
	const preTransferIDs = transferRows.map(tr => Number(tr.getAttribute('data-transfer-i-d')));
	
	for (const t of Object.values(runtime.allTransfers.getSync())) {
		if (!preTransferIDs.includes(t.id)) {
			const newOptn = buildElement("option", { text: t.transferName });
			newOptn.value = makeAddOnValue('transfers', t.id);
			newSlct.appendChild(newOptn);
		}
	}


	newSlct.addEventListener('change', (e) => {
		const row = e.target.closest('tr');

		const valueType = parseAddOnOption(e.target.value).table;
		const valueID = parseAddOnOption(e.target.value).id;
		
			// create the inputs for the middle columns
		makeSizeInputs(row, valueType, valueID);
   });

	return newSlct;
}

	// doesn't just make the inputs it's self, but handles when which cells get inputs
function makeSizeInputs(row, tbl, id) {
	if (tbl == 'styles') {
		const style = runtime.allStyles.getByID(id);
		const defColorID = style.defaultColor.id;

			// get the size displayChars for this style/color combo
		const styleSizeDChars = runtime.allItems.getSizeDisplayCharsByStyleColor(id, defColorID);
			// get the sizes for a style with default color
		const styleSizes = runtime.allItems.getSizesByStyleColor(id, defColorID);

			// we want to distinguish between 'styles' and 'transfers'
				// here we handle one size fits all items, placing the input in the smalls column
					// in the else we'll handle regularly sized styles
		if (styleSizes.length === 1 && styleSizes[0].displayChar === 'O') {
			for (const td of row.querySelectorAll('td[data-display-char]')) {
				if (td.dataset.displayChar == 'S' || td.dataset.displayChar == 'O') {
						// for *one-size* items, get the quantity from the total cell, if it exists
					const totalTD = row.querySelector('td[title=total]');
						// if totalTD exists, get it's value
					const q = totalTD?.textContent || '';

						// id is the styleID
					makeOrderSizeInput(td, id, styleSizes[0], q);

					td.dataset.displayChar = 'O';
					td.title = 'O';
				} else {
						// clear
					td.textContent = '';
				}
			}
		} else {
				// if the first cell held a 'one-size' input, fix it
			if (row.cells[1].dataset.displayChar == 'O') {
				row.cells[1].dataset.displayChar = 'S';
				row.cells[1].title = 'S';
			}
			for (const td of row.querySelectorAll('td[data-display-char]')) {
				const sizeDC = td.dataset.displayChar;
				const size = styleSizes.find(size => size.displayChar === sizeDC);

				if (styleSizeDChars.includes(sizeDC)) {
					const currentValue = td.textContent.trim();

						// id is the styleID
					makeOrderSizeInput(td, id, size, currentValue)
				} else {
						// if this size doesn't exist for this style, remove any existing input
					td.textContent = '';
				}
			}
		}
	} else if (tbl == 'transfers') {
		const inputTD = row.cells[1];
		const totalTD = row.querySelector('td[title=total]');
			// if totalTD exists, get it's value
		const q = totalTD?.textContent || '';

			// if we are in add mode, handle middle cells
				// if we are in edit mode, row.cells[1] should colspan all those cells
		const sizeTDs = row.querySelectorAll('td[data-display-char]');
		if (sizeTDs) {
			sizeTDs.forEach(std => {
				std.textContent = '';
			})
		}

			// build an input in the cell
		makeOrderTransferInput(inputTD, id, q);
	}
}

function makeOrderSizeInput(td, styleID, size, currentValue) {
		// clear the destination, then align it
	td.textContent = '';
		// make the input
	const input = makeOrderInput(currentValue);
	input.name = `addOn:style:${styleID}:size:${size.displayChar}`;
	input.dataset.sizeID = size.id;

		// also make a data-attribute to compare against on submit
	if (currentValue) td.dataset.oValue = currentValue;

	td.appendChild(input);
}

function makeOrderTransferInput(td, id, currentValue) {
		// clear the destination, then align it
	td.textContent = '';
	td.style.textAlign = 'left';
		// make the input
	const input = makeOrderInput(currentValue);
	input.name = `addOn:transfer:${id}`;
		// unnecessary, transferID is attached to the row it's self
	// input.dataset.transferID = id;

	if (currentValue) td.dataset.oValue = currentValue;

	td.appendChild(input);
}

function makeOrderInput(currentValue) {
	const input = document.createElement('input');
	input.type = 'number';
	input.min = 0; 
	input.max = 99;
	input.step = 1;
		// set the initial value if it exists
	if (currentValue) input.value = currentValue;

	return input; 
}

	// takes the values of inputs, puts them directly in table cells
function cleanInputRows(rows) {
		// check if the row was marked complete. if so, change to partial. uncheck the box
	const tbody = rows[0].closest('tbody');
	if (tbody.classList.contains('doneRow')) {
		tbody.classList.remove('doneRow');
		tbody.classList.add('partDoneRow');
		tbody.querySelector('input[type="checkbox"]').checked = false;
	}
		// actual cell cleaning
	rows.forEach((row) => {
		const cells = row.querySelectorAll('td');

		let total = 0;

			// if the first element contains a select, get it's name and make that the first td
		const slct = row.querySelector('select');
		if (slct) {
			const value = slct.value;
			const tbl = parseAddOnOption(value).table;
			const id = Number(parseAddOnOption(value).id);

				// be sure to set the data-attribute
			if (tbl == 'styles') {
				row.dataset.styleID = id;
				cells[0].textContent = slct.options[slct.selectedIndex].text;
			} else if (tbl == 'transfers') {
				row.dataset.transferID = id;
				cells[0].textContent = 'Transfer - ' + slct.options[slct.selectedIndex].text;
			}
		}

			// handle quantity tds
		if (cells[1].dataset.displayChar == 'O' || row.dataset.transferID) {
				// get the total, if any
			const input = cells[1].querySelector('input');
			if (input) total = parseInt(input.value) || 0;
				// clear the cell regardless
			cells[1].textContent = '';
		} else {		
			let zeroReplacement = '';
				// if this is the first row, use '-'
			if (row === row.parentElement.firstElementChild) zeroReplacement = '-';
				
				// skip the first and last two cells
			for (let i = 1; i < cells.length - 2; i++) {
				const input = cells[i].querySelector('input');
				let value = 0;
				if (input) {
						// if the input.value > 0, put it in the cell, otherwise empty the cell
					value = parseInt(input.value) || 0;
					cells[i].textContent = (value > 0) ? value : zeroReplacement;
				}
				total += value;
				
					// add a title for new rows
				if (!cells[i].title) cells[i].title = sizeList[i - 1];
			}
		}
		
			// set the total, and DONT ensure the final cell is empty, because it might hold the buttons
		cells[cells.length - 2].textContent = total;
		// cells[cells.length - 1].textContent = '';
			// remove the row if it was empty, and was not the first row
		if ((total === 0) && (row !== row.parentElement.firstElementChild)) row.remove();
	});
}

	// a check for adding to an order, makes sure you don't try to add the same style twice
function checkDuplicateAddedStyles(rows) {
		// get an array of selected values from rows
	const selectedValues = [];
	Array.from(rows).forEach((row) => {
		const slct = row.querySelector('select');
		if (slct.value) selectedValues.push(slct.value);
	})
		// some() checks if array values are unique here
   let check = selectedValues.some((val, idx, arr) => arr.indexOf(val) !== idx);
	return check;
}

function makeAddOnValue(table, id) {
	return table + ':' + id;
}

function parseAddOnOption(value) {
	const [table, id] = value.split(':');
   return { table, id: Number(id) };
}



function showEditSizeInputs(order) {
		// set mode. prevents addOns being activated while edit is in progress
	runtime.activeMode = 'edit';
		// get the parent element with the specified data attribute
	const prnt = document.querySelector(`[data-school-order-id="${order.id}"]`);
	if (prnt) {
			// get the rows for the order
		const rows = Array.from(prnt.children);
			// make an identifier for the first input so we can focus later
		let firstInput = null;
			// make inputs
    	rows.forEach((row) => {
			const styleID = row.dataset.styleID;
			const transferID = row.dataset.transferID;
				// handle size tds
			if (styleID) {
				makeSizeInputs(row, 'styles', styleID);
			} else if (transferID) {
				makeSizeInputs(row, 'transfers', transferID);
			}

				// handle the total td. store it's textContent, and empty it
			const cells = row.querySelectorAll('td');
			let totalCell = cells[cells.length - 2];
			totalCell.dataset.oValue = totalCell.textContent.trim();
			totalCell.textContent = '';
      });
		
			// put submit and cancel in the right place
		const firstCells = rows[0].querySelectorAll('td');
		const btnTD = firstCells[firstCells.length - 2];
			// function(btnCntnr, lstnrCntnr, type, action)
		makeSubmitCancelButtons(btnTD, prnt, 'order', 'Edit');

			// give focus to the first input
		rows[0].querySelector('input')?.focus();
	} else {
		console.error(`Element with data-schoolOrderID="${orderID}" not found.`);
	}
}

function cancelSizeEdit(target) {
	const tbody = target.closest('tbody');
   const rows = Array.from(tbody.querySelectorAll('tr'));
		// a quick clean. remove the inputs and set the cell values to the oValues we stored in a data attribute
   rows.forEach(row => {
		const cells = Array.from(row.querySelectorAll('td'));
		for (let i = 1; i < cells.length -1; i++) {
				// empty 'one-size' cells
			if (cells[i].dataset.displayChar == 'O' || cells[i].dataset.blankCell) {
				cells[i].textContent = '';
			} else {
				cells[i].textContent = cells[i].dataset.oValue;
			}
		}
   });
		// exit edit mode
	runtime.activeMode = null;
}


async function submitSizeEdit(target, order) {
	const tbody = target.closest('tbody');
		// get the rows
	const rows = Array.from(tbody.querySelectorAll('tr'));
		
		// check which items have changed
	const items = [];
	const transfers = [];
	rows.forEach((row) => {
			// first, we need to check if a row is for shirts or transfers
		if (row.dataset.styleID) {
				// get the style
			const styleID = Number(row.dataset.styleID);
				// we need the style to get the default color
			const style = runtime.allStyles.getByID(styleID);

				// get the inputs
			const inputs = Array.from(row.querySelectorAll('input[type="number"]'));
			inputs.forEach(input => {
					// if the value has been changed, add it to the array
				let oValue = input.closest('td').dataset.oValue;
				if (oValue === '-' || oValue === '') oValue = 0;
				if (input.value != oValue) {
					const sizeID = input.dataset.sizeID;
						// get the item based on style/color/size
					const item = runtime.allItems.getByStyleColorSize(style.id, style.defaultColor.id, sizeID);
					const shirt = {
						itemID: item.id,
						quantity: input.value
					};
					items.push(shirt);
				}
			});
		} else if (row.dataset.transferID) {
				// get the input
			const input = row.querySelector('input[type="number"]');
				// if the value has been changed, add it to the array
			let oValue = input.closest('td').dataset.oValue;
			if (oValue === '-' || oValue === '') oValue = 0;
			if (input.value != oValue) {
				const transfer = {
					transferID: Number(row.dataset.transferID),
					quantity: input.value
				}
				transfers.push(transfer);
			}
		}
	});
	
		// cancel if no thing was changed
	if (items.length === 0 && transfers.length === 0) {
		cancelSizeEdit(target);
		return;
	}
	
		// send it to the server
	const data = { 'orderID': order.id, 'items': items, 'transfers': transfers };	
	const request = new ActionRequest('editSizes', 'SchoolOrder', data);
	let responseJSON = await myFetch(request);

	if (responseJSON.success) {
		order.updateFromJSON(responseJSON.data.newOrder);
		cleanInputRows(rows);
			// exit edit mode
		runtime.activeMode = null;
	}
}


	// shows the original message
function showOMessage(order) {
	if (!order.messageOrders[0]) {
		openModal("No order message");
	} else {
		let mText = order.messageOrders[0].orderText;
		console.log(order);
			// if there is a second messageOrder, append it's text
		if (order.messageOrders[1]) mText += "\n\n" + order.messageOrders[1].orderText;
			// display it
		openModal(mText);
	}
}


	// toggles an order as done / not done
async function toggleOrderCompleteness(box, order) {
	if (order.shirtsByStyle.length === 0) {
		openModal("You can not mark an order with no shirts complete");
		box.checked = false;
	} else {
		let completeness = box.checked;
		let tbody = box.closest('tbody');
		
		const data = {'id': order.id, 'completeness': completeness};
		let request = new ActionRequest('changeOrderCompleteness', 'SchoolOrder', data);
		let responseJSON = await myFetch(request);
		
		if (responseJSON) {
			if (completeness) {
				tbody.classList.remove("unDoneRow", "partDoneRow", "overRow", "unOrderedRow");
				tbody.classList.add("doneRow");
					// don't updateNeeded for partDone/overRows. they are not counted in the needed table
				if (order.completeness < 2) updateNeeded(order);
			} else {
				tbody.classList.remove("doneRow", "partDoneRow");
				tbody.classList.add("unDoneRow");
				updateNeeded(order, false);
			}
				// do this last
			order.completeness = completeness;
		} else {
			box.checked = !completeness;
		}
	}
}

	// updates a one row table at the top of the page displaying how many more of each size are needed
function updateNeeded(order, add = true) {
	const nCntnr = document.getElementById('needContainer');
	const tds = nCntnr.querySelectorAll('tbody tr td');
	const totalCell = Array.from(tds).find(td => td.title === "total");
	let total = totalCell ? parseInt(totalCell.textContent.trim(), 10) || 0 : 0;


		// show the table if it was empty and hidden
	nCntnr.classList.remove('hidden');

	order.getTeamStyle().sizes.forEach(size => {
		const match = Array.from(tds).find(td => td.title === size.displayChar);
      if (match) {
         let current = parseInt(match.textContent.trim(), 10);
         if (isNaN(current)) current = 0;
				// make quantity negative if add is false
         const delta = add ? -size.quantity : size.quantity;
         match.textContent = current + delta;
			

			total += delta;
			// const totalCell = Array.from(tds).find(td => td.title === "total");
         // let currentTotal = parseInt(totalCell.textContent.trim(), 10);
         // if (isNaN(currentTotal)) currentTotal = 0;
         // totalCell.textContent = currentTotal + delta;

			// 	// hide if total needed = 0
			// if ((currentTotal + delta) === 0) totalCell.closest('table').classList.add('hidden');
      }
	});

		// set the total display
	if (totalCell) totalCell.textContent = total;
		// if total needed == 0, hide the table
	if (total === 0) nCntnr.classList.add('hidden');
}


	// marks a comment as handled
async function changeCommentHandled(box) {
	const data = {'id': box.dataset.orderId, 'handled': box.checked};
	console.log(data);
	let request = new ActionRequest('changeCommentHandled', 'MessageOrder', data);
	let responseJSON = await myFetch(request);
	
		// remove the comment, or alert user of db failure
	if (responseJSON.data.rowsAffected) {
		const table = box.closest('table');
		const tbody = box.closest('tbody');

		box.closest('tr').remove();

			// if the tbody is emptied (this was the only comment), remove the table
		if (tbody && tbody.querySelectorAll('tr').length === 0) {
			table.remove();
		}
	} else {
		openModal('Something went wrong marking this comment as handled');
		box.checked = false;
	}
}

    // add an itemless schoolOrder to an event. will add it to db, and current display 
        // useful when a school orders add ons before submitting a roster through ihsaa
async function makeBlankOrder() {
	let allSchools = Object.values(await runtime.allSchools.load());
	allSchools.sort((a, b) => a.shortName.localeCompare(b.shortName));

	    // Create content as a DOM fragment / wrapper
	const wrapper = document.createElement('div');
	wrapper.innerHTML = 
      `<label for="schoolInput">Select School:</label>
		<input list="schoolList" id="schoolInput" name="schoolInput" />
		<datalist id="schoolList"></datalist>
		<p id="schoolIDDisplay">Selected School ID: <span id="schoolID"></span></p>`;
	if (runtime.stateEvent.sport.name.toLowerCase() === "soccer") {
		wrapper.innerHTML += 
			`<form class="genderRadio"d>
				<p>Gender:</p>
				<label><input type="radio" name="gender" value="1">Boys</label>
				<label><input type="radio" name="gender" value="2">Girls</label>
				<p id="gndrMsg"></p>
			</form>`;
	}
	wrapper.innerHTML += `<button id="addSchoolBtn">Add School</button>`;

        // setTimeout() to delay the code that follows. give the DOM time to catch up
	setTimeout(() => {
		wrapper.querySelector('#schoolInput')?.focus();
	}, 0);

        // make a list of schools to select from
	const schoolMap = {};
	const dl = wrapper.querySelector('#schoolList');
	allSchools.forEach(school => {
		const optn = document.createElement('option');
		optn.value = school.shortName;
		dl.appendChild(optn);
		schoolMap[school.shortName] = school;
	});

        // update schoolID <span> on selection change
	wrapper.querySelector("#schoolInput").addEventListener("change", (e) => {
		const schoolName = e.target.value;
		const school = schoolMap[schoolName] || "Not found";
		wrapper.querySelector("#schoolID").textContent = school.id;
	});

        // add a listener for the submit button
	wrapper.querySelector("#addSchoolBtn").addEventListener("click", async () => {
			// get the school
		const schoolName = wrapper.querySelector("#schoolInput").value;
		const school = schoolMap[schoolName];
		if (!school) {
			wrapper.querySelector("#schoolID").textContent = "School not found";
			return;
		}

			// initialize gender as null
		let gender = null;
			// check if the gender form exists. currently only true for soccer
		const genderForm = wrapper.querySelector(".genderRadio");
		if (genderForm) {
			const selected = genderForm.querySelector('input[name="gender"]:checked');
			if (selected) {
					gender = selected.value;
			} else {
						// optionally, handle case where nothing is selected
					wrapper.querySelector("#gndrMsg").textContent = "Gender is required for this sport";
					return;
			}
		}
            // close the modal on submit
		closeModal();

            // get the eventSiteDivision so we can add this new order appropriately
		const esd = runtime.stateEvent.getEsdByDivIDAndGenderID(school.division.id, gender);
			// check if this school already has an order
		if (esd.hasSchoolByID(school.id)) {
				// if so, reopen modal just to show a message
			openModal("This school is already in this event.");
		} else {
				// if not, add it
			const request = new ActionRequest('addNewOrder', 'SchoolOrder', [esd.id, school.id, gender]);
			const responseJSON = await myFetch(request);
			const orderID = responseJSON.data;
                // get the appropriate table to append this order to
			let table = document.querySelector(`table.orderTable[data-event-site-division-id='${esd.id}']`);
				// if it doesn't already exist, create it
			if (!table) {
				const table = document.createElement('table');
				table.innerHTML = `<thead><tr>
									<th>School</th>
									<th>S</th><th>M</th><th>L</th><th>XL</th><th>2X</th><th>3X</th><th>Total</th>
									<th><span class="material-icons">more_horiz</span></th>
									</tr></thead>`;
				table.className = "orderTable";
				table.dataset.eventId = runtime.stateEvent.id;
				table.dataset.eventSiteDivisionId = esd.id;
				
					// Find the h3 with the matching division id, so we can navigate the DOM to place the table
				const h3 = document.querySelector(`h3[data-event-site-division-id='${esd.id}']`);
				if (!h3) {
					console.error(`Could not find h3 for division id ${esd.id}`);
					return;
				}

					// Traverse upward to find the previous h2 so we can get a data-attribute
				let current = h3.previousElementSibling;
				while (current && current.tagName !== 'H2') {
					current = current.previousElementSibling;
				}

				if (current && current.dataset.eventSiteId) {
					table.dataset.eventSiteId = current.dataset.eventSiteId;
				} else {
					console.error(`Could not find corresponding h2 for division id ${esd.id}`);
					return;
				}

				// const so = new SchoolOrder({ id: orderID, eshdID: esd.id, })
				// const table = buildOrdersTable();

					// Insert the table after the h3
				h3.insertAdjacentElement('afterend', table);
			}
    
                // populate the new <tr>
			const rowContent = `<tr data-style-id="9">
					<td title="${orderID} / ">${schoolName}</td>
					<td title="S">-</td>
					<td title="M">-</td>
					<td title="L">-</td>
					<td title="XL">-</td>
					<td title="2XL">-</td>
					<td title="3XL">-</td>
					<td title="total">-</td>
					<td>
						<span class="material-icons clickable order-action addAddOns" title="add add ons">add</span><span class="material-icons clickable order-action editSizes" title="edit the quantities">edit</span>
						<span class="material-icons clickable order-action showMessage" title="view the original message">article</span>
						<span class="material-icons clickable order-action printLabel" title="print box label">print</span>
						<span class="material-icons clickable order-action dlInvoice" title="download invoice">request_quote</span>
						<input class="orderChckBx" type="checkbox" id="" name="" 
							value="${orderID}" title="mark order complete" />
					</td>
				</tr>`;
                // make a new tbody to hold the new tr
			const newTbody = document.createElement('tbody');
			newTbody.innerHTML = rowContent;
			newTbody.id = 'row' + orderID;
			newTbody.className = 'unDoneRow';
			newTbody.dataset.schoolOrderId = orderID;

                // we'll use these to place the new tbody at the right spot in the table
			const tbodies = Array.from(table.querySelectorAll("tbody"));
			let inserted = false;

			for (const tbody of tbodies) {
                    // get the first tr of the tbody
				const row = tbody.querySelector("tr");
                    // get the school name so we can check order
				const cellText = row?.querySelector("td")?.textContent?.trim();
                    // compare names, insert when appropriate
				if (cellText && schoolName.localeCompare(cellText, undefined, { sensitivity: 'base' }) < 0) {
					tbody.before(newTbody);  // newTbody should be a full <tbody> with a <tr> inside
					inserted = true;
                        // break on insertion. don't keep looking.
					break;
				}
			}
                // fallback, append to end of the table
			if (!inserted) {
				table.appendChild(newTbody);  
			}

                // finally, add the new order to the runtime
                    // make the order object, use data from above
                    //constructor({ id, eshdID, school, completeness = 0, due = null, paid = null, schoolOrderNote = null, 
                    // invoiceSent = null, messageOrders = [], shirtsByStyle = [], site = undefined, sport = undefined }) 
            const order = new SchoolOrder({
                id: orderID,
                eshdID: esd.id,
                school: school
            });

            esd.schoolOrders.push(order);
                // sort the addition
            esd.sortSchoolOrders();
		}
	});

        // finally attach everything
   openModal(wrapper); 
}


function showMoreRowOptions(order) {
		// set so modal function can access
	runtime.activeOrder = order

	const wrapper = document.createElement('div');
	let html = `<button class="clickable quote" title="download add on quote">Quote</button>`;
	html += `<label>Download the invoice as a quote</label><br />
				<button class="clickable receipt" title="download add on receipt">Receipt</button>`;
	html += `<label>Download the invoice as a Receipt</label><br />`;

	wrapper.innerHTML = html;
	openModal(wrapper);
}


	// display an input in the modal for uploading qualifiers
function showQlfrsUpld() {
		// make a file input
	const wrapper = document.createElement('div');
	wrapper.innerHTML = 
		`<label>Select and excel file to upload qualifiers</label>
		<input type="file" id="qlfrsInput" accept=".xlsx,.xls" />`;

		// open it in the modal
	openModal(wrapper);
	
		// add a listener to run when a file is selected
	document.getElementById('qlfrsInput').addEventListener('change', uploadQualifiers);
}


	// upload qualifiers
async function uploadQualifiers() {
		// aliases for the total column to check for
	const totalColAliases = ['total', 'students', 'grand total', 'not scratched', 'participants', '# Part'];
		// container for actual upload
	let upSchools = {};

		// get the file
	const file = document.getElementById('qlfrsInput').files[0];
	if (!file) return;
		// Read file into an ArrayBuffer
	const data = await file.arrayBuffer();
		// Parse data
	const workbook = XLSX.read(data);

		// pull data from each sheet
	workbook.SheetNames.forEach(sheetName => {
			// get the actual sheet
		const sheet = workbook.Sheets[sheetName];
			// Convert to simple row arrays
		const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

			// define some containers
		let headerRowIndex = null;
		let schoolColsIndices = [];
		let totalColsIndices = [];

			// find the actual header row, grab the school indexes
		rows.forEach((row, i) => {
			if (headerRowIndex) return; // already found, skip the rest
			row.forEach((cell, j) => {
				if (typeof cell === 'string' && cell.trim().toLowerCase().startsWith('school')) {
					headerRowIndex = i;
					schoolColsIndices.push(j);
				}
			});
		});

			// if no school column found, exit
		if (headerRowIndex === null) {
			openModal("No 'School' column found, check the file");
			return;
		}
		
			// grab the total column indices
			// do this after finding the header in case some nut has placed the total column left of the school column
		rows[headerRowIndex].forEach((cell, k) => {
			if (typeof cell === 'string' && totalColAliases.some(str => cell.trim().toLowerCase().startsWith(str))) {
				totalColsIndices.push(k);
			}
		})

			// check if schools and totals have the same number of columns, if not exit
		if (schoolColsIndices.length !== totalColsIndices.length) {
			openModal(`Hey, this file contains ${schoolColsIndices.length} SCHOOL column and ${totalColsIndices.length} TOTAL columns. Check it.`);
			return;
		}

			// get the actual data to upload
		schoolColsIndices.forEach((val, i) => {
				// which columns to pull from
			let schoolI = schoolColsIndices[i];
			let totalI = totalColsIndices[i];
				// start after the header row
			for (let j = headerRowIndex + 1; j < rows.length; ++j) {
					// ensure the columns look right, a school, not a 'TOTAL' row, and a number in the right place
				const total = Number(rows[j][totalI]);
				if (typeof rows[j][schoolI] === 'string' && !isNaN(total) 
					&& !rows[j][schoolI].trim().toLowerCase().startsWith('total')) {
							// trim, and strip any '.' from name
						const name = rows[j][schoolI].trim().replace(/\./g, '');
						
							// if upSchools does not yet include this school, add it
						if (!upSchools[name]) {
							upSchools[name] = { 
								name: name,
								qualifiers: 0
							};
						}

							// then add the qualifiers
						upSchools[name].qualifiers += total;
				}
			}
		});
	});
	
	console.log(upSchools);

	let esdIDs = {};
	
	runtime.stateEvent.eventSites.forEach(es => {
		es.esDivisions.forEach(esd => {
			esdIDs[esd.division.id] = esd.id;
		});
	});

	const data2 = {'upSchools': upSchools, 'esdIDs': esdIDs};
	let request = new ActionRequest('uploadQualifiers', 'SchoolOrder', data2);
	let responseJSON = await myFetch(request);

		// if school names didn't match, display them in the modal
	if (Array.isArray(responseJSON.data.unmatchedSchools) && responseJSON.data.unmatchedSchools.length) {
		const schools = responseJSON.data.unmatchedSchools;

		const message = `
			<p>There were some unmatched schools:</p>
			<ul>${schools.map(s => `<li>${s.name}</li>`).join('')}</ul>
		`;

		openModal(message);
		// if all matched, close the modal
	} else if (responseJSON) {
		closeModal();
	}
}

	// show an A-Z list of all schools in the event
function showAllSchoolsAZ() {
	const schoolNames = [];
	runtime.stateEvent.eventSites.forEach(es => {
		es.esDivisions.forEach(esd => {
			esd.schoolOrders.forEach(so => {
				schoolNames.push(so.school.shortName);
			});
		});
	});

	schoolNames.sort();

	const ul = buildElement("ul");

	schoolNames.forEach(sn => {
		ul.appendChild(buildElement("li", { text: sn }));
	});

	openModal(ul);
}



///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
// functions for handling an event's inventories

function showEditInventory(btn) {
		// set mode. prevents addOns being activated while edit is in progress
	runtime.activeMode = 'edit';

	const invTbl = getInventoryTable(btn.dataset.eventSiteID);
	const invTDs = invTbl.querySelectorAll('td[data-inv-item-i-d]');
	const trnsfrTDs = invTbl.querySelectorAll('td[data-inv-transfer-i-d]');

		// put inputs in the appropriate tds
	invTDs.forEach(td => {
		const inpt = makeInventoryInput(td);
		td.textContent = '';
		td.appendChild(inpt);
	});
	trnsfrTDs.forEach(td => {
		const inpt = makeTransferInput(td);
		td.textContent = '';
		td.appendChild(inpt);
	});

		// give focus
	invTDs[0]?.querySelector('input')?.focus();

		// function(buttonContainer, listenerContainer, type, action, id)
	makeSubmitCancelButtons(btn.parentElement, invTbl, 'inventory', 'InventoryEdit', btn.dataset.eventSiteID);
}

async function submitInventoryEdit(btn) {
	const itemsMap = runtime.allItems.getSync();
	const transfersMap = runtime.allTransfers.getSync();

	const esID = btn.dataset.id;
	const tbl = getInventoryTable(esID);
	const invTDs = tbl.querySelectorAll('td[data-inv-item-i-d]');
	const trnsfrTDs = tbl.querySelectorAll('td[data-inv-transfer-i-d]');

	const updateInvItems = [];
	const updateTransfers = [];

	invTDs.forEach(td => {
		const inputValue = Number(td.querySelector('input').value);
		if (Number(td.dataset.oValue) !== inputValue) {
			updateInvItems.push({ 
				invItemID: Number(td.dataset.invItemID), 
				itemID: Number(td.dataset.itemID), 
				quantity: inputValue, 
				price: itemsMap[td.dataset.itemID].price 
			});
		}
	});

	trnsfrTDs.forEach(td => {
		const inputValue = Number(td.querySelector('input').value);
		if (Number(td.dataset.oValue) !== inputValue) {
			updateTransfers.push({ 
				invTransferID: Number(td.dataset.invTransferID), 
				transferID: Number(td.dataset.transferID), 
				quantity: inputValue, 
				price: transfersMap[td.dataset.transferID].price 
			});
		}
	});
	
		// if there are changes, send them to the server
	if (updateInvItems.length || updateTransfers.length) {
		const data = { 'eventSiteID': esID, 'updateItems': updateInvItems, 'updateTransfers': updateTransfers };	
		const request = new ActionRequest('editEventSiteInventory', 'EventSite', data);
		let responseJSON = await myFetch(request);

		if (responseJSON.success) {
				// update the cells
			invTDs.forEach(td => {
				updateTotalCell(td);
				td.textContent = td.querySelector('input').value;
				td.dataset.oValue = td.textContent;
			});
			trnsfrTDs.forEach(td => {
				td.textContent = td.querySelector('input').value;
				td.dataset.oValue = td.textContent;
			});

				// update runtime
			const eSite = runtime.stateEvent.getEventSiteByID(esID);
			eSite.updateInventory(updateInvItems, updateTransfers);

				// reset the buttons
			resetInventoryButtons(btn);

				// unset activeMode
			runtime.activeMode = null;
		} else {
			openModal("there was a problem submitting the inventory edit");
		}
	} else {
		cancelInventoryEdit(btn);
	}
}

function updateTotalCell(td) {
	// console.log(td, td.querySelector('input'), td.querySelector('input').value);
	console.log(td, td.querySelector('input'));
	const newValue = Number(td.querySelector('input').value);
	const oldValue = Number(td.dataset.oValue ?? td.textContent);
	const diff = newValue - oldValue;

		// find total cell in the same row
	const totalCell = td.parentElement.querySelector('td[data-total-cell]');

		// adjust the value
	if (totalCell) totalCell.textContent = Number(totalCell.textContent) + diff;
}

function cancelInventoryEdit(btn) {
		// get the right table
	const tbl = getInventoryTable(btn.dataset.id);

		// clear the tds
	tbl.querySelectorAll('td[data-inv-item-i-d], td[data-inv-transfer-i-d]').forEach(td => {
		td.innerHTML = '';
		td.textContent = td.dataset.oValue;
	});

		// reset the buttons
	resetInventoryButtons(btn);

		// unset activeMode
	runtime.activeMode = null;
}

function resetInventoryButtons(btn) {
	const prnt = btn.parentElement;
	prnt.innerHTML = '';

	const newBtns = buildInventorySiteButtons(btn.dataset.id);
	prnt.append(...newBtns);
}

function showFillInventory() {
	console.log('fill');
}

function getInventoryTable(esID) {
		// grab the inventory container
	const cntnr = document.querySelector('.tabPanel.active[data-tab="inventory"]');
		// select the table with the matching data attribute
	const tbl = cntnr.querySelector(`table[data-event-site-i-d="${esID}"]`);

		// if no table matches, alert
	if (!tbl) {
		openModal("Could not find inventory table for eventSiteID " + esID);
		return;
	}

	return tbl;
}

function makeInventoryInput(td) {
	const input = document.createElement('input');
		input.type = 'number';
		input.name = `inventory${td.dataset.invItemId}`;
		input.value = td.dataset.oValue;
		input.min = 0; 
		input.max = 1000;
		input.step = 1;
		input.dataset.sizeChar = td.dataset.title;
	return input;
}

function makeTransferInput(td) {
	const input = document.createElement('input');
		input.type = 'number';
		input.name = `inventory${td.dataset.invTransferID}`;
		input.value = td.dataset.oValue;
		input.min = 0; 
		input.max = 1000;
		input.step = 1;
	return input;
}

function showAddItem(btn) {
	console.log('show')
}

function showAddTransfer(btn) {
	runtime.activeMode = 'addInventoryTransfer';

		// bring in a couple things
	const esID = btn.dataset.eventSiteID
	const eSite = runtime.stateEvent.getEventSiteByID(esID);
	const allTransfers = runtime.allTransfers.getSync();
	const eSiteTransfers = eSite.transfers;

		// make a Set of existing transferIDs
	const existingIDs = new Set(eSiteTransfers.map(t => t.transferID));
		// filter out matches
	const unTransfers = Object.values(allTransfers).filter(t => !existingIDs.has(t.id));

		// build a form to add transfers not already part of the event
	const frm = buildElement("form", { id: 'addTransferForm', dataset: { esID: esID } });
	frm.append(buildElement("p", { text: "Enter quantities for additional transfers:" }));
	frm.addEventListener("submit", function(e) { submitAddTransfer(e, frm); });

		// fill labels/inputs in the form
	unTransfers.forEach(t => {
		const inpt = buildElement("input", { id: `addTransfer${t.id}`, attrs: {
			name: t.id,
			type: 'number',
			min: 0,
			max: 2000,
			step: 1
		} });
		const lbl = buildElement("label", { text: `${t.transferName}: `, attrs: { for:`addTransfer${t.id}` } });
		frm.appendChild(buildElement("fieldset", { children: [ lbl, inpt ] }));
	});

		// make a label, a button, put them in the modal
	frm.appendChild(buildElement("button", { text: "SUBMIT", classes: 'block' }));

	openModal(frm);
}

async function submitAddTransfer(e, form) {
		// stop page refresh
	e.preventDefault();

		// ensure necessary data loaded
	await runtime.allTransfers.load();

	const esID = form.dataset.esID;

		// handle your form data here
	const data = new FormData(form);
	const updateTransfers = [];

	for (const [key, value] of data) {
		if (value > 0) {
			const t = runtime.allTransfers.getByID(key);
			updateTransfers.push({ 
				invTransferID: null, 
				transferID: Number(t.id), 
				quantity: Number(value), 
				price: t.price
			});
		}
	}
	
	const update = { 'eventSiteID': esID, 'updateTransfers': updateTransfers };	
	console.log(update);
	const request = new ActionRequest('editEventSiteInventory', 'EventSite', update);
	let responseJSON = await myFetch(request);

	if (responseJSON.success) {
		closeModal();

			// add the new transfers to the table
		const tbl = getInventoryTable(esID);
		const tbody = tbl.querySelector("tbody");

		const newTransfers = [];
		updateTransfers.forEach(ut => {
			newTransfers.push(InventoryTransfer.fromJSON({ 
				id: null,
				eventSiteID: esID,
				transferID: ut.transferID,
				startQ: ut.quantity,
				soldQ: null,
				price: ut.price,
				transfer: runtime.allTransfers.getByID(ut.transferID)
			}))
		});

		buildInventoryTransfersRows(tbody, newTransfers);

			// add the new transfers to runtime
		const eSite = runtime.stateEvent.getEventSiteByID(esID);
		eSite.transfers.push(...newTransfers);

	}
}





	// helper
// function buildActionButton({ type, title = "", icon = null, text = "", classes = [], datasetExtra = {} }) {
//     const children = [];
//     if (icon) children.push(buildIcon(icon));
//     if (text) children.push(text);

//     return buildElement("button", {
//         classes: ["topLevelButton", "clickable", ...classes],
//         dataset: { btnType: type, ...datasetExtra },
//         title,
//         children
//     });
// }