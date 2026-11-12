

export class Employee {
   static registry = null;

   constructor({ id, name, shortName, phone, email, payRate }) {
      this.id = id;
      this.name = name;
      this.shortName = shortName;
      this.phone = phone;
      this.email = email;
      this.payRate = payRate;
   }


}
