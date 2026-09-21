	//////////////////// a container to hold data at runtime
	// holds page data, made available to the console
import { makeDataLoader, makeItemLoader, makeSeasonLoader, makeSeriesLoader } from "./models/loaders.js";
import { Activity, Color, Cost, Division, Employee, Item, Person, School, Season, Series, Site, SiteAlias, Size, 
			Style, Transfer, Vehicle } from "./models/db-classes.js";

export const runtime = {
		// global containers
	activeOrder: undefined,
	stateEvent: undefined,
	yearEvents: undefined,
		// this one prevents different actions being called while others are still open
	activeMode: undefined,
		// makeDataLoader(srvrClassName, jsClass = null, srvrFnctn = "getAllFromDB")
	allActivities: makeDataLoader('Activity', Activity),
	allADs: makeDataLoader('Person', Person, "getAllADs"),
	allColors: makeDataLoader('Color', Color),
	allCosts: makeDataLoader('Cost', Cost),
	allDivisions: makeDataLoader('Division', Division),
	allEmployees: makeDataLoader('Employee', Employee),
	allEventSeries: makeSeriesLoader(),
	allItems: makeItemLoader(),
	allSchools: makeDataLoader('School', School),
	allSeasons: makeSeasonLoader(),
	allSites: makeDataLoader('Site', Site),
	allSiteAliases: makeDataLoader('SiteAlias', SiteAlias),
	allSizes: makeDataLoader('Size', Size),
	allStyles: makeDataLoader('Style', Style),
	allTransfers: makeDataLoader('Transfer', Transfer),
	allVehicles: makeDataLoader('Vehicle', Vehicle),

		// really just a utility for the router, so new pages don't have stale data here
	clearPageData() {
		this.stateEvent = undefined;
		this.yearEvents = undefined;
		this.activeMode = undefined;
	}
};


	// define some look up info
Activity.registry = runtime.allActivities;
Color.registry = runtime.allColors;
Division.registry = runtime.allDivisions;
Employee.registry = runtime.allEmployees;
Item.registry = runtime.allItems;
School.registry = runtime.allSchools;
Site.registry = runtime.allSites;
Size.registry = runtime.allSizes;
Series.registry = runtime.allEventSeries;
Style.registry = runtime.allStyles;
Transfer.registry = runtime.allTransfers;
Vehicle.registry = runtime.allVehicles;
