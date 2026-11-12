

export class Size {
   static registry = null;

   constructor({ id, name, charName, displayChar, sizingCategoryID, quantity }) {
      this.id = id;
      this.name = name;
      this.charName = charName;
      this.displayChar = displayChar;
      this.sizingCategoryID = sizingCategoryID;
      this.quantity = quantity;
   }


}
