import { Employee } from './Employee.js';
import * as Utils from '../../utilities.js';

export class EventSiteEmployee {
   constructor({ id, esID, employeeID, payRate, hours, employee }) {
      this.id = id;
      this.esID = esID;
      this.employeeID = employeeID;
      this.payRate = payRate;
      this.hours = hours;
      this.employee = Utils.parseToInstance(employee, Employee);
   }


}
