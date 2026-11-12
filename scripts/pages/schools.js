import { runtime } from '../runtime.js';
import { buildElement } from '../utilities.js';

export async function goToSchoolsPage() {
   runtime.stateEvent = null;
   runtime.activeMode = null;

   await runtime.allDivisions.load();
   const schools = await runtime.allSchools.load();
   buildSchoolsPage(schools);
}

function buildSchoolsPage(schools) {
   const display = document.getElementById("display");
   const title = buildElement("h2", { text: "Schools" });
   const table = buildSchoolsTable(schools);

   display.replaceChildren(title, table);
}

function buildSchoolsTable(schools) {
   const headers = [ "", "School", "District", "Division" ];
   const thead = buildElement("thead", {
      children: buildElement("tr", {
         children: headers.map(text => buildElement("th", { text }))
      })
   });
   const tbody = buildElement("tbody", {
      children: Object.values(schools).map(school =>
         buildElement("tr", {
            id: `row${school.id}`,
            children: [
               buildElement("td", { text: school.id }),
               buildElement("td", { text: school.shortName }),
               buildElement("td", { text: school.district?.name ?? "" }),
               buildElement("td", { text: school.division?.name ?? "" })
            ]
         })
      )
   });

   return buildElement("table", {
      id: "eventsTable",
      classes: "eventsTable",
      children: [thead, tbody]
   });
}