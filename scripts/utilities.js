import { myFetch } from "./fetch.js";
import { ActionRequest } from "./models/other-classes.js";

export function parseToInstancesArr(data, ClassRef) {
        // takes data, and returns an array of object of the class given by ClassRef
            // expects data to be an array of objects, or an object where each property is an object
                // we end up with the latter from associative arrays from php
   return Object.values(data || {})
            // .map makes the array from the data
      .map(item => (item instanceof ClassRef) 
                // if (item instanceof ClassRef), put the item in the .mapped array
         ? item 
                // else check if there actually is an item, and if ClassRef has a .fromJSON()
         : (item != null && typeof ClassRef.fromJSON === 'function') 
                    // if that was true, try to make a ClassRef object
            ? ClassRef.fromJSON(item) 
                    // else map null
            : null)
                // filter out nonconforming elements
      .filter(Boolean);
}

export function parseToInstance(value, ClassRef) {
        // returns an instance of ClassRef from value if possible
   return (value instanceof ClassRef) ? 
      value
      : (value != null && typeof ClassRef.fromJSON === 'function')
         ? ClassRef.fromJSON(value)
         : null;
}

export function safeParseDate(input) {
   if (!input || typeof input !== 'string') return null;

   const date = new Date(input.replace(' ', 'T'));
   return isNaN(date.getTime()) ? null : date;
}

    // assumes objs is an array of objects that all have a unique id property
export function mapObjsBy(objs, key = 'id') {
	const result = {};
		// {} in case objs is null, etc
	for (const obj of Object.values(objs || {})) {
		result[obj[key]] = obj;
	}
	return result;
}


export function distributeElementsToRows(containerSelector, minItemWidth = 100) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const itemCount = container.children.length;
    if (itemCount === 0) return;

    // Get container width in pixels
    const containerWidth = container.clientWidth;

    // Calculate max columns that fit by minItemWidth
    let columnsByWidth = Math.floor(containerWidth / minItemWidth);
    columnsByWidth = Math.min(columnsByWidth, itemCount); // can't have more columns than items
    columnsByWidth = Math.max(columnsByWidth, 1);         // at least 1 column

    // Now find the divisor of itemCount closest to columnsByWidth for balanced rows
    let bestColumns = 1;
    let bestDiff = Infinity;

    for (let c = 1; c <= columnsByWidth; c++) {
        let diff = Math.abs(itemCount / c - Math.round(itemCount / c));
        if (diff < bestDiff) {
        bestDiff = diff;
        bestColumns = c;
        }
    }

    container.style.display = 'grid';
    container.style.gridTemplateColumns = `repeat(${bestColumns}, 1fr)`;
    container.style.gap = '10px';
}


   // makes an object with methods to access the database
      // intended for use with the runtime object
export function makeDataLoader(srvrClassName, jsClass = null, srvrFnctn = "getAllFromDB") {
   let cache = null;          // resolved data
   let loadPromise = null;    // promise for first-time load

      // private helper to fetch and map data
   async function fetchAndMap() {
      const req = new ActionRequest(srvrFnctn, srvrClassName);
      const res = await myFetch(req);
      const raw = res.data || {};
      let mapped = mapObjsBy(raw); // { id1: obj1, id2: obj2, ... }

      if (jsClass) {
         for (const key in mapped) {
            mapped[key] = new jsClass(mapped[key]);
         }
      }

      return mapped;
   }

   return {
         // async load: fetch once, reuse promise if already loading
      async load() {
         if (!cache && !loadPromise) {
            loadPromise = fetchAndMap().then(data => {
               cache = data;       // store resolved data for sync access
               return cache;
            });
         }
         return loadPromise;
      },

         // always fetch fresh and update cache
      async refresh() {
         loadPromise = fetchAndMap().then(data => {
            cache = data;
            return cache;
         });
         return loadPromise;
      },

         // synchronous access to resolved data
      getSync() {
         if (!cache) throw new Error("Data not loaded yet");
         return cache;
      },

         // clear everything
      clear() {
         cache = null;
         loadPromise = null;
      }
   };
}



   // compares arrays' elements, disregarding order
      // returns true/false
export function arraysEqualIgnoreOrder(a, b) {
   if (!Array.isArray(a) || !Array.isArray(b)) return false;
   if (a.length !== b.length) return false;

      // reorder the arrays identically
   const sortedA = [...a].sort();
   const sortedB = [...b].sort();

      // checks if every val of sortedA === sortedB at the same idx, using the built in Array.every()
   return sortedA.every((val, idx) => val === sortedB[idx]);
}


export function appndSbmtCnclBtns(prnt, actn) {
   const btnDiv = document.createElement('div');

	const submitButton = document.createElement('button');
	submitButton.type = 'button';
	submitButton.textContent = 'Submit';
   submitButton.dataset.action = 'submit' + actn;
	btnDiv.appendChild(submitButton);
	
	const cancelButton = document.createElement('button');
	cancelButton.type = 'button';
	cancelButton.textContent = 'X';
   cancelButton.dataset.action = 'cancel' + actn;
	btnDiv.appendChild(cancelButton);

   	// add event listeners for ESC and ENTER
   if (prnt) {
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

      prnt.addEventListener('keydown', keyHandler);

      // define a cleanup helper
      function cleanup() {
         prnt.removeEventListener('keydown', keyHandler);
      }

      prnt.appendChild(btnDiv);
   }
}





// function hasItems(arr) {
//    return (Array.isArray(arr) && arr.length > 0);
// }
