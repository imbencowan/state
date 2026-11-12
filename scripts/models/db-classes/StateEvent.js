import { Series } from './Series.js';
import { EventSite } from './EventSite.js';

import * as Utils from '../../utilities.js';
import { sizeList, BOX_QUANTITIES, DAIRY_STYLE_ID, DAIRY_COLOR_ID, SCHOOL_NAMES_TRANSFER_ID, ID_SALES_TAX } from '../../constants.js';

// define how an event works from json
export class StateEvent {
   constructor({ id, series, startDate, endDate, year, eventSites = [] }) {
      this.id = id;
      this.series = Utils.parseToInstance(series, Series);
      this.startDate = Utils.safeParseDate(startDate.date);
      this.endDate = Utils.safeParseDate(endDate.date);
      this.year = year;
		this.eventSites = Utils.parseToInstancesArr(eventSites, EventSite);
      this.esMap = null;
      this.esdMap = null;
      this.orderMap = null;
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
	
	getESDivisionByID(id) {
		id = Number(id);
      
      if (!this.esdMap) {
         this.esdMap = new Map();

         for (const eSite of this.eventSites) {
            for (const d of eSite.esDivisions) {
               this.esdMap.set(d.id, d); 
            }
         }
      }

      return this.esdMap.get(id);
	}
	
	getRealYear() {
		return this.startDate.getFullYear().toString().slice(-2);
	}

   getDateRangeString() {
      return Utils.getDateRangeString(this.startDate, this.endDate);
   }
	
	getEsdByDivIDAndGenderID(divID, genderID = null) {
		if (divID < this.series.minDiv) divID = this.series.minDiv;
		for (const es of this.eventSites) {
         for (const esd of es.esDivisions) {
            if (esd.division.id === Number(divID) && ((genderID === null) || (esd.gender.id === Number(genderID)))) return esd;
         }
		}
      
		return null;
	}

   getOrderByID(id) {
      id = Number(id);
      
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

   getPaymentTotals() {
      return this.eventSites.reduce((totals, eSite) => {
         totals.cash += Number(eSite.cash ?? 0);
         totals.card += Number(eSite.card ?? 0);
         totals.checks += Number(eSite.checks ?? 0);
         return totals;
      }, { cash: 0, card: 0, checks: 0 });
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
                     // get just the dairy hoods
                  const dStyle = so.getTeamStyle();
                  const dHoods = dStyle?.colors[DAIRY_COLOR_ID];

                  if (dHoods) {
                     for (const [sizeChar, soi] of Object.entries(dHoods.sizeMap)) {
                           // make sure displayChar is valid
                        if (!(sizeChar in neededSizes)) throw new Error(`Unknown size: ${sizeChar}`);
                        neededSizes[sizeChar] += soi.quantity;
                        neededSizes.total += soi.quantity;
                     }
                  }
               }
            }
         }
      }

      return neededSizes;
   }

   getNeededBoxes() {
      const boxSizes = Object.keys(BOX_QUANTITIES);
      const neededBoxes = Object.fromEntries(boxSizes.map(size => [size, 0]));
      neededBoxes.total = 0;

      for (const es of this.eventSites) {
         for (const esd of es.esDivisions) {
            for (const so of esd.schoolOrders) {
               if (!so.completeness && (so.qualifiers === null || so.getDairyTotal() <= so.qualifiers)) {
                  let remaining = so.getBoxTotal();
                  while (remaining > 0) {
                     const boxSize = boxSizes.find(size => remaining <= BOX_QUANTITIES[size])
                        ?? boxSizes[boxSizes.length - 1];
                     neededBoxes[boxSize]++;
                     neededBoxes.total++;
                     remaining -= BOX_QUANTITIES[boxSize];
                  }
               }
            }
         }
      }

      return neededBoxes;
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
                  let seriesGenderStr = '';
                  if (this.series.name === "Soccer") {
                     if (order.genderID === 1) seriesGenderStr += ' - Boys';
                     if (order.genderID === 2) seriesGenderStr += ' - Girls';
                  }
                  
						order.division = eshd.division.name + divGenderStr;
						order.site = eventSite.site.name;
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

   isOneActivity() {
      const firstActivityID = this.eventSites
         .flatMap(es => es.esDivisions)
         .find(esd => esd.activity?.id != null)?.activity.id;

      return this.eventSites.every(es =>
         es.esDivisions.every(esd => esd.activity?.id == firstActivityID)
      );
   }

   getRowsForItemsSoldByStyleAndColor() {
      const itemsByStyleAndColor = new Map();

      let subTotal = 0;
      let totalTotal = 0;
      let totalItems = 0;

      const addSoldQuantity = (item, quantity) => {
         const { style, color, size } = item;
         const isAccessory = style.sizingCategoryID === 4;
         if (![1, 2, 3, 4].includes(style.sizingCategoryID)) return;
         if (!isAccessory && !sizeList.includes(size.displayChar)) {
            throw new Error(`Unknown size: ${size.displayChar}`);
         }

         const key = `${style.id}-${color.id}`;
         itemsByStyleAndColor.set(key, itemsByStyleAndColor.get(key) ?? {
            style,
            color,
            sizes: Object.fromEntries(sizeList.map(sizeChar => [
               sizeChar,
               isAccessory ? '' : { quantity: 0, alu: null, price: null }
            ])),
            total: 0
         });

         const row = itemsByStyleAndColor.get(key);
         if (!isAccessory) {
            const sizeCell = row.sizes[size.displayChar];
            sizeCell.quantity += quantity;
            sizeCell.alu = item.alu;
            sizeCell.price = item.price;
         }
         row.total += quantity;
      };

      for (const es of this.eventSites) {
         for (const inventoryItem of es.inventory) {

            addSoldQuantity(inventoryItem.item, inventoryItem.getSoldQ());
         }

         for (const esd of es.esDivisions) {
            for (const order of esd.schoolOrders) {
               for (const orderItem of order.oItems) {
                  if (orderItem.item.style.id !== DAIRY_STYLE_ID) {
                     addSoldQuantity(orderItem.item, orderItem.quantity);
                  }
               }
            }
         }
      }

      const rows = [...itemsByStyleAndColor.values()]
         .sort((a, b) => a.style.listOrder - b.style.listOrder || a.color.name.localeCompare(b.color.name))
         .map(({ style, color, sizes, total }) => [
            style.inventoryName,
            style.code,
            color.name,
            ...sizeList.map(size => {
               if (sizes[size] === '') return '';
               const { quantity, alu, price } = sizes[size];
               if (quantity === 0) return 0;

               const adjustedPrice = Number(price) / (1 + Number(ID_SALES_TAX));
               const formattedPrice = price != null && Number.isFinite(adjustedPrice)
                  ? `$${adjustedPrice.toFixed(2)}`
                  : String(price ?? '');
               const totalPrice = quantity * adjustedPrice;
               subTotal += totalPrice;
               totalItems += quantity;
               return [quantity, alu ?? '', formattedPrice, totalPrice.toFixed(2)].join('\n');
            }),
            total
         ]);

      const transfersByPrice = new Map();
      for (const es of this.eventSites) {
         for (const transfer of es.transfers) {
            if (Number(transfer.transferID) === SCHOOL_NAMES_TRANSFER_ID || transfer.soldQ <= 0) continue;

            const price = Number(transfer.price);
            if (!Number.isFinite(price)) throw new Error(`Invalid transfer price: ${transfer.price}`);

            transfersByPrice.set(price, (transfersByPrice.get(price) ?? 0) + Number(transfer.soldQ));
         }
      }

      for (const [price, quantity] of [...transfersByPrice].sort(([a], [b]) => a - b)) {
         rows.push([
            `Transfers ($${price.toFixed(2)} each)`,
            '',
            '',
            ...sizeList.map(() => ''),
            quantity
         ]);

         subTotal += quantity * price;
         totalItems += quantity;
      }

      rows.push([ 'Subtotal', subTotal.toFixed(2) ]);
      rows.push([ 'Total Items', totalItems ]);

      return rows;
   }

      // this function is a wrapper to conveniently call on a stateEvent instance
         // allItems must be passed in from runtime via the caller to avoid circular dependencies
         // you can't import runtime to this module
   async loadInventories(allItems, allTransfers) {
         // filter for sites missing inventory
      const missingSites = this.eventSites.filter(s => !s.inventoryLoaded);
         // return early if no sites are missing inventory
      if (missingSites.length === 0) return {};

      await EventSite.fetchInventories(missingSites, allItems, allTransfers);  
   }

      // this is a convenience wrapper like loadInventories
   async loadOrders(allItems, allTransfers) {
      await EventSite.fetchOrders(this.eventSites, allItems, allTransfers);
   }
}
