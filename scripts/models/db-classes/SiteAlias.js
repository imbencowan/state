

export class SiteAlias {
   constructor({ id, siteID, alias }) {
      this.id = id;
      this.siteID = siteID;
      this.alias = alias;
   }

   static fromValues(id, siteID, alias) {
      return new SiteAlias({ id, siteID, alias });
   }

   static fromJSON(json) {
      return new SiteAlias(json);
   }
}
