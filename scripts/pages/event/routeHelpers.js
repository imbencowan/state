export function parseEventRoute(parts) {
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
   
      // if year was missing, assign a default
   if (!year) year = document.getElementById('selectYear').value;

   //    // double check them just cuz
   // if (!isEventYear(year) || !isEventTab(tab)) {
   //    valid = false;
   // }
   

      // coerce year in case it's a string
   year = Number(year);

   return { valid, year, tab };
}

export function isEventTab(x) {
   const tabs = ['orders', 'inventory', 'results'];
   return tabs.includes(x);
}

export function isEventYear(y) {
   return /^\d{2}$/.test(String(y));
}