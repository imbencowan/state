import { Style } from './Style.js';
import { Size } from './Size.js';
import { Color } from './Color.js';
import { Brand } from './Brand.js';
import { Cost } from './Cost.js';
import * as Utils from '../../utilities.js';

export class Item {
   static registry = null;

   constructor({ id, price, cost, stock, caseQ, inventoryMin, inventoryStep, color, size, style, alu = null }) {
      this.id = id;
      this.alu = alu;
      this.price = price;
      this.cost = cost;
      this.stock = stock;
      this.caseQ = caseQ;
      this.inventoryMin = inventoryMin;
      this.inventoryStep = inventoryStep;
      this.color = Utils.parseToInstance(color, Color);
      this.size = Utils.parseToInstance(size, Size);
      this.style = Utils.parseToInstance(style, Style);
   }

   static fromValues(id, price, cost, stock, caseQ, inventoryMin, inventoryStep, color, size, style, alu = null) {
      return new Item({ id, price, cost, stock, caseQ, inventoryMin, inventoryStep, color, size, style, alu });
   }

   static fromJSON(json) {
      return new Item(json);
   }

   getInternalName() {
      return `${this.style.vShortName} - ${this.color.name} - ${this.size.charName}`;
   }
	
	getInvoiceName() {
		return `${this.style.brand.shortName} ${this.style.vShortName} - ${this.color.name} - ${this.size.name}`;
	}
}
