//////////////////////////////////////////////////////////////
// db classes
// these represent data from the db
//////////////////////////////////////////////////////////////

   // import helper functions
import * as Utils from '../utilities.js';
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
	
	getEsdByDivID(id) {
		if (id < this.sport.minDiv) id = this.sport.minDiv;
		for (const es of this.eventSites) {
			for (const esd of es.esDivisions) {
				if (esd.division.id === Number(id)) return esd;
			}
		}
		return null;
	}
	
	getUndoneOrders() {
		let orders = [];

		this.eventSites.forEach(eventSite => {
         let divGenderStr = '';
         if (eventSite.gender) divGenderStr += ' ' + eventSite.gender.name;

			eventSite.esDivisions.forEach(eshd => {
				eshd.schoolOrders.forEach(order => {
						// check completeness. 0 == incomplete.
					if (!order.completeness) {
                  let sportGenderStr = '';
                  if (this.sport.name === "Soccer") {
                     if (order.messageOrders[0].genderID === 1) sportGenderStr += ' - Boys';
                     if (order.messageOrders[0].genderID === 2) sportGenderStr += ' - Girls';
                  }
                  
						order.division = eshd.division.name +divGenderStr;
						order.site = eventSite.site.name;
						order.sport = this.sport.name + sportGenderStr;
						orders.push(order);
					}
				});
			});
		});
		return orders;
	}
}

export class Sport {
   constructor({ id, name, isGendered, isIndividualed, maxTeamSize, minDiv }) {
      this.id = id;
      this.name = name;
      this.isGendered = isGendered;
      this.isIndividualed = isIndividualed;
      this.maxTeamSize = maxTeamSize;
      this.minDiv = minDiv;
   }

   static fromValues(id, name, isGendered, isIndividualed, maxTeamSize, minDiv) {
      return new Sport({ id, name, isGendered, isIndividualed, maxTeamSize, minDiv });
   }

   static fromJSON(json) {
      return new Sport(json);
   }
}

export class EventSite {
   constructor({ id, eventID, site, managerName, gender, vehicle, esDivisions = [] }) {
		this.id = id;
		this.eventID = eventID;
		this.site = Utils.parseToInstance(site, Site);
		this.managerName = managerName;
      this.gender = gender;
		this.vehicle = Utils.parseToInstance(vehicle, Vehicle);
		this.esDivisions = Utils.parseToInstancesArr(esDivisions, EventSiteDivision);
	}

   static fromValues(id, eventID, site, managerName, vehicle, esDivisions = []) {
      return new EventSite({ id, eventID, site, managerName, vehicle, esDivisions });
   }

   static fromJSON(json) {
      return new EventSite(json);
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
   constructor({ id, eshdID, school, completeness = 0, due = null, paid = null, schoolOrderNote = null, 
               invoiceSent = null, messageOrders = [], shirtsByStyle = [], site = undefined, sport = undefined }) {
      this.id = id;
      this.eshdID = eshdID;
      this.school = Utils.parseToInstance(school, School);
      this.completeness = completeness;
      this.due = due;
      this.paid = paid;
      this.schoolOrderNote = schoolOrderNote;
      this.invoiceSent = invoiceSent;
      this.messageOrders = Array.isArray(messageOrders) ? messageOrders : [];
      this.shirtsByStyle = Array.isArray(shirtsByStyle)
         ? shirtsByStyle.map(style => style instanceof Style ? style : style != null ? Style.fromJSON(style) : null).filter(Boolean)
         : [];
      this.site = site;
      this.sport = sport;
   }

   static fromValues(id, eShdID, school, completeness, due, paid, schoolOrderNote, invoiceSent, messageOrders, shirtsByStyle, 
							site, sport) {
      return new SchoolOrder({ id, eShdID, school, completeness, due, paid, schoolOrderNote, invoiceSent, messageOrders, shirtsByStyle, 
										site, sport });
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
      console.log(this.shirtsByStyle);
		this.shirtsByStyle.forEach(style => {
			style.sizes.forEach(size => {
				boxTotal += size.quantity;
			});
		});
		return boxTotal;
	}
	
	hasAddOns() {
		return this.shirtsByStyle.some(style => style.shortName !== 'Dairy Hoods');
	}
	
	getTeamStyle() {
		return this.shirtsByStyle.find(style => style.shortName === 'Dairy Hoods');
	}
	
	getAddedStyles() {
		return this.shirtsByStyle.filter(style => style.shortName !== 'Dairy Hoods')
	}
	
	getMinSize() {
		let min = Infinity;
		this.shirtsByStyle.forEach(style => {
			style.sizes.forEach(size => {
				if (size.id < min) min = size.id;
			});
		});
		return min;
	}
	
	getMaxSize() {
		let max = 0;
		this.shirtsByStyle.forEach(style => {
			style.sizes.forEach(size => {
				if (size.id > max) max = size.id;
			});
		});
		return max;
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

      this.sizeMap = {};
      for (const size of this.sizes) {
         if (size && size.charName) this.sizeMap[size.charName] = size;
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
      return new Person({ id, name, email, phone, extension, fax });
   }

   static fromJSON(json) {
      return new Person(json);
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


