import { actionFetch } from "../fetch.js";
import { mapObjsBy } from "../utilities.js";
import { Item, Season, Sport } from "../models/db-classes.js";


   // a specific loader for Items that gives a getByStyleColorSize() method
export function makeItemLoader() {
      // start with our basic loader. // gives methods for accessing all Items from the db
   const loader = makeDataLoader('Item', Item);

      // a cache for a lookup
   let styleColorSizeLookup = null;

      // builds the lookup
   function buildLookup(items) {
      const lookup = {};

      for (const item of Object.values(items)) {
         lookup[item.style.id] ??= {};
         lookup[item.style.id][item.color.id] ??= {};
         lookup[item.style.id][item.color.id][item.size.id] = item;
      }

      return lookup;
   }


      // returns the basic load(), getSync(), getByID(), adds a lookup method, over writes refresh() and clear()
   return {
         // spreads the og methods to the return
      ...loader,

         // over ride to load the lookup on initialization
      async load() {
         const items = await loader.load();
         styleColorSizeLookup = buildLookup(items);
         return items;
      },

         // returns an item given 3 defining ids
      getByStyleColorSize(styleID, colorID, sizeID) {
         return styleColorSizeLookup?.[styleID]?.[colorID]?.[sizeID];
      },

         // returns an array of displayChars for all Sizes for a given style/color combo
      getSizeDisplayCharsByStyleColor(styleID, colorID) {
            // get all sizes for a style/color combo
         const sizes =  styleColorSizeLookup?.[styleID]?.[colorID] ?? {};
            // return the displayChars
         return Object.values(sizes).map(s => s.size.displayChar);
      },

         // returns an array of Sizes for a given style/color combo
      getSizesByStyleColor(styleID, colorID) {
            // get all sizes for a style/color combo
         const itemsByStyleColor = styleColorSizeLookup?.[styleID]?.[colorID] ?? {};
         const itemsbBSCArr = Object.values(itemsByStyleColor);
         return itemsbBSCArr.map(i => i.size);
      },

      async refresh() {
         styleColorSizeLookup = null;
         return loader.refresh();
      },

      clear() {
         styleColorSizeLookup = null;
         loader.clear();
      }
   };
}


export function makeSportLoader() {
      // start with our basic loader. // gives methods for accessing all Items from the db
   const loader = makeDataLoader('Sport', Sport);

      // a cache for a lookup
   let slugLookup = null;

      // build the lookup
   function buildSlugLookup(sports) {
      const lookup = {}

      for (const s of Object.values(sports)) { lookup[s.slug] = s; }

      return lookup;
   }


      // returns the basic load(), getSync(), getByID(), adds a lookup method, over writes refresh() and clear()
   return {
         // spreads the og methods to the return
      ...loader,

         // over ride to load the lookup on initialization
      async load() {
         const sports = await loader.load();
         slugLookup = buildSlugLookup(sports);
         return sports;
      },

      getBySlug(slug) {
         // if (!slugLookup) await this.load();
         return slugLookup?.[slug];
      },

      async refresh() {
         slugLookup = null;
         return loader.refresh();
      },

      clear() {
         slugLookup = null;
         loader.clear();
      }
   };
}

export function makeSeasonLoader() {
      // start with our basic loader. // gives methods for accessing all Seasons from the db
   const loader = makeDataLoader('Season', Season);

      // returns the basic load(), getSync(), getByID(), adds a date comparison method
   return {
      ...loader,

      getByDate(date) {
         return Object.values(loader.getSync()).find(season => season.containsDate(date));
      }
   };
}






   // makes an object with methods to access the database
      // intended for use with the runtime object
export function makeDataLoader(srvrClassName, jsClass = null, srvrFnctn = "getAllFromDB") {
   let cache = null;          // resolved data
   let nameLookup = null;
   let loadPromise = null;    // promise for first-time load

      // private helper to fetch and map data
   async function fetchAndMap() {
      const response = await actionFetch(srvrFnctn, srvrClassName);
      const raw = response.data || {};
      let mapped = mapObjsBy(raw); // { id1: obj1, id2: obj2, ... }

      if (jsClass) {
         for (const key in mapped) {
            mapped[key] = new jsClass(mapped[key]);
         }
      }

      return mapped;
   }

   function buildNameLookup() {
      nameLookup = {};

      for (const obj of Object.values(cache)) {
         if (obj.name) nameLookup[obj.name] = obj;
      }
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
            nameLookup = null;
            return cache;
         });
         return loadPromise;
      },

         // synchronous access to resolved data
      getSync() {
         if (!cache) throw new Error("Data not loaded yet");
         return cache;
      },

      getByID(id) {
         if (!cache) throw new Error("Data not loaded yet");
         return cache[id];
      },

      getByName(name) {
         if (!cache) throw new Error("Data not loaded yet");
         if (!nameLookup) buildNameLookup();

         return nameLookup[name];
      },

         // clear everything
      clear() {
         cache = null;
         loadPromise = null;
      }
   };
}