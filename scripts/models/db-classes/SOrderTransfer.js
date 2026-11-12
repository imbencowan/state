import { Transfer } from './Transfer.js';
import { Cost } from './Cost.js';
import * as Utils from '../../utilities.js';

export class SOrderTransfer {
   constructor({ id, schoolOrderID, transferID, quantity, price, cost, transfer }) {
      this.id = id;
      this.schoolOrderID = schoolOrderID;
      this.transferID = transferID;
      this.quantity = quantity;
      this.price = price;
      this.cost = cost;
      this.transfer = Utils.parseToInstance(transfer, Transfer);
   }

   static fromValues(id, schoolOrderID, transferID, quantity, price, cost, transfer) {
      return new SOrderTransfer({ id, schoolOrderID, transferID, quantity, price, cost, transfer });
   }

   static fromJSON(json) {
      return new SOrderTransfer(json);
   }

   getSoldDollars() {
      return this.quantity * this.price;
   }
}
