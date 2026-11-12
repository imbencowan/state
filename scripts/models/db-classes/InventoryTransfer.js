import { Transfer } from './Transfer.js';
import { Cost } from './Cost.js';
import * as Utils from '../../utilities.js';

export class InventoryTransfer {
   static registry = null;

   constructor({ id, eventSiteID, transferID, startQ, soldQ, price, cost, transfer }) {
      this.id = id;
      this.eventSiteID = eventSiteID;
      this.transferID = transferID;
      this.startQ = startQ;
      this.soldQ = soldQ;
      this.price = price;
      this.cost = cost;
      this.transfer = Utils.parseToInstance(transfer, Transfer);
   }

   static fromValues(id, eventSiteID, transferID, startQ, soldQ, price, cost, transfer) {
      return new InventoryTransfer({ id, eventSiteID, transferID, startQ, soldQ, price, cost, transfer });
   }

   static fromJSON(json) {
      return new InventoryTransfer(json);
   }

   static fromTransfer({ t, eventSiteID = null, startQ = 0, soldQ = 0 }) {
      return new InventoryTransfer({
         id: null,
         eventSiteID,
         transferID: t.id,
         startQ,
         soldQ,
         price: t.price,
         cost: t.cost,
         transfer: t
      });
   }

   toDB() {
      return {
         eventSiteTransferID: this.id,
         eventSiteID: this.eventSiteID,
         transferID: this.transferID,
         startQ: this.startQ,
         soldQ: this.soldQ,
         price: this.price,
         mcuCost: this.cost
      };
   }

   getSoldDollars() {
      return this.soldQ * this.price;
   }
}
