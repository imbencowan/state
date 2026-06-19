// IMPORT ////////////////////////////////////////////////////////////////////////////////////
import { init } from './scripts/initialization.js';
import { router } from './scripts/router.js';
	// runtime container. holds some stuff to be made widely available through the code
import { runtime } from './scripts/runtime.js';


	// make runtime available in console
window.__runtime = runtime;

	
	// initialize the page
document.addEventListener('DOMContentLoaded', async () => {
		// call init first 
	await init();
		// parse the initial url
	await router(); 
		// add a listener for browser forward/back navigation
	window.addEventListener('popstate', async () => { await router(); });
});