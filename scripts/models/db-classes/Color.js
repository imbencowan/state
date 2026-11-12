

export class Color {
   static registry = null;

   constructor({ id, name, hex }) {
      this.id = id;
      this.name = name;
      this.hex = `#${hex}`;
   }

   static fromValues(id, name, hex) {
      return new Color({ id, name, hex });
   }

   static fromJSON(json) {
      return new Color(json);
   }
}
