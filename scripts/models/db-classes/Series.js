import * as Utils from '../../utilities.js';

export class Series {
   constructor({ id, name, isGendered, isIndividualed, maxTeamSize, minDiv, labelColor }) {
      this.id = id;
      this.name = name;
         // url path. 
      this.slug = Utils.slugify(name);
      this.isGendered = isGendered;
      this.isIndividualed = isIndividualed;
      this.maxTeamSize = maxTeamSize;
      this.minDiv = minDiv;
      this.labelColor = labelColor;
   }


}
