import { ActionRequest } from "../models/other-classes.js";
import { myFetch } from "../fetch.js";
import { runtime } from "../runtime.js";
import { appndSbmtCnclBtns } from "../utilities.js";

   // a 'global' to hold a reusable template
let inventoryTemplate = [];

   // global
const sizeList = ['S', 'M', 'L', 'XL', '2X', '3X'];
// const sizesObj = { 'S': null, 'M': null, 'L': null, 'XL': null, '2X': null, '3X': null };
const sizesObj = {};
sizeList.forEach(size => sizesObj[size] = {});

export async function showInventories(data) {
   const request = new ActionRequest('showInventories', 'EventSite', data);
	let responseJSON = await myFetch(request);
   let events = null;
	if (responseJSON.data) {
         // make it an array
      events = Object.values(responseJSON.data);

         // preload
      await runtime.allItems.load();
      await runtime.allStyles.load();
      await runtime.allColors.load();
      await runtime.allSizes.load();

         // build an inventory template
      buildInventoryTemplate();

         // build the page
      await buildPage(events);
      addPageFunctionality();
   }

		// unset activeMode on new page
	runtime.activeMode = null;
}

   // build the template
function buildInventoryTemplate() {
      // get some alls
   const allStyles = Object.values(runtime.allStyles.getSync());
   const allColors = Object.values(runtime.allColors.getSync());

      // make some colors
   const white = allColors.find(c => c.name ==='white');
   const ash = allColors.find(c => c.name ==='ash');
   const atheather = allColors.find(c => c.name ==='athletic heather');
   const black = allColors.find(c => c.name ==='black');
   const assorted = allColors.find(c => c.name ==='assorted');

      // define an inventories styles, and their colors
   const shirtStyles = [ 
      ['t-shirts', [white, atheather]],
      ['youth t-shirts', [white], {'S': {}, 'M': {}, 'L': {} }],
      ['long sleeves', [white]],
      ['crews', [ash , atheather]],
      ['youth crew', [ash ], {'S': {}, 'M': {}, 'L': {} }],
      ['hoods', [ash , atheather]],
      ['youth hoods', [ash ], { 'M': {}, 'L': {}, 'XL': {} }],
      ['zip up hoods', [atheather]],
      ['baseball hats', [assorted], {'O': {} }],
      ['beanies', [black], { 'O': {} }],
      ['cinch bags', [atheather], { 'O': {} }]
   ];

      // make the actual template
   // inventoryTemplate = shirtStyles.map(([name, colors, sizesOverride]) => {
   //       // get the style
   //    const style = allStyles.find(s => s.inventoryName === name);
   //    if (!style) return null;

   //       // use the override for youth sizes, default for the others
   //    const o = sizesOverride || sizesObj;
   //       // use JSON.parse... to get a copy
   //    const colorsWithSizes = colors.map(c => ({ ...c, sizes: JSON.parse(JSON.stringify(o)) }));

   //    colorsWithSizes.forEach(color => {
   //       for (const key in color.sizes) {
   //          if (color.sizes.hasOwnProperty(key)) {
   //             color.sizes[key].size = getSize(key, style.sizingCategoryID);
   //             color.sizes[key].itemID = getItemID(style.id, color.id, color.sizes[key].size.id)
   //          }
   //       }
   //    });

   //    return { ...style, colors: colorsWithSizes };
   //       // remove unmatched elements
   // }).filter(Boolean);



      // items by size by color by style. style, color, and size hold a reference
      // [{style: style, colors: [{color: color, sizes: [size: size, quantity, itemID]}]}]
   inventoryTemplate = shirtStyles.map(([name, colors, sizesOverride]) => {
         // get the style
      const style = allStyles.find(s => s.inventoryName === name);
      if (!style) return null;

         // use the override for youth sizes, default for the others
      const o = sizesOverride || sizesObj;

      const colorsWithSizes = colors.map(colorRef => {
            // build sizes keyed by displayChar
         const sizes = {};
         for (const key in o) {
            if (o.hasOwnProperty(key)) {
               const sizeRef = getSize(key, style.sizingCategoryID);
               if (sizeRef) {
                  sizes[key] = {
                     size: sizeRef,                    // reference to size object
                     quantity: null,                      // inventory property
                     itemID: getItemID(style.id, colorRef.id, sizeRef.id)
                  };
               }
            }
         }

         return {
            color: colorRef,   // reference to color
            sizes              // object keyed by 'S','M','L', etc.
         };
      });

      return {
         style,                // reference to style
         colors: colorsWithSizes
      };
   }).filter(Boolean);


   console.log(inventoryTemplate);
}

   // returns a copy of the template, so we don't over write the template.
function buildInventoryInstance(template) {
   return template.map(entry => ({
      style: entry.style, // keep reference
      colors: entry.colors.map(c => ({
         color: c.color, // keep reference
         sizes: Object.fromEntries(
            Object.entries(c.sizes).map(([key, s]) => [
               key,
               {
                  size: s.size,       // keep reference
                  quantity: 0,        // fresh per-instance
                  itemID: s.itemID    // copy scalar
               }
            ])
         )
      }))
   }));
}

async function buildPage(events) {
   const year = events[0].year;
   
   let html = '';
   html += `<h1>${year}-${year+1} Inventories</h1>`;
   events.forEach(event => {
      html += `<h2>${event.sport.name}</h2>`;
      event.eventSites.forEach(eSite => {
console.log(eSite);

         runtime.inventories[eSite.id] = {
            sport: event.sport.name,
            divisions: getDivisionsString(eSite),
            site: eSite.site.name,
            // city: eSite.site.city.name,
            employees: eSite.employees
         }

         html += `<div class="invntryCntnr" data-e-site-i-d="${eSite.id}">
         <div class="row">
            <h3>${eSite.site.name}</h3>
            <div class="top-btn-cntnr">
               <button class="topLevelButton" data-action="printInventory" title="print inventory">
                  <span class="material-icons">print</span>
               </button>
               <button class="topLevelButton" data-action="editInventory" title="edit inventory">
                  <span class="material-icons">edit</span>
               </button>
            </div>
         </div>`;

         html += buildInventoryTable(eSite);
         html += `</div>`;
      });
   });


   document.getElementById('display').innerHTML = html;
}

   // add event listeners, may be load some data
function addPageFunctionality() {
   const container = document.getElementById('display');

      // click listener will only activate for elements with a data-action
   container.addEventListener('click', function(event) {
         // get the button
      const btn = event.target.closest('[data-action]');
      if (!btn) return; // clicked somewhere irrelevant

         // define click actions. 'selector': function()
      const actions = {
         'editInventory': () => { if (!runtime.activeMode) showEdit(btn); },
         'submitEditInventory': () => { submitEdit(btn); },
         'cancelEditInventory': () => { cancelEdit(btn); },
         'printInventory': () => { printInventory(btn); }
      };

      for (const slct in actions) {
         if (btn.dataset.action == slct) {
            actions[slct]();
            return;
         }
      }
   });
}

function buildInventoryTable(eSite) {
      // Make a fresh copy so we can attach quantities etc. without mutating the template
   const inventory = buildInventoryInstance(inventoryTemplate);

      // this just assigns quantities to inventory. that's it.
   eSite.inventory.forEach(inventoryItem => {
      const item = inventoryItem.item;
         // find the style in the template
      const style = inventory.find(s => s.style.id === item.styleID);
      if (!style) return;
         // find the color in that style
      const color = style.colors.find(c => c.color.id === item.colorID);
      if (!color) return;
         // check if the size property exists and assign quantity
      if (color.sizes.hasOwnProperty(item.size.displayChar)) {
         color.sizes[item.size.displayChar].quantity = inventoryItem.startQ;
      }
   });
   
      // this is where we need to add each inventory to runtime
   

      // string some html
   let html = `
      <div class="table-container">
      <table class="inventoryTable">
         <thead>
            <tr>
               <th>Item</th>
               <!--<th>Style</th>-->
               <th>Color</th>`;
               sizeList.forEach(size => { html += `<th>${size}</th>`; });
               html += `<th>TOTAL</th>
            </tr>
         </thead>
         <tbody>`;
               // s = {style: style, colors: []}
            inventory.forEach(s => {
               const youth = (s.style.sizingCategoryID === 2);
               const shirt = (s.style.sizingCategoryID !== 4);
               const styleRight = (youth) ? "right" : "";
               const rowStyle = (shirt) ? "shirtRow" : "";
                  // c = {color: color, sizes: []}
               s.colors.forEach((c, colorIndex) => {
                  const styleTDs = (colorIndex === 0) ? 
                     (`<td  class="${styleRight}" rowspan="${s.colors.length}">${s.style.inventoryName}</td>
                        <!--<td rowspan="${s.colors.length}">${s.style.code}</td>-->`) : '';
                  let total = 0;
                  html += `<tr class="${rowStyle}" data-style-i-d="${s.style.id}" data-color-i-d=
                        "${c.color.id}">` + styleTDs + `<td>${c.color.name}</td>`;
                     if ('O' in c.sizes) {
                        total = c.sizes['O'].quantity || '';
                        html += `<td colspan="6"></td>
                                 <td data-column="size" data-item-i-d="${c.sizes['O'].itemID}" 
                                       data-o-value="${total}">${total}</td>`;
                     } else {
                        sizeList.forEach(char => { 
                              // only do sizes that exist for the style
                           if (char in c.sizes) {
                              const size = c.sizes[char];
                              const q = size.quantity || 0;
                              total += q;
                              const qStr = size.quantity || '';
                              html += `<td data-column="size" data-item-i-d="${size.itemID}" 
                                       data-o-value="${qStr}">${qStr}</td>`; 
                           } else {
                                 // if there isn't a size for this style (youth) 
                              html += `<td class="center">---</td>`;
                           }
                        });
                        html += `<td>${total}</td>`
                     }
                  html += `</tr>`;
               });
            });
            html += `
         </tbody>
      </table>
      </div>
   `;

   return html;
}


function showEdit(target) {
      // prevent opening edits on multiple inventories simultaneously
   runtime.activeMode = 'edit';

      // get the table
   const container = target.closest('.invntryCntnr');
   const table = container.querySelector('table');

      // forEach size td, add an input
   for (const td of table.querySelectorAll("td[data-column]")) {
         // make an input
      let input = document.createElement('input');
      input.type = 'number';
      input.style.width = '35px';
      input.value = td.dataset.oValue;
      td.textContent = "";
      td.appendChild(input);
   }   

      // remove the edit button, replace it with submit and cancel
   const btnDiv = container.querySelector('.top-btn-cntnr');
   btnDiv.innerHTML = '';
   appndSbmtCnclBtns(btnDiv, 'EditInventory');

      // give focus
   table.querySelector('input')?.focus();
}

async function submitEdit(btn) {
      // get the container, table, and tds
   const container = btn.closest('.invntryCntnr');
   const table = container.querySelector('table');
   const tds = Array.from(table.querySelectorAll('td[data-column]'));

   let update = [];
   tds.forEach((td) => {
      if (!td.dataset.itemID) console.log(td);

      const o = td.dataset.oValue;
      const v = td.querySelector('input').value;
         // if they don't match, send v to the server to update
      if (o !== v) {
         if (td.dataset.itemID) update.push({ itemID: Number(td.dataset.itemID), quantity: Number(v) });
      }
   });


      // if values were changed, update db, else cancel
   if (update.length) {
         // attach prices
      const allItems = runtime.allItems.getSync();
      update.forEach(u => {
         u.price = allItems[u.itemID].price;
      })      
   console.log(update);
      const data = { 'eventSiteID': container.dataset.eSiteID, 'update': update };
      const request = new ActionRequest('editEventSiteInventory', 'EventSite', data);
      let responseJSON = await myFetch(request);

      if (responseJSON.success) console.log(responseJSON.data);
      if (responseJSON.success) updateTable(tds, update);
   } else {
      cancelEdit(target);
   } 

      // put the edit button back
   replaceEditButton(btn);
   
      // don't forget to reset
   runtime.activeMode = null;
}

function updateTable(tds) {
   tds.forEach(td => {
      td.innerHTML = td.querySelector('input').value;
   });
}

function cancelEdit(btn) {
      // get the container, table, and tds
   const container = btn.closest('.invntryCntnr');
   const table = container.querySelector('table');
   const tds = Array.from(table.querySelectorAll('td[data-column]'));
   
      // change them all back to their originalText
   tds.forEach((td) => {
      if (td.dataset.oValue !== undefined) td.textContent = td.dataset.oValue;
   });

      // put the edit button back
   replaceEditButton(btn);

      // don't forget to reset
   runtime.activeMode = null;
}

function replaceEditButton(btn) {
   const btns = btn.parentElement;
   const prnt = btns.parentElement;
   btns.remove();
   const btnHTML = `
            <button class="topLevelButton" data-action="printInventory" title="print inventory">
               <span class="material-icons">print</span>
            </button>
            <button class="topLevelButton" data-action="editInventory" title="edit inventory">
               <span class="material-icons">edit</span>
            </button>`;
   prnt.innerHTML += btnHTML;

}

function getItemID(styleID, colorID, sizeID) {
   const allItems = Object.values(runtime.allItems.getSync());
   
   const item = allItems.find(i => 
      i.style.id === styleID &&
      i.color.id === colorID &&
      i.size.id === sizeID
   );

   // console.log(item, styleID, colorID, sizeID);
   
   return item ? item.id : null; // return null if no match
}

function getSize(dispChar, catID) {

   const allSizes = Object.values(runtime.allSizes.getSync());
   
   const size = allSizes.find(s => {
      return s.displayChar === dispChar &&
            s.sizingCategoryID === Number(catID);
   });

   if (!size) console.log(allSizes, dispChar, catID);

   return size || null; // return null if no match
}

   // this should be an EventSite method, but i didnt have time to deal with connecting it.
function getDivisionsString(eSite) {
   if (!eSite.esDivisions || eSite.esDivisions.length === 0) return '';

   let minDiv = eSite.esDivisions[0].division;
   let maxDiv = eSite.esDivisions[0].division;

   eSite.esDivisions.forEach(esd => {
      const div = esd.division;
      if (div.id < minDiv.id) minDiv = div;
      if (div.id > maxDiv.id) maxDiv = div;
   });

   return minDiv.id === maxDiv.id
      ? minDiv.name
      : `${minDiv.name}-${maxDiv.name}`;
}