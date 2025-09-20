	//////////////////// a container to hold data at runtime
	// holds page data, made available to the console
import { makeDataLoader } from "./utilities.js";
import { Employee, Vehicle } from "./models/db-classes.js";

export const runtime = {
		// global containers. accessors as well if they utilize 
	stateEvent: undefined,
	sizeCodesByStyles: undefined,
	styleMap: undefined,
	allEmployees: makeDataLoader('Employee', Employee),
	allItems: undefined,
	allSchools: undefined,
	allVehicles: makeDataLoader('Vehicle', Vehicle),
		// this one prevents different actions being called while others are still open
	activeMode: undefined
};