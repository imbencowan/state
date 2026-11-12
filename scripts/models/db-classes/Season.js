export class Season {
   constructor({ id, name, startMonth, startDay, endMonth, endDay, color }) {
      this.id = id;
      this.name = name;
      this.startMonth = startMonth;
      this.startDay = startDay;
      this.endMonth = endMonth;
      this.endDay = endDay;
      this.color = color;
   }


   containsDate(date) {
      let month, day;

      if (date instanceof Date) {
         month = date.getMonth() + 1;
         day = date.getDate();
      } else {
         const d = new Date(date);
         month = d.getUTCMonth() + 1;
         day = d.getUTCDate();
      }

         // make an integer that sequences month-day in one value
      const monthDay = (month * 100) + day;

      const start = this.startMonth * 100 + this.startDay;
      const end = this.endMonth * 100 + this.endDay;
      
         // Doesn't cross New Year's
      if (start <= end) return monthDay >= start && monthDay <= end;

         // Crosses New Year's
      return monthDay >= start || monthDay <= end;
   }

   static sortByStartDate(allSeasons) {
      return [...allSeasons].sort((a, b) => {
         const aStart = (a.startMonth * 100) + a.startDay;
         const bStart = (b.startMonth * 100) + b.startDay;
         return aStart - bStart;
      });
   }
   
   static getCurrentSeason(allSeasons) {
      allSeasons = Season.sortByStartDate(allSeasons);

      const now = new Date();
      const today = ((now.getMonth() + 1) * 100) + now.getDate();

      return allSeasons.find(season => {
         const start = (season.startMonth * 100) + season.startDay;
         const end = (season.endMonth * 100) + season.endDay;

            // if the range crosses the end of the calendar year
         if (start > end) return today >= start || today <= end;

         return today >= start && today <= end;
      }) || null;
   }

   static getNextSeason(allSeasons) {
      allSeasons = Season.sortByStartDate(allSeasons);

      const currentSeason = Season.getCurrentSeason(allSeasons);
      if (!currentSeason) return null;

      const currentI = allSeasons.findIndex(season => season.id === currentSeason.id);
      if (currentI === -1) return null;

      const nextI = (currentI + 1) % allSeasons.length;
      return allSeasons[nextI] || null;
   }
}
