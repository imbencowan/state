import { runtime } from './runtime.js';
import { myFetch } from './fetch.js';
import { ActionRequest } from './models/other-classes.js'; 
import { StateEvent, Style, Item } from './models/db-classes.js'  
    // function to be attached to a listener
import { submitOrderFiles } from './order-submission.js';
	// utilities?
import { buildElement } from './utilities.js';
    // modal initializaion
import { init as modalInit } from './modal.js';
    // function for a listener
import { goToEventPage, buildEventPage, addEventPageFunctionality } from './pages/event.js';

import { navigate } from './navigation.js';



	// init is called onload() and does stuff after the script and html is in place
		// importantly it adds event listeners after the elements exist
export async function init() {
		// build the nav bar i guess
	buildNavList();
	buildNavList2();

	document.getElementById('navContainer').addEventListener('click', async (e) => {
			// get the function to call from. nav2Handlers is a constant of this module
      const li = e.target.closest('li');
      if (!li) return;

		const handler = navigate(li.dataset.route);
		if (!handler) return;

			// is await necessary?
		await handler();
   });

		// add the file submit listenter
	document.getElementById('fileInput').addEventListener('change', submitOrderFiles);
	
		// initial load
			// Sizes, Colors, Styles, and Transfers are all terminal objects with no runtime.all* children
	await Promise.all([
		runtime.allSizes.load(),
		runtime.allColors.load(),
		runtime.allStyles.load(),
		runtime.allTransfers.load()
	]);
	await runtime.allItems.load();


		// make the modal
	modalInit();
}

function buildNavList() {
	const sportList = [
		['Golf', 'golf'],
		['Soccer', 'soccer'],
		['Volleyball', 'volleyball'],
		['X-Country', 'cross-country'],
		['Swimming', 'swimming'],
		['Football', 'football'],
		['Drama', 'drama'],
		['G Basketball', 'girls-basketball'],
		['Wrestling', 'wrestling'],
		['Dance', 'dance'],
		['Cheer', 'cheer'],
		['B Basketball', 'boys-basketball'],
		['Debate', 'debate'],
		['Speech', 'speech'],
		['Esports', 'esports'],
		['Softball', 'softball'],
		['Baseball', 'baseball'],
		['Tennis', 'tennis'],
		['Track', 'track']
	];
		// get the nav bar
	let navList = document.getElementById("stateNavList");
			// create each element and append them to the nav
	sportList.forEach((sport) => {
		navList.appendChild(buildElement("li", { text: sport[0], dataset: { route: sport[1] } }));

	});
}

function buildNavList2() {
		// get the nav bar
	let navList = document.getElementById("nav2List");

		// build each <li>, with a couple data-attrs, and append them to nav2
	[ 'Year', 'Items', 'Schools'].forEach((itm) => {
      navList.appendChild(buildElement("li", { text: itm, dataset: { route: itm.toLowerCase() } }));
   });
}