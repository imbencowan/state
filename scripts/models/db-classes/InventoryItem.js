import { Item } from './Item.js';
import { Cost } from './Cost.js';
import { parseWithRegistry } from '../../hydration.js';

export class InventoryItem {
   constructor({ id, eventSiteID, itemID, startQ, endQ, addOrRemoveQ, writeOffQ, sponsorQ, price, cost, item }) {
		this.id = id;
		this.eventSiteID = eventSiteID;
		this.itemID = itemID;
      this.startQ = startQ;
      this.endQ = endQ;
      this.addOrRemoveQ = addOrRemoveQ;
      this.writeOffQ = writeOffQ;
      this.sponsorQ = sponsorQ;
      this.price = price;
      this.cost = cost;
      this.item = parseWithRegistry(item, Item, itemID);   
	}

   static fromValues(id, eventSiteID, itemID, startQ, endQ, addOrRemoveQ, writeOffQ, sponsorQ, price, cost, item) {
      return new InventoryItem({ id, eventSiteID, itemID, startQ, endQ, addOrRemoveQ, writeOffQ, sponsorQ, price, cost, item });
   }

   static fromJSON(json) {
      return new InventoryItem(json);
   }

   getSoldQ() {
      if (this.endQ == null) return 0;

         // start + add/remove - end - writeOff - sponsor = sold
      return this.startQ + this.addOrRemoveQ - this.endQ - this.writeOffQ - this.sponsorQ;
   }

   getSoldDollars() {
      return this.getSoldQ() * this.price;
   }
}
