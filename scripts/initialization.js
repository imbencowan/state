import { runtime } from './runtime.js';
import { actionFetch } from './fetch.js';
    // function to be attached to a listener
import { submitOrderFiles } from './order-submission.js';
	// utility for building the nav bar
import { buildElement } from './utilities.js';
    // modal initializaion
import { init as modalInit } from './modal.js';
import { navigate } from './navigation.js';



	// init is called onload() and does stuff after the script and html is in place
		// importantly it adds event listeners after the elements exist
export async function init() {
		// add options to the year select
	fillYearSelect();

		// build the nav bar i guess
	buildNavList();
	buildNavList2();

		// after the nav is build attach a listener
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

async function fillYearSelect() {
	let years = (await actionFetch('getAllYears', 'Event')).data;

	const currentDate = new Date();
	const currentYear = currentDate.getFullYear() % 100;

		// only add if June or later (month >= 5)
	if (currentDate.getMonth() >= 5 && !years.includes(currentYear)) {
		years.push(currentYear);
	}

	const slct = document.getElementById('selectYear');

	years.forEach(year => {
		slct.appendChild(buildElement("option", { text: (year + "-" + (year + 1)), attrs: { value: year } }));
	});

	slct.value = String(currentYear);
}

function buildNavList() {
	const sportList = [
			// [<li> text, slug for routing]
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