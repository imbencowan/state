

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

   static fromValues(id, name, shortName, phone, email, payRate) {
      return new Employee({ id, name, phone, email, payRate });
   }

   static fromJSON(json) {
      return new Employee(json);
   }
}
