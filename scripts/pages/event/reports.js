import { runtime } from '../../runtime.js';
import { actionFetch, myFetch } from '../../fetch.js';
import { openModal, closeModal } from '../../modal.js';
import { buildElement, buildTD, buildDollarTD, parseToInstancesArr } from '../../utilities.js';
import { buildActionButton, makeSubmitCancelButtons, makeTypeActionLabel, 
         makeLabelInputList } from '../page-utils.js';
import { buildFillTable, submitFillInventory } from './inventory.js';
import { InventoryTransfer } from '../../models/db-classes.js';
import {  } from '../../print.js';


   // buttons for each site
const reportSiteButtons = [
   { action: "fillInventory", title: "finalize the inventory", icon: "edit", text: " Inventory",
      handler: showFillInventory, submitHandler: submitFillInventoryReport, cancelHandler: closeModal }, 
   { action: "fillTransfers", title: "enter sold transfers", icon: "edit", text: " Sold Transfers", 
      handler: showEnterSoldTransfers },
   { action: "addCosts", title: "add additional costs", icon: "add", text: " Costs", handler: showAddCosts },
   { action: "editMcUCosts", title: "edit mcu costs", icon: "edit", text: " McU Costs", handler: showEditMcUCosts },
   { action: "updateCost/Price", title: "update cost/prices from default item data", icon: "refresh", text: "Cost/Price", 
      handler: updateCostAndPrice }
];
   // an array of action/handler pairs based on buttons to be used the page's event listener
export const reportSiteActions = Object.fromEntries(
	reportSiteButtons.flatMap(btn => {
		const entries = [[btn.action, btn.handler]];

		if (btn.submitHandler) entries.push([ makeTypeActionLabel('submit', btn.action), btn.submitHandler ]);
		if (btn.cancelHandler) entries.push([ makeTypeActionLabel('cancel', btn.action), btn.cancelHandler ]);

		return entries;
	})
);


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
         const btns = buildSiteBtns(es);
         const tbl = buildSiteTable(es);
   
            
            // stick them in a div in the panel
         panel.appendChild(buildElement("div", { children: [ siteH2, btns, tbl ] }));
      });
}

function buildSiteBtns(eSite) {
   const btns = reportSiteButtons.map(b => 
      buildActionButton({ ...b, classes: "report-action", datasetExtra: { eventSiteID: eSite.id } })
   );

   return buildElement("div", { classes: "buttonContainer", children: btns });
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

         rows.push(makeRow(name, sold, cost, price, lost, first, total));
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

         rows.push(makeRow(`${size} merch`, sold, cost, price, lost, first, total));
         first = false;
      }
   }

      // push the accessories
   first = true;
   for (const a of inventory.accessories) {
      const sold = a.getSoldQ();
      const cost = a.cost;
      const price = a.price;

      rows.push(makeRow(a.item.style.vShortName, sold, cost, price, '', first, total));
      first = false;
   }

      //push the transfers
   first = true;
   for (const t of inventory.transfers) {
      if (t.soldQ > 0) {
         rows.push(makeRow(t.transfer.transferName, t.soldQ, t.cost, t.price, '', first, total));
         first = false;
      }
   }
   
      // costs
   first = true;
   for (const c of es.costs) {
      rows.push(makeCostRow(c.cost.name, c.quantity, c.rate, first, total));
      first = false;
   }

      // employees
   for (const e of es.employees) {
      const name = `employee pay - ${e.employee.shortName}`;
      rows.push(makeCostRow(name, e.hours, e.payRate, first, total));
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
      buildDollarTD(total.resale - total.cost - total.lost)
   ] }));

   return buildElement("tbody", { children: rows });
}

function makeRow(name, sold, cost, price, lost, first, total) {
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
      buildDollarTD(cost),
      buildDollarTD(price),
      buildDollarTD(tCost),
      buildDollarTD(tResale),
      buildDollarTD(tProfit),
      buildTD(lost),
      buildDollarTD(lostTotal)
   ];

   return buildElement("tr", { children: tds, classes: classes });
}

function makeCostRow(name, quantity, rate, first, total) {
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
      buildTD()
   ];

   return buildElement("tr", { children: tds, classes: classes });
}

function makeTotalRow() {

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
		openModal("Could not find inventory table for eventSiteID " + esID);
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

   openModal(cntnr, 'full');
}

async function submitFillInventoryReport({ target }) {
   const success = await submitFillInventory({ target });
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

   openModal(frm);
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
      closeModal();
      await eSite.refreshInventory(runtime.allItems, runtime.allTransfers);
      refreshTable(eSite.id);
      
   }
}

function showEditMcUCosts({ target }) {

}

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

      // build a form to add transfers not already part of the event
   const frm = buildElement("form", { id: 'siteCostsForm', dataset: { esID: eSite.id } });
   frm.append(buildElement("p", { text: "Enter additional costs:" }));
   frm.addEventListener("submit", function(e) { submitAddCosts(e, frm, eSite); });

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
         console.log(esEmp);
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
   frm.appendChild(fieldset);

      // make a label, a button, put them in the modal
   frm.appendChild(buildElement("button", { text: "SUBMIT", classes: 'block' }));

   openModal(frm, 'wide');
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
   console.log(eSite);
   console.log(esEmp);
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

   console.log(updateCosts);

   const updateC = { rows: updateCosts, updateCols: [ 'rate', 'quantity' ] };
   const responseCost = await actionFetch('upsertMany', 'EventSiteCost', updateC);

   const updateP = { rows: updatePay, updateCols: [ 'hours', 'payRate' ] };
   const responsePay = await actionFetch('upsertMany', 'EventSiteEmployee', updateP);
   

   if (responseCost.success && responsePay.success) {
      closeModal();
      // await eSite.refreshInventory(runtime.allItems, runtime.allTransfers);
      // refreshTable(eSite.id);

      console.log('success');
      
   }
}


