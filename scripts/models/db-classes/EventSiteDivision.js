import { Division } from './Division.js';
import { SchoolOrder } from './SchoolOrder.js';
import { Activity } from './Activity.js';
import * as Utils from '../../utilities.js';
import { parseWithRegistry } from '../../hydration.js';

export class EventSiteDivision {
   constructor({ id, eventSiteID, divisionID, division, genderID, gender, activityID, activity, 
               schoolOrders = [] }) {
      this.id = id;
      this.eventSiteID = eventSiteID;
      this.division = parseWithRegistry(division, Division, divisionID);
      this.activity = parseWithRegistry(activity, Activity, activityID);
      this.gender = gender;
      this.schoolOrders = Utils.parseToInstancesArr(schoolOrders, SchoolOrder);
      this.ordersLoaded = this.schoolOrders.length > 0;
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
	
	// getTeamsWithAddOns() {
	// 	return this.schoolOrders.filter(order =>
	// 		order.hasAddOns()
	// 	);
	// }
	
	getMaxSize() {
		let max = 0;
		this.schoolOrders.forEach(order => {
			order.oItems.forEach(soi => {
					if (soi.item.size.id > max) max = soi.item.size.id;
			});
		});
		return max;
	}

   getESDName(includeActivity = false) {
      const activityStr = includeActivity ? (' ' + this.activity.name) : '';
      const genderStr = this.gender.name ? (' ' + this.gender.name) : '';
      return `${this.division.name}${genderStr}${activityStr}`;
   }
}
