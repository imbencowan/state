

export class Cost {
   static registry = null;

   constructor({ id, name, rate, units }) {
      this.id = id;
      this.name = name;
      this.rate = rate;
      this.units = units
   }

   static fromValues(id, name, rate, units) {
      return new Cost({ id, name, rate, units });
   }

   static fromJSON(json) {
      return new Cost(json);
   }
}
