import { Cost } from './Cost.js';
import * as Utils from '../../utilities.js';

export class EventSiteCost {
   constructor({ id, esID, costID, rate, quantity, note, cost }) {
      this.id = id;
      this.esID = esID;
      this.costID = costID;
      this.rate = rate;
      this.quantity = quantity;
      this.note = note;
      this.cost = Utils.parseToInstance(cost, Cost);
   }


}
