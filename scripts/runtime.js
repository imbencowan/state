	//////////////////// a container to hold data at runtime
	// holds page data, made available to the console
import { makeDataLoader } from "./utilities.js";
import { Division, Employee, Person, School, Site, Sport, Vehicle } from "./models/db-classes.js";

export const runtime = {
		// global containers. accessors as well if they utilize 
	stateEvent: undefined,
	sizeCodesByStyles: undefined,
	styleMap: undefined,
		// makeDataLoader(srvrClassName, jsClass = null, srvrFnctn = "getAllFromDB")
	allADs: makeDataLoader('Person', Person, "getAllADs"),
	allDivisions: makeDataLoader('Division', Division),
	allEmployees: makeDataLoader('Employee', Employee),
	allItems: undefined,
	allSchools: makeDataLoader('School', School),
	allSites: makeDataLoader('Site', Site),
	allSports: makeDataLoader('Sport', Sport),
	allVehicles: makeDataLoader('Vehicle', Vehicle),
		// this one prevents different actions being called while others are still open
	activeMode: undefined
};