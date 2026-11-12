

export class Person {
   constructor({ id, name, email, phone, extension, fax }) {
      this.id = id;
      this.name = name;
      this.email = email;
      this.phone = phone;
      this.extension = extension;
      this.fax = fax;
   }

   static fromValues(id, name, email, phone, extension, fax) {
      return new Person({ id, name, email, phone, extension, fax });
   }

   static fromJSON(json) {
      return new Person(json);
   }
}
