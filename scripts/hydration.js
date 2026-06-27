import { parseToInstance } from "./utilities.js";

   // 
export function parseWithRegistry(value, ClassRef, id) {
   value = parseToInstance(value, ClassRef);

   if (!value && id && ClassRef.registry){
      value = ClassRef.registry.getByID(id);
   }

   return value;
}