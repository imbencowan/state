////////////////////////////////////////////////////////////////////////////////
// js functions for the event page
import { runtime } from '../runtime.js';
import { actionFetch, myFetch } from '../fetch.js';
import { arraysEqualIgnoreOrder, buildElement, getPropertyValues, formatDateInput, parseInputDate, 
         getDateRangeString } from '../utilities.js';
import { buildActionButton, makeTypeActionLabel, makeLabelInputList, 
         makeButtonActionMap, buildIcon } from './page-utils.js';
import { getDivisionsString } from '../formatters.js';
import { modal, childModal } from '../modal.js';
import { EventSite, Season, Site, StateEvent } from '../models/db-classes.js';
import { showPage } from './page-handling.js';
import { printSeasonStockPDF } from '../print.js';



const topButtons = [
   { action: "getSeasonStock", text: " Get Next Season Stock", handler: showSeasonStock }, 
   { action: "addEvents", icon: "add", text: " Events", handler: showAddEvents }, 
   { action: "addYear", icon: "add", text: " Year", handler: showAddYear }
];

   // action/handler map for the click event listener
const yearActionMap = makeButtonActionMap(topButtons);
yearActionMap.editRow = showRowEdit;
yearActionMap.cancelRowEdit = cancelRowEdit;
yearActionMap.submitRowEdit = submitRowEdit;


export async function goToYearPage(year) {
   await Promise.all([
      runtime.allSites.load(),
      runtime.allDivisions.load(),
      runtime.allEmployees.load(),
      runtime.allVehicles.load(),
      runtime.allSports.load(),
      runtime.allSeasons.load()
   ]);

   if (!year) year = document.getElementById('selectYear').value;
   const response = await showPage('showYear', 'Year', { year: year });

   buildYearPage(response.data);
   addShowYearFunctionality();

   runtime.activeMode = null;
}

function buildYearPage(y) {
   const h2 = buildElement("h2", { text: `${y.year} - ${y.year + 1} Events` });
   const topBtnElmnts = topButtons.map(buildActionButton);
   const topDiv = buildElement("div", { children: [ h2, ...topBtnElmnts ], classes: "row" });

   const thead = buildYearThead();
   const tbody = buildYearTbody(y.events);
   const tbl = buildElement("table", { id: 'eventsTable', classes: 'eventsTable', children: [ thead, tbody ] });
   const tblCntnr = buildElement("div", { children: [ tbl ], classes: 'table-container' });

   const yearDiv = buildElement("div", { id:'yearContainer', children: [ topDiv, tblCntnr ] });
   document.getElementById('display').appendChild(yearDiv);
}

function buildYearThead() {
   const thTexts = [ "Event", "Site", "Divisions", "Employees", "Vehicle" ];
   
   const ths = thTexts.map(t => buildElement("th", { text: t }));
   ths.push(buildElement("th", { children: [ buildIcon('edit') ]}))

   const tr = buildElement("tr", { children: ths });

   return buildElement("thead", { children: [ tr ] });
}

function buildYearTbody(events) {
   const rows = [];

   for (const e of events) {
      const sEvent = StateEvent.fromJSON(e);
      const season = runtime.allSeasons.getByDate(sEvent.startDate);

      for (const [i, es] of sEvent.eventSites.entries()) {
            // a couple arrays for oValues to hold
         const empIDsOV = JSON.stringify(es.employees.map(esE => esE.employee.id));
         const divIDsOV = JSON.stringify(es.esDivisions.map(esd => esd.division.id));
         const vhclIDsOV = JSON.stringify(es.vehicles.map(v => v.id));

         const tds = [];

         if (i === 0) {
            const h2 = buildElement("h2", { text: sEvent.sport.name });
            const txt = sEvent.getDateRangeString();
            tds.push(buildElement("td", { children: [ h2, txt ], attrs: { rowspan: sEvent.eventSites.length } }));
         }

         tds.push(...[
            buildElement("td", { text: es.site.name, dataset: { column: 'site', oValue: es.site.id } }),
            buildElement("td", { text: es.getDivisionsString(), dataset: { column: 'divisions', oValue: divIDsOV } }),
            buildElement("td", { text: es.getEmployeesString(), dataset: { column: 'employees', oValue: empIDsOV } }),
            buildElement("td", { text: es.getVehicleString(), dataset: { column: 'vehicles', oValue: vhclIDsOV } }),
            buildElement("td", { dataset: { column: 'buttons' }, children: buildElement("button", { title: 'edit row', 
                                    children: buildIcon('edit'), dataset: { action: 'editRow' } }) }),
         ]);

         const row = buildElement("tr", { children: tds, dataset: { eventID: sEvent.id, eventSiteID: es.id } });
         row.style.backgroundColor = season.color;
         rows.push(row);
      }
   }

   return buildElement("tbody", { children: rows });
}





function addShowYearFunctionality() {
   const container = document.getElementById('yearContainer');

      // click listener will only activate for elements with a data-action
   container.addEventListener('click', function(event) {
         // get the button
		const target = event.target.closest('[data-action]');
      if (!target) return; // clicked somewhere irrelevant

      const action = target.dataset.action;
      const handler = yearActionMap[action];

		if (handler) handler(target);
   });
}


//////////////////////////////////////////////////////////////////////////////////////////

async function showRowEdit(target) {
   if (runtime.activeMode) return;
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
            input = makeRowSiteSelect(td);
            break;
         case "divisions":
               // put edit divisions on hold because it doesn't work with BasicTableModel's current update methods
                  // and i'm not sure i want to be able to edit divisions any way.
                     // if you remove a division from a site, what happens? it's outside the scope of update
                        // needs a custom function
            // input = await makeDivSelect(td);
            break;
         case "manager":
            input = document.createElement('input');
            input.type = 'text';
            input.placeholder = td.dataset.oValue;
            break;
         case "employees":
            input = makeEmplySlct(td);
            break;
         case "vehicles":
            input = makeVhclSlct(td);
            break;
         case "buttons":
               // pass the row for button event listeners
            input = makeSubmitCancelButtons(row);
      }

      if(input) {
         td.textContent = "";
         td.appendChild(input);
      }
   }

      // give focus to the first select
   row.querySelector('select')?.focus();
}

function makeRowSiteSelect(td) {
   const slct = makeSiteSelect();
   slct.value = td.dataset.oValue;

   return slct;
}

   // make a select for sites
function makeSiteSelect() {
      // bring in the sites
   let allSites = runtime.allSites.getSync();
      // alphebetize the list
   allSites = Object.values(allSites).sort((x, y) => {
      return x.name.localeCompare(y.name); // or numeric comparison if needed
   });

   const newSlct = buildElement('select', { dataset: { control: 'sites' } });

      // forEach site, make an option
   allSites.forEach((site) => {
      const newOptn = buildElement("option", { text: site.name, attrs: { value: site.id } });
      newSlct.appendChild(newOptn);
   });
  
   return newSlct;
}
   
      // omitted. editing divisions in row is currently prevented
// function makeRowDivSelect(td) {
//    const slct = makeDivSelect();

//       // parse oValues from the data attribute to an array
//    const oValues = JSON.parse(td.dataset.oValue || '[]');
   
//       // select if value matches one of oValues
//          // may be this works, wrote it while it was not implemented
//    [...slct.options].forEach(option => {
//       if (oValues.includes(option.value)) option.selected = true;
//    });

//    return slct;
// }

   // make a select for divisions
function makeDivSelect(td) {
   const allDivisions = runtime.allDivisions.getSync();

   const newSlct = buildElement('select', { dataset: { control: 'divisions' } });
   newSlct.multiple = true;

      // forEach div
   Object.values(allDivisions).reverse().forEach(div => {
      if (div.id !== 99) {
         const newOptn = buildElement("option", { text: div.name, attrs: { value: div.id } });
         newSlct.appendChild(newOptn);
      }
   });
  
   return newSlct;
}

   // make a select for employees
function makeEmplySlct(td) {const newSlct = document.createElement('select');
   newSlct.multiple = true;

      // parse oValues from the data attribute to an array
   const oValues = JSON.parse(td.dataset.oValue || '[]'); // fallback to empty array

      // forEach div
   Object.entries(runtime.allEmployees.getSync()).forEach(([key, emp]) => {
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
function makeVhclSlct(td) {
   const newSlct = document.createElement('select');
   newSlct.multiple = true;

      // parse oValues from the data attribute to an array
   const oValues = JSON.parse(td.dataset.oValue || '[]'); // fallback to empty array

      // forEach div
   Object.entries(runtime.allVehicles.getSync()).forEach(([key, v]) => {
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

   // replace this with the function in page-utils.js?
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
      } else {
         const input = td.querySelector('input');
         if (input) {
            const inputValue = td.querySelector('input').value;
            if (String(inputValue) !== String(JSON.parse(td.dataset.oValue))) {
               updateValues[column] = inputValue;
            }
         }
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
      const response = await actionFetch('editEventSiteFromRow', 'EventSite', data);

      if (response.success) updateRow(tds, updateValues);
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
         if (slct) {
            const names = Array.from(slct.selectedOptions).map(opt => opt.textContent);
            const namesStr = names.join(', ');
            const idsArr = Array.from(slct.selectedOptions).map(opt => Number(opt.value));

            td.textContent = namesStr;
            td.dataset.oValue = JSON.stringify(idsArr);
            td.dataset.oText = namesStr;
         } else {
            let input = td.querySelector('input');
            if (input) td.textContent = input.value
         }
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



function showAddYear() {
      // header
   const head = buildElement("h2", { text: "Paste a year's schedule here, and we'll try to parse it" });

      // textarea
   const textarea = document.createElement("textarea");
   textarea.rows = 10;
   textarea.cols = 50;
   textarea.placeholder = "Paste PDF text here...";

      // submit button
   const submitBtn = document.createElement("button");
   submitBtn.textContent = "Parse";
   submitBtn.style.display = "block";
   submitBtn.style.marginTop = "0.5em";

      // make a wrapper so we don’t pollute the page
   const wrapper = buildElement("div", { children: [ head, textarea, submitBtn ] });

      // wire the button
   submitBtn.addEventListener("click", () => {
      const txt = textarea.value.trim();
      if (txt) {
         parseYear(txt);
      }
      // clean up after use
      // wrapper.remove();
   });

      // add to page
   modal.open(wrapper);
   textarea.focus();
}

   // scan txt until you find a sport
async function parseYear(txt) {
      // define existing values
   const allSports = Object.values(await runtime.allSports.load());
   const allSites = Object.values(await runtime.allSites.load());
   const allSchools = Object.values(await runtime.allSchools.load());
   const allDivs = Object.values(await runtime.allDivisions.load());
   const allADs = Object.values(await runtime.allADs.load());

   const lastDiv = allDivs[allDivs.length - 1];
   if (lastDiv.id === 99) allDivs.pop();

      // split txt into lines // Remove extra white space // remove any empty lines
   let lines = txt.split('\n');
   lines = lines.map(function(line) { return line.trim(); });
   lines = lines.filter(function(line) { return line.length > 0; });

   let newEvents = [];
   let currentEvent = null;
   let secondEvent = null;

   lines.forEach(line => {
         // check if the line starts with a known sport name
      const sport = allSports.find(s => line.toLowerCase().startsWith(s.name.toLowerCase()));
      if (sport) {
            // get the dates
         let remaining = line.slice(sport.name.length).trim();
         let dates = parseDateRangeStr(remaining);

            // check if dance and cheer are in the same line
         if (sport.name.toLowerCase() === 'dance' || sport.name.toLowerCase() === 'cheer') { 
            // look for other sports in the line 
            const otherSport = allSports.find(s => 
                  (s.name.toLowerCase() !== sport.name.toLowerCase() 
                     && remaining.toLowerCase().includes(s.name.toLowerCase()))
            ); 
            if (otherSport) { 
                  // over write date stuff
               const nameIdx = remaining.toLowerCase().indexOf(otherSport.name.toLowerCase());
               if (nameIdx !== -1) remaining = remaining.slice(nameIdx + otherSport.name.length).trim();
            
               dates = parseDateRangeStr(remaining);
                  // add the second event
               secondEvent = {
                  sport: sport,
                  startDate: dates[0],
                  endDate: dates[1] || dates[0],
                  eventSites: []
               };
               newEvents.push(secondEvent);
            } 
         }

            // add the event
         currentEvent = {
               sport: sport,
               startDate: dates[0],
               endDate: dates[1] || dates[0],
               eventSites: []
         };
         newEvents.push(currentEvent);
      } else if (currentEvent) {    
            // treat as a site line
            // expected line format: "6A RedHawk GC (Mtn View host) Dane Pence"
            
            // if a site is just TBD, leave sites empty. 
         if ((line.length < 7) && (line.endsWith("A TBD"))) return;
        
            // delete host data
         line = line.replace(/\([^)]*\)/g, '').trim();
         let lineParts = parseSiteLineParts(line);

            // parse. // site first, so we know definitively how many there are
         let eSites = parseSite(lineParts.siteStr, allSites);
         parseManager(lineParts, eSites, allADs);
         parseDivs(lineParts.divStr, eSites, currentEvent.sport);

         eSites.forEach(es => {
            currentEvent.eventSites.push(es);
         })
      }
   });

   let seenSites = [];
   let newDuplicates = [];
   newEvents.forEach(e => {
      e.eventSites.forEach(es => {
         if (!es.site.id) console.log(es.site);
         if (!es.site.id && seenSites.includes(es.site.name)) {
            es.duplicate = true;
            newDuplicates.push(es.site.name);
         } else {
            seenSites.push(es.site.name);
            es.duplicate = false;
         }
      });
   });

   
   console.log(newEvents);
   
   const response = await actionFetch('submitYear', 'Year', { events: newEvents });

   if (response.success) {
      // some thing should happen here
   }
   

            // helpers // parsers
   function parseSiteLineParts(str) {
      let parts = { divStr: null, siteStr: null, mgrStr: null };
         // get the div part
         // if str starts with a division, split at the first space followed by a word.
            // else leave divStr null
               // test if str starts with a digit followed by 'A'
      if (/^\dA/.test(str)) {
            // get the start of the string (^[\s\S]) to the first space followed by a letter (?= [A-Za-z])
         const match = str.match(/^[\s\S]*?(?= [A-Za-z])/);
         parts.divStr = match ? match[0] : str;
         str = str.slice(match[0].length).trim();
      }

         // get the manager part
            // if TBD, leave mgrStr null
      if (str.endsWith('TBD')) {
            // there is a site in the str, trim the TBD
         if (str.length > 3) str = str.slice(0, -3);
      } else {
            // regex to get the last two words
               // (\w+) → a word. // \s+ → white space. 
               // \s*[\W]*$ → optional trailing spaces or punctuation, then end of string.
         const match = str.match(/(\w+)\s+(\w+)\s*[\W]*$/);
         if (match) {
            parts.mgrStr = match[0];
               // Remove the match from the end of str
            str = str.slice(0, str.length - match[0].length).trim();
               // check if there were two managers
            if (str.endsWith('/')) {
                  // same regex as above
               const match = str.match(/(\w+)\s+(\w+)\s*[\W]*$/);
               if (match) {
                     // mimic above
                  parts.mgrStr = match[0] + " " + parts.mgrStr;
                  str = str.slice(0, str.length - match[0].length).trim();
               }
            }
         }
      }

         // siteStr should be the remainder
      parts.siteStr = str;
      // console.log(parts);

      return parts;
   }

   function parseDateRangeStr(str) {
      let dateParts = str.split('-');
      let dates = dateParts.map(d => d.trim());
      dates.forEach(d => { d.replace('.', '')});

      let year = new Date().getFullYear();
      dates[0] = new Date(`${dates[0]} ${year}`);

      let month = dates[0].getMonth()

         // increment the year if it's next year
      if (month < 7) dates[0].setFullYear(++year);

      


      if (!dates[1]) {
         dates[1] = dates[0];
      } else if (dates[1].length < 4) {
         let day = parseInt(dates[1], 10);
         dates[1] = new Date(year, month, day);
      } else if (dates[1].length < 10) {
         dates[1] = new Date(`${dates[1]} ${year}`);
      } else {
         dates[1] = new Date("2025-10-11");
         console.log(dates[1]);
      }

      return dates;
   }

   function parseSite(str, allSites) {
      let sites = [];
      let eSites = [];
         // check if there is a slash indicating multiple sites
      if (str.includes("/")) {
            // check if Boys / Girls is indicated
         if (/\bB\b.*?\/.*?\bG\b/.test(str)) {
               // split at the slash
            let parts = str.split('/');
            parts.forEach(part => {
                  // get gender. B(oys) = 1, G(irls) = 2, neither = 3, but that shouldn't happen here
               let gender = 3;
               if (/\bB\b/.test(part)) {
                  gender = 1;
               } else if (/\bG\b/.test(part)) {
                  gender = 2;
               }
                  // clean the string. remove 'B' or 'G' and trim()
                   // use regex to ensure B and G are bounded, not part of a word
               part = part.replace(/\b[BG]\b/g, '').trim();
               sites.push(strToSite(part));
               eSites.push(new EventSite( { site: strToSite(part), gender } ));
            });
         } else {
               // if not B / G, remove the second site, just log the first
            str = str.split('/')[0];
            sites.push(strToSite(str));
         }
            // if there is no slash
      } else {
         sites.push(strToSite(str));
      }

      if (sites.length === 1) eSites.push(new EventSite( { site: sites[0], gender: null } ))

      // console.log(eSites);
      return eSites;


      function strToSite(str) {
         str = str.split(',')[0];
            // use regex to replace all '.' // /g means global, all
         str = str.replace(/\./g, '').trim();

            // special for Rocky Mountain abbreviation
         if (str === "Rocky Mtn") str = "Rocky Mountain HS";
            // if str is a school name missing HS, append HS
         if (allSchools.find(s => s.shortName === str)) str += " HS";


         let site = allSites.find(s => s.name === str);
         if (!site) site = allSites.find(s => s.name === (str + ' HS')) || new Site({ name: str });

         if (!site.id) console.log(site.name);
         return site;
      }
   }

   function parseManager(lineParts, eSites) {
      const str = lineParts.mgrStr;

      if (eSites.length === 1) {
            // if TBD, do no thing
         if (str === null) return;
            // if only one name, assign it
         if (!str.includes("/")) {
            eSites[0].managerName = str;
            return;
         } else {
            // get the correct name
         }
      } else if (eSites.length === 2) {

            // get both names.  // split and trim
         let names = str.split('/').map(p => p.trim());
            // make sure we're matching the sites and the managers order
               // see which eSite was the start of the string
         let testStr = eSites[0].site.name;
         if (testStr.endsWith(" HS")) testStr = testStr.replace(/ HS$/, "");
            // assign accordingly
         if (lineParts.siteStr.startsWith(testStr)) {
            eSites[0].managerName = names[0];
            eSites[1].managerName = names[1];
         } else {
            eSites[0].managerName = names[1];
            eSites[1].managerName = names[0];
         }
      }
   }

   function parseDivs(str, eSites, sport) {
      let divs = [];

         // if no divs specified, get it from sport
      if (str === null || str.length === 0) {
         const minDivID = sport.minDiv;
         allDivs.forEach(div => {
            if (div.id >= minDivID && div.id < 98) divs.push(div);
         });
            // if only one div, assign
      } else if (str.length === 2) {
         divs.push(allDivs.find(d => str.startsWith(d.name)));
      } else {
            // if more than one, search the string
         allDivs.forEach(div => {
            if (str.includes(div.name)) divs.push(div);
         });
      }

         // divs are assumed to be the same for each site in a row.  // assign
      eSites.forEach(es => {
         es.esDivisions = divs;
      });
   }
}



   // 
function showAddEvents() {
      // header
   const head = buildElement("h2", { text: "Add events" });

      // year select
   const yearDiv = makeAddEventYearDiv();
   
   const headers = [ 'Event', 'Sites', 'Divisions', 'X' ].map(t => buildElement("th", { text: t }));
   const thead = buildElement("thead", {children: buildElement("tr", { children: headers }) });
   const tbody = buildElement("tbody");
   const table = buildElement("table", { id: 'addEventsTable', children: [ thead, tbody ] });
   addAddEventRow(tbody);

   table.addEventListener("change", addEventFormChangeListener);


      // add row button
   const addIcon = buildIcon('add');
   const addBtn = buildElement("button", { children: [ addIcon, " Event" ], dataset: { control: 'addRow' } });
      // submit button
   const confirmBtn = buildElement("button", { text: "Confirm", styles: { display: 'block' }, 
                                 dataset: { control: 'confirm' } });
   
      // make a wrapper so we don’t pollute the page
   const wrapper = buildElement("div", { children: [ head, yearDiv, table, addBtn, confirmBtn ] });
   wrapper.addEventListener("click", (e) => handleAddEventClick(e.target, tbody));


      // add to page
   modal.open(wrapper, "wide");
}

function handleAddEventClick(target, tbody) {
   target = target.closest('button');
   if (!target) return;

   switch (target.dataset.control) {
      case 'addRow':
         addAddEventRow(tbody);
         break;
      case 'removeRow':
         removeAddEventRow(target, tbody);
         break;
      case 'confirm':
         summarizeAddEventsInputs(tbody);
   }
}

function addAddEventRow(tbody) {
   let year = document.getElementById('eventYearSelect')?.value;
   if (!year) year = document.getElementById('selectYear').value;

   const today = new Date();
   const dateObj = new Date(2000 + Number(year), today.getMonth(), today.getDate());
   const date = formatDateInput(dateObj);

   const eDiv = buildElement("div", { classes: [ 'grid', 'gridCols2' ], dataset: { column: 'event' } });
   eDiv.appendChild(buildElement("label", { text: 'Activity: ' }));
   eDiv.appendChild(makeSportSelect());
   eDiv.appendChild(buildElement("label", { text: 'Start: ' }));
   eDiv.appendChild(buildElement("input", { attrs: { type: 'date', value: date }, dataset: { control: 'start' } }));
   eDiv.appendChild(buildElement("label", { text: 'End: ' }));
   eDiv.appendChild(buildElement("input", { attrs: { type: 'date', value: date }, dataset: { control: 'end' } }));
   eDiv.appendChild(buildElement("label", { text: 'Sites: ' }));
   const sitesSelect = makeSiteSelect();
   sitesSelect.multiple = true;
   eDiv.appendChild(sitesSelect);

   const sitesDiv = buildElement("div", { classes: [ 'grid', 'gridCols2' ], dataset: { column: 'sites' } });
   const divisionsDiv = buildElement("div", { dataset: { column: 'divisions' } });
   const closeBtn = buildElement("button", { text: 'x', dataset: { control: 'removeRow' } });


   const eventTD = buildElement("td", { children: eDiv });
   const sitesTD = buildElement("td", { children: sitesDiv });
   const divisionsTD = buildElement("td", { children: divisionsDiv });
   const closeTD = buildElement("td", { children: closeBtn });

   const tr = buildElement("tr", { children: [ eventTD, sitesTD, divisionsTD, closeTD ], classes: [ 'addEventRow' ] });

   tbody.appendChild(tr);
}

function removeAddEventRow(target, tbody) {
      // don't remove the last remaining row. do no thing
   if (tbody.rows.length < 2) return;

   target.closest('tr').remove();
}

function makeAddEventYearDiv() {
   const year = new Date().getFullYear() % 100;
   const maxYear = year + 10;
   const minYear = 20;

   const yearSelect = buildElement("select", { id: 'eventYearSelect' });
   for (let i = minYear; i <= maxYear; ++i) {
      yearSelect.appendChild(buildElement("option", { text: `${i}-${i+1}`, attrs: { value: i } }));
   }

      // select the currently viewed year to start
   const appYear = document.getElementById('selectYear').value;
   yearSelect.value = appYear;

   return buildElement("div", { children: [ "For the year: ", yearSelect ] });
}

function makeSportSelect() {
   const allSports = runtime.allSports.getSync();

   const newSlct = buildElement("select", { dataset: { control: 'sport' } });

      // forEach div
   Object.values(allSports).forEach(sport => {
      const newOptn = buildElement("option", { text: sport.name, attrs: { value: sport .id } });
      newSlct.appendChild(newOptn);
   });
  
   return newSlct;
}

function addEventFormChangeListener(e) {
   const target = e.target;
   const row = e.target.closest(".addEventRow");
   if (!row) return

   switch (target.dataset.control) {
      case 'sites':
         updateSites(target, row);
         break;
      case 'divisions':
         updateDivisions(target, row);
         break;
      case 'start': 
         row.querySelector('[data-control="end"]').value = target.value;
         break;
   }
}

function updateSites(target, row) {
   const sitesDiv = row.querySelector('[data-column="sites"]');
   const divisionsDiv = row.querySelector('[data-column="divisions"]');
   const selectedIDs = new Set([...target.selectedOptions].map(o => o.value));

      // remove sites no longer selected
   for (const siteRow of sitesDiv.querySelectorAll('[data-site-i-d]')) {
      if (!selectedIDs.has(siteRow.dataset.siteID)) siteRow.remove();
   }
      // like wise, remove any matching elements from the divisions column
   for (const divRow of divisionsDiv.querySelectorAll('[data-site-i-d]')) {
      if (!selectedIDs.has(divRow.dataset.siteID)) divRow.remove();
   }

      // add new sites
   for (const id of selectedIDs) {
      if (sitesDiv.querySelector(`[data-site-i-d="${id}"]`)) continue;

      const site = runtime.allSites.getByID(id);
      const siteLabel = buildElement("label", { text: site.name });
      const divSelect = makeDivSelect();
      divSelect.dataset.siteID = id;
      divSelect.size = 1;

      const siteRow = buildElement("div", { dataset: { siteID: id }, children: [ siteLabel, divSelect ], 
                                    classes: 'contents' });
      sitesDiv.appendChild(siteRow);

         // create the label in the divisions column, so they stay matched. initialize with a nonbreaking space
      const divLabel = buildElement("label", { text: "\u00A0", dataset: { siteID: id } });
      divLabel.style.display = 'block';
      divLabel.style.marginBottom = '1rem';
      divisionsDiv.appendChild(divLabel);
   }
}

function updateDivisions(target, row) {
   const divisionsDiv = row.querySelector('[data-column="divisions"]');
   const selectedIDs = [...target.selectedOptions].map(o => o.value);
   const siteID = target.dataset.siteID;

      // get the matching element
   let label = divisionsDiv.querySelector(`[data-site-i-d="${siteID}"]`);

   const divisions = selectedIDs.map(id => runtime.allDivisions.getByID(id).name);
   const divString = divisions.join(', ');

   label.textContent = divString || "\u00A0";
}



function summarizeAddEventsInputs(tbody) {
   const addEvents = [];

   const rows = Array.from(tbody.rows);

   for (const row of rows) {
         // get the controls for more readable access
      const controlNodes = row.querySelectorAll('[data-control]');
         // .map here creates an array of [controlName, control] pairs. // Object.fromEntries() consumes these arrays
      const controls = Object.fromEntries(
         [...controlNodes].map(control => [control.dataset.control, control])
      );

         // get the sites control's selections, then get the values of those selections
      const siteSelectionsArr = [...(controls.sites?.selectedOptions ?? [])];
      const siteIDs = siteSelectionsArr.map(option => Number(option.value));
         // store the sites with their divisions
      const sites = [];
      for (const sID of siteIDs) {
            // get the divisions control for this site
         const siteDivControl = row.querySelector(`[data-control="divisions"][data-site-i-d="${sID}"]`);
            // make the selections an array, or an empty array if no selections were made
         const divArr = [...siteDivControl?.selectedOptions ?? []];
            // extract the ids
         const divIDs = divArr.map(option => Number(option.value));
         sites.push({ siteID: sID, divIDs });
      }

         // push an Event. // sites will already hold it's divisions data
      addEvents.push({ 
         sportID: Number(controls.sport.value),
         start: controls.start.value,
         end: controls.end.value,
         sites
      });
   }
   
   showConfirmAddEvents(addEvents);
}

function showConfirmAddEvents(addEvents) {
   const h3 = buildElement("h3", { text: "Does this look right?" });

   const eventDivs = [];
   for (const e of addEvents) {
      const startDate = parseInputDate(e.start);
      const endDate = parseInputDate(e.start);
      
      const h4 = buildElement("h4", { text: runtime.allSports.getByID(e.sportID).name });
      const dateP = buildElement("p", { text: getDateRangeString(startDate, endDate) });

      const spans = [];
      for (const site of e.sites) {
         const siteName = runtime.allSites.getByID(site.siteID).name;

         const divisions = [];
         for (const id of site.divIDs) {
            divisions.push(runtime.allDivisions.getByID(id));
         }

         spans.push(buildElement("span", { text: siteName }));
         spans.push(buildElement("span", { text: getDivisionsString(divisions) }));
      }

      const sitesDiv = buildElement("div", { children: spans, classes: [ 'grid', 'gridCols2' ] });

      eventDivs.push(buildElement("div", { children: [ h4, dateP, sitesDiv ] }));
   }

   const eventsContainer = buildElement("div", { children: eventDivs });

   const submitBtn = buildElement("button", { text: "Submit", styles: { display: 'block' }, });
   submitBtn.addEventListener('click', () => submitAddEvents(addEvents));

   const wrapper = buildElement("div", { children: [ h3, eventsContainer, submitBtn ] });
   childModal.open(wrapper);
}

async function submitAddEvents(addEvents) {
   console.log(addEvents);
   const data = { addEvents };
   const response = await actionFetch('addEvents', 'Event', data);

   if (response.success) {

   }
}


   // 
async function showSeasonStock() {
   const allSeasons = Object.values(await runtime.allSeasons.load());
   await runtime.allItems.load();

   const season = Season.getNextSeason(allSeasons);
   if (!season) {
      modal.open('No next season found.');
      return;
   }

   const dateRange = getNextSeasonDateRange(season);
   const response = await actionFetch('getStockByDateRange', 'Event', dateRange);
   if (!response?.success) return;

   printSeasonStockPDF(season, dateRange, response.data);
}

function getNextSeasonDateRange(season) {
   const now = new Date();
   const currentYear = now.getFullYear();
   const today = ((now.getMonth() + 1) * 100) + now.getDate();
   const start = (season.startMonth * 100) + season.startDay;
   const crossesYear = start > ((season.endMonth * 100) + season.endDay);

   const startYear = start > today ? currentYear : currentYear + 1;
   const endYear = crossesYear ? startYear + 1 : startYear;

   return {
      start: `${startYear}-${String(season.startMonth).padStart(2, '0')}-${String(season.startDay).padStart(2, '0')}`,
      end: `${endYear}-${String(season.endMonth).padStart(2, '0')}-${String(season.endDay).padStart(2, '0')}`
   };
}