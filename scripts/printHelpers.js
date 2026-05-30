   // self explanatory, separate layer to avoid import issues else where
import { runtime } from './runtime.js';
import { Transfer } from './models/db-classes.js';



export function getTransferDisplayName(t) {
      // if runtime.stateEvent exists, properly name 'sub events'
   if (t.transferName === 'sub events' && runtime.stateEvent) {
      return `${runtime.stateEvent.sport.name} events`;
   } else {
      return t.transferName
   }
}

export function getTransferInvoiceName(t) {
   return "McUs add on transfers - " + getTransferDisplayName(t);
}