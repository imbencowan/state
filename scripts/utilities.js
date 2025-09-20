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
   return (value instanceof ClassRef)
      ? value
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
export function makeDataLoader(dbClassName, jsClass = null) {
        // cache is held *private* in side the closure
    let cache = null;

        // private helper to fetch and map data
    async function fetchAndMap() {
            // fetch the appropriate data
        const req = new ActionRequest("getAllFromDB", dbClassName);
        const res = await myFetch(req);
            // extract from the response  // empty object if no response data
        const raw = res.data || {};

            // first map by id
        let mapped = mapObjsBy(raw); // produces { id1: obj1, id2: obj2, ... }

            // if a jsClass is specified, turn each property object into an instance
        if (jsClass) {
            for (const o in mapped) {
                mapped[o] = new jsClass(mapped[o]);
            }
        }
        return mapped;
    }

    return {
            // if no cache, fetch
        async load() {
            if (!cache)  cache = await fetchAndMap();
            return cache;
        },

            // fetch, and set cache
        async refresh() {
            cache = await fetchAndMap();
            return cache;
        },

        clear() {
            cache = null;
        }
    };
}



// function hasItems(arr) {
//    return (Array.isArray(arr) && arr.length > 0);
// }
