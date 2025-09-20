// IMPORT ////////////////////////////////////////////////////////////////////////////////////
import { init } from './scripts/initialization.js';
	// runtime container. holds some stuff to be made widely available through the code
import { runtime } from './scripts/runtime.js';
	// test stuff
import { changeSelectedTable, getAnItem, getAllItems, addAnItem, deleteAnItem, showTable } from './scripts/test-stuff.js';


	// make runtime available in console
window.__runtime = runtime;

	// call init onload
document.addEventListener('DOMContentLoaded', init);



