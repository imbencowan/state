// FUNCTIONS TO HANDLE PAGE NAVIGATION ///////////////////////////////////////////////////////
   // translates urls to js functions to navigate to correct displays //
import { runtime } from "./runtime.js";

import { goToEventPage } from './pages/event/eventMain.js';
import { goToItemsPage } from "./pages/items.js";
import { goToSchoolsPage } from "./pages/schools.js";
import { goToYearPage } from "./pages/year.js";


   // define valid routes
      // home, sports, items, schools, year
const routes = [
      // handler in this first one creates an anonymous function to avoid passing (parts, match) as arguments
   { match: parts => (parts.length === 0), handler: () => goToEventPage() },
   { match: parts => (runtime.allSports.getBySlug(parts[0])), handler: handleSport }, 
   { match: parts => (parts[0] === 'items' && parts.length === 1), handler: goToItemsPage },
   { match: parts => (parts[0] === 'schools' && parts.length === 1), handler: goToSchoolsPage },
   { match: parts => (parts[0] === 'year'), handler: handleYear }
];


export async function router() {
   const path = location.pathname.replace('/state', '');
      // make an array, splitting the path at '/'s. // remove falsy parts. // trim()
   const parts = path.split('/').filter(Boolean).map(p => p.trim());;
      // we need this to route sports
   await runtime.allSports.load();

   for (const route of routes) {
      const match = route.match(parts);

      if (match) {
         return route.handler(parts, match, path);
      }
   }

   return showNotFound(path);
}


   /////////////////////////////////////////////////////////////////////////////////////
function handleYear(parts, path) {
   const parsed = parseYearParts(parts);

   if (parsed.valid) {
      history.replaceState(null, "", `/state/${parts[0]}/${parsed.year}`);
      setYearSelect(parsed.year);
      goToYearPage(parsed.year);
   } else {
      showNotFound(path);
   }
}

function parseYearParts(parts) {
   let valid = true;
   let year;

      // check if it's too long. // only allow '/year/##', no more
   if (parts.length > 2) {
      valid = false;
   } else if (parts.length == 2) {
      year = parts[1];
      if(!isEventYear(year)) {
         valid = false;
      }
   } else {
      year = document.getElementById('selectYear').value;
   }

   year = Number(year);

   return { valid, year };
}


   ////////////////////////////////////////////////////////////////////////////////////
   // state/sport/ handling
function handleSport(parts, sport, path) {
      // lower case to normalize tabs. 'ORDERS' would become 'orders', etc
   parts = parts.map(p => p.toLowerCase());

   const parsed = parseEventRoute(parts);

      // if it's a valid path, fetch a page. // if not, 404
   if (parsed.valid) {
      const revisedPath = `state/${parts[0]}/${parsed.year}/${parsed.tab}`;
      history.replaceState(null, "", `/${revisedPath}`);

      setYearSelect(parsed.year);

      goToEventPage(sport.id, parsed.year, parsed.tab);
   } else {
      showNotFound(path);
   }
}

function parseEventRoute(parts) {
   let valid = true;
   let year, tab;

      // check if it's too long first
   if (parts.length > 3) {
      valid = false;
   } else if (parts.length > 1) {
         // if there were 3 parts, assume /sport/year/tab
      if (parts.length === 3) {
         year = parts[1];
         tab = parts[2];
         if (!isEventYear(year) || !isEventTab(tab)) {
            valid = false;
         }
      } else {
            // if there were two parts, check if the second is a year or a tab
         if (isEventTab(parts[1])) {
            tab = parts[1];
         } else if (isEventYear(parts[1])) {
            year = parts[1];
         } else {
            valid = false;
         }
      }
   } 
   
      // if a part was missing, assign a default
   if (!year) year = document.getElementById('selectYear').value;
   if (!tab) tab = 'orders';

   //    // double check them just cuz
   // if (!isEventYear(year) || !isEventTab(tab)) {
   //    valid = false;
   // }
   

      // coerce year in case it's a string
   year = Number(year);

   return { valid, year, tab };
}

function isEventTab(x) {
   const tabs = ['orders', 'inventory', 'reports'];
   return tabs.includes(x);
}

function isEventYear(y) {
   return /^\d{2}$/.test(String(y));
}

   // use this to maintain a selected year on refresh
      // html won't set the value to an invalid year (nonexistent option) *shrug*
function setYearSelect(y) {
   document.getElementById('selectYear').value = String(y);
}


   ////////////////////////////////////////////////////////////////////////////////////
function showNotFound(path) {
   console.log('not found ', path);
   document.getElementById('display').innerHTML = `
      <div class="error-screen">
         <h1>Not Found</h1>
         <p>No route matches: ${path}</p>
      </div>
   `;
}