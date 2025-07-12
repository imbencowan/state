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