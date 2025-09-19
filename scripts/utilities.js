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
export function mapObjsByID(objs) {
   const result = {};
   for (let i = 0; i < objs.length; i++) {
      const obj = objs[i];
      result[obj.id] = obj;
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

// function hasItems(arr) {
//    return (Array.isArray(arr) && arr.length > 0);
// }

// window.addEventListener('resize', () => {
//   distributeElementsToRows('#yourNavId');
// });

// // Call on initial load too
// distributeElementsToRows('#yourNavId');
