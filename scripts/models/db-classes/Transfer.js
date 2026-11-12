import { Cost } from './Cost.js';

export class Transfer {
   constructor({ id, transferName, inventoryName, price, cost, listOrder, invoiceName = null }) {
      this.id = id;
      this.name = transferName;
      this.transferName = transferName;
      this.inventoryName = inventoryName ?? transferName;
      this.invoiceName = invoiceName;
      this.price = price;
      this.cost = cost;
      this.listOrder = listOrder;
   }

   static fromValues(id, transferName, inventoryName, price, cost, listOrder, invoiceName = null) {
      return new Transfer({ id, transferName, inventoryName, price, cost, listOrder, invoiceName });
   }

   static fromJSON(json) {
      return new Transfer(json);
   }
}
