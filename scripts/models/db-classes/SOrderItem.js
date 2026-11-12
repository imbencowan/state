import { Item } from './Item.js';
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


   getSoldDollars() {
      return this.quantity * this.price;
   }
}
