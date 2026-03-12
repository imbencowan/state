/////////////////////////////////////////////////////////////////////////////////////////////
// js functions for the event page
import { runtime } from '../runtime.js';
import { myFetch } from '../fetch.js';
import { sizeList } from '../constants.js';
import { ActionRequest } from '../models/other-classes.js';
import { StateEvent, SchoolOrder, School } from '../models/db-classes.js';
import { openModal, closeModal } from '../modal.js';
import { buildElement, parseToInstancesArr } from '../utilities.js';
import { printBoxLabel, printUndoneBoxLabels, downloadInvoicePDF, printAllInvoices, 
			printSoSPDF, printAllSoSPDF, printOMessages, genIHSAATotals } from '../print.js';


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

		// attach a header, the buttons at the top of the page, tables for orders, a couple helper tables
	attachSportHeader(cntnr, data);
	attachTopButtons(cntnr, data);
	attachNeededTable(cntnr, data);
	attachOrders(cntnr, data);
	attachCommentTable(cntnr, data);

	return cntnr;
}

	// builds the inner page header
function attachSportHeader(cntnr, data) {
	const sport = data.sport.name;
	const year = data.startDate.toLocaleDateString("en-US", { year: "numeric" });
	const h = buildElement("h1", { text: sport + " " + year});
	cntnr.appendChild(h);
}

	// builds buttons for the top of the page for various print options 
function attachTopButtons(cntnr) {
	const b1 = buildElement("button", {
		classes: ["topLevelButton", "clickable", "genUndoneBoxLabelsBtn"],
		dataset: { btnType: "genBoxLabels" },
		title: "print all undone box labels",
		children: [ buildIcon("print"), " Undone Labels" ]
	});
	const b2 = buildElement("button", {
		classes: ["topLevelButton", "clickable", "printAllSoSPDF"],
		dataset: { btnType: "printAllSoSPDF" },
		title: "print all site's sign off sheets",
		children: [ buildIcon("print"), " All SoS" ]
	});
	const b3 = buildElement("button", {
		classes: ["topLevelButton", "clickable", "printInvoicesBtn"],
		dataset: { btnType: "printInvoices" },
		title: "print all invoices",
		children: [ buildIcon("print"), " Invoices" ]
	});
	const b4 = buildElement("button", {
		classes: ["topLevelButton", "clickable", "printMessagesBtn"],
		dataset: { btnType: "printMessages" },
		title: "print order messages",
		children: [ buildIcon("print"), " Messages" ]
	});
	const b5 = buildElement("button", {
		classes: ["topLevelButton", "clickable", "printTotalsBtn"],
		dataset: { btnType: "printTotals" },
		title: "print shirt totals",
		children: [ buildIcon("print"), " Totals" ]
	});
	const b6 = buildElement("button", {
		classes: ["topLevelButton", "clickable", "newOrderBtn"],
		dataset: { btnType: "newOrder" },
		title: "add an order",
		children: ["+ Order"]
	});
	const b7 = buildElement("button", {
		classes: ["topLevelButton", "clickable", "uploadQlfrs"],
		dataset: { btnType: "uploadQlfrs" },
		title: "upload qualifiers",
		children: [ buildIcon("upload"), " Qualifiers" ]
	});

	const h = buildElement("h1", { children: [ b1, b2, b3, b4, b5, b6, b7 ] })
	const btnCntnr = buildElement("div", { id: "buttonContainer", children: [ h ] });

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
	const thead = buildThead();		
		// the table, empty
	const table = buildElement("table", { classes: "orderTable", children: thead, dataset: {
		eventId: eventID,
		eventSiteId: esID,
		eventSiteDivisionId: esdID
	// 	<table class="orderTable" data-event-id="<?= $event->id; ?>" data-event-site-id="<?= $eventSite->id; ?>"
	// data-event-site-division-id="<?= $esd->id; ?>">
	} });
		// fill the table body
	buildTbodies(table, orders);

	return table;
}

function buildThead() {
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

function buildTbodies(table, orders) {
		// we'll need this for a data- in the trs
	const allStyles = runtime.allStyles.getSync();
	const teamStyleID = Object.values(allStyles).find(style => style.shortName === "Dairy Hoods").id;

	orders.forEach(so => {
		const teamShirts = so.getTeamStyle();

		let tds = [];

			// first td, the school name
		tds.push(buildElement("td", {
			title: (so.id + " / " + so.getMessageFileNames()), 
			text: so.school.shortName
		}));
			// then the sizes
		for (const s of sizeList) {
			tds.push(buildElement("td", { title: s, text: (teamShirts?.sizeMap[s]?.quantity || '-') }));
		}
			// then the total
		let totalText = so.getDairyTotal();
		if (so.qualifiers == null) console.log(so.id, so.school.shortName);
		if (so.qualifiers && (so.qualifiers != so.getDairyTotal())) {
			totalText += "/" + so.qualifiers;
		}
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
			makeRowIconButton('edit', 'editSizes', 'edit the sizes'),
			makeRowIconButton('mail', 'showMessage', 'view the original message'),
			makeRowIconButton('article', 'printLabel', 'print box label'),
			makeRowIconButton('request_quote', 'dlInvoice', 'download invoice'),
			makeRowIconButton('more_horiz', 'showMore', 'show more options'),
			chkBx
		] }));

			// build the row
		const trs = [];
		trs.push(buildElement("tr", { dataset: { styleId: teamStyleID }, children: tds }));

			// if there are any add ons, make rows for them
		if (so.hasAddOns()) {
			const addedStyles = so.getAddedStyles();
			for (const aStyle of addedStyles) {
				let tds = [];

					// first td, the school name
				tds.push(buildElement("td", {	text: aStyle.shortName }));
					// then the sizes
				let sTotal = 0
				for (const s of sizeList) {
					tds.push(buildElement("td", { title: s, text: (aStyle.sizeMap[s]?.quantity || '') }));
					sTotal += aStyle.sizeMap[s]?.quantity || 0;
				}
					// then the total
				tds.push(buildElement("td", { title: 'total', text: sTotal }));
					// an empty td to fill the table
				tds.push(buildElement("td"));

					// make the row
				trs.push(buildElement("tr", { classes: "addOnRow", dataset: { styleId: aStyle.id }, children: tds }));
			}
		}


		const tbody = buildElement("tbody", { 
			id: ('row' + so.id),
			classes: getRowCompletenessClass(so), 
			dataset: { schoolOrderId: so.id },
			children: trs 
		});
		table.appendChild(tbody);
	});
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

	// builds spans that contain icons. helper function to decrease redundant code
function buildIcon(type) {
   return buildElement("span", { classes: ["material-icons"], text: type });
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


	// attaches event listeners
export function addEventPageFunctionality() {
		// PRE LOAD 
	runtime.allItems.load();



	const container = document.getElementById('eventContainer');

		// this is one listener that handles clicks for all buttons on the event page
			// may be should move top level buttons to a more specific listener
		//////////////////////////////////////////////////////////////////////////////////////////////////////
	container.addEventListener('click', function(event) {
		const target = event.target;

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
		}

			// top-level buttons. 'selector': function to call
		const topLevelActions = {
			'button.genUndoneBoxLabelsBtn': () => printUndoneBoxLabels(),
			'button.genTotalsBtn': () => genIHSAATotals(),
			'button.printInvoicesBtn': () => printAllInvoices(),
			'button.printMessagesBtn': () => printOMessages(),
			'button.printTotalsBtn': () => printTotals(),
			'button.newOrderBtn': () => makeBlankOrder(),
			'button.printAllSoSPDF': () => printAllSoSPDF(),
			'button.printSoSPDF': () => printSoSPDF(runtime.stateEvent.getDivisionByID(target.dataset.eshdid)),
			'button.uploadQlfrs': () => showQlfrsUpld()
		};

		for (const sel in topLevelActions) {
			if (target.matches(sel)) {
				topLevelActions[sel]();
				return;
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


////////////////// functions for editing orders in the page

function showAddOnInputs(order) {
		// set mode. prevents edit being called while this is open
	runtime.activeMode = 'add';
		// get the parent element with the specified data attribute
	const prnt = document.querySelector(`[data-school-order-id="${order.id}"]`);
	if (prnt) {
			// don't add more rows than there are styles
		if (prnt.querySelectorAll('tr').length < 9) {
				// get the first tr
			const firstTr = prnt.querySelector('tr');
			
			const tdCount = firstTr ? firstTr.children.length : 0;

			const newTr = document.createElement('tr');
			
			newTr.classList.add('addOnRow');
				// create the style select
			const newTd = document.createElement('td');
				// send the parent so we can omit options that already exist
			const newSlct = buildAddOnSelect(prnt);
			newTd.appendChild(newSlct);
			newTr.appendChild(newTd);
			
				// make an identifier for the first input so we can focus later
			let firstInput = null;
				// create the inputs for the middle rows
			for (let i = 0; i < tdCount - 3; i++) {
				const newTd = document.createElement('td');
				const input = makeInput(i);
				newTd.appendChild(input);  
				newTr.appendChild(newTd);  
				if (!firstInput) firstInput = input;
			}
			
				// submit/cancel td
			const btnTD = document.createElement('td');
			newTr.appendChild(btnTD);
				// put submit and cancel buttons in the btnTD, unless there already is one
			if (prnt.querySelector('button.submitAddOns') === null) makeSubmitCancelButtons(btnTD, prnt, 'AddOns');
			
				// a final empty cell to maintain form
			const lastTd = document.createElement('td');
			newTr.appendChild(lastTd);

				// Append the newly created <tr> to the <tbody>
			prnt.appendChild(newTr);
			
				// give focus to the first input
			firstInput.focus();
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
	let addItems = [];
	rows.forEach((row) => {
			// get the itemID
		let styleID = Number(row.querySelector('select').value);
		let style = runtime.sizeCodesByStyles.find(style => style.id === styleID);
			// get the inputs
		const inputs = Array.from(row.querySelectorAll('input[type="number"]'))
			.filter(input => parseInt(input.value, 10) > 0);
		inputs.forEach((input) => {
				// match quantities with itemIDs, then push them to an array
			const sizeChar = input.dataset.sizeChar;
console.log(style);
			const itemID = style.sizeMap[sizeChar].id;
			const shirt = {
				itemID: itemID,
				quantity: input.value
			};
			addItems.push(shirt);
		});
	});
	
		// cancel if no thing was input
	if (addItems.length === 0) {
		cancelAddOns(target);
		return;
	}
	
		// send it to the server
	const data = {'orderID': order.id, 'addItems': addItems };
	let request = new ActionRequest('addAddOns', 'SOrderItem', data);
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

function makeSubmitCancelButtons(td, tbody, action) {
	const submitButton = document.createElement('button');
	submitButton.type = 'button';
	submitButton.textContent = 'Submit';
	submitButton.classList.add('addOnButton', 'order-action', 'submit' + action);
	td.appendChild(submitButton);
	
	const cancelButton = document.createElement('button');
	cancelButton.type = 'button';
	cancelButton.textContent = 'X';
	cancelButton.classList.add('addOnButton', 'order-action', 'cancel' + action);
	td.appendChild(cancelButton);

		// add event listeners for ESC and ENTER
	if (tbody) {
		// define the listener as a named function
		const keyHandler = function(e) {
			if (e.key === 'Escape') {
					cancelButton.click();
					cleanup();
			} else if (e.key === 'Enter') {
					submitButton.click();
					cleanup();
			}
		};

		tbody.addEventListener('keydown', keyHandler);

		// define a cleanup helper
		function cleanup() {
			tbody.removeEventListener('keydown', keyHandler);
		}
	}
}

function buildAddOnSelect(prnt) {
		// get the styles that have already been added. get the rows with the attribute, then pull the ids with .map()
	const rows = Array.from(prnt.querySelectorAll('tr[data-style-id]'))
	const preStyleIDs = rows.map(tr => Number(tr.getAttribute('data-style-id')));
	
	const newSlct = document.createElement('select');
	runtime.sizeCodesByStyles.forEach((style) => {
			// exclude the preexisting styles
		if (!preStyleIDs.includes(style.id)) {
			const newOptn = document.createElement('option');
			newOptn.textContent = style.shortName;
			newOptn.value = style.id;
			newSlct.appendChild(newOptn);
		}
	});
	return newSlct;
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
	rows.forEach((row) => {
		const cells = row.querySelectorAll('td');
			// if the first element contains a select, get it's name and make that the first td
		const slct = row.querySelector('select');
		if (slct) {
			const name = slct.options[slct.selectedIndex].text;
			cells[0].textContent = "+ " + name;
				// be sure to set the data-attributej
			row.dataset.styleId = slct.value;
		}
		
		let total = 0;
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
		
			// set the total, and DONT ensure the final cell is empty, because it might hold the buttons
		cells[cells.length - 2].textContent = total;
		// cells[cells.length - 1].textContent = '';
			// remove the row if the row if it was empty
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

function makeInput(i) {
	const input = document.createElement('input');
		input.type = 'number';
		input.name = `addOn${i}`;
		input.min = 0; 
		input.max = 99;
		input.step = 1;
		input.dataset.sizeChar = sizeList[i];
	return input;
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
    	rows.forEach((currentRow) => {
			const cells = currentRow.querySelectorAll('td');
				// Add number inputs to all but the first, and last two cells of each row
			for (let i = 1; i < cells.length - 2; i++) {
				const currentValue = cells[i].textContent.trim();
				const input = makeInput(i);
					// Set initial value from current text in <td>
				input.value = currentValue;
					// also make a data-attribute to compare against on submit
				cells[i].dataset.oValue = currentValue;
				cells[i].textContent = ''; // Clear existing content
				cells[i].appendChild(input);

				if (!firstInput) firstInput = input;
			}
			let totalCell = cells[cells.length - 2];
			totalCell.dataset.oValue = totalCell.textContent.trim();
			totalCell.textContent = '';
      });
		
			// put submit and cancel in the right place
		const firstCells = rows[0].querySelectorAll('td');
		const btnTD = firstCells[firstCells.length - 2];
		makeSubmitCancelButtons(btnTD, prnt, 'Edit');
			// give focus
		firstInput.focus()
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
			cells[i].textContent = cells[i].dataset.oValue;
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
	let items = [];
	rows.forEach((row) => {
			// get the style
		let styleID = Number(row.dataset.styleId);
		let style = runtime.sizeCodesByStyles.find(style => style.id === styleID);
			// get the inputs
		let inputs = Array.from(row.querySelectorAll('input[type="number"]'));
		inputs.forEach(input => {
				// if the value has been changed, add it to the array
			let oValue = input.closest('td').dataset.oValue;
			if (oValue === '-' || oValue === '') oValue = 0;
			if (input.value != oValue) {
				const sizeChar = input.closest('td').title;
				console.log(sizeChar, style);
				const itemID = style.sizeMap[sizeChar].id;
				let shirt = {
					itemID: itemID,
					quantity: input.value
				};
				items.push(shirt);
			}
		});
	});
	
		// cancel if no thing was changed
	if (items.length === 0) {
		cancelSizeEdit(target);
		return;
	}
	
		// send it to the server
	const data = { 'orderID': order.id, 'items': items };	
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
						<span class="material-icons clickable order-action addAddOns" title="add add ons">add</span><span class="material-icons clickable order-action editSizes" title="edit the sizes">edit</span>
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


	// display an input in the modal
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
	
	// console.log(upSchools);

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