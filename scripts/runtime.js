	//////////////////// a container to hold data at runtime
	// holds page data, made available to the console
import { makeDataLoader } from "./utilities.js";
import { makeItemLoader, makeSeasonLoader, makeSportLoader } from "./models/loaders.js";
import { Color, Cost, Division, Employee, Item, Person, School, Season, Site, Size, Sport, Style, Transfer, Vehicle } 
			from "./models/db-classes.js";

export const runtime = {
		// global containers. accessors as well if they utilize 
	activeOrder: undefined,
	stateEvent: undefined,
		// this one prevents different actions being called while others are still open
	activeMode: undefined,
		// makeDataLoader(srvrClassName, jsClass = null, srvrFnctn = "getAllFromDB")
	allADs: makeDataLoader('Person', Person, "getAllADs"),
	allColors: makeDataLoader('Color', Color),
	allCosts: makeDataLoader('Cost', Cost),
	allDivisions: makeDataLoader('Division', Division),
	allEmployees: makeDataLoader('Employee', Employee),
	allItems: makeItemLoader(),
	allSchools: makeDataLoader('School', School),
	allSeasons: makeSeasonLoader(),
	allSites: makeDataLoader('Site', Site),
	allSizes: makeDataLoader('Size', Size),
	allSports: makeSportLoader(),
	allStyles: makeDataLoader('Style', Style),
	allTransfers: makeDataLoader('Transfer', Transfer),
	allVehicles: makeDataLoader('Vehicle', Vehicle)
};


	// define some look up info
Color.registry = runtime.allColors;
Division.registry = runtime.allDivisions;
Employee.registry = runtime.allEmployees;
Item.registry = runtime.allItems;
School.registry = runtime.allSchools;
Site.registry = runtime.allSites;
Size.registry = runtime.allSizes;
Sport.registry = runtime.allSports;
Style.registry = runtime.allStyles;
Transfer.registry = runtime.allTransfers;
Vehicle.registry = runtime.allVehicles;
