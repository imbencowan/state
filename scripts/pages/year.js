////////////////////////////////////////////////////////////////////////////////
// js functions for the event page
import { runtime } from '../runtime.js';
import { myFetch } from '../fetch.js';
import { ActionRequest } from '../models/other-classes.js';
import { arraysEqualIgnoreOrder } from '../utilities.js';

export function addShowYearFunctionality() {
   const container = document.getElementById('eventsTable');

   container.addEventListener('click', function(event) {
		const target = event.target

         // define click actions. 'selector': function()
      const actions = {
         'editRow': () => { if (!runtime.activeMode) showRowEdit(target); },
         'cancelRowEdit': () => cancelRowEdit(target),
         'submitRowEdit': () => submitRowEdit(target)
      };

      for (const slct in actions) {
         if (target.dataset.action == slct) {
            actions[slct]();
            return;
         }
      }
   });
}

async function showRowEdit(target) {
      // prevent opening edits on multiple rows simultaneously
   runtime.activeMode = 'edit';

      // get the containing row
   const row = target.closest('tr');

      // forEach td, put the appropriate element in
   for (const td of row.querySelectorAll("td[data-column]")) {
      const current = td.textContent.trim();
      td.dataset.oText = current; // stash it here
      const column = td.dataset.column;

      let input;
         // use a switch to not rely on position
      switch (column) {
         case "site":
            input = await makeSiteSlct(td);
            break;
         case "divisions":
            input = await makeDvsnSlct(td);
            break;
         case "employees":
            input = await makeEmplySlct(td);
            break;
         case "vehicles":
            input = await makeVhclSlct(td);
            break;
         case "buttons":
               // pass the row for button event listeners
            input = makeSubmitCancelButtons(row);
      }

      td.textContent = "";
      if(input) td.appendChild(input);
   }
}

   // make a select for divisions
async function makeSiteSlct(td) {
      // bring in the sites
   let allSites = await runtime.allSites.load();
      // alphebetize the list
   allSites = Object.values(allSites).sort((x, y) => {
      return x.name.localeCompare(y.name); // or numeric comparison if needed
   });

   const oSiteID = td.dataset.oValue;

   const newSlct = document.createElement('select');


      // forEach site, make an option
   allSites.forEach((site) => {
      const newOptn = document.createElement('option');
      newOptn.textContent = site.name;
      newOptn.value = site.id;
      if (site.id == oSiteID) newOptn.selected = true;

      newSlct.appendChild(newOptn);
   });
  
   return newSlct;
}

   // make a select for divisions
async function makeDvsnSlct(td) {
   const allDivisions = await runtime.allDivisions.load();

   const newSlct = document.createElement('select');
   newSlct.multiple = true;

      // parse oValues from the data attribute to an array
   const oValues = JSON.parse(td.dataset.oValue || '[]'); // fallback to empty array

      // forEach div
   Object.entries(allDivisions).forEach(([key, div]) => {
      if (div.id !== 99) {
         const newOptn = document.createElement('option');
         newOptn.textContent = div.name;
         newOptn.value = div.id;
            // select if value matches one of oValues
         if (oValues.includes(div.id)) newOptn.selected = true;

         newSlct.appendChild(newOptn);
         newSlct.appendChild(newOptn);
      }
   });
  
   return newSlct;
}

   // make a select for divisions
async function makeEmplySlct(td) {
   const allEmployees = await runtime.allEmployees.load();

   const newSlct = document.createElement('select');
   newSlct.multiple = true;

      // parse oValues from the data attribute to an array
   const oValues = JSON.parse(td.dataset.oValue || '[]'); // fallback to empty array

      // forEach div
   Object.entries(allEmployees).forEach(([key, emp]) => {
      const newOptn = document.createElement('option');
      newOptn.textContent = emp.shortName;
      newOptn.value = emp.id;
         // select if value matches one of oValues
      if (oValues.includes(emp.id)) newOptn.selected = true;

      newSlct.appendChild(newOptn);
   });
  
   return newSlct;
}

   // make a select for divisions
async function makeVhclSlct(td) {
   const allVehicles = await runtime.allVehicles.load();

   const newSlct = document.createElement('select');
   newSlct.multiple = true;

      // parse oValues from the data attribute to an array
   const oValues = JSON.parse(td.dataset.oValue || '[]'); // fallback to empty array

      // forEach div
   Object.entries(allVehicles).forEach(([key, v]) => {
      const newOptn = document.createElement('option');
      newOptn.textContent = v.name;
      newOptn.value = v.id;
         // select if value matches one of oValues
      if (oValues.includes(v.id)) newOptn.selected = true;

      newSlct.appendChild(newOptn);
      newSlct.appendChild(newOptn);
   });
  
   return newSlct;
}

function makeSubmitCancelButtons(row) {
   const btnDiv = document.createElement('div');

	const submitButton = document.createElement('button');
	submitButton.type = 'button';
	submitButton.textContent = 'Submit';
   submitButton.dataset.action = 'submitRowEdit';
	btnDiv.appendChild(submitButton);
	
	const cancelButton = document.createElement('button');
	cancelButton.type = 'button';
	cancelButton.textContent = 'X';
   cancelButton.dataset.action = 'cancelRowEdit';
	btnDiv.appendChild(cancelButton);

	
		// add event listeners for ESC and ENTER
   if (row) {
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

      row.addEventListener('keydown', keyHandler);

      // define a cleanup helper
      function cleanup() {
         row.removeEventListener('keydown', keyHandler);
      }
   }

   return btnDiv;
}

async function submitRowEdit(target) {
      // get the row and tds
   const row = target.closest('tr');
   const tds = row.querySelectorAll('td[data-column]'); // only tds with data-column
      // containers
   const selectedValues = {};
   const oValues = {};
   const updateValues = {};

      // get the selectedValues and oValues for each column
   tds.forEach(td => {
         // get some info
      const column = td.dataset.column;
      const select = td.querySelector('select');

      if (select) {
            // get single or multiple selected values
         const values = Array.from(select.selectedOptions).map(opt => Number(opt.value));
            // you want a single value instead of array for single selects:
         selectedValues[column] = select.multiple ? values : values[0];
            // parse the original value for the column
         oValues[column] = JSON.parse(td.dataset.oValue);
      }

   });


      // Compare and build updateValues
   for (const key in selectedValues) {
      const sel = selectedValues[key];
      const orig = oValues[key];

         // separate comparisons for arrays vs literals
      if (Array.isArray(sel) && Array.isArray(orig)) {
         if (!arraysEqualIgnoreOrder(sel, orig)) {
            updateValues[key] = sel;
         }
      } else {
         if (sel !== orig) updateValues[key] = sel;
      }
   }

      // if values were changed, update db, else cancel
   if (Object.keys(updateValues).length) {
      const data = { 'eventSiteID': row.dataset.eventSiteID, 'updateValues': updateValues };
      const request = new ActionRequest('editEventSiteFromRow', 'EventSite', data);
      let responseJSON = await myFetch(request);

      if (responseJSON.success) updateRow(tds, updateValues);
   } else {
      cancelRowEdit(target);
   }   
      // reset activeMode. don't forget
   runtime.activeMode = null;
}

function updateRow(tds, updateValues) {
   tds.forEach((td) => {
      const column = td.dataset.column;
      if (column in updateValues) {
         let slct = td.querySelector('select');
         const names = Array.from(slct.selectedOptions).map(opt => opt.textContent);
         td.textContent = names.join(', ');
         console.log(names);
      } else {
            // if it hasn't changed just replace with the oText
         if (td.dataset.oText !== undefined) td.textContent = td.dataset.oText;
      }
   });

   replaceEditButton(tds);
}

function cancelRowEdit(target) {
      // get the row and tds
   const row = target.closest('tr');
   const tds = Array.from(row.querySelectorAll('td'));
   
      // change them all back to their originalText
   tds.forEach((td) => {
      if (td.dataset.oText !== undefined) td.textContent = td.dataset.oText;
   });

      // put the edit button back in the final td
   replaceEditButton(tds);

      // don't forget to reset
   runtime.activeMode = null;
}

   // put the edit button back in the final td
function replaceEditButton(tds) {
   const lastTd = tds[tds.length - 1];
   const btn = document.createElement('button');
   const spn = document.createElement('span');

   spn.textContent = 'edit';
   spn.title = 'edit row';
   spn.dataset.action = 'editRow';
   spn.classList.add('material-icons');
   btn.appendChild(spn);
   lastTd.textContent = "";
   
   lastTd.appendChild(btn);
}