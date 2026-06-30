import { runtime } from '../runtime.js';
import { buildElement } from '../utilities.js';
import { sizeList } from '../constants.js';
import { actionFetch } from '../fetch.js';
import { buildActionButton, makeSubmitCancelButtons } from './page-utils.js';
import { navigate } from '../navigation.js';


export async function goToItemsPage() {
   const allItems = await runtime.allItems.load();

   const groupedItems = { garments: groupItemsByStyleByColor(allItems) };

   buildItemsPage(groupedItems);
}

function buildItemsPage(items) {
   const display = document.getElementById("display");

   const gH1 = buildElement("h1", { text: "Garments" });
   const garmentsTable = buildGarmentsTable(items.garments);
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
   const buttons = [
      { type: "editStock", title: "edit stock", icon: "edit", text: " Stock", classes: ["editStock"] },
      { type: "incrementStock", title: "increment stock", icon: "add", text: " Stock", classes: ["incrementStock"] },
      { type: "editPrices", title: "edit prices", icon: "edit", text: " Prices", classes: ["editPrices"] },
      { type: "editBase", title: "", icon: "edit", text: " Base Inventory", classes: ["editBaseInventory"] }
   ];

   return buttons.map(buildActionButton);
}

function buildGarmentsTable(garments) {
   const colgroup = buildElement("colgroup", {
      children: [
         buildElement("col", { classes: "left" }),
         buildElement("col", { classes: "left" }),
         buildElement("col", { classes: "center" }),
         buildElement("col", { classes: "center" }),
         buildElement("col", { classes: "right" }),
         buildElement("col", { classes: "right" })
      ]
   });

   const thead = buildGarmentsTHead();   
   const tbody = buildElement("tbody", { children: buildGarmentRows(garments) });

   return buildElement("table", { id: 'allGarmentsTable', children: [ colgroup, thead, tbody ], classes: "itemsTable" });
}

function buildGarmentsTHead() {
   const thTexts = [ 'Style', 'Color', 'ID', 'Size', 'Price', 'Stock' ];
   const thRow = buildElement("tr");

   thTexts.forEach(t => {
      thRow.appendChild(buildElement("th", { text: t }));
   });
      
   return buildElement("thead", { children: thRow });
}

function buildGarmentRows(garments) {
   const rows = [];

   garments.forEach(style => {
      style.colors.forEach((color, i) => {
         color.sizes.forEach((item, j) => {
            const tds = [];
            if (i === 0 && j === 0) tds.push(buildElement("td", { text: style.shortName, attrs: { rowspan: getStyleRowCount(style) } }));
            if (j === 0) tds.push(buildElement("td", { text: color.name, attrs: { rowspan: color.sizes.length } }));
            tds.push(buildElement("td", { text: item.id }));
            tds.push(buildElement("td", { text: item.size.displayChar }));
            tds.push(buildElement("td", { text: item.price, dataset: { oPrice: item.price } }));
            tds.push(buildElement("td", { text: item.stock, dataset: { oStock: item.stock } }));

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

export function addItemsPageFunctionality() {
   const container = document.getElementById('itemsContainer');

      // this is one listener that handles clicks for all buttons on the event page
      //////////////////////////////////////////////////////////////////////////////////////////////////////
   container.addEventListener('click', function(event) {
         // qualify the target, some buttons have span children
      const btn = event.target.closest('button');
      const spn = event.target.closest('span');

         // prioritize buttons if found. if not, we've got a naked span to use
      const target = btn || spn;
      if (!target) return;

      ////////////////// call the correct function for the click by checking the target ////////////////////
         // top-level buttons. 'selector': function to call
      const topLevelActions = {
            // orders panel actions
         'button.editStock': () => showEditStock(target),
         'button.incrementStock': () => showIncrementStock(target),
         'button.editPrices': () => showEditPrices(target),
         'button.submitStockUpdate': () => submitStockUpdate(target),
         'button.cancelStockUpdate': () => cancelStockUpdate(target),
         'button.submitStockIncrement': () => submitStockIncrement(target),
         'button.cancelStockIncrement': () => cancelStockUpdate(target)
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
}


////////////////////////////////////////////////////////////////////////////////////////////
// UI functionality

function showEditStock(btn) {
      // set mode. prevents addOns being activated while edit is in progress
   runtime.activeMode = 'edit';

   const tbl = document.getElementById('allGarmentsTable');
   const tds = tbl.querySelectorAll('td[data-o-stock]');

   tds.forEach(td => {
      const inpt = makeStockInput(td);
      td.textContent = '';
      td.appendChild(inpt);
   });

   tds[0]?.querySelector('input')?.focus();

      // function(buttonContainer, listenerContainer, type, action, id = null)
   makeSubmitCancelButtons(btn.parentElement, tbl, 'items', 'StockUpdate');
}

function showIncrementStock(btn) {
   runtime.activeMode = 'edit';

   const tbl = document.getElementById('allGarmentsTable');
   const tds = tbl.querySelectorAll('td[data-o-stock]');

   tds.forEach(td => {
      const inpt = makeStockInput(td, 0);
      td.textContent = '';
      td.appendChild(inpt);
   });

   tds[0]?.querySelector('input')?.focus();

   makeSubmitCancelButtons(btn.parentElement, tbl, 'items', 'StockIncrement');
}

function makeStockInput(td, value = td.dataset.oStock) {
	const input = document.createElement('input');
		input.type = 'number';
		input.name = `stock${td.parentElement.dataset.itemId}`;
		input.value = value;
		input.min = 0; 
		input.max = 5000;
		input.step = 1;
	return input;
}

async function submitStockUpdate(btn) {
	const itemsMap = runtime.allItems.getSync();

   const tbl = document.getElementById('allGarmentsTable');
   const tds = tbl.querySelectorAll('td[data-o-stock]');

   const updateItems = [];

   tds.forEach(td => {
      const inputValue = Number(td.querySelector('input').value);
		if (Number(td.dataset.oStock) !== inputValue) {
			updateItems.push({
				itemID: Number(td.parentElement.dataset.itemID), 
				stock: inputValue,
			});
		}
   });

   console.log(updateItems);

   	// if there are changes, send them to the server
	if (updateItems.length) {
		const data = { 'update': updateItems };
      const response = await actionFetch('updateRowsByIDs', 'Item', data);

		if (response.success) {
				// update the cells
			tds.forEach(td => {
				td.textContent = td.querySelector('input').value;
				td.dataset.oStock = td.textContent;
			});

				// update runtime
			runtime.allItems.refresh();

				// reset the buttons
			resetTopButtons(btn);

				// unset activeMode
			runtime.activeMode = null;
		} else {
			openModal("there was a problem submitting the inventory edit");
		}
	} else {
		cancelStockUpdate(btn);
	}
}

function cancelStockUpdate(btn) {
   // get the right table
   const tbl = document.getElementById('allGarmentsTable');

      // clear the tds
   tbl.querySelectorAll('td[data-o-stock]').forEach(td => {
      td.innerHTML = '';
      td.textContent = td.dataset.oStock;
   });

      // reset the buttons
   resetTopButtons(btn);

      // unset activeMode
   runtime.activeMode = null;
}

async function submitStockIncrement(btn) {
	const itemsMap = runtime.allItems.getSync();

   const tbl = document.getElementById('allGarmentsTable');
   const tds = tbl.querySelectorAll('td[data-o-stock]');

   const updateItems = [];

   tds.forEach(td => {
      const incrementValue = Number(td.querySelector('input').value);
		if (incrementValue !== 0) {
         const itemID = Number(td.parentElement.dataset.itemID);
         const newStock = Number(td.dataset.oStock) + incrementValue;

			updateItems.push({
				itemID: itemID,
				stock: newStock,
			});
		}
   });

	if (updateItems.length) {
		const data = { 'update': updateItems };
      const response = await actionFetch('updateRowsByIDs', 'Item', data);

		if (response.success) {
			tds.forEach(td => {
            const incrementValue = Number(td.querySelector('input').value);
            const newStock = Number(td.dataset.oStock) + incrementValue;
				td.textContent = newStock;
				td.dataset.oStock = td.textContent;
			});

			runtime.allItems.refresh();
			resetTopButtons(btn);
			runtime.activeMode = null;
		} else {
			openModal("there was a problem submitting the stock increment");
		}
	} else {
		cancelStockUpdate(btn);
	}
}

function resetTopButtons(btn) {
	const prnt = btn.parentElement;
	prnt.innerHTML = '';

	const newBtns = buildTopButtons();
	prnt.append(...newBtns);
}



function showEditPrices() {
   console.log('edit prices');
}




   // returns garments grouped by style, sub grouped by color
export function groupItemsByStyleByColor(items) {
   const styles = {};

   for (const item of Object.values(items)) {
      const sizeCat = item.style.sizingCategoryID;
      if (sizeCat == 1 || sizeCat == 2 || sizeCat == 3) {
         const styleID = item.style.id;
         const colorID = item.color.id;

            // initialize style container
         if (!styles[styleID]) {
            styles[styleID] = {
               ...item.style,
               colors: {}
            };
         }

            // initialize color container
         if (!styles[styleID].colors[colorID]) {
            styles[styleID].colors[colorID] = {
               ...item.color,
               sizes: {}
            };
         }

            // push the inventory item
         styles[styleID].colors[colorID].sizes[item.size.displayChar] = item;
      }
   }

      // convert styles object → ordered array
   const orderedStyles = Object.values(styles)
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

   return orderedStyles;
}
