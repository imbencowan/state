//////////////////////////////////////////////////////////////
// db classes
// these represent data from the db
//////////////////////////////////////////////////////////////

   // import helper functions
import * as Utils from '../utilities.js';
import { parseWithRegistry } from '../hydration.js';
import { sizeList, ADULT_HOOD_STYLE_ID, DAIRY_STYLE_ID } from '../constants.js';
import { actionFetch } from '../fetch.js';
// DO NOT IMPORT RUNTIME, no circular dependencies.


	// define how an event works from json
export class StateEvent {
   constructor({ id, sport, startDate, endDate, year, eventSites = [] }) {
      this.id = id;
      this.sport = Utils.parseToInstance(sport, Sport);
      this.startDate = Utils.safeParseDate(startDate.date);
      this.endDate = Utils.safeParseDate(endDate.date);
      this.year = year;
		this.eventSites = Utils.parseToInstancesArr(eventSites, EventSite);
      this.esMap = null;
      this.esdMap = null;
      this.orderMap = null;
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
      id = Number(id);
		if (!this.esMap) {
         this.esMap = new Map();

         for (const eSite of this.eventSites) {
                  this.esMap.set(eSite.id, eSite);
         }
      }

      return this.esMap.get(id);
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

   getOrderByID(id) {
      if (!this.orderMap) {
         this.orderMap = new Map();

         for (const eSite of this.eventSites) {
            for (const d of eSite.esDivisions) {
               for (const o of d.schoolOrders) {
                  this.orderMap.set(o.id, o);
               }
            }
         }
      }

      return this.orderMap.get(id);
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

      // this is a convenience wrapper like loadInventories
   async loadOrders(allItems, allTransfers) {
      await EventSite.fetchOrders(this.eventSites, allItems, allTransfers);
   }
}

export class Sport {
   constructor({ id, name, isGendered, isIndividualed, maxTeamSize, minDiv, labelColor }) {
      this.id = id;
      this.name = name;
         // url path. 
      this.slug = Utils.slugify(name);
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
   constructor({ id, eventID, site, siteID, managerName, gender, vehicle, employees, inventory, transfers, 
               plusSizePricing, esDivisions = [] }) {
		this.id = id;
		this.eventID = eventID;
		this.site = parseWithRegistry(site, Site, siteID);
		this.managerName = managerName;
      this.gender = gender;
		this.vehicle = Utils.parseToInstance(vehicle, Vehicle);
      this.employees = Utils.parseToInstancesArr(employees, Employee);
      this.inventory = Utils.parseToInstancesArr(inventory, InventoryItem);
      this.transfers = Utils.parseToInstancesArr(transfers, InventoryTransfer);
      this.plusSizePricing = plusSizePricing;
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
            // collects Adult, Youth, Womens // omits One Size Fits All items
         if (sizeCat == 1 || sizeCat == 2 || sizeCat == 3) {
            const styleID = inv.item.style.id;
            const colorID = inv.item.color.id;

               // initialize style/color containers if they don't exist (??=)
            styles[styleID] ??= { ...inv.item.style, colors: {} };
            styles[styleID].colors[colorID] ??= { ...inv.item.color, sizes: {} };

               // push the inventory item
            styles[styleID].colors[colorID].sizes[inv.item.size.displayChar] = inv;
         }
      }

         // convert styles object → ordered array
      const orderedStyles = Object.values(styles)
         .sort((a, b) => a.listOrder - b.listOrder)
         .map(style => {
               // convert colors object → array (optional sort)
            const orderedColors = Object.values(style.colors)
               // .sort((a, b) => a.listOrder - b.listOrder) // optional if you add listOrder for colors
            
            return {
               ...style,
               colors: orderedColors
            };
         });

      return orderedStyles;
   }

   getInventoryAccessories() {
      const styles = [];

      for (const inv of this.inventory) {
            // 4 = 'one size fits all' category. hats, bags, etc
         if (inv.item.style.sizingCategoryID == 4) styles.push(inv);
      }

      styles.sort((a, b) => 
         a.item.style.listOrder - b.item.style.listOrder
      );

      return styles;
   }

   getInventoryTransfers() {
      this.transfers.sort((a, b) => 
         a.transfer.listOrder - b.transfer.listOrder
      );
      return this.transfers;
   }

   updateInventory(update) {
      update.forEach(u => {
         const invItem = this.inventory.find(ii => ii.id === u.invItemID);
         invItem.startQ = Number(u.quantity);
      });
   }

   getReportInventory() {
      const PLUS_SIZECHARS = new Set([ '2X', '3X', '4X' ]);
      const plusSizes = { '2X': 0, '3X': 0, '4X': 0 }

      const transfers = this.getInventoryTransfers();
      const accessories = [];
      let garments = {};

      for (const inv of this.inventory) {
         const sizeCat = inv.item.style.sizingCategoryID;
         const styleID = inv.item.style.id;
            // handle 'one size fits all' items first
         if (sizeCat == 4) {
            accessories.push(inv);
               // handle garments
         } else if (sizeCat == 1 || sizeCat == 2 || sizeCat == 3) {
            const colorID = inv.item.color.id;
            const sChar = inv.item.size.displayChar;
            const sold = inv.getSoldQ();

               // initialize style/color containers if they
            garments[styleID] ??= { ...inv.item.style, colors: {} };
            garments[styleID].colors[colorID] ??= { ...inv.item.color, retailTotal: 0, sOrderTotal: 0, 
                                                   cost: null, price: null };

               // add the inventory item
            garments[styleID].colors[colorID].retailTotal += sold;
               // ??= allows assigning once
            if (!PLUS_SIZECHARS.has(sChar)) {
               garments[styleID].colors[colorID].cost ??= inv.cost;
               garments[styleID].colors[colorID].price ??= inv.price;
            } else {
               plusSizes[sChar] += sold;
            }
         }
      }

         // add add ons from school orders
      for (const esd of this.esDivisions) {
         for (const so of esd.schoolOrders) {
            for (const soi of so.oItems) {
               const styleID = soi.item.style.id;
               const colorID = soi.item.color.id;
               const sChar = soi.item.size.displayChar;
               if (styleID === DAIRY_STYLE_ID) continue;

               garments[styleID] ??= { ...soi.item.style, colors: {} };
               garments[styleID].colors[colorID] ??= { ...soi.item.color, retailTotal: 0, sOrderTotal: 0, 
                                                   cost: 0, price: 0 };
               
                  // add the quantity
               garments[styleID].colors[colorID].sOrderTotal += soi.quantity;  
               
                  // track plus sizes
               if (PLUS_SIZECHARS.has(sChar)) plusSizes[sChar] += soi.quantity;
            }
         }
      }


      // convert styles object → ordered array
      garments = Object.values(garments)
         .sort((a, b) => a.listOrder - b.listOrder)
         .map(style => {
               // convert colors object → array (optional sort)
            const orderedColors = Object.values(style.colors)
               // .sort((a, b) => a.listOrder - b.listOrder) // optional if you add listOrder for colors
            
            return {
               ...style,
               colors: orderedColors
            };
         });
      accessories.sort((a, b) => 
         a.item.style.listOrder - b.item.style.listOrder
      );

      return { garments, accessories, transfers, plusSizes };
   }

   static async fetchOrders(eSites, allItems, allTransfers) {
      const esds = eSites.flatMap(site => site.esDivisions);
      const missingEsds = esds.filter(div => !div.ordersLoaded);

         // return early if all esds have orders loaded
      if (missingEsds.length === 0) return {};

      const response = await actionFetch('getOrders', 'Event', { esdIDs: missingEsds.map(esd => esd.id) });

      const ordersByESD = {};
      for (const o of Object.values(response.data.orders)) {
         const order = Utils.parseToInstance(o, SchoolOrder);
         if (!ordersByESD[o.eshdID]) ordersByESD[o.eshdID] = [];
         ordersByESD[o.eshdID].push(order);
      }

         // assign and mark loaded
      for (const esd of missingEsds) {
         esd.ordersLoaded = true;
         esd.schoolOrders = ordersByESD[esd.id] || [];
      }
   }

      // static batch fetch method
   static async fetchInventories(eSites, allItems, allTransfers) { 
         // filter for sites missing inventory
      const missingSites = eSites.filter(s => !s.inventoryLoaded);
         // return early if no sites are missing inventory
      if (missingSites.length === 0) return {};


         // make sure these are loaded
      await allItems.load();
      // await allTransfers.load();

         // fetch
      const response = await actionFetch('getInventoryItems', 'Event', { eSiteIDs: missingSites.map(s => s.id) });

         // get and group the site's inventory items
      const itemsBySite = {};
      for (const ii of Object.values(response.data.invItems)) {
         const invItem = Utils.parseToInstance(ii, InventoryItem);
         invItem.item = allItems.getByID(ii.itemID);

         if (!itemsBySite[ii.eventSiteID]) itemsBySite[ii.eventSiteID] = [];
         itemsBySite[ii.eventSiteID].push(invItem);
      }

         // get the site's transfers
      const transfersBySite = {};
      for (const t of Object.values(response.data.transfers)) {
         const trnsfr = Utils.parseToInstance(t, InventoryTransfer);
         trnsfr.transfer = allTransfers.getByID(t.transferID);

         if (!transfersBySite[t.eventSiteID]) transfersBySite[t.eventSiteID] = [];
         transfersBySite[t.eventSiteID].push(trnsfr);
      }

         // assign and mark loaded
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
   static registry = null;

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
   constructor({ id, eventSiteID, divisionID, division, schoolOrders = [] }) {
      this.id = id;
      this.eventSiteID = eventSiteID;
      this.division = parseWithRegistry(division, Division, divisionID);
      this.schoolOrders = Utils.parseToInstancesArr(schoolOrders, SchoolOrder);
      this.ordersLoaded = this.schoolOrders.length > 0;
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
   static registry = null;

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
   constructor({ id, eshdID, schoolID, school, genderID, qualifiers = 0, completeness = 0, due = null, 
               paid = null, schoolOrderNote = null, invoiceDate = null, invoiceVersion = null, messageOrders = [], 
               shirtsByStyle = [], oItems = [], oTransfers = [], site = undefined, sport = undefined }) {
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
      this.shirtsByStyle = Array.isArray(shirtsByStyle)
         ? shirtsByStyle.map(style => style instanceof Style ? style : style != null ? Style.fromJSON(style) : null).filter(Boolean)
         : [];
      this.oItems = Utils.parseToInstancesArr(oItems, SOrderItem);
      this.oTransfers = Utils.parseToInstancesArr(oTransfers, SOrderTransfer);
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
      return this.shirtsByStyle.some(style => style.shortName !== 'Dairy Hoods')
   }

   hasAddedTransfers() {
      return (this.oTransfers.length > 0)
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
   static registry = null;

   constructor({ id, name, shortName, addressPhysical, addressMailing, addressLine2, ad, districtID, district, 
               divisionID, division }) {
      this.id = id;
      this.name = name;
      this.shortName = shortName;
      this.addressPhysical = addressPhysical;
      this.addressMailing = addressMailing;
      this.addressLine2 = addressLine2;
      this.ad = Utils.parseToInstance(ad, Person);
      this.division = parseWithRegistry(division, Division, divisionID);
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
   static registry = null;

   constructor({ id, price, cost, stock, caseQ, inventoryMin, inventoryStep, color, size, style }) {
      this.id = id;
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

   static fromValues(id, price, cost, stock, caseQ, inventoryMin, inventoryStep, color, size, style) {
      return new Item({ id, price, cost, stock, caseQ, inventoryMin, inventoryStep, color, size, style });
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

export class InventoryItem {
   constructor({ id, eventSiteID, itemID, startQ, endQ, addedQ, writeOffQ, sponsorQ, price, cost, item }) {
		this.id = id;
		this.eventSiteID = eventSiteID;
		this.itemID = itemID;
      this.startQ = startQ;
      this.endQ = endQ;
      this.addedQ = addedQ;
      this.writeOffQ = writeOffQ;
      this.sponsorQ = sponsorQ;
      this.price = price;
      this.cost = cost;
      this.item = parseWithRegistry(item, Item, itemID);   
	}

   static fromValues(id, eventSiteID, itemID, startQ, endQ, addedQ, removedQ, price, cost, item) {
      return new InventoryItem({ id, eventSiteID, itemID, startQ, endQ, addedQ, removedQ, price, cost, item });
   }

   static fromJSON(json) {
      return new InventoryItem(json);
   }

   getSoldQ() {
      if (this.endQ == null) return 0;

      return this.startQ + this.addedQ - this.endQ - this.writeOffQ - this.sponsorQ;
   }
}

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

export class Size {
   static registry = null;

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
   static registry = null;

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
   static registry = null;

   constructor({ id, name, hex }) {
      this.id = id;
      this.name = name;
      this.hex = `#${hex}`;
   }

   static fromValues(id, name, hex) {
      return new Color({ id, name, hex });
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
   constructor({ id, transferName, inventoryName, price, cost, listOrder }) {
      this.id = id;
      this.transferName = transferName;
      this.inventoryName = inventoryName ?? transferName;
      this.price = price;
      this.cost = cost;
      this.listOrder = listOrder;
   }

   static fromValues(id, transferName, inventoryName, price, cost, listOrder) {
      return new Transfer({ id, transferName, inventoryName, price, cost, listOrder });
   }

   static fromJSON(json) {
      return new Transfer(json);
   }
}

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
}

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
}

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

   static fromValues(id, schoolOrderID, itemID, quantity, price, cost, item) {
      return new SOrderItem({ id, schoolOrderID, itemID, quantity, price, cost, item });
   }

   static fromJSON(json) {
      return new SOrderItem(json);
   }
}

export class Season {
   constructor({ id, name, startMonth, startDay, endMonth, endDay, color }) {
      this.id = id;
      this.name = name;
      this.startMonth = startMonth;
      this.startDay = startDay;
      this.endMonth = endMonth;
      this.endDay = endDay;
      this.color = color;
   }

   static fromValues(id, name, startMonth, startDay, endMonth, endDay, color) {
      return new Season({ id, name, startMonth, startDay, endMonth, endDay, color });
   }

   static fromJSON(json) {
      return new Season(json);
   }

   static sortByStartDate(allSeasons) {
      return [...allSeasons].sort((a, b) => {
         const aStart = (a.startMonth * 100) + a.startDay;
         const bStart = (b.startMonth * 100) + b.startDay;
         return aStart - bStart;
      });
   }
   
   static getCurrentSeason(allSeasons) {
      allSeasons = Season.sortByStartDate(allSeasons);

      const now = new Date();
      const today = ((now.getMonth() + 1) * 100) + now.getDate();

      return allSeasons.find(season => {
         const start = (season.startMonth * 100) + season.startDay;
         const end = (season.endMonth * 100) + season.endDay;

            // if the range crosses the end of the calendar year
         if (start > end) return today >= start || today <= end;

         return today >= start && today <= end;
      }) || null;
   }

   static getNextSeason(allSeasons) {
      allSeasons = Season.sortByStartDate(allSeasons);

      const currentSeason = Season.getCurrentSeason(allSeasons);
      if (!currentSeason) return null;

      const currentI = allSeasons.findIndex(season => season.id === currentSeason.id);
      if (currentI === -1) return null;

      const nextI = (currentI + 1) % allSeasons.length;
      return allSeasons[nextI] || null;
   }
}
