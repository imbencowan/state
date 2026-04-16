import { myFetch } from '../fetch.js';
import { StateEvent } from './db-classes.js';
import { ActionRequest } from './other-classes.js';

export class EventCollection {
   constructor(events = []) {
      this.events = Array.isArray(events) ? events : [];
   }

   getOrders() {
      let orders = [];

      this.events.forEach(evnt => {
         evnt.eventSites.forEach(eSite => {
            eSite.esDivisions.forEach(esd => {
               orders = orders.concat(esd.schoolOrders);
            });
         });
      });

      return orders;
   }

   getTotalShirts() {
      return this.getOrders().reduce((ttl, ordr) => ttl + ordr.getBoxTotal(), 0);
   }

   getNetDollars() {
      return this.getOrders().reduce((ttl, ordr) => ttl + Number(ordr.due || 0), 0);
   }

   static async fetchDateRange(start, end) {
      const request = new ActionRequest('fetchDateRange', 'Event', { start, end });
      const responseJSON = await myFetch(request);
      if (!responseJSON?.success || !Array.isArray(responseJSON.data)) return new EventCollection();

      const evnts = responseJSON.data.map(evnt => StateEvent.fromJSON(evnt));
      return new EventCollection(evnts);
   }
}
