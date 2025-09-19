	//////////////////// a container to hold data at runtime
	// holds page data, made available to the console
export const runtime = {
		// global containers
	stateEvent: undefined,
	sizeCodesByStyles: undefined,
	styleMap: undefined,
	allEmployees: undefined,
	allItems: undefined,
	allSchools: undefined,
	allVehicles: undefined,
		// this one prevents different actions being called while others are still open
	activeMode: undefined
};