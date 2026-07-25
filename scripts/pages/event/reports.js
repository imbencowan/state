import { runtime } from '../../runtime.js';
import { actionFetch, myFetch } from '../../fetch.js';
import { modal, childModal } from '../../modal.js';
import { buildElement, buildTD, buildDollarTD, parseToInstancesArr, formatCurrency, 
         giveFirstFocus } from '../../utilities.js';
import { buildActionButton, buildIcon, makeSubmitCancelButtons, makeTypeActionLabel, 
         makeLabelInputList, makeButtonActionMap } from '../page-utils.js';
import { buildFillTable, submitFillInventory } from './inventory.js';
import { InventoryTransfer } from '../../models/db-classes.js';
import {  } from '../../print.js';


   // buttons for each site
const reportSiteButtons = [
   { action: "fillInventory", title: "finalize the inventory", icon: "edit", text: " Inventory",
      handler: showFillInventory, submitHandler: submitFillInventoryReport, cancelHandler: modal.close }, 
   { action: "fillTransfers", title: "enter sold transfers", icon: "edit", text: " Sold Transfers", 
      handler: showEnterSoldTransfers },
   { action: "addCosts", title: "add additional costs", icon: "add", text: " Costs", handler: showAddCosts },
   { action: "editCostAndPrice", title: "edit cost/price", icon: "edit", text: " Cost/Price", 
      handler: showEditCostAndPrice, submitHandler: submitEditCostAndPrice, cancelHandler: cancelEditCostAndPrice },
   { action: "updateCost/Price", title: "update cost/prices from default item data", icon: "refresh", text: "Cost/Price", 
      handler: updateCostAndPrice }
];
   // an array of action/handler pairs based on buttons to be used the page's event listener
export const reportSiteActions = makeButtonActionMap(reportSiteButtons);


export async function attachReportsPanel(panel, sEvent) {
	   // first, ensure the appropriate data
   await sEvent.loadInventories(runtime.allItems, runtime.allTransfers);
   await sEvent.loadOrders(runtime.allItems, runtime.allTransfers);
   await runtime.allCosts.load();
   await runtime.allEmployees.load();

      // for each EventSite
      sEvent.eventSites.forEach(es => {
            // a site header
         const hTxt = es.site.name + ' ' + es.getDivisionsString();
         const siteH2 = buildElement("h2", { text: hTxt, dataset: { eventSiteId: es.id } });
         const btns = attachSiteBtns(es.id);
         const tbl = buildSiteTable(es);
   
            
            // stick them in a div in the panel
         panel.appendChild(buildElement("div", { children: [ siteH2, btns, tbl ] }));
      });
}

function attachSiteBtns(esID) {
   const btns = buildSiteBtns(esID);

   return buildElement("div", { classes: "buttonContainer", children: btns });
}

function buildSiteBtns(esID) {
   return reportSiteButtons.map(b => 
      buildActionButton({ ...b, classes: "report-action", datasetExtra: { eventSiteID: esID } })
   );
}

function buildSiteTable(es) {
   const thead = buildSiteThead();
   const tbody = buildSiteTbody(es);

   return buildElement("table", { classes: 'reportTable', children: [ thead, tbody ], dataset: { eventSiteID: es.id } });
}

function buildSiteThead() {
   const hTexts = [ '', 'sold', 'mcu cost', 'retail', 'cost $', 'resale $', 'profit', 'lost', 'lost $' ];
   const ths = [];
   for (const h of hTexts) {
      ths.push(buildElement("th", { text: h }));
   }

   return buildElement("thead", { children: buildElement("tr", { children: ths }) });
}

function buildSiteTbody(es) {
   const inventory = es.getReportInventory();

   const total = { cost: 0, resale: 0, profit: 0, lost: 0 };
   
   const rows = [];

   let first = true;

      // push the garment rows
   for (const style of inventory.garments) {
      for (const color of style.colors) {
         const name = style.vShortName + ' - ' + color.name;
         const sold = color.retailTotal + color.sOrderTotal;
         const cost = color.cost;
         const price = color.price;
         const lost = color.lostTotal;

         const rowData = { type: 'garments', colorID: color.id, styleID: style.id };
         rows.push(makeRow(name, sold, cost, price, lost, first, total, rowData));
         first = false;
      }
   }

      // push plus size info
   first = true;
   for (const size in inventory.plusSizes) {
      if (inventory.plusSizes[size].sold > 0) {         
         const sold = inventory.plusSizes[size].sold;
         const cost = es.plusSizePricing[size].cost;
         const price = es.plusSizePricing[size].price;
         const lost = inventory.plusSizes[size].lost;

         const rowData = { type: 'plusSize', size: size, esID: es.id };
         rows.push(makeRow(`${size} merch`, sold, cost, price, lost, first, total, rowData));
         first = false;
      }
   }

      // push the accessories
   first = true;
   for (const a of inventory.accessories) {
      const sold = a.getSoldQ();
      const cost = a.cost;
      const price = a.price;

      const rowData = { type: 'accessories', iiID: a.id };
      rows.push(makeRow(a.item.style.vShortName, sold, cost, price, '', first, total, rowData));
      first = false;
   }

      //push the transfers
   first = true;
   for (const t of inventory.transfers) {
      if (t.soldQ > 0) {
         const rowData = { type: 'transfers', eventTransferID: t.id };
         rows.push(makeRow(t.transfer.transferName, t.soldQ, t.cost, t.price, '', first, total, rowData));
         first = false;
      }
   }
   
      // costs
   first = true;
   for (const c of es.costs) {
      const rowData = { type: 'cost', costID: c.id };
      rows.push(makeCostRow(c.cost.name, c.quantity, c.rate, first, total, rowData));
      first = false;
   }

      // employees
   for (const e of es.employees) {
      const name = `employee pay - ${e.employee.shortName}`;
      const rowData = { type: 'employeePay', employeeID: e.employee.id };
      rows.push(makeCostRow(name, e.hours, e.payRate, first, total, 'employeePay'));
   }

      // total rows
   rows.push(buildElement("tr", { classes: 'topRow', children: [
      buildTD("Totals"), 
      buildTD(), 
      buildTD(), 
      buildTD(), 
      buildDollarTD(total.cost), 
      buildDollarTD(total.resale), 
      buildDollarTD(total.profit)
   ] }));
   rows.push(buildElement("tr", { children: [
      buildTD("Total Profit"), buildTD(), buildTD(), buildTD(), buildTD(), buildTD(), 
      buildDollarTD(total.resale - total.cost - total.lost), buildTD(), buildDollarTD(total.lost)
   ] }));

   return buildElement("tbody", { children: rows });
}

function makeRow(name, sold, cost, price, lost, first, total, rowData) {
   const tCost = (sold * cost);
   const tResale = (sold * price);
   const tProfit = tResale - tCost;
   const lostTotal = (lost) ? (lost * cost) : 0;
   total.lost += lostTotal;
   total.cost += tCost;
   if (name != 'school names') total.resale += tResale;
   total.profit += tProfit;
      // if this is the first row, assign a class for a thicker border
   const classes = first ? ['topRow'] : [];

   const tds = [
      buildTD(name),
      buildTD(sold),
      buildElement("td", { text: formatCurrency(cost), dataset: { column: 'cost' } }),
      buildElement("td", { text: formatCurrency(price), dataset: { column: 'price' } }),
      buildDollarTD(tCost),
      buildDollarTD(tResale),
      buildDollarTD(tProfit),
      buildTD(lost),
      buildDollarTD(lostTotal)
   ];

   return buildElement("tr", { children: tds, classes: classes, dataset: rowData });
}

function makeCostRow(name, quantity, rate, first, total, rowData) {
   total.cost += (quantity * rate);
      // if this is the first row, assign a class for a thicker border
   const classes = first ? ['topRow'] : [];

   const tds = [
      buildTD(name),
      buildTD(quantity),
      buildDollarTD(rate),
      buildTD(),
      buildDollarTD(quantity * rate),
      buildTD(),
      buildTD(),
      buildTD(),
      buildTD()
   ];

   return buildElement("tr", { children: tds, classes: classes });
}

async function refreshTable(esID) {
   const eSite = runtime.stateEvent.getEventSiteByID(esID);
   const tbl = getReportTable(esID);

   await eSite.refreshInventory(runtime.allItems, runtime.allTransfers);

   const newTbody = buildSiteTbody(eSite);
   tbl.replaceChild(newTbody, tbl.tBodies[0]);
}



function getReportTable(esID) {
	esID = Number(esID);
		// grab the inventory container
	const cntnr = document.querySelector('.tabPanel.active[data-tab="reports"]');
		// select the table with the matching data attribute
	const tbl = cntnr.querySelector(`table[data-event-site-i-d="${esID}"]`);

		// if no table matches, alert
	if (!tbl) {
		modal.open("Could not find inventory table for eventSiteID " + esID);
		return;
	}

	return tbl;
}



   /////////////////////////////////////////////////////////////////////////////////////////////////////////////
function showFillInventory({ target }) {
   const esID = Number(target.dataset.eventSiteID);
   const eSite = runtime.stateEvent.getEventSiteByID(esID);

   const tbl = buildFillTable(eSite);
   const btnCntnr = buildElement("div");
   makeSubmitCancelButtons({ btnCntnr, lstnrCntnr: tbl, type: 'report', action: target.dataset.action, 
                           datasetExtra: { id: esID } });
   

   const cntnr = buildElement("div", { children: [ tbl, btnCntnr ] });

   cntnr.addEventListener('click', function(event) {
      const target = event.target;
      const action = target.dataset.action;
      if (!action) return;

      reportSiteActions[action]({ target });
   });

   modal.open(cntnr, 'full');
}

async function submitFillInventoryReport({ target }) {
   const success = await submitFillInventory({ target });
   console.log('chang');
   if (success) await refreshTable(target.dataset.id);
}


function showEnterSoldTransfers({ target }) {
   const esID = Number(target.dataset.eventSiteID);
   const eSite = runtime.stateEvent.getEventSiteByID(esID);

   const misc5 = runtime.allTransfers.getByName('misc $5 transfers');
   const misc7 = runtime.allTransfers.getByName('misc $7 transfers');
   
   const listTransfers = [ ...eSite.transfers ];
   listTransfers.push(InventoryTransfer.fromTransfer({ t: misc5, eventSiteID: esID }));
   listTransfers.push(InventoryTransfer.fromTransfer({ t: misc7, eventSiteID: esID }));

      // build a form to add transfers not already part of the event
   const frm = buildElement("form", { id: 'soldTransferForm', dataset: { esID: eSite.id } });
   frm.append(buildElement("p", { text: "Enter quantities for sold transfers:" }));
   frm.addEventListener("submit", function(e) { submitSoldTransfers(e, frm, listTransfers, eSite); });

      // fill labels/inputs in the form
   const fieldset = makeLabelInputList({ list: listTransfers, getName: (t => t.transfer.transferName), 
                                          getID: (t => t.transfer.id) });
   frm.appendChild(fieldset);

      // make a label, a button, put them in the modal
   frm.appendChild(buildElement("button", { text: "SUBMIT", classes: 'block' }));

   modal.open(frm);
}

async function submitSoldTransfers(e, frm, listTransfers, eSite) {
      // stop page refresh
   e.preventDefault();

      // ensure necessary data loaded
   await runtime.allTransfers.load();

      // handle form data here
   const data = new FormData(frm);
   const updateTransfers = [];

   for (const [key, value] of data) {
      const invTransfer = listTransfers.find(t => t.transfer.id == key);
      if (value != invTransfer.soldQ) {
         invTransfer.soldQ = value;
         updateTransfers.push(invTransfer.toDB());
      }
   }
   
   const update = { rows: updateTransfers, updateCols: [ 'soldQ' ] };
   const response = await actionFetch('upsertMany', 'EventSiteTransfer', update);
   

   if (response.success) {
      modal.close();
      await eSite.refreshInventory(runtime.allItems, runtime.allTransfers);
      refreshTable(eSite.id);
      
   }
}

   // this sets cost/price for event items/transfers equal to user inputs
      // which is different from updateCostAndPrice, which sets cost/price = to base table db values
function showEditCostAndPrice({ target }) {
   const esID = Number(target.dataset.eventSiteID);
   const eSite = runtime.stateEvent.getEventSiteByID(esID);
   const tbl = getReportTable(esID);
   
   const rows = tbl.querySelectorAll(
      'tr[data-type="garments"], tr[data-type="plusSize"], tr[data-type="accessories"], tr[data-type="transfers"]'
   );

   for (const row of rows) {
      const tds = row.querySelectorAll('td[data-column="cost"], td[data-column="price"]');

      for (const td of tds) {
         makeCostPriceInput(td);
      }
   }

   makeSubmitCancelButtons({ btnCntnr: target.parentElement, lstnrCntnr: tbl, type: 'report', 
         action: 'editCostAndPrice', datasetExtra: { esID: esID } });

   giveFirstFocus(tbl);
}

function makeCostPriceInput(td) {
   const oValue = Number(td.textContent);
   td.dataset.oValue = oValue;

   const input = buildElement("input", { attrs: { type: 'number', value: oValue, step: .01, min: 0, max: 5000 } });
   td.replaceChildren(input);
}

async function submitEditCostAndPrice({ target }) {
   const esID = Number(target.dataset.esID);
   const eSite = runtime.stateEvent.getEventSiteByID(esID);
   const tbl = getReportTable(esID);

      // a look up to pass to a helper. // so we can set pricing correctly
   const plusSizeRows = tbl.querySelectorAll('tr[data-type="plusSize"]');
   const plusSizePricing = {};
   for (const row of plusSizeRows) {
      const cost = Number(row.querySelector('td[data-column="cost"] input')?.value);
      const price = Number(row.querySelector('td[data-column="price"] input')?.value);
      plusSizePricing[row.dataset.size] = { cost, price };
   }

   const updates = {
      garments: [],
      plusSize: [],
      accessories: [],
      transfers: []
   };
   
   const rows = tbl.querySelectorAll(
      'tr[data-type="garments"], tr[data-type="plusSize"], tr[data-type="accessories"], tr[data-type="transfers"]'
   );
   for (const row of rows) {
      const rowUpdates = buildUpdate(row, eSite, plusSizePricing);
      if (rowUpdates) updates[row.dataset.type].push(...rowUpdates);
   }

   const response = await actionFetch('editCostAndPrice', 'EventSite', { updates });

   if (response.success) {
      resetSiteButtons(target);
      await refreshTable(esID);
   }
}

function buildUpdate(row, eSite, plusSizePricing) {
   const changes = {};

   for (const td of row.querySelectorAll('td[data-column="cost"], td[data-column="price"]')) {
      const input = td.querySelector("input");
      const newValue = Number(input.value);
      const oldValue = Number(td.dataset.oValue);

      if (newValue !== oldValue) changes[td.dataset.column] = newValue;
   }

   if (Object.keys(changes).length === 0) return null;

   const update = {};
   let colMap = { cost: 'mcuCost', price: 'price'};

   switch (row.dataset.type) {
      case "garments":
         const updates = [];

            // get this site's garments for the style/color combination
         const garments = eSite.getInventoryGarmentsByStyleByColor();
         const sGarments = garments.find(s => (s.id == row.dataset.styleID));
         const scGarments = sGarments.colors.find(c => (c.id == row.dataset.colorID));

         for (const [sChar, invItem] of Object.entries(scGarments.sizes)) {
            const u = { eventSiteInventoryID: invItem.id };
            for (const [propName, value] of Object.entries(changes)) {
               let finalValue = value
               if (plusSizePricing[sChar]) finalValue += plusSizePricing[sChar][propName];
               u[colMap[propName]] = finalValue;
            }
            
            updates.push(u)
         }

         return updates;
      case "plusSize":
         update.eventSiteID = Number(row.dataset.esID);
         colMap = { cost: ('cost' + row.dataset.size), price: ('price' + row.dataset.size) };
         break;
      case "accessories":
         update.eventSiteInventoryID = Number(row.dataset.iiID);
         break;
      case "transfers":
         update.eventSiteTransferID = Number(row.dataset.eventTransferID);
         break;
   }

   for (const [propName, value] of Object.entries(changes)) {
      update[colMap[propName]] = value;
   }

   return [ update ];
}

function cancelEditCostAndPrice({ target }) {
   const esID = Number(target.dataset.esID);
   const tbl = getReportTable(esID);
   
   const rows = tbl.querySelectorAll(
      'tr[data-type="garments"], tr[data-type="plusSize"], tr[data-type="accessories"], tr[data-type="transfers"]'
   );

   for (const row of rows) {
      const tds = row.querySelectorAll('td[data-column="cost"], td[data-column="price"]');

      for (const td of tds) {
         td.replaceChildren(td.dataset.oValue);
      }
   }

   resetSiteButtons(target)
}

function resetSiteButtons(btn) {
   const prnt = btn.parentElement;
   prnt.innerHTML = '';

   const newBtns = buildSiteBtns(btn.dataset.esID);
   prnt.append(...newBtns);
}


   // this sets cost/price for event items/transfers equal to the base item/transfer cost/price
      // which is different from editCostAndPrice, which allows user provided values for cost/price
async function updateCostAndPrice({ target }) {
   const esID = target.dataset.eventSiteID;
   const eSite = runtime.stateEvent.getEventSiteByID(esID);

   const response = await eSite.updateCostAndPrice(runtime.allItems, runtime.allTransfers);

   if (response.success) await refreshTable(esID);

}

function showAddCosts({ target }) {
   const esID = Number(target.dataset.eventSiteID);
   const eSite = runtime.stateEvent.getEventSiteByID(esID);

   const COSTS = {
      transfers: runtime.allCosts.getByName("transfers"),
      machine: runtime.allCosts.getByName("machine cost"),
      champs: runtime.allCosts.getByName("state champs"),
      personalV: runtime.allCosts.getByName("personal vehicle"),
      rentalV: runtime.allCosts.getByName("rental vehicle"),
      gas: runtime.allCosts.getByName("gas"),
      hotel: runtime.allCosts.getByName("hotel"),
   }

   const headers = [ "Cost: ", "Quantity: ", "Rate: " ].map(
      text => buildElement("div", { text, classes: "cost-header" })
   );


   const costs = [];
      // transfer cost
   costs.push(...prepareAddCostRow({ eSite: eSite, cost: COSTS.transfers, quantity: eSite.getMainTransfers().startQ }));
      // machine costs
   costs.push(...prepareAddCostRow({ eSite: eSite, cost: COSTS.machine, quantity: eSite.getLikelyNumberPresses() }));
      // state champs
   costs.push(...prepareAddCostRow({ eSite: eSite, cost: COSTS.champs, quantity: eSite.getStateChampQuantity() }));
      // employees
   if (eSite.employees.length) {;
      eSite.employees.forEach(esEmp => {
         costs.push(...buildAddEmployeeRow({ eSite, esEmp }));
      });
   }
      // vehicles
   if (eSite.vehicles.length) {
      if (eSite.vehicles.find(v => v.name.includes("Personal"))) {
         costs.push(...prepareAddCostRow({ eSite: eSite, cost: COSTS.personalV }));
      }
      if (eSite.vehicles.find(v => v.name.includes("Rental"))) {
         costs.push(...prepareAddCostRow({ eSite: eSite, cost: COSTS.rentalV }));
      }
      costs.push(...prepareAddCostRow({ eSite: eSite, cost: COSTS.gas }));
   }
      // hotels
   if (eSite.site.city.distance > 100) costs.push(...prepareAddCostRow({ eSite: eSite, cost: COSTS.hotel }));


      // fill labels/inputs in the form
   const fieldset = buildElement("fieldset", { children: [ ...headers, ...costs ] });

      // make a button for adding other costs
   const addBtn = buildElement("button", { children: [ buildIcon('add'), " Cost" ], attrs: { type: "button" }, 
                  dataset: { action: "showAddNewCost"}, styles: { float: 'right' }, classes: 'report-action' });
   addBtn.addEventListener("click", showAddNewCost);
      // make a submit button
   const sbmtBtn = buildElement("button", { text: "SUBMIT", classes: 'block' });
   
   
      // build a form to hold the previously defined children
   const formP = buildElement("p", { text: "Enter additional costs:" });
   const br = buildElement("br");
   const frm = buildElement("form", { id: 'siteCostsForm', dataset: { esID: eSite.id },
                           children: [ formP, fieldset, addBtn, br, sbmtBtn ] });
   frm.addEventListener("submit", function(e) { submitAddCosts(e, frm, eSite); });

   modal.open(frm, 'wide');
}

function prepareAddCostRow({ cost, quantity, eSite }) {
   let rate = null;
   const esCost = eSite.getCostByID(cost.id);

   if (esCost) {
      rate = esCost.rate;
      quantity = esCost.quantity;
   }

   return buildAddCostRow({ cost, quantity, rate });
}

function buildAddCostRow({ cost, quantity = '', rate = null }) {
   if (!rate) rate = cost.rate;
   const lbl = buildElement("div", { text: cost.name });

   const quantityInput = buildElement("input", { 
         // decimal step for fractions of a unit
      attrs: { value: quantity, type: "number", step: .01 }, 
      dataset: { costID: cost.id, field: 'quantity' }
   });

   const rateInput = buildElement("input", {
      attrs: { value: rate, type: "number", step: .01 }, 
      dataset: { costID: cost.id, field: 'rate' }
   });


   return [ lbl, quantityInput, rateInput ];
}

function buildAddEmployeeRow({ esEmp, eSite }) {
   const rate = esEmp.payRate ?? esEmp.employee.payRate;
   const quantity = esEmp.hours ?? '';

   const lbl = buildElement("div", { text: `employee pay - ${esEmp.employee.shortName}` });

   const hoursInput = buildElement("input", { 
         // decimal step for fractions of a unit
      attrs: { value: quantity, type: "number", step: .01 }, 
      dataset: { employeeID: esEmp.employee.id, field: 'hours' }
   });

   const rateInput = buildElement("input", {
      attrs: { value: rate, type: "number", step: .01 }, 
      dataset: { employeeID: esEmp.employee.id, field: 'payRate' }
   });

   return [ lbl, hoursInput, rateInput ];
}

async function submitAddCosts(e, frm, eSite) {
      // stop page refresh
   e.preventDefault();

   const costs = {};
   const employees = {};

   for (const input of frm.querySelectorAll("input")) {
      const { costID, employeeID, field } = input.dataset;
      const value = Number(input.value);

      if (costID) {
         costs[costID] ??= {
            costID: Number(costID),
            eventSiteID: eSite.id
         };

         costs[costID][field] = value;
      }

      if (employeeID) {
         employees[employeeID] ??= {
            employeeID: Number(employeeID),
            eventSiteID: eSite.id,
            payRate: null,
            hours: null
         };

         employees[employeeID][field] = value;
      }
   }

   const updateCosts = [];
   for (const cost of Object.values(costs)) {
      if ((cost.quantity > 0) && cost.rate) {
         updateCosts.push(cost);
      }
   }

   const updatePay = [];
   for (const emp of Object.values(employees)) {
      if ((emp.hours > 0) && emp.payRate) {
         updatePay.push(emp);
      }
   }

   const updateC = { rows: updateCosts, updateCols: [ 'rate', 'quantity' ] };
   const responseCost = await actionFetch('upsertMany', 'EventSiteCost', updateC);

   const updateP = { rows: updatePay, updateCols: [ 'hours', 'payRate' ] };
   const responsePay = await actionFetch('upsertMany', 'EventSiteEmployee', updateP);
   

   if (responseCost.success && responsePay.success) {
      modal.close();
      await eSite.refreshCosts();
      refreshTable(eSite.id);
   }
}

function showAddNewCost() {
   const p = buildElement("p", { text: 'What should the new cost be called?' });
   const input = buildElement("input", { attrs: { type: 'text' } });
   const sbmtBtn = buildElement("button", { text: "SUBMIT", classes: 'block' });

   const form = buildElement("form", { children: [ p, input, sbmtBtn ] });
   form.addEventListener("submit", function(e) { submitNewCost(e, form); });

   childModal.open(form);
}

async function submitNewCost(e, form) {
      // stop page refresh
   e.preventDefault();

   const costName = form.querySelector('input').value;
   
   if (costName != '') {
      const response = await actionFetch('insert', 'Cost', { data: { costName } });

      if (response.success) {
         const costID = response.data;
         const lbl = buildElement("div", { text: costName });

         const quantityInput = buildElement("input", { attrs: { type: "number", step: .01 }, 
            dataset: { costID: costID, field: 'quantity' }
         });

         const rateInput = buildElement("input", { attrs: { type: "number", step: .01 }, 
            dataset: { costID: costID, field: 'rate' }
         });


         const costForm = document.getElementById('siteCostsForm');
         const fieldset = costForm.querySelector('fieldset');
         fieldset.append(lbl, quantityInput, rateInput);
         console.log(fieldset);

         childModal.close();
      }
   }
}
