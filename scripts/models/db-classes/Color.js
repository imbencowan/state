

export class Color {
   static registry = null;

   constructor({ id, name, hex }) {
      this.id = id;
      this.name = name;
      this.hex = `#${hex}`;
   }


}
