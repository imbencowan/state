////////////////////////////////////////////////////////////////////////////////
// js functions for the event page
import { runtime } from '../runtime.js';
import { myFetch } from '../fetch.js';
import { ActionRequest } from '../models/other-classes.js';

export function addShowYearFunctionality() {
   const container = document.getElementById('eventsTable');

   container.addEventListener('click', function(event) {
		const target = event.target
			// call the correct function, send the order and may be the event target
		if (target.classList.contains('edit-row-button')) {
			editRow(target);
      }
   });
}

async function editRow(target) {
      // get db data to make selects
   const allEmployees = await runtime.allEmployees.load();
   const allSites = await runtime.allSites.load();
   const allVehicles = await runtime.allVehicles.load();

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
            input = await makeSiteSlct();
            break;
         case "divisions":
            input = await makeDvsnSlct();
            break;
         case "employees":
            input = await makeEmplySlct();
            break;
         case "vehicles":
            input = await makeVhclSlct();
            break;
         case "buttons":
            input = makeCance
      }

      console.log(input);
      td.textContent = "";
      if(input) td.appendChild(input);
   }

   
}

   // make a select for divisions
async function makeSiteSlct() {
      // bring in the sites
   let allSites = await runtime.allSites.load();
      // alphebetize the list
   allSites = Object.values(allSites).sort((x, y) => {
      return x.name.localeCompare(y.name); // or numeric comparison if needed
   });

   const newSlct = document.createElement('select');

      // forEach site, make an option
   allSites.forEach((site) => {
      const newOptn = document.createElement('option');
      newOptn.textContent = site.name;
      newOptn.value = site.id;
      newSlct.appendChild(newOptn);
   });
  
   return newSlct;
}

   // make a select for divisions
async function makeDvsnSlct() {
   const allDivisions = await runtime.allDivisions.load();

   const newSlct = document.createElement('select');
   newSlct.multiple = true;

      // forEach div
   Object.entries(allDivisions).forEach(([key, div]) => {
      if (div.id !== 99) {
         const newOptn = document.createElement('option');
         newOptn.textContent = div.name;
         newOptn.value = div.id;
         newSlct.appendChild(newOptn);
      }
   });
  
   return newSlct;
}

   // make a select for divisions
async function makeEmplySlct() {
   const allEmployees = await runtime.allEmployees.load();

   const newSlct = document.createElement('select');
   newSlct.multiple = true;

      // forEach div
   Object.entries(allEmployees).forEach(([key, emp]) => {
      const newOptn = document.createElement('option');
      newOptn.textContent = emp.shortName;
      newOptn.value = emp.id;
      newSlct.appendChild(newOptn);
   });
  
   return newSlct;
}

   // make a select for divisions
async function makeVhclSlct() {
   const allVehicles = await runtime.allVehicles.load();

   const newSlct = document.createElement('select');
   newSlct.multiple = true;

      // forEach div
   Object.entries(allVehicles).forEach(([key, v]) => {
      const newOptn = document.createElement('option');
      newOptn.textContent = v.name;
      newOptn.value = v.id;
      newSlct.appendChild(newOptn);
   });
  
   return newSlct;
}