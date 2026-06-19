// FUNCTIONS TO HANDLE PAGE NAVIGATION ///////////////////////////////////////////////////////
   // translates urls to js functions to navigate to correct displays //
// import { myFetch } from "./fetch.js";
// import { ActionRequest } from "./models/other-classes.js";
import { runtime } from "./runtime.js";

import { goToEventPage, showEventByDate } from './pages/event.js';
import { goToItemsPage } from "./pages/items.js";
import { goToSchoolsPage } from "./pages/schools.js";
import { goToYearPage } from "./pages/year.js";



export async function router() {
   const path = location.pathname.replace('/state', '');
   const parts = path.split('/').filter(Boolean);


   console.log(path, parts);

      // Home // default to next (or most recent) Event with no date argument
   if (parts.length === 0) {
      showEventByDate();
      return;
   }

      // check if we're navigating to a sport
   await runtime.allSports.load();
   const sport = runtime.allSports.getBySlug(parts[0]);

   if (sport) {
      goToEventPage(sport.id);
      return;
   }


      // other bits. // items, schools, year,
   switch (parts[0]) {
      case '':
      case 'home':
         return showEventByDate();

      case 'items':
         return goToItemsPage();

      case 'schools':
         return goToSchoolsPage();

      case 'year':
         return goToYearPage();

      default:
         return showNotFound(path);
   }
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