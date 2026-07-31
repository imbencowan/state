import { runtime } from '../runtime.js';
import { buildElement } from '../utilities.js';
import { sizeList } from '../constants.js';
import { actionFetch } from '../fetch.js';
import { buildIcon, makeSubmitCancelButtons, makeTypeActionLabel } from './page-utils.js';
import { formatCurrency } from '../utilities.js';
import { navigate } from '../navigation.js';




   // define table columns. // identifiers correspond to db col names
const columns = {
   transferName:     { hText: "Transfer", value: t => t.transferName,          align: "left",   editable: false },
   id:               { hText: "ID",       value: t => t.id,                    align: "center", editable: false },
   mcuCost:          { hText: "McU Cost", value: t => formatCurrency(t.cost),  align: "right",  editable: true },
   price:            { hText: "Price",    value: t => formatCurrency(t.price), align: "right",  editable: true }
};


   // define which columns get top edit buttons. // same as columns.editable, but i wanted to order them
const topButtons = [ 'mcuCost', 'price' ];






export async function goToTransfersPage() {
      // unset runtime.stateEvent 
   runtime.stateEvent = null;
      // load allItems
   const allTransfers = await runtime.allTransfers.load();

   buildTransfersPage(allTransfers);
}

function buildTransfersPage(transfers) {
   const display = document.getElementById("display");

   const tH1 = buildElement("h1", { text: "Transfers" });
   const transfersTable = buildTransfersTable(transfers);
   const topButtons = buildTopBtnCntnr();

   const cntnr = buildElement("div", { id: 'transfersContainer', children: [ tH1, topButtons, transfersTable ] });

   display.innerHTML = '';
   display.appendChild(cntnr);

   addTransfersPageFunctionality();
}

function buildTopBtnCntnr() {
   const h = buildElement("h1", { children: buildTopButtons() });
   const btnCntnr = buildElement("div", { classes: "buttonContainer", children: [h] });
   return btnCntnr;
}

function buildTopButtons() {
   const btns = [];
   
   for (const key of topButtons) {
      const col = columns[key];
      if (col.editable) btns.push(buildTransfersEditButton(key, col));
   }

   return btns;
}

    // builds a semi specific type of button. this condenses some styling used repeatedly
function buildTransfersEditButton(key, col) {
   if (col.editable) {
      return buildElement("button", {
         classes: [ "topLevelButton", "clickable", "transfers-update" ],
         dataset: { column: key },
         title: col.btnTitle ?? "",
         children: [ buildIcon('edit'), col.hText ]
      });
   }
}



function buildTransfersTable(transfers) {
   const thead = buildTransfersTHead();  
   const tbody = buildTransfersTbody(transfers);

   return buildElement("table", { id: 'allTransfersTable', children: [ thead, tbody ], classes: "transfersTable" });
}

function buildTransfersTHead() {
   const thRow = buildElement("tr");

   for (const [key, col] of Object.entries(columns)) {
      const text = col.hText;
      const classes = [ col.align ];
      thRow.appendChild(buildElement("th", { text: col.hText, dataset: { column: key}, classes }));
   }
      
   return buildElement("thead", { children: [ thRow ] });
}

function buildTransfersTbody(transfers) {
   const rows = [];

   Object.values(transfers).forEach(t => {
      const tds = [];
      
      for (const [key, col] of Object.entries(columns)) {
         let data;
         const classes = [ col.align ];
         if (col.editable) data = { column: key, oValue: col.value(t) };

         tds.push(buildElement("td", { text: col.value(t), classes, dataset: data }));
      }
      
      rows.push(buildElement("tr", { children: tds, dataset: { transferID: t.id } }));
   });

   return buildElement("tbody", { children: rows });
}




export function addTransfersPageFunctionality() {
   const container = document.getElementById('transfersContainer');

      // this is one listener that handles clicks for all buttons on the event page
      //////////////////////////////////////////////////////////////////////////////////////////////////////
   container.addEventListener('click', function(event) {
      const target = event.target.closest("button");
      if (!target) return;

      if (target.classList.contains("transfers-update")) {
         showUpdateTransfers({ target });
      } else if (target.dataset.action == 'submitUpdateTransfers') {
         submitUpdateTransfers({ target });
      } else if (target.dataset.action == 'cancelUpdateTransfers') {
         cancelUpdateTransfers({ target });
      } 
   });
}


////////////////////////////////////////////////////////////////////////////////////////////
// UI functionality

function showUpdateTransfers({ target }) {
   const key = target.dataset.column;
   if (!key) return;

   runtime.activeMode = `editTransfers${key}`;

      // get the table
   const tbl = document.getElementById('allTransfersTable');
   //    // ensure the column is visible
   // tbl.querySelectorAll(`[data-column="${key}"]`).forEach(el => el.removeAttribute("hidden"));
      // get the columns tds
   const tds = tbl.querySelectorAll(`td[data-column="${key}"]`);

      // create inputs in the columns tds
   tds.forEach(td => {
      const inpt = makeTableInput(td);
      td.textContent = '';
      td.appendChild(inpt);
   });

   tds[0]?.querySelector('input')?.focus();

      
   makeSubmitCancelButtons({ btnCntnr: target.parentElement, lstnrCntnr: tbl, type: 'transfers', 
         action: 'updateTransfers', datasetExtra: { column: key } });
}


function makeTableInput(td) {
   const input = document.createElement('input');
      input.type = 'number';
      input.name = td.parentElement.dataset.transferID;
      input.value = td.dataset.oValue;
      input.min = 0; 
      input.max = 5000;
      input.step = 1;
   return input;
}

async function submitUpdateTransfers({ target }) {
   const colKey = target.dataset.column;

   const tbl = document.getElementById('allTransfersTable');
   const tds = tbl.querySelectorAll(`td[data-column=${colKey}]`);

   const updateTransfers = [];

   tds.forEach(td => {
      const inputValue = Number(td.querySelector('input').value);
      if (Number(td.dataset.oValue) !== inputValue) {
         updateTransfers.push({
            transferID: Number(td.parentElement.dataset.transferID), 
            [colKey]: inputValue,
         });
      }
   });

      // if there are changes, send them to the server
   if (updateTransfers.length) {
      const data = { 'update': updateTransfers };
      const response = await actionFetch('updateRowsByIDs', 'Transfer', data);

      if (response.success) {
            // update the cells
         tds.forEach(td => {
            td.textContent = td.querySelector('input').value;
            td.dataset.oValue = td.textContent;
         });

            // update runtime
         runtime.allItems.refresh();

            // reset the buttons
         resetTopButtons(target);

            // unset activeMode
         runtime.activeMode = null;
      } else {
         modal.open("there was a problem submitting the transfer edit");
      }
   } else {
      cancelUpdateTransfers({ target });
   }
}

function cancelUpdateTransfers({ target }) {
      // get the right table
   const tbl = document.getElementById('allTransfersTable');
   
   const key = target.dataset.column;

      // clear the tds
   tbl.querySelectorAll(`td[data-column=${key}]`).forEach(td => {
      td.innerHTML = '';
      td.textContent = td.dataset.oValue;
   });

      // reset the buttons
   resetTopButtons(target);

      // unset activeMode
   runtime.activeMode = null;
}


function resetTopButtons(btn) {
   const prnt = btn.parentElement;
   prnt.innerHTML = '';

   const newBtns = buildTopButtons();
   prnt.append(...newBtns);
}
