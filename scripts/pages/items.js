import { runtime } from '../runtime.js';
import { buildElement } from '../utilities.js';
import { sizeList } from '../constants.js';
import { actionFetch } from '../fetch.js';
import { buildIcon, makeSubmitCancelButtons, makeTypeActionLabel } from './page-utils.js';
import { formatCurrency } from '../utilities.js';
import { navigate } from '../navigation.js';




   // define table columns. // identifiers correspond to db col names
const columns = {
   style:            { hText: "Style",             value: i => i.style.vShortName,      align: "left",   editable: false },
   color:            { hText: "Color",             value: i => i.color.name,            align: "left",   editable: false },
   size:             { hText: "Size",              value: i => i.size.displayChar,      align: "center", editable: false },
   id:               { hText: "ID",                value: i => i.id,                    align: "center", editable: false },
   mcuCost:          { hText: "McU Cost",          value: i => formatCurrency(i.cost),  align: "right",  editable: true },
   price:            { hText: "Price",             value: i => formatCurrency(i.price), align: "right",  editable: true },
   stock:            { hText: "Stock",             value: i => i.stock,                 align: "right",  editable: true },
   caseQ:            { hText: "Case Qty",          value: i => i.caseQ,                 align: "right",  editable: true },
   inventoryMinimum: { hText: "Inventory Minimum", value: i => i.inventoryMin,          align: "right",  editable: true },
   inventoryStep:    { hText: "Inventory Step",    value: i => i.inventoryStep,         align: "right",  editable: true }
};
   // define some titles down here, so the above stays pretty
columns.mcuCost.btnTitle = "edit our cost";
columns.price.btnTitle = "edit the retail price ";
columns.stock.btnTitle = "edit stock";
columns.caseQ.btnTitle = "edit the quantity in a case";
columns.inventoryMinimum.btnTitle = "edit the minimum quantity for a basic inventory";
columns.inventoryStep.btnTitle = "edit the amount to increase inventory quantities by";

const baseColumns = [ 'style', 'color', 'size', 'id' ];
const startColumns = [ ...baseColumns, 'mcuCost', 'price', 'stock' ];


   // define which columns get top edit buttons. // same as columns.editable, but i wanted to order them
const topButtons = [ 'stock', 'mcuCost', 'price', 'caseQ', 'inventoryMinimum', 'inventoryStep' ];






export async function goToItemsPage() {
      // unset runtime.stateEvent 
   runtime.stateEvent = null;
      // load allItems
   const allItems = await runtime.allItems.load();

   const groupedItems = groupItemsByStyleByColor(allItems);

   buildItemsPage(groupedItems);
}

function buildItemsPage(items) {
   const display = document.getElementById("display");

   const gH1 = buildElement("h1", { text: "Garments" });
   const garmentsTable = buildItemsTable(items);
   const topButtons = buildTopBtnCntnr();

   const cntnr = buildElement("div", { id: 'itemsContainer', children: [ gH1, topButtons, garmentsTable ] });

   display.innerHTML = '';
   display.appendChild(cntnr);

   addItemsPageFunctionality();
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
      if (col.editable) btns.push(buildItemsEditButton(key, col));
   }

   return btns;
}

    // builds a semi specific type of button. this condenses some styling used repeatedly
function buildItemsEditButton(key, col) {
   if (col.editable) {
      return buildElement("button", {
         classes: [ "topLevelButton", "clickable", "items-update" ],
         dataset: { column: key },
         title: col.btnTitle ?? "",
         children: [ buildIcon('edit'), col.hText ]
      });
   }
}



function buildItemsTable(items) {
   const thead = buildGarmentsTHead();  
   const garmentRows = buildGarmentRows(items.garments);
   const accessoryRows = buildAccessoryRows(items.accessories);
   const tbody = buildElement("tbody", { children: [ ...garmentRows, ...accessoryRows ] });

   return buildElement("table", { id: 'allGarmentsTable', children: [ thead, tbody ], classes: "itemsTable" });
}

function buildGarmentsTHead() {
   const thRow = buildElement("tr");

   for (const [key, col] of Object.entries(columns)) {
      const hidden = !startColumns.includes(key);
      const text = col.hText;
      const classes = [ col.align ];
      thRow.appendChild(buildElement("th", { text: col.hText, dataset: { column: key}, attrs: { hidden }, classes }));
   }
      
   return buildElement("thead", { children: [ thRow ] });
}

function buildGarmentRows(garments) {
   const rows = [];

   garments.forEach(style => {
      style.colors.forEach((color, i) => {
         color.sizes.forEach((item, j) => {
            const tds = [];
            
            for (const [key, col] of Object.entries(columns)) {
               let data;
               const classes = [ col.align ];
               const hidden = !startColumns.includes(key);

               if (key == 'style') {
                  if (i === 0 && j === 0) {
                     tds.push(buildElement("td", { text: col.value(item), attrs: { rowspan: getStyleRowCount(style) } }));
                  }
               } else if (key == 'color') {
                  if (j === 0) {
                     tds.push(buildElement("td", { text: col.value(item), attrs: { rowspan: color.sizes.length } }));
                  }
               } else {
                  if (col.editable) data = { column: key, oValue: col.value(item) };
                  tds.push(buildElement("td", { text: col.value(item), classes, dataset: data, attrs: { hidden } }));
               }
            }
            
            rows.push(buildElement("tr", { children: tds, dataset: { itemID: item.id } }));
         });
      });
   });



   return rows;
}

function getStyleRowCount(style) {
   let count = 0;

   style.colors.forEach(c => {
      count += c.sizes.length;
   });
   
   return count;
}

function buildAccessoryRows(accessories) {
   const rows = [];

   for (const item of accessories) {
      const tds = [];

      for (const [key, col] of Object.entries(columns)) {
         let data;
         const classes = [];
         const hidden = !startColumns.includes(key);

         if (col.editable) data = { column: key, oValue: col.value(item) };
         classes.push(col.align);
         tds.push(buildElement("td", { text: col.value(item), classes, dataset: data, attrs: { hidden } }));
      }
            
      rows.push(buildElement("tr", { children: tds, dataset: { itemID: item.id } }));
   }

   return rows;
}

   // returns garments grouped by style, sub grouped by color
export function groupItemsByStyleByColor(items) {
   const gStyles = {};
   const accessories = [];

   for (const item of Object.values(items)) {
      const sizeCat = item.style.sizingCategoryID;
      if (sizeCat == 1 || sizeCat == 2 || sizeCat == 3) {
         const styleID = item.style.id;
         const colorID = item.color.id;

            // initialize style container
         if (!gStyles[styleID]) {
            gStyles[styleID] = {
               ...item.style,
               colors: {}
            };
         }

            // initialize color container
         if (!gStyles[styleID].colors[colorID]) {
            gStyles[styleID].colors[colorID] = {
               ...item.color,
               sizes: {}
            };
         }

            // push the inventory item
         gStyles[styleID].colors[colorID].sizes[item.size.displayChar] = item;
      } else {
         // accessories
         accessories.push(item);
      }
   }

      // convert gStyles object → ordered array
   const garments = Object.values(gStyles)
   .sort((a, b) => a.listOrder - b.listOrder)
   .map(style => {
      const orderedColors = Object.values(style.colors).map(color => {
            // convert sizes object → ordered array
         const orderedSizes = sizeList
            .filter(sizeChar => color.sizes[sizeChar])
            .map(sizeChar => color.sizes[sizeChar]);

         return {
            ...color,
            sizes: orderedSizes
         };
      });

      return {
         ...style,
         colors: orderedColors
      };
   });

   return { garments, accessories };
}


export function addItemsPageFunctionality() {
   const container = document.getElementById('itemsContainer');

      // this is one listener that handles clicks for all buttons on the event page
      //////////////////////////////////////////////////////////////////////////////////////////////////////
   container.addEventListener('click', function(event) {
      const target = event.target.closest("button");
      if (!target) return;

      if (target.classList.contains("items-update")) {
         showUpdateItems({ target });
      } else if (target.dataset.action == 'submitUpdateItems') {
         submitUpdateItems({ target });
      } else if (target.dataset.action == 'cancelUpdateItems') {
         cancelUpdateItems({ target });
      } 
   });
}


////////////////////////////////////////////////////////////////////////////////////////////
// UI functionality

function showUpdateItems({ target }) {
   const key = target.dataset.column;
   if (!key) return;

   runtime.activeMode = `editItems${key}`;

      // get the table
   const tbl = document.getElementById('allGarmentsTable');
      // ensure the column is visible
   tbl.querySelectorAll(`[data-column="${key}"]`).forEach(el => el.removeAttribute("hidden"));
      // get the columns tds
   const tds = tbl.querySelectorAll(`td[data-column="${key}"]`);

      // create inputs in the columns tds
   tds.forEach(td => {
      const inpt = makeTableInput(td);
      td.textContent = '';
      td.appendChild(inpt);
   });

   tds[0]?.querySelector('input')?.focus();

      
   makeSubmitCancelButtons({ btnCntnr: target.parentElement, lstnrCntnr: tbl, type: 'items', 
         action: 'updateItems', datasetExtra: { column: key } });
}

// function showIncrementStock({ target }) {
//    runtime.activeMode = 'incrementStock';

//    const tbl = document.getElementById('allGarmentsTable');
//    const tds = tbl.querySelectorAll('td[data-o-stock]');

//    tds.forEach(td => {
//       const inpt = makeStockInput(td, 0);
//       td.textContent = '';
//       td.appendChild(inpt);
//    });

//    tds[0]?.querySelector('input')?.focus();

//    makeSubmitCancelButtons({ btnCntnr: target.parentElement, lstnrCntnr: tbl, type: 'items', 
//          action: target.dataset.action, datasetExtra: { column: target.dataset.column } });
// }

function makeTableInput(td) {
	const input = document.createElement('input');
		input.type = 'number';
		input.name = `stock${td.parentElement.dataset.itemId}`;
		input.value = td.dataset.oValue;
		input.min = 0; 
		input.max = 5000;
		input.step = 1;
	return input;
}

async function submitUpdateItems({ target }) {
   const colKey = target.dataset.column;

   const tbl = document.getElementById('allGarmentsTable');
   const tds = tbl.querySelectorAll(`td[data-column=${colKey}]`);

   const updateItems = [];

   tds.forEach(td => {
      const inputValue = Number(td.querySelector('input').value);
		if (Number(td.dataset.oValue) !== inputValue) {
			updateItems.push({
				itemID: Number(td.parentElement.dataset.itemID), 
				[colKey]: inputValue,
			});
		}
   });

   	// if there are changes, send them to the server
	if (updateItems.length) {
		const data = { 'update': updateItems };
      const response = await actionFetch('updateRowsByIDs', 'Item', data);

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
			modal.open("there was a problem submitting the inventory edit");
		}
	} else {
		cancelUpdateItems({ target });
	}
}

function cancelUpdateItems({ target }) {
      // get the right table
   const tbl = document.getElementById('allGarmentsTable');
   
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

// async function submitIncrementStock({ target }) {
// 	const itemsMap = runtime.allItems.getSync();

//    const tbl = document.getElementById('allGarmentsTable');
//    const tds = tbl.querySelectorAll('td[data-o-stock]');

//    const updateItems = [];

//    tds.forEach(td => {
//       const incrementValue = Number(td.querySelector('input').value);
// 		if (incrementValue !== 0) {
//          const itemID = Number(td.parentElement.dataset.itemID);
//          const newStock = Number(td.dataset.oStock) + incrementValue;

// 			updateItems.push({
// 				itemID: itemID,
// 				stock: newStock,
// 			});
// 		}
//    });

// 	if (updateItems.length) {
// 		const data = { 'update': updateItems };
//       const response = await actionFetch('updateRowsByIDs', 'Item', data);

// 		if (response.success) {
// 			tds.forEach(td => {
//             const incrementValue = Number(td.querySelector('input').value);
//             const newStock = Number(td.dataset.oStock) + incrementValue;
// 				td.textContent = newStock;
// 				td.dataset.oStock = td.textContent;
// 			});

// 			runtime.allItems.refresh();
// 			resetTopButtons(target);
// 			runtime.activeMode = null;
// 		} else {
// 			modal.open("there was a problem submitting the stock increment");
// 		}
// 	} else {
// 		cancelItemsUpdate(target);
// 	}
// }

// function submitEditPrices({ target }) {
//    console.log("sub price")
// }

function resetTopButtons(btn) {
	const prnt = btn.parentElement;
	prnt.innerHTML = '';

	const newBtns = buildTopButtons();
	prnt.append(...newBtns);
}
