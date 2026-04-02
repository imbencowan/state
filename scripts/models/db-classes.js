//////////////////////////////////////////////////////////////
// db classes
// these represent data from the db
//////////////////////////////////////////////////////////////

   // import helper functions
import * as Utils from '../utilities.js';
import { sizeList, ADULT_HOOD_STYLE_ID } from '../constants.js';
import { ActionRequest } from "./other-classes.js";
import { myFetch } from '../fetch.js';
// do not import runtime, no circular dependencies


	// define how an event works from json
export class StateEvent {
   constructor({ id, sport, startDate, endDate, year, eventSites = [] }) {
      this.id = id;
      this.sport = Utils.parseToInstance(sport, Sport);
      this.startDate = Utils.safeParseDate(startDate.date);
      this.endDate = Utils.safeParseDate(endDate.date);
      this.year = year;
		this.eventSites = Utils.parseToInstancesArr(eventSites, EventSite);
   }

   static fromValues(id, sport, startDate, endDate, year, eventSites = []) {
      return new StateEvent({ id, sport, startDate, endDate, year, eventSites });
   }

   static fromJSON(json) {
      return new StateEvent(json);
   }
	
	getRealYear() {
		return this.startDate.getFullYear().toString().slice(-2);
	}
	
	getEventSiteByID(id) {
		return this.eventSites.find(es => es.id === Number(id));
	}
	
	getDivisionByID(id) {
		for (const es of this.eventSites) {
			const match = es.esDivisions.find(div => div.id === Number(id));
			if (match) return match;
		}
		return null; // Not found
	}
	
	getEsdByDivIDAndGenderID(divID, genderID = null) {
		if (divID < this.sport.minDiv) divID = this.sport.minDiv;
		for (const es of this.eventSites) {
            // if a genderID was passed (soccer) check it matches the EventSite's gender
         if ((genderID == null) || (es.gender.id === Number(genderID))) {
            for (const esd of es.esDivisions) {
               if (esd.division.id === Number(divID)) {
                  return esd;
               }
            }
         }
		}
		return null;
	}

      // returns an object with props for each size named by displayChar and a total prop
   getNeededSizes() {
         // makes an obj with properties named by sizeChars with values all set to 0
      const neededSizes = Object.fromEntries(sizeList.map(size => [size, 0]));
      neededSizes.total = 0;

         // for each EventSite, each ESDivision, each SchoolOrder, each Size, increment the corresponding neededSize
      for (const es of this.eventSites) {
         for (const esd of es.esDivisions) {
            for (const so of esd.schoolOrders) {
                  // we only need incomplete orders // exclude orders that are over their qualifiers
               if (!so.completeness && ((so.qualifiers === null || so.getDairyTotal() <= so.qualifiers))) {
                     // dairyHoods style.id == 9. this filters out add ons
                  const dHoods = so.shirtsByStyle.find(item => item.id === 9);
                  if (dHoods) {
                     for (const size of dHoods.sizes) {
                           // make sure displayChar is valid
                        if (!(size.displayChar in neededSizes)) throw new Error(`Unknown size: ${size.displayChar}`);
                        neededSizes[size.displayChar] += size.quantity;
                        neededSizes.total += size.quantity;
                     }
                  }
               }
            }
         }
      }

      return neededSizes;
   }
	
      // only if they are not blank
         // and not over
	getUndoneOrders() {
		let orders = [];

		this.eventSites.forEach(eventSite => {
         let divGenderStr = '';
         if (eventSite.gender) divGenderStr += ' ' + eventSite.gender.name;

			eventSite.esDivisions.forEach(eshd => {
				eshd.schoolOrders.forEach(order => {
						// check completeness. 0 == incomplete. // check blank // check over qualifiers
					if (!order.completeness && (order.getDairyTotal() > 0) && !order.isOver()) {
                  let sportGenderStr = '';
                  if (this.sport.name === "Soccer") {
                     if (order.genderID === 1) sportGenderStr += ' - Boys';
                     if (order.genderID === 2) sportGenderStr += ' - Girls';
                  }
                  
						order.division = eshd.division.name +divGenderStr;
						order.site = eventSite.site.name;
						order.sportStr = this.sport.name + sportGenderStr;
                  order.sportLblClr = this.sport.labelColor;
						orders.push(order);
					}
				});
			});
		});
		return orders;
	}

   getUnhandledComments() {
      let unhandledComments = [];

      for (const es of this.eventSites) {
         for (const esd of es.esDivisions) {
            for (const so of esd.schoolOrders) {
               for (const mo of so.messageOrders) {
                     // we only need orders with comments that are unhandled
                  if (mo.comment && !mo.commentHandled) {
                     unhandledComments.push({
                        comment: mo.comment,
                        moID: mo.id,
                        soID: so.id,
                        schoolName: so.school.shortName,
                        divName: esd.division.name
                     });
                  }
               }
            }
         }
      }

      return unhandledComments;
   }

      // this function is a wrapper to conveniently call on a stateEvent instance
         // allItems must be passed in from runtime via the caller to avoid circular dependencies
         // you can't import runtime to this module
   async loadInventories(allItems, allTransfers) {
      await EventSite.fetchInventories(this.eventSites, allItems, allTransfers);  
   }
}

export class Sport {
   constructor({ id, name, isGendered, isIndividualed, maxTeamSize, minDiv, labelColor }) {
      this.id = id;
      this.name = name;
      this.isGendered = isGendered;
      this.isIndividualed = isIndividualed;
      this.maxTeamSize = maxTeamSize;
      this.minDiv = minDiv;
      this.labelColor = labelColor;
   }

   static fromValues(id, name, isGendered, isIndividualed, maxTeamSize, minDiv, labelColor) {
      return new Sport({ id, name, isGendered, isIndividualed, maxTeamSize, minDiv, labelColor });
   }

   static fromJSON(json) {
      return new Sport(json);
   }
}

export class EventSite {
   constructor({ id, eventID, site, managerName, gender, vehicle, employees, inventory, transfers, 
               esDivisions = [] }) {
		this.id = id;
		this.eventID = eventID;
		this.site = Utils.parseToInstance(site, Site);
		this.managerName = managerName;
      this.gender = gender;
		this.vehicle = Utils.parseToInstance(vehicle, Vehicle);
      this.employees = Utils.parseToInstancesArr(employees, Employee);
      this.inventory = inventory;
      this.transfers = transfers;
      this.inventoryLoaded = false;
		this.esDivisions = Utils.parseToInstancesArr(esDivisions, EventSiteDivision);
	}

   static fromValues(id, eventID, site, managerName, vehicle, esDivisions = []) {
      return new EventSite({ id, eventID, site, managerName, vehicle, esDivisions });
   }

   static fromJSON(json) {
      return new EventSite(json);
   }

   getDivisionsString() {
      if (!this.esDivisions || this.esDivisions.length === 0) return '';

      let minDiv = this.esDivisions[0].division;
      let maxDiv = this.esDivisions[0].division;

      this.esDivisions.forEach(esd => {
         const div = esd.division;
         if (div.id < minDiv.id) minDiv = div;
         if (div.id > maxDiv.id) maxDiv = div;
      });

      let divStr = (minDiv.id === maxDiv.id)
         ? minDiv.name
         : `${minDiv.name}-${maxDiv.name}`;

      if (this.gender && this.gender.id !== 3) divStr += ' ' + this.gender.name;

      return divStr;
   }

   getGenderName() {
      return this.gender?.name || '';
   }

   getEmployeesString() {
      if (!this.employees || this.employees.length === 0) return '';

      return this.employees.map(e => e.shortName).join(' / ');
   }

   getStructuredInventory() {
      return {
         garments: this.getInventoryGarmentsByStyleByColor(),
         accessories: this.getInventoryAccessories(),
         transfers: this.getInventoryTransfers()
      }
   }

   getInventoryGarmentsByStyleByColor() {
      const styles = {};

      for (const inv of this.inventory) {
         const sizeCat = inv.item.style.sizingCategoryID;
         if (sizeCat == 1 || sizeCat == 2 || sizeCat == 3) {
            const styleID = inv.item.style.id;
            const colorID = inv.item.color.id;

               // initialize style container
            if (!styles[styleID]) {
                  styles[styleID] = {
                     ...inv.item.style,
                     colors: {}
                  };
            }

               // initialize color container
            if (!styles[styleID].colors[colorID]) {
                  styles[styleID].colors[colorID] = {
                     ...inv.item.color,
                     sizes: {}
                  };
            }

               // push the inventory item
            styles[styleID].colors[colorID].sizes[inv.item.size.displayChar] = inv;
         }
      }

      // console.log(styles);

      return styles;
   }

   getInventoryAccessories() {
      const styles = {};

      for (const inv of this.inventory) {
         const sizeCat = inv.item.style.sizingCategoryID;
            // 4 = 'one size fits all' category. hats, bags, etc
         if (sizeCat == 4) {
            const styleID = inv.item.style.id;

               // push the inventory item
            styles[styleID] = inv;
         }
      }

      return styles;
   }

   getInventoryTransfers() {
      return this.transfers;
   }

   updateInventory(update) {
      update.forEach(u => {
         const invItem = this.inventory.find(ii => ii.id === u.invItemID);
         invItem.startQ = Number(u.quantity);
      });
   }

      // static batch fetch method
   static async fetchInventories(eSites, allItems, allTransfers) {
         // make sure these are loaded
      await allItems.load();
      // await allTransfers.load();

         // filter for sites missing inventory
      const missingSites = eSites.filter(s => !s.inventoryLoaded);
      if (missingSites.length === 0) return {};

         // fetch
      const request = new ActionRequest('getInventoryItems', 'Event', { eSiteIDs: missingSites.map(s => s.id) });
      const responseJSON = await myFetch(request);

         // get and group the site's inventory items
      const itemsBySite = {};
      for (const ii of Object.values(responseJSON.data.invItems)) {
         const invItem = Utils.parseToInstance(ii, InventoryItem);
         invItem.item = allItems.getByID(ii.itemID);

         if (!itemsBySite[ii.eventSiteID]) itemsBySite[ii.eventSiteID] = [];
         itemsBySite[ii.eventSiteID].push(invItem);
      }

         // get the site's transfers
      const transfersBySite = {};
      for (const t of Object.values(responseJSON.data.transfers)) {
         const trnsfr = Utils.parseToInstance(t, InventoryTransfer);
         trnsfr.transfer = allTransfers.getByID(t.transferID);

         if (!transfersBySite[t.eventSiteID]) transfersBySite[t.eventSiteID] = [];
         transfersBySite[t.eventSiteID].push(trnsfr);
      }

         // mark loaded
      for (const es of missingSites) {
         es.inventoryLoaded = true;
         es.inventory = itemsBySite[es.id] || [];
         es.transfers = transfersBySite[es.id] || [];
      }
   }
}

export class Site {
   constructor({ id, name, city }) {
      this.id = id;
      this.name = name;
      this.city = city;
   }

   static fromValues(id, name, city) {
      return new Site({ id, name, city });
   }

   static fromJSON(json) {
      return new Site(json);
   }
}

export class Vehicle {
   constructor({ id, name, isUnique }) {
      this.id = id;
      this.name = name;
      this.isUnique = isUnique;
   }

   static fromValues(id, name, isUnique) {
      return new Vehicle({ id, name, isUnique });
   }

   static fromJSON(json) {
      return new Vehicle(json);
   }
}

export class EventSiteDivision {
   constructor({ id, eventSiteID, division, schoolOrders = [] }) {
      this.id = id;
      this.eventSiteID = eventSiteID;
      this.division = Utils.parseToInstance(division, Division);
      this.schoolOrders = Utils.parseToInstancesArr(schoolOrders, SchoolOrder);
   }

   static fromValues(id, eventSiteID, division, schoolOrders = []) {
      return new EventSiteDivision({ id, eventSiteID, division, schoolOrders });
   }

   static fromJSON(json) {
      return new EventSiteDivision(json);
   }

   sortSchoolOrders() {
      this.schoolOrders.sort((a, b) => {
         const nameA = a.school?.shortName?.toLowerCase() || '';
         const nameB = b.school?.shortName?.toLowerCase() || '';
         return nameA.localeCompare(nameB);
      });
   }
	
	hasSchoolByID(id) {
		return this.schoolOrders.some(order => order.school?.id === id);
	}
	
	getTeamsWithAddOns() {
		return this.schoolOrders.filter(order =>
			order.shirtsByStyle.some(style => style.shortName !== 'Dairy Hoods')
		);
	}
	
	getMaxSize() {
		let max = 0;
		this.schoolOrders.forEach(order => {
			order.shirtsByStyle.forEach(style => {
				style.sizes.forEach(size => {
					if (size.id > max) max = size.id;
				});
			});
		});
		return max;
	}
}

export class Division {
   constructor({ id, name, minPop, pre24Name }) {
      this.id = id;
      this.name = name;
      this.minPop = minPop;
      this.pre24Name = pre24Name;
   }

   static fromValues(id, name, minPop, pre24Name) {
      return new Division({ id, name, minPop, pre24Name });
   }

   static fromJSON(json) {
      return new Division(json);
   }
}

export class SchoolOrder {
   constructor({ id, eshdID, school, genderID, qualifiers = 0, completeness = 0, due = null, paid = null, 
               schoolOrderNote = null, invoiceDate = null, invoiceVersion = null, messageOrders = [], 
               shirtsByStyle = [], site = undefined, sport = undefined }) {
      this.id = id;
      this.eshdID = eshdID;
      this.school = Utils.parseToInstance(school, School);
      this.genderID = genderID;
      this.qualifiers = qualifiers;
      this.completeness = completeness;
      this.due = due;
      this.paid = paid;
      this.schoolOrderNote = schoolOrderNote;
      this.invoiceDate = Utils.safeParseDate(invoiceDate);
      this.invoiceVersion = invoiceVersion;
      this.messageOrders = Array.isArray(messageOrders) ? messageOrders : [];
      this.shirtsByStyle = Array.isArray(shirtsByStyle)
         ? shirtsByStyle.map(style => style instanceof Style ? style : style != null ? Style.fromJSON(style) : null).filter(Boolean)
         : [];
      this.site = site;
      this.sport = sport;
   }

   static fromValues(id, eShdID, school, genderID, qualifiers, completeness, due, paid, schoolOrderNote, 
                     invoiceSent, messageOrders, shirtsByStyle, site, sport) {
      return new SchoolOrder({ id, eShdID, school, genderID, qualifiers, completeness, due, paid, schoolOrderNote, 
                              invoiceSent, messageOrders, shirtsByStyle, site, sport });
   }

   static fromJSON(json) {
      return new SchoolOrder(json);
   }
	
	updateFromJSON(json) {
		this.id = json.id;
		this.eshdID = json.eshdID;
		this.school = json.school instanceof School
			? json.school
			: json.school != null
				? School.fromJSON(json.school)
				: null;
		this.completeness = json.completeness;
		this.due = json.due;
		this.paid = json.paid;
		this.schoolOrderNote = json.schoolOrderNote;
		this.invoiceSent = json.invoiceSent;
		this.messageOrders = Array.isArray(json.messageOrders) ? json.messageOrders : [];
		this.shirtsByStyle = Array.isArray(json.shirtsByStyle)
			? json.shirtsByStyle.map(style =>
				style instanceof Style ? style : style != null ? Style.fromJSON(style) : null
			).filter(Boolean)
			: [];
		this.site = json.site;
		this.sport = json.sport;
	}
	
	getBoxTotal() {
		let boxTotal = 0;
      // console.log(this.shirtsByStyle);
		this.shirtsByStyle.forEach(style => {
         if (style.id !== 13) {
            style.sizes.forEach(size => {
               boxTotal += size.quantity;
            });
         }
		});
		return boxTotal;
	}

      // returns total number of participant hoods ordered
   getDairyTotal() {
      let dTotal = 0;

         // find the dairy hoods. if there are any, sum them. // dairy hoods style.id === 9
      const dHoods = this.shirtsByStyle.find(style => style.id === 9);
      if (dHoods) {
         for (const s of dHoods.sizes) {
            dTotal += s.quantity;
         }
      }

      return dTotal;
   }
	
	hasAddOns() {
		return this.shirtsByStyle.some(style => style.shortName !== 'Dairy Hoods');
	}
	
	getTeamStyle() {
		return this.shirtsByStyle.find(style => style.shortName === 'Dairy Hoods');
	}
	
	getAddedStyles() {
         // omit the dairy hoods
      const styles = this.shirtsByStyle.filter(style => style.shortName !== 'Dairy Hoods');

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
		this.shirtsByStyle.forEach(style => {
			style.sizes.forEach(size => {
            if (size.id < 9) {
				   if (size.id < min) min = size.id;
            }
			});
		});
		return min;
	}
	
	getMaxSize() {
		let max = 0;
		this.shirtsByStyle.forEach(style => {
			style.sizes.forEach(size => {
            if (size.id < 9) {
   				if (size.id > max) max = size.id;
      		}
         });
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
}

export class School {
   constructor({ id, name, shortName, addressPhysical, addressMailing, addressLine2, ad, district, division }) {
      this.id = id;
      this.name = name;
      this.shortName = shortName;
      this.addressPhysical = addressPhysical;
      this.addressMailing = addressMailing;
      this.addressLine2 = addressLine2;
      this.ad = Utils.parseToInstance(ad, Person);
      this.division = Utils.parseToInstance(division, Division);
   }

   static fromValues(id, name, shortName, addressPhysical, addressMailing, addressLine2, district, division) {
      return new School({ id, name, shortName, addressPhysical, addressMailing, addressLine2, district, division });
   }

   static fromJSON(json) {
      return new School(json);
   }
	
	getSchoolCode() {
		return this.name.slice(0, 3).toUpperCase() + String(this.id);
	}
}

export class MessageOrder {
   constructor({id, schoolOrderID, genderID, orderedBy, mOrderComment, mOrderCommentHandled, orderText, fileName, orderDate}) {
      this.id = id;
      this.schoolOrderID = schoolOrderID;
      this.genderID = genderID;
      this.orderedBy = orderedBy;
      this.mOrderComment = mOrderComment;
      this.mOrderCommentHandled = mOrderCommentHandled;
      this.orderText = orderText;
      this.fileName = fileName;
      this.orderDate = orderDate;
   }

   static fromValues(id, schoolOrderID, genderID, orderedBy, mOrderComment, mOrderCommentHandled, orderText, fileName, orderDate) {
      return new MessageOrder({id, schoolOrderID, genderID, orderedBy, mOrderComment, mOrderCommentHandled, orderText, fileName, orderDate});
   }

   static fromJSON(json) {
      return new MessageOrder(json);
   }
}

export class Item {
   constructor({ id, price, stock, color, size, style }) {
      this.id = id;
      this.price = price;
      this.stock = stock;
      this.color = Utils.parseToInstance(color, Color);
      this.size = Utils.parseToInstance(size, Size);
      this.style = Utils.parseToInstance(style, Style);
   }

   static fromValues(id, price, stock, color, size, style) {
      return new Item({ id, price, stock, color, size, style });
   }

   static fromJSON(json) {
      return new Item(json);
   }
	
	getInvoiceName() {
		return this.style.brand.shortName + " " + this.style.vShortName + " - " + this.color.name + " - " + this.size.name;
	}
}

export class InventoryItem {
   constructor({ id, eventSiteID, itemID, startQ, endQ, addedQ, removedQ, price, item }) {
		this.id = id;
		this.eventSiteID = eventSiteID;
		this.itemID = itemID;
      this.startQ = startQ;
      this.endQ = endQ;
      this.addedQ = addedQ;
      this.removedQ = removedQ;
      this.price = price;
      this.item = Utils.parseToInstance(item, Item);   
	}

   static fromValues(id, eventSiteID, itemID, startQ, endQ, addedQ, removedQ, price, item) {
      return new InventoryItem({ id, eventSiteID, itemID, startQ, endQ, addedQ, removedQ, price, item });
   }

   static fromJSON(json) {
      return new InventoryItem(json);
   }
}

export class Style {
   constructor({ id, code, name, inventoryName, shortName, vShortName, brand, sizingCategoryID, 
               minSizeID, maxSizeID, sizes = [] }) {
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
      this.sizes = Array.isArray(sizes) ? sizes.map(size => size) : [];
      // if (id === 9) console.log(sizes);

      this.sizeMap = {};
      for (const size of this.sizes) {
         if (size && size.displayChar) {
            this.sizeMap[size.displayChar] = size;
         } else {
            console.log(this.shortName, size);
         }
      }
   }

   static fromValues(id, name, shortName, vShortName, brandID, code, sizes = []) {
      return new Style({ id, name, shortName, vShortName, brandID, code, sizes });
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

export class Size {
   constructor({ id, name, charName, displayChar, sizingCategoryID, quantity }) {
      this.id = id;
      this.name = name;
      this.charName = charName;
      this.displayChar = displayChar;
      this.sizingCategoryID = sizingCategoryID;
      this.quantity = quantity;
   }

   static fromValues(id, name, charName, quantity) {
      return new Size({ id, name, charName, quantity });
   }

   static fromJSON(json) {
      return new Size(json);
   }
}

export class Person {
   constructor({ id, name, email, phone, extension, fax }) {
      this.id = id;
      this.name = name;
      this.email = email;
      this.phone = phone;
      this.extension = extension;
      this.fax = fax;
   }

   static fromValues(id, name, email, phone, extension, fax) {
      return new Person({ id, name, email, phone, extension, fax });
   }

   static fromJSON(json) {
      return new Person(json);
   }
}

export class Employee {
   constructor({ id, name, shortName, phone, email }) {
      this.id = id;
      this.name = name;
      this.shortName = shortName;
      this.phone = phone;
      this.email = email;
   }

   static fromValues(id, name, email, phone, extension, fax) {
      return new Employee({ id, name, email, phone, extension, fax });
   }

   static fromJSON(json) {
      return new Employee(json);
   }
}

export class Color {
   constructor({ id, name }) {
      this.id = id;
      this.name = name;
   }

   static fromValues(id, name) {
      return new Color({ id, name });
   }

   static fromJSON(json) {
      return new Color(json);
   }
}

export class Brand {
   constructor({ id, name, shortName }) {
      this.id = id;
      this.name = name;
      this.shortName = shortName;
   }

   static fromValues(id, name, shortName) {
      return new Brand({ id, name, shortName });
   }

   static fromJSON(json) {
      return new Brand(json);
   }
}

export class Transfer {
   constructor({ id, transferName, inventoryName, price }) {
      this.id = id;
      this.transferName = transferName;
      this.inventoryName = inventoryName;
      this.price = price
   }

   static fromValues(id, name, shortName) {
      return new Transfer({ id, name, shortName });
   }

   static fromJSON(json) {
      return new Transfer(json);
   }
}

export class InventoryTransfer {
   constructor({ id, eventSiteID, transferID, startQ, soldQ, price, transfer }) {
      this.id = id;
      this.eventSiteID = eventSiteID;
      this.transferID = transferID;
      this.startQ = startQ;
      this.soldQ = soldQ;
      this.price = price;
      this.transfer = Utils.parseToInstance(transfer, Transfer);
   }

   static fromValues(id, eventSiteID, transferID, startQ, soldQ, price, transfer) {
      return new InventoryTransfer({ id, eventSiteID, transferID, startQ, soldQ, price, transfer });
   }

   static fromJSON(json) {
      return new InventoryTransfer(json);
   }
}
