import { makeDataLoader } from "../utilities.js";
import { Item } from "../models/db-classes.js";


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


// export function makeSizeLoader() {
//       // start with our basic loader. // gives methods for accessing all Items from the db
//    const loader = makeDataLoader('Item', Item);

// }