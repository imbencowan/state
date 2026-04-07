import { runtime } from './runtime.js';
import { myFetch } from './fetch.js';
import { ActionRequest } from './models/other-classes.js'; 
import { StateEvent, Style, Item } from './models/db-classes.js'  
    // function to be attached to a listener
import { submitOrderFiles } from './order-submission.js';
	// utilities?
import * as Utils from './utilities.js';
    // modal initializaion
import { init as modalInit } from './modal.js';
    // function for a listener
import { goToEventPage, buildEventPage, addEventPageFunctionality } from './pages/event.js';
import { showPage } from './pages/page-handling.js';
import { addShowYearFunctionality } from './pages/year.js';



	// init is called onload() and does stuff after the script and html is in place
		// importantly it adds event listeners after the elements exist
export async function init() {
		// build the nav bar i guess
	buildNavList();
	buildNavList2();

		// add the file submit listenter
	document.getElementById('fileInput').addEventListener('change', submitOrderFiles);

		// load size codes
	let request = new ActionRequest('loadSizeCodesByStyle', 'Item');
	let sizeData = await myFetch(request);
	runtime.sizeCodesByStyles = sizeData.data.map(styleData => Style.fromJSON(styleData));
	runtime.styleMap = Utils.mapObjsBy(runtime.sizeCodesByStyles);
	
	await Promise.all([
		runtime.allSizes.load(),
		runtime.allColors.load(),
		runtime.allStyles.load(),
		runtime.allTransfers.load()
	]);
	await runtime.allItems.load();


		// display next event
	request = new ActionRequest('showEventByDate', 'Event');
	
	let responseJSON = await myFetch(request);
	
	document.getElementById("display").innerHTML = responseJSON.html;
		// if we returned an event, not an empty display
	if (responseJSON.data !== null) {
			// put the event in working memory
		runtime.stateEvent = StateEvent.fromJSON(responseJSON.data);

		const pageContent = buildEventPage(runtime.stateEvent);
		document.getElementById("display").replaceChildren(pageContent);

			// attach event listeners to the html in "display"
		addEventPageFunctionality();
	}

	
		// make the modal
	modalInit();
}

function buildNavList() {
	const sportList = [
		['Golf', 1],
		['Soccer', 2],
		['Volleyball', 3],
		['X-Country', 4],
		['Swimming', 5],
		['Football', 6],
		['Drama', 7],
		['G Basketball', 8],
		['Wrestling', 9],
		['Dance', 10],
		['Cheer', 11],
		['B Basketball', 12],
		['Debate', 13],
		['Speech', 14],
		['Esports', 19],
		['Softball', 15],
		['Baseball', 16],
		['Tennis', 17],
		['Track', 18]
	];
		// get the nav bar
	let navList = document.getElementById("stateNavList");
	sportList.forEach((sport) => {
			// create the element
		let newLI = document.createElement("li");
		newLI.innerHTML = sport[0];
			// add a listener to load the appropriate content when clicked
		newLI.addEventListener('click', function(){ goToEventPage(sport); });
			// add it to the page
		navList.appendChild(newLI);
	});
}

function buildNavList2() {
		// get the nav bar
	let navList = document.getElementById("nav2List");

		// [<h>, serverFunc, serverClass, jsFunc]
	const nav2Items = [
		['Year', 'showYear', 'Year'],
		['Schools', 'showSchools', 'School'],
		['Items', 'showItems', 'Item'],
		['Tests', 'showTests', 'Test']
	];
	nav2Items.forEach((item) => {
			// create the element
		let newLI = document.createElement("li");
		newLI.innerHTML = item[0];

			// add a listener to load the appropriate content when clicked
		newLI.addEventListener('click', async function() {
			let data = null;
			if (item[1] == 'showYear' || item[1] == 'showInventories') {
				data = { year: document.getElementById('selectYear').value };
			}

			if (item[3] == 'showInventories') {
				showInventories(data);
			} else {
					// await the main content load
				await showPage(item[1], item[2], data);
			}

				// additional behavior after content is loaded
			if (item[1] === 'showYear') {
				addShowYearFunctionality();
			}
      });
			// add it to the page
		navList.appendChild(newLI);
	});
}