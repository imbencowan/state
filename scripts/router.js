// FUNCTIONS TO HANDLE PAGE NAVIGATION ///////////////////////////////////////////////////////
   // translates urls to js functions to navigate to correct displays //
import { runtime } from "./runtime.js";

import { goToEventPage } from './pages/event.js';
import { goToItemsPage } from "./pages/items.js";
import { goToSchoolsPage } from "./pages/schools.js";
import { goToYearPage } from "./pages/year.js";


   // define valid routes
const routes = [
      // handler in this first one creates an anonymous function to avoid passing (parts, match) as arguments
   { match: parts => (parts.length === 0), handler: () => goToEventPage() },
   { match: parts => (runtime.allSports.getBySlug(parts[0])), handler: handleSport }, 
   { match: parts => (parts[0] === 'items' && parts.length === 1), handler: goToItemsPage },
   { match: parts => (parts[0] === 'schools' && parts.length === 1), handler: goToSchoolsPage },
   { match: parts => (parts[0] === 'year' && parts.length === 1), handler: goToYearPage }
];


export async function router() {
   const path = location.pathname.replace('/state', '');
   const parts = path.split('/').filter(Boolean);
      // we need this to route sports
   await runtime.allSports.load();


   for (const route of routes) {
      const match = route.match(parts);

      if (match) {
         return route.handler(parts, match);
      }
   }

   return showNotFound(path);
}



function handleSport(parts, sport) {
   goToEventPage(sport.id);
}


function showNotFound(path) {
   console.log('not found ', path);
   document.getElementById('display').innerHTML = `
      <div class="error-screen">
         <h1>Not Found</h1>
         <p>No route matches: ${path}</p>
      </div>
   `;
}