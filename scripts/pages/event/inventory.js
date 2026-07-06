// rendering and interaction functions for the inventory tab of the event page

import { runtime } from '../../runtime.js';
import { sizeList, DAIRY_STYLE_ID, ADULT_HOOD_STYLE_ID } from '../../constants.js';
import { actionFetch, myFetch } from '../../fetch.js';
import { openModal, closeModal } from '../../modal.js';
import { buildElement, parseToInstancesArr } from '../../utilities.js';
import { buildActionButton, makeSubmitCancelButtons, makeTypeActionLabel } from '../page-utils.js';
import { InventoryItem, InventoryTransfer } from '../../models/db-classes.js';
import { printInventories } from '../../print.js';


   // define the top inventory buttons. what they say, and who they call
export const topInventoryButtons = [
   { action: "printAllInventoriesPage1", title: "print all starting inventories", icon: "print", 
      text: " All Page 1", handler: () => printInventories({ pages: 1 }) },
   { action: "printAllInventories", title: "print all full inventories", icon: "print", text: " All Full",
      handler: () => printInventories({ pages: 3 }) }
];
   // define per site inventory buttons
export const inventorySiteButtons = [
   { action: "printSiteInventoryPage1", icon: "print", title: "print site's starting inventory", text: " Page 1",
      handler: ({ eSite }) => printInventories({ pages: 1, eSites: [eSite] }) },
   { action: "printSiteInventory", icon: "print", title: "print site's inventory sheets", text: " Full",
      handler: ({ eSite }) => printInventories({ pages: 3, eSites: [eSite] }) },
   { action: "editInventory", icon: "edit", title: "edit inventory", text: " Edit", handler: showEditInventory,
      submitHandler: submitInventoryEdit, cancelHandler: cancelInventoryEdit },
   { action: "fillInventory", icon: "edit", title: "fill inventory", text: " Fill", handler: showFillInventory,
		addedHandlers: { submit: submitFillInventory, cancel: cancelFillInventory } },
   { action: "addItem", title: "add an item", text: "+ Item", handler: showAddItem },
   { action: "addTransfer", title: "add a transfer type", text: "+ Transfer", handler: showAddTransfer },
   { action: "genBaseInventory", title: "generate a base inventory", text: "+ Inventory", handler: genBaseInventory }
];


   ////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////// INVENTORY PANEL BUILDING //////////////////////////////////////////////////////////
export async function attachInventoryPanel(panel, sEvent) {
		// first, ensure the appropriate data
	await sEvent.loadInventories(runtime.allItems, runtime.allTransfers);

	attachInventoryTopButtons(panel);

		// build inventory tables for each site
	for (const es of runtime.stateEvent.eventSites) {
			// some buttons for each inventory, to edit, and to fill
		const btns = buildInventorySiteButtons(es);
			// a button container
		const btnDiv = buildElement("div", { classes: [ 'invntryBtnCntnr', 'inline' ], children: btns });

			// a site header, with those buttons
		const hTxt = es.site.name + ' ' + es.getDivisionsString();
		const siteH2 = buildElement("h2", { text: hTxt, children: [ btnDiv ] });

			// the table
		const tbl = buildInventoryTable(es.getStructuredInventory(), runtime.stateEvent.id, es.id);
		
		const cntnr = buildElement("div", { children: [ siteH2, tbl ], classes: [ 'siteContainer' ] });
		
		panel.appendChild(cntnr);
	}
}

	// builds buttons for the top of the page for various print options 
function attachInventoryTopButtons(cntnr) {
	const btnElements = topInventoryButtons.map(buildActionButton);
	const h = buildElement("h1", { children: btnElements });
	const btnCntnr = buildElement("div", { classes: "buttonContainer", children: [h] });
	cntnr.appendChild(btnCntnr);
}

function buildInventorySiteButtons(eSite) {
      // if there is already an inventory, exclude the genBaseInventory button
   const btns = inventorySiteButtons.filter(btn => {
      if (eSite.inventory?.length && btn.action === 'genBaseInventory') return false;

      return true;
   });

	return btns.map(btn => 
		buildActionButton({ ...btn, classes: [ "inventory-action" ], datasetExtra: { eventSiteID: eSite.id } })
   );
}


function buildInventoryTable(inventory, eventID, esID) {
	const thead = buildInventoryThead();
	const tbody = buildInventoryTbody(inventory);
	
		// the table
	const table = buildElement("table", { classes: "inventoryTable", children: [ thead, tbody ], 
										dataset: { eventSiteID: esID } });

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

function buildInventoryTbody(inventory) {
   const tbody = buildElement("tbody");		
		// fill the table body
	buildInventoryGarmentsRows(tbody, inventory.garments);
	buildInventoryAccessoriesRows(tbody, inventory.accessories);
	buildInventoryTransfersRows(tbody, inventory.transfers);

   return tbody;
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
			tds.push(buildElement("td", { text: color.name, style: { backgroundColor: color.hex } }));

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
					tds.push(buildElement("td", { text: qStr, classes: 'right', title: char, 
								dataset: { itemID: size.item.id, invItemID: size.id, oValue: qStr }, 
								style: { backgroundColor: color.hex } }));
				} else {
						// if there isn't a size for this style (youth)
					tds.push(buildElement("td", { text: "---", classes: "center", 
								style: { backgroundColor: color.hex } }));
				}
			});

				// finally the total
			tds.push(buildElement("td", { text: total, dataset: { totalCell: true }, 
						style: { backgroundColor: color.hex } }));

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



///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
// functions for handling an event's inventories

function showEditInventory({ target }) {
		// set mode. prevents addOns being activated while edit is in progress
	runtime.activeMode = 'edit';

	const btn = target;

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
	makeSubmitCancelButtons(btn.parentElement, invTbl, 'inventory', btn.dataset.action, btn.dataset.eventSiteID);
}

async function submitInventoryEdit({ target }) {
	const itemsMap = runtime.allItems.getSync();
	const transfersMap = runtime.allTransfers.getSync();

	const esID = target.dataset.id
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
		const response = await actionFetch('editEventSiteInventory', 'EventSite', data);

		if (response.success) {
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
			resetInventoryButtons(target);

				// unset activeMode
			runtime.activeMode = null;
		} else {
			openModal("there was a problem submitting the inventory edit");
		}
	} else {
		cancelInventoryEdit({ target });
	}
}

function updateTotalCell(td) {
	const newValue = Number(td.querySelector('input').value);
	const oldValue = Number(td.dataset.oValue ?? td.textContent);
	const diff = newValue - oldValue;

		// find total cell in the same row
	const totalCell = td.parentElement.querySelector('td[data-total-cell]');

		// adjust the value
	if (totalCell) totalCell.textContent = Number(totalCell.textContent) + diff;
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


function cancelInventoryEdit({ target }) {
		// get the right table
	const tbl = getInventoryTable(target.dataset.id);

		// clear the tds
	tbl.querySelectorAll('td[data-inv-item-i-d], td[data-inv-transfer-i-d]').forEach(td => {
		td.innerHTML = '';
		td.textContent = td.dataset.oValue;
	});

		// reset the buttons
	resetInventoryButtons(target);

		// unset activeMode
	runtime.activeMode = null;
}

function resetInventoryButtons(btn) {
	const prnt = btn.parentElement;
	prnt.innerHTML = '';

	const newBtns = buildInventorySiteButtons(runtime.stateEvent.getEventSiteByID(Number(btn.dataset.id)));
	prnt.append(...newBtns);
}

function showFillInventory({ target }) {
	runtime.activeMode = 'fill';

   const esID = Number(target.dataset.eventSiteID);
   const eSite = runtime.stateEvent.getEventSiteByID(esID);

	const strtTbl = getInventoryTable(esID);
	const prnt = strtTbl.parentElement;
	
	strtTbl.hidden = true;

   const tbl = buildFillTable(eSite);
	prnt.appendChild(tbl);
   
		// function(buttonContainer, listenerContainer, type, action, id)
	makeSubmitCancelButtons(target.parentElement, tbl, 'inventory', target.dataset.action, target.dataset.eventSiteID);
   

	tbl.addEventListener('input', e => {
		if (!e.target.matches('input')) return;

		const row = e.target.closest('tr');
		updateFillRow(row);
	});


      // give focus
	tbl?.querySelector('input')?.focus();
}

function buildFillTable(eSite) {
   const thead = buildFillTHead();
   const rows = buildFillRows(eSite);
   const tbody = buildElement('tbody', { children: rows });

   const table = buildElement("table", { classes: "inventoryFillTable", children: [ thead, tbody ], 
										dataset: { eventSiteID: eSite.id } });

	return table;
}

function buildFillTHead() {
   const cols = [ "Style", "Color", "Size", "Starting", "Ending", "Added", "Mess Ups", "Dairy", "Sold" ];
   const ths = [];

	cols.forEach(c => {
		ths.push(buildElement("th", { text: c, classes: 'center' }));
	});

	const thRow = buildElement("tr", { children: ths });
	
	return buildElement("thead", { children: thRow });
}

function buildFillRows(eSite) {
   const inventory = eSite.getStructuredInventory();
   
   const rows = [];

	const rowCount = eSite.inventory.length

   buildFillGarmentRows(inventory.garments, rows, rowCount);
   buildFillAccessoryRows(inventory.accessories, rows, rowCount);


   return rows;
}

function buildFillGarmentRows(garments, rows, rowCount) {
   let firstStyleRow = true;

   for (const style of garments) {
      const align = style.sizingCategoryID === 2 ? "right" : "left";
      const colors = Object.values(style.colors);

         // total rows this style occupies
      const styleRowspan = colors.reduce((sum, color) => sum + Object.keys(color.sizes).length, 0);

      for (const color of colors) {
         const invItems = Object.values(color.sizes);

         for (let i = 0; i < invItems.length; i++) {
               const invItem = invItems[i];
               const tds = [];

                  // only on the very first row of the style
               if (firstStyleRow) {
                  tds.push(buildElement("td", { text: style.shortName, attrs: { rowspan: styleRowspan }, 
                           classes: align}));
                  firstStyleRow = false;
               }
                  // only on the first row of this color
               if (i === 0) {
                  tds.push(buildElement("td", { text: color.name, classes: [ 'center' ], 
                           attrs: { rowspan: invItems.length } }));
               }

						// size char
               tds.push(buildElement("td", { text: invItem.item.size.displayChar, classes: [ 'center' ] }));

						// end, added, writeOff, dairy column tds
               buildItemFillTDs(tds, invItem, rowCount, rows.length);

					const row = buildElement("tr", { children: tds, dataset: { id: invItem.id } });

               rows.push(row);
         }
      }
         // reset for the next style
      firstStyleRow = true;
   }
}

function buildFillAccessoryRows(accessories, rows, rowCount) {
	accessories.forEach(a => {
		const tds = [];

		tds.push(buildElement("td", { text: a.item.style.shortName }));
		tds.push(buildElement("td", { text: a.item.color.name }));
			// empty cell where size char would go
		tds.push(buildElement("td"));
		
		buildItemFillTDs(tds, a, rowCount, rows.length);

		rows.push(buildElement("tr", { children: tds, dataset: { id: a.id } }));
	});
}

	// append the final cells to tds
function buildItemFillTDs(tds, invItem, rowCount, row) {
	   // start columns
	const startQ = invItem.startQ;
	tds.push(buildElement("td", { text: startQ, classes: [ 'qCol' ], 
				dataset: { fillType: 'startQ', oValue: startQ } }));

		// input columns
	const inputCols = [ 'endQ', 'addedQ', 'writeOffQ', 'sponsorQ' ];
	inputCols.forEach((col, i) => {
			// make an empty td in the dairy column for all but adult hoods
		if ((col == 'sponsorQ') && (invItem.item.style.id != ADULT_HOOD_STYLE_ID)) {
			tds.push(buildElement("td"));
		} else {
			const input = makeFillInput(invItem[col], col);
				// set tab index so we can tab by column rather than row
			input.tabIndex = (i * rowCount) + row + 1;
			tds.push(buildElement("td", { children: [ input ], classes: ['qCol'] }));
		}
	});

		// sold column
	const soldQ = invItem.getSoldQ();
	tds.push(buildElement("td", { text: soldQ, classes: [ 'qCol' ], 
				dataset: { fillType: 'soldQ', oValue: soldQ } }));
}

function makeFillInput(oValue, type) {
   const input = document.createElement('input');
		input.type = 'number';
         // if 0, make it blank. all the 0s crowd the view
		input.value = oValue ?? '';
		input.min = 0; 
		input.max = 1000;
		input.step = 1;
      input.dataset.fillable = true;
      input.dataset.oValue = oValue;
      input.dataset.fillType = type
	return input;
}

	 // takes a container, clears it, inserts a submit and cancel button
		  // the listener container fires a submit or cancel click when 'ENTER' or 'ESC' are pressed
function makeFillHandlerButtons(btnCntnr, lstnrCntnr, type, action, id = null) {
		  // first, clear the destination
	 btnCntnr.innerHTML = '';

		  // make the buttons // secondary classes guide listeners handling
	 const submitButton = buildElement('button', { text: 'Submit', type: 'button',
		  classes: ['addOnButton', `${type}-action`, `submit${action}`], 
		  dataset: { id: id, action: makeTypeActionLabel('submit', action) }
	 });
	 const updateSoldButton = buildElement('button', { text: 'Update Sold', type: 'button',
		  classes: ['addOnButton', `${type}-action`, `update${action}`], 
		  dataset: { id: id, action: makeTypeActionLabel('update', action) }
	 });
	 const cancelButton = buildElement('button', { text: 'X', type: 'button',
		  classes: ['addOnButton', `${type}-action`, `cancel${action}`], 
		  dataset: { id: id, action: makeTypeActionLabel('cancel', action) }
	 });
		  // append them
	 btnCntnr.append(submitButton, updateSoldButton, cancelButton);

		  // add event listeners for ESC and ENTER
	 if (lstnrCntnr) {
				// define the listener as a named function
		  const keyHandler = function(e) {
				if (e.key === 'Escape') {
						  cancelButton.click();
						  cleanup();
				} else if (e.key === 'Enter') {
						  updateSoldButton.click();
						  cleanup();
				}
		  };

		  lstnrCntnr.addEventListener('keydown', keyHandler);

				// define a cleanup helper
		  function cleanup() {
				lstnrCntnr.removeEventListener('keydown', keyHandler);
		  }
	 }
}

function updateFillRow(row) {
	const start = row.querySelector('[data-fill-type="startQ"]')?.textContent ?? 0;
	const end = row.querySelector('[data-fill-type="endQ"]')?.value ?? 0;
	const added = row.querySelector('[data-fill-type="addedQ"]')?.value ?? 0;
	const removed = row.querySelector('[data-fill-type="writeOffQ"]')?.value ?? 0;
	const dairy = row.querySelector('[data-fill-type="sponsorQ"]')?.value ?? 0;

	const soldCell = row.querySelector('[data-fill-type="soldQ"]');

	const sold = Number(start) + Number(added) - Number(removed) - Number(dairy) - Number(end);

	if (soldCell) soldCell.textContent = sold;
}

async function submitFillInventory({ target }) {
		// define a pair of helpers
	function valueChanged(el) {
		if (!el) return false;
		if (el.value === '' && el.dataset.oValue === 'null') return false;
		return Number(el.value) !== Number(el.dataset.oValue);
	}
	function getValue(el) {
		return Number(el?.value ?? el?.dataset.oValue ?? 0);
	}

	const tbl = document.querySelector('.inventoryFillTable');
	const rows = tbl.querySelectorAll('tbody tr');

	const update = []

	for (const row of rows) {
		const end = row.querySelector('[data-fill-type="endQ"]');
		const added = row.querySelector('[data-fill-type="addedQ"]');
		const writeOff = row.querySelector('[data-fill-type="writeOffQ"]');
		const dairy = row.querySelector('[data-fill-type="sponsorQ"]');

		const changed =
			valueChanged(end) ||
			valueChanged(added) ||
			valueChanged(writeOff) ||
			valueChanged(dairy);

		if (!changed) continue;

		update.push({
			eventSiteInventoryID: row.dataset.id,
			endQ: getValue(end),
			addedQ: getValue(added),
			writeOffQ: getValue(writeOff),
			sponsorQ: getValue(dairy),
		});
	}

	const response = await actionFetch('updateRowsByIDs', 'EventSiteInventoryItem', { update });

	if (response.success) {
		openModal("Success");
	}
	

}

function cancelFillInventory({ target }) {
   const el = document.querySelector('.inventoryFillTable');
   if (el) el.remove();

   getInventoryTable(target.dataset.id).hidden = false;

		// reset the buttons
	resetInventoryButtons(target);

		// unset activeMode
	runtime.activeMode = null;
}

function getInventoryTable(esID) {
	esID = Number(esID);
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

function showAddItem({ target, eSite }) {
	runtime.activeMode = 'addInventoryItem';

		// bring in allTransfers
	let allItems = Object.values(runtime.allItems.getSync());
		// don't add sponsored hoods to inventory
	allItems = allItems.filter(i => i.style.id != DAIRY_STYLE_ID);

		// make a Set of existing transferIDs
	const existingIDs = new Set(eSite.inventory.map(ii => ii.itemID));
		// filter out matches
	const unItems = allItems.filter(i => !existingIDs.has(i.id));

		// build a form to add items not already part of the event
	const frm = buildElement("form", { id: 'addItemForm', dataset: { esID: eSite.id } });
	frm.append(buildElement("p", { text: "Enter quantities for additional items:" }));
	frm.addEventListener("submit", function(e) { submitAddItems(e, frm); });

		// fill labels/inputs in the form
	unItems.forEach(i => {
		const inpt = buildElement("input", { id: `addItem${i.id}`, 
						attrs: { name: i.id, type: 'number', min: 0, max: 2000, step: 1 } });

		const span = buildElement("span", { text: `${i.getInternalName()}: `, 
						style: { backgroundColor: i.color.hex } });
		if (i.color.name == 'white') span.style.border = '2px solid black';
		if (i.color.name == 'assorted') span.style.border = '3ps solid red';

		const lbl = buildElement("label", { children: span, attrs: { for:`addItems${i.id}` } });
		frm.appendChild(buildElement("fieldset", { children: [ lbl, inpt ] }));
	});

		// make a label, a button, put them in the modal
	frm.appendChild(buildElement("button", { text: "SUBMIT", classes: 'block' }));

	openModal(frm);
}

async function submitAddItems(e, form) {
		// stop page refresh
	e.preventDefault();
	
		// ensure necessary data loaded
	await runtime.allItems.load();

	const esID = form.dataset.esID;

		// handle your form data here
	const data = new FormData(form);
	const updateItems = [];

	for (const [key, value] of data) {
		if (value > 0) {
			const i = runtime.allItems.getByID(key);
			updateItems.push({ 
				invItemID: null, 
				itemID: Number(i.id), 
				quantity: Number(value), 
				price: i.price
			});
		}
	}
	
	const update = { 'eventSiteID': esID, 'updateItems': updateItems };	
	// console.log(update);
	const response = await actionFetch('editEventSiteInventory', 'EventSite', update);
	

	if (response.success) {
		closeModal();

			// add the new transfers to the table
		const tbl = getInventoryTable(esID);
		const tbody = tbl.querySelector("tbody");

		const newItems = [];
		updateItems.forEach(it => {
			newItems.push(InventoryItem.fromJSON({ 
				id: null,
				eventSiteID: esID,
				itemID: it.transferID,
				startQ: it.quantity,
				endQ: null,
				addedQ: 0,
				writeOffQ: 0,
				sponsorQ: 0,
				price: it.price,
				item: runtime.allItems.getByID(it.itemID)
			}))
		});

			// add the new transfers to runtime
		const eSite = runtime.stateEvent.getEventSiteByID(esID);
		eSite.inventory.push(...newItems);

		tbl.replaceWith(buildInventoryTable(eSite.getStructuredInventory(), runtime.stateEvent.id, esID));
	}
}

function showAddTransfer({ target, eSite }) {
	runtime.activeMode = 'addInventoryTransfer';

		// bring in allTransfers
	const allTransfers = runtime.allTransfers.getSync();

		// make a Set of existing transferIDs
	const existingIDs = new Set(eSite.transfers.map(t => t.transferID));
		// filter out matches
	const unTransfers = Object.values(allTransfers).filter(t => !existingIDs.has(t.id));

		// build a form to add transfers not already part of the event
	const frm = buildElement("form", { id: 'addTransferForm', dataset: { esID: eSite.id } });
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
	// console.log(update);
	const response = await actionFetch('editEventSiteInventory', 'EventSite', update);
	

	if (response.success) {
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


	////////////////////////////////////////////////////////////////
	// this may never be necessary again once every thing catches up
async function genBaseInventory({ target }) {
   const esID = target.dataset.eventSiteID

   const response = await actionFetch('genBaseInventory', 'EventSite', { esID: esID });

   if (response.success) {
      const tbl = getInventoryTable(esID);
      const eSite = runtime.stateEvent.getEventSiteByID(esID);

      eSite.inventory = parseToInstancesArr(response.data.items, InventoryItem);
      
      const tbody = buildInventoryTbody(eSite.getStructuredInventory());

      tbl.appendChild(tbody);

      target.remove();
   } else {
      openModal("There was a problem generating the inventory");
   }
}