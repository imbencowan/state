import { Series } from './Series.js';
import { Site } from './Site.js';
import { Vehicle } from './Vehicle.js';
import { EventSiteDivision } from './EventSiteDivision.js';
import { Division } from './Division.js';
import { SchoolOrder } from './SchoolOrder.js';
import { School } from './School.js';
import { Item } from './Item.js';
import { InventoryItem } from './InventoryItem.js';
import { Style } from './Style.js';
import { Size } from './Size.js';
import { Employee } from './Employee.js';
import { EventSiteEmployee } from './EventSiteEmployee.js';
import { Color } from './Color.js';
import { Transfer } from './Transfer.js';
import { InventoryTransfer } from './InventoryTransfer.js';
import { Cost } from './Cost.js';
import { EventSiteCost } from './EventSiteCost.js';
import { Activity } from './Activity.js';
import { Gender } from './Gender.js';
import * as Utils from '../../utilities.js';
import { parseWithRegistry } from '../../hydration.js';
import { ADULT_HOOD_STYLE_ID, DAIRY_STYLE_ID } from '../../constants.js';
import { actionFetch } from '../../fetch.js';
import { getFormattedDivsString } from '../../formatters.js';

export class EventSite {
   constructor({ id, eventID, site, siteID, managerName, gender, vehicles, employees, inventory, transfers, costs,
               plusSizePricing, esDivisions = [], card = 0, cash = 0, checks = 0, paymentDiscrepancy = 0,
               sNamesAdjustment = 0 }) {
		this.id = id;
		this.eventID = eventID;
		this.site = parseWithRegistry(site, Site, siteID);
		this.managerName = managerName;
      this.gender = gender;
      this.card = card;
      this.cash = cash;
      this.checks = checks;
      this.paymentDiscrepancy = paymentDiscrepancy;
      this.sNamesAdjustment = sNamesAdjustment;
		this.vehicles = Utils.parseToInstancesArr(vehicles, Vehicle);
      this.employees = Utils.parseToInstancesArr(employees, EventSiteEmployee);
      this.inventory = Utils.parseToInstancesArr(inventory, InventoryItem);
      this.transfers = Utils.parseToInstancesArr(transfers, InventoryTransfer);
      this.costs = Utils.parseToInstancesArr(costs, EventSiteCost);
      this.plusSizePricing = plusSizePricing;
      this.inventoryLoaded = false;
      this.costMap = null;
		this.esDivisions = Utils.parseToInstancesArr(esDivisions, EventSiteDivision);
      this.sortESDs();
	}

   static fromValues(id, eventID, site, siteID, managerName, gender, vehicles, employees, inventory, transfers, 
                     costs, plusSizePricing, esDivisions = [], card = 0, cash = 0, checks = 0, paymentDiscrepancy = 0,
                     sNamesAdjustment = 0) {
      return new EventSite({ id, eventID, site, siteID, managerName, gender, vehicles, employees, inventory, 
                           transfers, costs, plusSizePricing, esDivisions, card, cash, checks, paymentDiscrepancy,
                           sNamesAdjustment });
   }

   static fromJSON(json) {
      return new EventSite(json);
   }

   sortESDs() {
      this.esDivisions.sort((a, b) =>
         a.activity.id - b.activity.id ||
            // sort divisions descending
         b.division.id - a.division.id ||
         a.gender.id - b.gender.id
      );
   }

   getDivisionsString() {
      const divisions = [];
      for (const esd of this.esDivisions) {
         divisions.push(esd.division);
      }

      const divsStr = getFormattedDivsString(divisions, this.getESDsGender());
      return divsStr;
   }

   getESDsGender() {
         // establish the first esd's gender for reference
       const gender = this.esDivisions[0]?.gender;

      if ((gender?.id === 1 || gender?.id === 2) &&
         this.esDivisions.every(esd => esd.gender.id === gender.id)) {
         return gender;
      }

         // fall back
      return Gender.fromValues(3, '');
   }

   getSeriesStrGendered(sEvent) {
      const genderStr = this.gender ? (' ' + this.gender.name) : '';
      return sEvent.series.name + genderStr;
   }

   getGenderName() {
      return this.gender?.name || '';
   }

   getEmployeesString() {
      if (!this.employees || this.employees.length === 0) return '';

      return this.employees.map(e => e.employee.shortName).join(' / ');
   }

   getVehicleString() {
      if (!this.vehicles || this.vehicles.length === 0) return '';

      return this.vehicles.map(v => v.name).join(',  ');
   }

   getCostByID(id) {
      id = Number(id);
      if (!this.costMap) {
         this.costMap = new Map();

         for (const esc of this.costs) {
            this.costMap.set(esc.cost.id, esc);
         }
      }

      return this.costMap.get(id);
   }

      // used to prefill cost data in the results tab
   getLikelyNumberPresses() {
      return Math.min(this.employees.length, 4);
   }

   getMainTransfers() {
      return this.transfers.find(t => t.transfer.transferName === "event transfers");
   }

   getAdjustedSchoolNamesSoldQ(soldQ) {
      return Number(soldQ) - Number(this.sNamesAdjustment ?? 0);
   }

   getSchoolOrderTransferQ(transferID) {
      let quantity = 0;
      for (const esd of this.esDivisions) {
         for (const order of esd.schoolOrders) {
            for (const transfer of order.oTransfers) {
               if (Number(transfer.transferID) === Number(transferID)) {
                  quantity += Number(transfer.quantity ?? 0);
               }
            }
         }
      }

      return quantity;
   }

   getStateChampQuantity() {
      const champs = this.transfers.find(t => t.transfer.transferName === "state champions");
      const champ = this.transfers.find(t => t.transfer.transferName === "state champion");
         // use 0 when either isn't attached to the event
      return (champs?.soldQ ?? 0) + (champ?.soldQ ?? 0);
   }

      // this is how much money we actually received
   getReceivedDollars() {
      return Number(this.cash ?? 0) + Number(this.card ?? 0) + Number(this.checks ?? 0);
   }

      // thid does not include preorders
   getRetailTotal() {
      const itemsTotal = this.inventory.reduce((total, inv) => total + inv.getSoldDollars(), 0);
      const transfersTotal = this.transfers.reduce((total, tr) => total + tr.getSoldDollars(), 0);
      // console.log(itemsTotal, transfersTotal);

      return itemsTotal + transfersTotal;
   }

      // this does include preorders
   getSalesTotal() {
      let preOrderHoods = 0;

      for (const esd of this.esDivisions) {
         for (const so of esd.schoolOrders) {
            preOrderHoods += so.oItems.reduce((total, soi) => total + (soi.item.style.id === ADULT_HOOD_STYLE_ID ? soi.quantity : 0), 0);
         }
      }

      const retailTotal = this.getRetailTotal();

      let preorderTotal = 0;

      for (const esd of this.esDivisions) {
         preorderTotal += esd.schoolOrders.reduce((total, so) => total + so.getPreorderDollars(), 0);
      }

      return retailTotal + preorderTotal;
   }

   // getStyleColorDollars(styleID, colorID) {
   //    const resale = this.inventory.reduce((total, inv) => total + ((inv.item.style.id === styleID && inv.item.color.id === colorID) ? inv.getSoldDollars() : 0), 0);
      
   //     let preorderTotal = 0;

   //    for (const esd of this.esDivisions) {
   //       for (const so of esd.schoolOrders) {
   //          for (const soi of so.oItems) {
   //             if (soi.item.style.id === styleID && soi.item.color.id === colorID) {
   //                console.log(so.school.shortName, soi.getSoldDollars());
   //                preorderTotal += soi.getSoldDollars();
   //             // console.log(soi.price);
   //             }
   //          }
   //       }
   //    }

   //    return resale + preorderTotal;
   // }

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
         const invItem = this.inventory.find(ii => ii.item.id === u.itemID);
         invItem.startQ = Number(u.quantity);
      });
   }

   getReportInventory() {
      const PLUS_SIZECHARS = new Set([ '2X', '3X', '4X' ]);
      const plusSizes = { '2X': { sold: 0, lost: 0 }, '3X': { sold: 0, lost: 0 }, '4X': { sold: 0, lost: 0 } };

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
            garments[styleID].colors[colorID] ??= { ...inv.item.color, retailTotal: 0, sOrderTotal: 0, lostTotal: 0,
                                                   cost: null, price: null };

               // add the inventory item
            garments[styleID].colors[colorID].retailTotal += sold;
            garments[styleID].colors[colorID].lostTotal += inv.writeOffQ;
               // ??= allows assigning once
            if (!PLUS_SIZECHARS.has(sChar)) {
               garments[styleID].colors[colorID].cost ??= inv.cost;
               garments[styleID].colors[colorID].price ??= inv.price;
            } else {
               plusSizes[sChar].sold += sold;
               plusSizes[sChar].lost += inv.writeOffQ;
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
               if (PLUS_SIZECHARS.has(sChar)) plusSizes[sChar].sold += soi.quantity;
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

   async refreshInventory(allItems, allTransfers) {
      await EventSite.fetchInventories([ this ], allItems, allTransfers);
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
            // alphabetize the array
         esd.sortSchoolOrders();
      }
   }

      // static batch fetch method
   static async fetchInventories(eSites, allItems, allTransfers) { 
         // make sure these are loaded
      await allItems.load();
      // await allTransfers.load();

         // fetch
      const response = await actionFetch('getInventoryItems', 'Event', { eSiteIDs: eSites.map(s => s.id) });

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
      for (const es of eSites) {
         es.inventoryLoaded = true;
         es.inventory = itemsBySite[es.id] || [];
         es.transfers = transfersBySite[es.id] || [];
      }
   }

      // calls ss function to set InventoryItems pricing = Items pricing.  // then refreshes this.inventory
   async updateCostAndPrice(allItems, allTransfers) {
      const response = await actionFetch("syncInventoryPricing", "EventSite", { esID: this.id });
      if (response.success) {
         await this.refreshInventory(allItems, allTransfers);
         return response;
      }
   }

   async refreshCosts() {
      const response = await actionFetch('getCosts', 'EventSite', { esID: this.id });
      if (response.success) this.costs = Utils.parseToInstancesArr(response.data.costs, EventSiteCost);
   }
}
