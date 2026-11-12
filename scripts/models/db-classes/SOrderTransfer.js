import { Transfer } from './Transfer.js';
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


   getSoldDollars() {
      return this.quantity * this.price;
   }
}
