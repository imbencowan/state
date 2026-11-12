

export class Activity {
   constructor({ id, name, isIndividualed, minDiv }) {
      this.id = id;
      this.name = name;
      this.isIndividualed = isIndividualed;
      this.minDiv = minDiv
   }

   static fromValues(id, name, isIndividualed, minDiv) {
      return new Activity({ id, name, isIndividualed, minDiv });
   }

   static fromJSON(json) {
      return new Activity(json);
   }
}
