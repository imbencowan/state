import { runtime } from '../runtime.js';
import { buildElement } from '../utilities.js';
import { sizeList } from '../constants.js';
import { actionFetch } from '../fetch.js';
import { buildIcon, makeSubmitCancelButtons, makeTypeActionLabel, makeLabelInputList } from './page-utils.js';
import { formatCurrency } from '../utilities.js';
import { navigate } from '../navigation.js';
import { modal, childModal } from '../modal.js';




   // define table columns. // identifiers correspond to db col names
const columns = {
   costName:     { hText: "Cost",   value: c => c.name,                 align: "left",    editable: true },
   id:           { hText: "ID",     value: c => c.id,                   align: "center",  editable: false },
   defaultRate:  { hText: "Rate",   value: c => formatCurrency(c.rate), align: "right",   editable: true },
   units:        { hText: "Units",  value: c => c.units,                align: "center",  editable: true }
};


   // define which columns get top edit buttons. // same as columns.editable, but i wanted to order them
const topButtons = [ 'costName', 'defaultRate', 'units' ];






export async function goToCostsPage() {
      // unset runtime.stateEvent 
   runtime.stateEvent = null;
      // load allCosts
   const allCosts = await runtime.allCosts.load();

   buildCostsPage(allCosts);
}

function buildCostsPage(costs) {
   const display = document.getElementById("display");

   const tH1 = buildElement("h1", { text: "Costs" });
   const costsTable = buildCostsTable(costs);
   const topButtons = buildTopBtnCntnr();

   const cntnr = buildElement("div", { id: 'costsContainer', children: [ tH1, topButtons, costsTable ] });

   display.innerHTML = '';
   display.appendChild(cntnr);

   addCostsPageFunctionality();
}

function buildTopBtnCntnr() {
   const h = buildElement("h1", { children: buildTopButtons() });
   const btnCntnr = buildElement("div", { classes: "buttonContainer", children: [h] });
   return btnCntnr;
}

function buildTopButtons() {
   const btns = [];

   btns.push(buildElement("button", {
         classes: [ "topLevelButton", "clickable", "costs-add" ],
         title: "add a cost", children: [ buildIcon('add'), " Cost" ]
      }));
   
   for (const key of topButtons) {
      const col = columns[key];
      if (col.editable) btns.push(buildCostsEditButton(key, col));
   }

   return btns;
}

    // builds a semi specific type of button. this condenses some styling used repeatedly
function buildCostsEditButton(key, col) {
   if (col.editable) {
      return buildElement("button", {
         classes: [ "topLevelButton", "clickable", "costs-update" ],
         dataset: { column: key },
         title: col.btnTitle ?? "",
         children: [ buildIcon('edit'), col.hText ]
      });
   }
}



function buildCostsTable(costs) {
   const thead = buildCostsTHead();  
   const tbody = buildCostsTbody(costs);

   return buildElement("table", { id: 'allCostsTable', children: [ thead, tbody ], classes: "costsTable" });
}

function buildCostsTHead() {
   const thRow = buildElement("tr");

   for (const [key, col] of Object.entries(columns)) {
      const text = col.hText;
      const classes = [ col.align ];
      thRow.appendChild(buildElement("th", { text: col.hText, dataset: { column: key}, classes }));
   }
      
   return buildElement("thead", { children: [ thRow ] });
}

function buildCostsTbody(costs) {
   const rows = [];

   Object.values(costs).forEach(c => {
      const tds = [];
      
      for (const [key, col] of Object.entries(columns)) {
         let data;
         const classes = [ col.align ];
         if (col.editable) data = { column: key, oValue: col.value(c) };

         tds.push(buildElement("td", { text: col.value(c), classes, dataset: data }));
      }
      
      rows.push(buildElement("tr", { children: tds, dataset: { costID: c.id } }));
   });

   return buildElement("tbody", { children: rows });
}




export function addCostsPageFunctionality() {
   const container = document.getElementById('costsContainer');

      // this is one listener that handles clicks for all buttons on the event page
      //////////////////////////////////////////////////////////////////////////////////////////////////////
   container.addEventListener('click', function(event) {
      const target = event.target.closest("button");
      if (!target) return;

      if (target.classList.contains("costs-update")) {
         showUpdateCosts({ target });
      } else if (target.classList.contains("costs-add")) {
         showAddCost();
      } else if (target.dataset.action == 'submitUpdateCosts') {
         submitUpdateCosts({ target });
      } else if (target.dataset.action == 'cancelUpdateCosts') {
         cancelUpdateCosts({ target });
      } 
   });
}


////////////////////////////////////////////////////////////////////////////////////////////
// UI functionality

function showAddCost() {
      // build a form to add transfers not already part of the event
   const frm = buildElement("form", { id: 'addCostForm' });
   frm.append(buildElement("p", { text: "Add a cost that can be applied to Event Sites:" }));
   frm.addEventListener("submit", function(e) { submitAddCost(e, frm); });

      // fill labels/inputs in the form
   const fieldset = buildAddCostFieldset();
   const div = buildElement("div", { children: fieldset });
   frm.appendChild(div);

      // make a label, a button, put them in the modal
   frm.appendChild(buildElement("button", { text: "SUBMIT", classes: 'block' }));

   modal.open(frm);
}

function buildAddCostFieldset() {
   const children = [];

   topButtons.forEach(c => {  
      const input = buildElement("input", { attrs: { name: c } });
      let name = columns[c].hText;
      if (name === "Cost") name = "Cost Name";

      if (columns[c].align === "right") {
         input.type = "number";
         input.min = 0;
         input.step = .01;
      } else {
         input.type = "text";
      }

      const span = buildElement("span", { text: `${name}: ` });
      const lbl = buildElement("label", { children: span, attrs: { for: c } });

      children.push(lbl, input);
   });

   return buildElement("fieldset", { classes: 'labelInputList', children });
}

async function submitAddCost(e, frm) {
      // stop page refresh
   e.preventDefault();

      // handle form data here
   const fData = new FormData(frm);
   const data = Object.fromEntries(fData);

      // ensure this is a new cost
   if (runtime.allCosts.getByName(data.costName)) {
    modal.open("That cost already exists.");
    return;
}
   
   const response = await actionFetch('insert', 'Cost', { data: data });
   

   if (response.success) {
      modal.close();
      // refreshTable(eSite.id);
   }
}

function showUpdateCosts({ target }) {
   const key = target.dataset.column;
   if (!key) return;

   runtime.activeMode = `editCosts${key}`;

      // get the table
   const tbl = document.getElementById('allCostsTable');
      // get the columns tds
   const tds = tbl.querySelectorAll(`td[data-column="${key}"]`);

      // create inputs in the columns tds
   tds.forEach(td => {
      const inpt = makeTableInput(td);
      td.textContent = '';
      td.appendChild(inpt);
   });

   tds[0]?.querySelector('input')?.focus();

      
   makeSubmitCancelButtons({ btnCntnr: target.parentElement, lstnrCntnr: tbl, type: 'costs', 
         action: 'updateCosts', datasetExtra: { column: key } });
}


function makeTableInput(td) {
   const col = columns[td.dataset.column];
   const type = (col.align === "right") ? "number" : "text";

   const input = buildElement("input", { attrs: { type: type } });
   // input.type = type;
   input.name = td.parentElement.dataset.costID;
   input.value = td.dataset.oValue;

   if (type === "number") {
      input.min = 0; 
      input.max = 5000;
      input.step = 1;
   }
      
   return input;
}

async function submitUpdateCosts({ target }) {
   console.log('submit');

   const colKey = target.dataset.column;

   const tbl = document.getElementById('allCostsTable');
   const tds = tbl.querySelectorAll(`td[data-column=${colKey}]`);

   const updateCosts = [];

   tds.forEach(td => {
      const inputValue = Number(td.querySelector('input').value);
      if (Number(td.dataset.oValue) !== inputValue) {
         updateCosts.push({
            costID: Number(td.parentElement.dataset.costID), 
            [colKey]: inputValue,
         });
      }
   });

      // if there are changes, send them to the server
   if (updateCosts.length) {
      const data = { 'update': updateCosts };
      const response = await actionFetch('updateRowsByIDs', 'Cost', data);

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
         modal.open("there was a problem submitting the cost edit");
      }
   } else {
      cancelUpdateCosts({ target });
   }
}

function cancelUpdateCosts({ target }) {
      // get the right table
   const tbl = document.getElementById('allCostsTable');
   
   const key = target.dataset.column;

      // clear the tds
   tbl.querySelectorAll(`td[data-column=${key}]`).forEach(td => {
      td.replaceChildren(td.dataset.oValue);
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
