import { Activity } from './Activity.js';

export class Gender {
   constructor({ id, name }) {
      this.id = id;
      this.name = name;
   }

   static fromValues(id, name) {
      return new Activity({ id, name });
   }

   static fromJSON(json) {
      return new Activity(json);
   }
}
