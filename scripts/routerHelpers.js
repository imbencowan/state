import { config } from "./config.js";

export function splitPath(path = location.pathname.replace(config.appRoot, '')) {
      // make an array, splitting the path at '/'s. // remove falsy parts. // trim()
   return path.split('/').filter(Boolean).map(p => p.trim());
}


   // use this to maintain a selected year on refresh
      // html won't set the value to an invalid year (nonexistent option) *shrug*
export function setYearSelect(y) {
   document.getElementById('selectYear').value = String(y);
}