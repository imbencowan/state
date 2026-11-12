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


}
