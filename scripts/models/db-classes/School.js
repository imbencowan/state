import { Division } from './Division.js';
import { Person } from './Person.js';
import * as Utils from '../../utilities.js';
import { parseWithRegistry } from '../../hydration.js';

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
