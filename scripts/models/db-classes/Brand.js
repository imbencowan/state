

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
