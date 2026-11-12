import { Item } from './Item.js';
import { Cost } from './Cost.js';
import { parseWithRegistry } from '../../hydration.js';

export class SOrderItem {
   constructor({ id, schoolOrderID, itemID, quantity, price, cost, item }) {
      this.id = id;
      this.schoolOrderID = schoolOrderID;
      this.itemID = itemID;
      this.quantity = quantity;
      this.price = price;
      this.cost = cost;
      this.item = parseWithRegistry(item, Item, itemID);
   }

   static fromValues(id, schoolOrderID, itemID, quantity, price, cost, item) {
      return new SOrderItem({ id, schoolOrderID, itemID, quantity, price, cost, item });
   }

   static fromJSON(json) {
      return new SOrderItem(json);
   }

   getSoldDollars() {
      return this.quantity * this.price;
   }
}
