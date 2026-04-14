// IMPORT ////////////////////////////////////////////////////////////////////////////////////
import { init } from './scripts/initialization.js';
	// runtime container. holds some stuff to be made widely available through the code
import { runtime } from './scripts/runtime.js';


	// make runtime available in console
window.__runtime = runtime;

	// call init onload
document.addEventListener('DOMContentLoaded', init);
