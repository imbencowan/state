////////////////////////////////////////////////////////////////////////////////
// js functions for the event page
import { runtime } from '../runtime.js';
import { myFetch } from '../fetch.js';
import { ActionRequest } from '../models/other-classes.js';
import { arraysEqualIgnoreOrder, buildElement } from '../utilities.js';
import { openModal } from '../modal.js';
import { EventSite, Season, Site } from '../models/db-classes.js';
import { showPage } from './page-handling.js';
import { printSeasonStockPDF } from '../print.js';


export async function goToYearPage() {
   const data = { year: document.getElementById('selectYear').value };

   await showPage('showYear', 'Year', data);
   await runtime.allSeasons.load();

   addShowYearFunctionality();
}

export function addShowYearFunctionality() {
   const container = document.getElementById('yearContainer');

      // click listener will only activate for elements with a data-action
   container.addEventListener('click', function(event) {
         // get the button
		const btn = event.target.closest('[data-action]');
      if (!btn) return; // clicked somewhere irrelevant

         // define click actions. 'selector': function()
      const actions = {
         'editRow': () => { if (!runtime.activeMode) showRowEdit(btn); },
         'cancelRowEdit': () => cancelRowEdit(btn),
         'submitRowEdit': () => submitRowEdit(btn),
         'addYear': () => showAddYear(),
         'getSeasonStock': () => showSeasonStock()
      };

      for (const slct in actions) {
         if (btn.dataset.action == slct) {
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
               // put edit divisions on hold because it doesn't work with BasicTableModel's current update methods
                  // and i'm not sure i want to be able to edit divisions any way.
                     // if you remove a division from a site, what happens? it's outside the scope of update
                        // needs a custom function
            // input = await makeDvsnSlct(td);
            break;
         case "manager":
            input = document.createElement('input');
            input.type = 'text';
            input.placeholder = td.dataset.oValue;
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

      if(input) {
         td.textContent = "";
         td.appendChild(input);
      }
   }
   console.log(row);

      // give focus to the first select
   row.querySelector('select')?.focus();
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
      // omitted. editing divisions in row is currently prevented
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

   // make a select for employees
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
         if (slct) {
            const names = Array.from(slct.selectedOptions).map(opt => opt.textContent);
            td.textContent = names.join(', ');
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
   openModal(wrapper);
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
   
   const request = new ActionRequest('submitYear', 'Year', { events: newEvents });
	const responseJSON = await myFetch(request);

   

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
function showAddEvent() {
      // header
   const head = buildElement("h2", { text: "Add an event" });

      // we need to replace this with a select for sports, a start date, and an end date
      // textarea
   // const textarea = document.createElement("textarea");
   // textarea.rows = 10;
   // textarea.cols = 50;
   // textarea.placeholder = "Paste PDF text here...";

      // submit button
   const submitBtn = document.createElement("button");
   submitBtn.textContent = "Submit";
   submitBtn.style.display = "block";
   submitBtn.style.marginTop = "0.5em";

      // make a wrapper so we don’t pollute the page
   const wrapper = buildElement("div", { children: [ head, submitBtn ] });

      // wire the button
   submitBtn.addEventListener("click", () => {
      const txt = textarea.value.trim();
      if (txt) {
         parseYear(txt);
      }
   });

      // add to page
   openModal(wrapper);
   textarea.focus();
}


   // 
async function showSeasonStock() {
   const allSeasons = Object.values(await runtime.allSeasons.load());
   await runtime.allItems.load();

   const season = Season.getNextSeason(allSeasons);
   if (!season) {
      openModal('No next season found.');
      return;
   }

   const dateRange = getNextSeasonDateRange(season);
   const request = new ActionRequest('getStockByDateRange', 'Event', dateRange);
   const responseJSON = await myFetch(request);
   if (!responseJSON?.success) return;

   printSeasonStockPDF(season, dateRange, responseJSON.data);
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
