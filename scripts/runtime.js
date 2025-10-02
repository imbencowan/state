	//////////////////// a container to hold data at runtime
	// holds page data, made available to the console
import { makeDataLoader } from "./utilities.js";
import { Color, Division, Employee, Item, Person, School, Site, Size, Sport, Style, Vehicle } 
			from "./models/db-classes.js";

export const runtime = {
		// global containers. accessors as well if they utilize 
	stateEvent: undefined,
	sizeCodesByStyles: undefined,
	styleMap: undefined,
		// makeDataLoader(srvrClassName, jsClass = null, srvrFnctn = "getAllFromDB")
	allADs: makeDataLoader('Person', Person, "getAllADs"),
	allColors: makeDataLoader('Color', Color),
	allDivisions: makeDataLoader('Division', Division),
	allEmployees: makeDataLoader('Employee', Employee),
	allItems: makeDataLoader('Item', Item),
	allSchools: makeDataLoader('School', School),
	allSites: makeDataLoader('Site', Site),
	allSizes: makeDataLoader('Size', Size),
	allSports: makeDataLoader('Sport', Sport),
	allStyles: makeDataLoader('Style', Style),
	allVehicles: makeDataLoader('Vehicle', Vehicle),
		// this one prevents different actions being called while others are still open
	activeMode: undefined
};