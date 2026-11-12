import { Size } from './Size.js';
import { Color } from './Color.js';
import { Brand } from './Brand.js';
import * as Utils from '../../utilities.js';

export class Style {
   static registry = null;

   constructor({ id, code, name, inventoryName, shortName, vShortName, brand, sizingCategoryID, 
               minSizeID, maxSizeID, defaultColor, listOrder, sizes = [] }) {
      this.id = id;
      this.code = code;
      this.name = name;
      this.inventoryName = inventoryName,
      this.shortName = shortName;
      this.vShortName = vShortName;
      this.brand = Utils.parseToInstance(brand, Brand);
      this.sizingCategoryID = sizingCategoryID;
      this.minSizeID = minSizeID;
      this.maxSizeID = maxSizeID;
      this.defaultColor = Utils.parseToInstance(defaultColor, Color);
      this.listOrder = listOrder;
      this.sizes = Array.isArray(sizes) ? sizes.map(size => size) : [];

      this.sizeMap = {};
      for (const size of this.sizes) {
         if (size && size.displayChar) {
            this.sizeMap[size.displayChar] = size;
         } else {
            console.log(this.shortName, size);
         }
      }
   }

   static fromValues(id, code, name, inventoryName, shortName, vShortName, brand, sizingCategoryID, minSizeID,
                     maxSizeID, listOrder, sizes = []) {
      return new Style({ id, code, name, inventoryName, shortName, vShortName, brand, sizingCategoryID, minSizeID, 
                     maxSizeID, listOrder, sizes });
   }

   static fromJSON(json) {
      return new Style(json);
   }
	
	getTotalQuantity() {
		if (!this.sizes) return 0;
		let total = 0;
		this.sizes.forEach(size => {
			total += size.quantity;
		});
		return total;
	}
}
