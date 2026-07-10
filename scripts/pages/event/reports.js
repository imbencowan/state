import { runtime } from '../../runtime.js';
import { actionFetch, myFetch } from '../../fetch.js';
import { openModal, closeModal } from '../../modal.js';
import { buildElement, buildTD, buildDollarTD, parseToInstancesArr } from '../../utilities.js';
import { buildActionButton, makeSubmitCancelButtons, makeTypeActionLabel } from '../page-utils.js';
import { buildFillTable, submitFillInventory } from './inventory.js';
import {  } from '../../models/db-classes.js';
import {  } from '../../print.js';


   // buttons for each site
const reportSiteButtons = [
   { action: "fillInventory", title: "finalize the inventory", icon: "edit", text: " Inventory",
      handler: showFillInventory, submitHandler: submitFillInventory, cancelHandler: closeModal }, 
   { action: "fillTransfers", title: "enter sold transfers", icon: "edit", text: " Sold Transfers", 
      handler: showEnterSoldTransfers },
   { action: "editMcUCosts", title: "edit mcu costs", icon: "edit", text: " McU Costs", handler: showEditMcUCosts },
   { action: "addCosts", title: "add additional costs", icon: "add", text: " Costs", handler: showAddCosts }
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

   return buildElement("table", { classes: 'reportTable', children: [ thead, tbody ] });
}

function buildSiteThead() {
   const hTexts = [ '', 'sold', 'mcu cost', 'retail', 'cost $', 'resale $', 'profit'];
   const ths = [];
   for (const h of hTexts) {
      ths.push(buildElement("th", { text: h }));
   }

   return buildElement("thead", { children: buildElement("tr", { children: ths }) });
}

function buildSiteTbody(es) {
   const inventory = es.getReportInventory();
   console.log(inventory);
   
   const rows = [];

   let first = true;

      // push the garment rows
   for (const style of inventory.garments) {
      for (const color of style.colors) {
         const name = style.vShortName + ' - ' + color.name;
         const sold = color.retailTotal + color.sOrderTotal;
         const cost = color.cost;
         const price = color.price;

         rows.push(makeRow(name, sold, cost, price, first));
         first = false;
      }
   }

      // push plus size info
   first = true;
   for (const size in inventory.plusSizes) {
      if (inventory.plusSizes[size] > 0) {         
         const sold = inventory.plusSizes[size];
         const cost = es.plusSizePricing[size].cost;
         const price = es.plusSizePricing[size].price;

         rows.push(makeRow(`${size} merch`, sold, cost, price, first));
         first = false;
      }
   }

      // push the accessories
   first = true;
   for (const a of inventory.accessories) {
      const sold = a.getSoldQ();
      const cost = a.cost;
      const price = a.price;

      rows.push(makeRow(a.item.style.vShortName, sold, cost, price, first));
      first = false;
   }

      //push the transfers
   first = true;
   for (const t of inventory.transfers) {
      rows.push(makeRow(t.transfer.transferName, t.soldQ, t.cost, t.price, first));
      first = false;
   }
   
      // blank
   rows.push(buildElement("tr", { children: buildElement("td", { text: '&nbsp;' }) }));

   rows.push(buildElement("tr", { children: buildElement("td", { text: 'transfers' }) }));
   
      // blank
   rows.push(buildElement("tr", { children: buildElement("td", { text: 'blank' }) }));

   rows.push(buildElement("tr", { children: buildElement("td", { text: 'costs' }) }));
   

   return buildElement("tbody", { children: rows });
}

function makeRow(name, sold, cost, price, first) {
      // if this is the first row, assign a class for a thicker border
   const classes = first ? ['topRow'] : [];

   const tds = [
      buildTD(name),
      buildTD(sold),
      buildDollarTD(cost),
      buildDollarTD(price),
      buildDollarTD(sold * cost),
      buildDollarTD(sold * price),
      buildDollarTD((sold * price) -(sold * cost))
   ];

   return buildElement("tr", { children: tds, classes: classes });
}




function showFillInventory({ target }) {
   const esID = Number(target.dataset.eventSiteID);
   const eSite = runtime.stateEvent.getEventSiteByID(esID);

   const tbl = buildFillTable(eSite);
   const btnCntnr = buildElement("div");
   makeSubmitCancelButtons({ btnCntnr, tbl, type: 'report', action: target.dataset.action, datasetExtra: { id: esID } });
   

   const cntnr = buildElement("div", { children: [ tbl, btnCntnr ] });

   cntnr.addEventListener('click', function(event) {
      const target = event.target;
      const action = target.dataset.action;
      if (!action) return; 
      console.log(action);
      console.log(reportSiteActions);
      console.log(reportSiteActions[action]);

      reportSiteActions[action]({ target });
   });

   openModal(cntnr, 'full');
}


function showEnterSoldTransfers({ target }) {

}

function showEditMcUCosts({ target }) {

}

function showAddCosts({ target }) {

}