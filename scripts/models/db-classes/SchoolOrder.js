import { School } from './School.js';
import { SOrderTransfer } from './SOrderTransfer.js';
import { SOrderItem } from './SOrderItem.js';
import * as Utils from '../../utilities.js';
import { parseWithRegistry } from '../../hydration.js';
import { ADULT_HOOD_STYLE_ID, DAIRY_STYLE_ID, DAIRY_COLOR_ID } from '../../constants.js';

export class SchoolOrder {
   constructor({ id, eshdID, schoolID, school, genderID, qualifiers = 0, completeness = 0, due = null, 
               paid = null, schoolOrderNote = null, invoiceDate = null, invoiceVersion = null, messageOrders = [], 
               oItems = [], oTransfers = [] }) {
      this.id = id;
      this.eshdID = eshdID;
      this.school = parseWithRegistry(school, School, schoolID);
      this.genderID = genderID;
      this.qualifiers = qualifiers;
      this.completeness = completeness;
      this.due = due;
      this.paid = paid;
      this.schoolOrderNote = schoolOrderNote;
      this.invoiceDate = Utils.safeParseDate(invoiceDate);
      this.invoiceVersion = invoiceVersion;
      this.messageOrders = Array.isArray(messageOrders) ? messageOrders : [];
      this.oItems = Utils.parseToInstancesArr(oItems, SOrderItem);
      this.oTransfers = Utils.parseToInstancesArr(oTransfers, SOrderTransfer);
   }


	updateFromJSON(json) {
		this.id = json.id;
		this.eshdID = json.eshdID;
		this.school = json.school instanceof School
			? json.school
			: json.school != null
				? new School(json.school)
				: null;
		this.completeness = json.completeness;
		this.due = json.due;
		this.paid = json.paid;
		this.schoolOrderNote = json.schoolOrderNote;
      this.invoiceDate = Utils.safeParseDate(json.invoiceDate);
      this.invoiceVersion = json.invoiceVersion;
		this.messageOrders = Array.isArray(json.messageOrders) ? json.messageOrders : [];
      this.oItems = Utils.parseToInstancesArr(json.oItems, SOrderItem);
      this.oTransfers = Utils.parseToInstancesArr(json.oTransfers, SOrderTransfer);
	}

   getES(sEvent) {
      const esd = this.getESD(sEvent);
      return sEvent.getEventSiteByID(esd.eventSiteID);
   }

   getESD(sEvent) {
      return sEvent.getESDivisionByID(this.eshdID);
   }

   getSOItemsByStyleByColor() {
      const styles = {};

      for (const soi of this.oItems) {
         const styleID = soi.item.style.id;
         const colorID = soi.item.color.id;

            // initialize style/color containers if they don't exist (??=)
         styles[styleID] ??= { style: soi.item.style, colors: {} };
         styles[styleID].colors[colorID] ??= { color: soi.item.color, sizeMap: {} };

            // push the sOrder item
         styles[styleID].colors[colorID].sizeMap[soi.item.size.displayChar] = soi;
      }

      return styles;
   }
	
	getBoxTotal() {
		let boxTotal = 0;
		this.oItems.forEach(soi => {
         boxTotal += soi.quantity;
		});
		return boxTotal;
	}

   getTotalTransfers() {
      let total = 0;
      this.oTransfers.forEach(t => {
         total += t.quantity;
      });

      return total;
   }
	
      // does the order have added shirts or transfers?
	hasAddOns() {
		return (this.hasAddedShirts() || this.hasAddedTransfers());
	}

   hasAddedShirts() {
      return this.oItems.some(soi => soi.item.style.id !== DAIRY_STYLE_ID);
   }

   hasAddedTransfers() {
      return (this.oTransfers.length > 0)
   }
	
	getTeamStyle() {
         // there is no console.log on line 809 any more  
      return Object.values(this.getSOItemsByStyleByColor())
            .find(({ style }) => style.id === DAIRY_STYLE_ID);
	}

      // returns total number of participant hoods ordered
   getDairyTotal() {
      let dTotal = 0;

         // find the dairy hoods. if there are any, sum them. // dairy hoods style.id === 9
      const dStyle = this.getTeamStyle();
      const dHoods = dStyle?.colors[DAIRY_COLOR_ID];

      if (dHoods) {
         for (const s of Object.values(dHoods.sizeMap)) {
            dTotal += s.quantity;
         }
      }

      return dTotal;
   }
	
	getAddedStyles() {
         // omit the dairy hoods
      const styles = Object.values(this.getSOItemsByStyleByColor())
            .filter(({ style }) => style.id !== DAIRY_STYLE_ID);
      // console.log(styles)

         // put adult hoods first in the list
      styles.sort((a, b) => {
         if (a.id ===  ADULT_HOOD_STYLE_ID) return -1;
         if (b.id ===  ADULT_HOOD_STYLE_ID) return 1;
         return 0;
      });

      return styles;
	}
	
	getMinSize() {
		let min = Infinity;
		this.oItems.forEach(soi => {
         if (soi.item.size.id < 9) {
            if (soi.item.size.id < min) min = soi.item.size.id;
         }
		});
		return min;
	}
	
	getMaxSize() {
		let max = 0;
		this.oItems.forEach(soi => {
         if (soi.item.size.id < 9) {
            if (soi.item.size.id > max) max = soi.item.size.id;
         }
		});
		return max;
	}

      // returns a bool for whether more shirts have been ordered than qualifiers
   isOver() {
      let over = false;
         // check if qualifiers has a value, and if dairyTotal exceeds it
      if ((this.qualifiers > 0) && (this.getDairyTotal() > this.qualifiers)) over = true;

      return over;
   }

   getMessageFileNames() {
         // if no message orders return ''
      if (!this.messageOrders || this.messageOrders.length === 0) return '';
         // else, string them with commas
      return this.messageOrders.map(mo => mo.fileName).join(', ');
   }

   getPreorderDollars() {
      const itemTotal = this.oItems.reduce((total, soi) => total + (soi.getSoldDollars()), 0);
      const transferTotal = this.oTransfers.reduce((total, sot) => total + (sot.getSoldDollars()), 0);

      return itemTotal + transferTotal;
      // return itemTotal;
   }
}
