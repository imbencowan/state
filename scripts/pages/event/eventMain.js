/////////////////////////////////////////////////////////////////////////////////////////////
// js functions for the event page
import { runtime } from '../../runtime.js';
import { actionFetch } from '../../fetch.js';
import { navigate } from '../../navigation.js';
import { splitPath } from '../../routerHelpers.js';
import { parseEventRoute } from './routeHelpers.js';
import { StateEvent } from '../../models/db-classes.js';
import { buildElement } from '../../utilities.js';
import { downloadInvoicePDF, printSoSPDF } from '../../print.js';
import { buildActionButton } from '../page-utils.js';
import { topOrderActions, orderRowActions, attachOrdersPanel, toggleOrderCompleteness, 
			changeCommentHandled } from './orders.js';
import { topInventoryActions, inventorySiteActions, attachInventoryPanel } from './inventory.js';
import { attachReportsPanel, reportSiteActions } from './reports.js';
import { openModal } from '../../modal.js';




	// define a little page structure, used in a couple functions
const tabs = [
	{ id: "orders", label: "Orders", build: attachOrdersPanel },
	{ id: "inventory", label: "Inventory", build: attachInventoryPanel },
	{ id: "reports", label: "Reports", build: attachReportsPanel }
];

	// define a pair of buttons to navigate next/previous event
const prevNextEventButtons = [
	{ action: "prevEvent", title: "show previous event", text: "◀", handler: () => showPrevNextEvent('prev') },
	{ action: "nextEvent", title: "show next event", text: "▶", handler: () => showPrevNextEvent('next') }
];

	// build lookups for the top button handlers
const prevNextActions = Object.fromEntries(
	prevNextEventButtons.map(b => [b.action, b.handler])
)
const topActions = {
	printSoSPDF: ({ target }) => printSoSPDF(runtime.stateEvent.getDivisionByID(target.dataset.eshdid)),
	...prevNextActions,
	...topOrderActions,
	...topInventoryActions
};

		



	// leave the default parameters so we can access the next/most recent event
export async function goToEventPage(sportID = null, year = null, tab = 'orders') {
		// check if we're just switching tabs for a single event
	if (runtime.stateEvent && sportID == runtime.stateEvent.sport.id && year == runtime.stateEvent.year) {
		switchTab(tab);
	} else {
		let response;

			// if no sport provided, get the next/most recent Event
		if(!sportID) {
			response = await actionFetch('getEventByDate', 'Event', { 'date': null });
		} else {
				// other wise look up the event by sport and year. // pass tab as context
			if (!year) {
					// if no year was sent, get it from the select
				if (document.getElementById("selectYear")) year = document.getElementById("selectYear").value;

					// if there was a problem with the select, get the current school year
				if (!year) {
					const sixMonthsAgo = new Date();
					sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
					year = sixMonthsAgo.getFullYear() % 100;
				}
			}
			const data = { 'year': year, 'sportID': sportID, 'context': tab }
			response = await actionFetch('getEventBySportAndYear', 'Event', data);
		}
		
			// reset mode on load
		runtime.activeMode = null;

		if (response.data !== null) {
			runtime.stateEvent = StateEvent.fromJSON(response.data);

			const pageContent = buildEventPage(runtime.stateEvent, tab);
			document.getElementById("display").replaceChildren(pageContent);

				// ATTACH EVENT LISTENERS 
			addEventPageFunctionality();
		} else {
			showNoEvent(sportID, year);
		}
	}
}

export function buildEventPage(sEvent, tab) {
		// a container
	const cntnr = buildElement("div", { id: "eventContainer" });

		// attach a header, the buttons at the top of the page, tabs for viewing event data
	attachSportHeader(cntnr, sEvent);
	attachTabs(cntnr, sEvent, tab);

	return cntnr;
}

	// builds the inner page header
function attachSportHeader(cntnr, sEvent) {
	const arrowButtons = prevNextEventButtons.map(buildActionButton);

	const sport = sEvent.sport.name;
	const year = sEvent.startDate.toLocaleDateString("en-US", { year: "numeric" });
	const h = buildElement("h1", { text: (sport + " " + year) });

	const bDiv = buildElement("div", { classes: 'prevNextCntnr', children: arrowButtons });
	const hDiv = buildElement("div", { children: [ h, bDiv ], classes: 'prevNextDiv' });
	cntnr.appendChild(hDiv);
}

	// this *just* attaches the tabs, and only fills the passed tab
		// it attaches a build function to fill the tab if it's clicked.
function attachTabs(parent, sEvent, tab) {
   const nav = buildElement("nav", { id: "eventTabNav", classes: ["eventTabNav"] });
   const pnlsCntnr = buildElement("div", { id: "tabPnlsCntnr", classes: ["tabPnlsCntnr"] });

		// tabs is a module level const
   tabs.forEach(t => {
			// a button for switching tabs
      const btn = buildElement("button", {
         text: t.label,
         dataset: { tab: t.id }
      });
			// the panel that will hold the tab's display
      const panel = buildElement("div", {
         classes: ["tabPanel"],
         dataset: { tab: t.id }
      });

			// the passed tab will be active and built
      if (t.id == tab) {
         btn.classList.add("active");
         panel.classList.add("active");
         	// build it immediately
         t.build(panel, sEvent);
         panel.dataset.built = "true";
      }

      nav.append(btn);
      pnlsCntnr.append(panel);
   });

		// listener switches tabs, including building them on first access
   nav.addEventListener("click", e => {
			// exit if a tab button wasn't clicked
      if (!e.target.matches("button")) return;

      const tabID = e.target.dataset.tab;
		navigate(`${sEvent.sport.slug}/${sEvent.year}/${tabID}`);
   });

   parent.append(nav, pnlsCntnr);
}

function switchTab(tab) {
	const nav = document.getElementById("eventTabNav");
	const tabBtn = nav.querySelector(`[data-tab="${tab}"]`);
	const pnlsCntnr = document.getElementById("tabPnlsCntnr");
	const panel = pnlsCntnr.querySelector(`[data-tab="${tab}"]`);

		// remove active from any tab
	nav.querySelectorAll("button").forEach(b => b.classList.remove("active"));
	pnlsCntnr.querySelectorAll(".tabPanel").forEach(p => p.classList.remove("active"));

		// mark the target as active
	tabBtn.classList.add("active");
	panel.classList.add("active");

		// lazy build. calls the build function if the panel has not yet been built.
	if (!panel.dataset.built) {
			// find and call the build function
	   const tabInfo = tabs.find(t => t.id === tab);
	   tabInfo.build(panel, runtime.stateEvent);
			// mark built as true now
	   panel.dataset.built = "true";
	}
}

async function showPrevNextEvent(drctn) {
		// get the tab from the url to pass as context for the event
			// prevents memory error trying to grab all an event's data at once.
	const parts = splitPath();
	const tab = parseEventRoute(parts).tab;

	const data = { drctn: drctn, eventID: runtime.stateEvent.id, context: tab };
	const response =  await actionFetch('getPrevNextSportEvent', 'Event', data);

	if (response.success) {
		if (response.data.event == null) {
				// this presumes drctn can only be 'prev' or 'next'
			const qlfr = drctn === 'prev' ? 'earlier' : 'later';
			openModal(`There is no ${qlfr} event for ${runtime.stateEvent.sport.name}`);
		} else {
				// assign the new runtime event
			const sEvent = StateEvent.fromJSON(response.data.event);

			if (sEvent.year !== runtime.stateEvent.year) {
				history.pushState({}, '', `/state/${sEvent.sport.slug}/${sEvent.year}/${tab}`);
				document.getElementById('selectYear').value = sEvent.year;
			}

			runtime.stateEvent = sEvent;
			runtime.activeMode = null;
			
				// load the new display
			const pageContent = buildEventPage(sEvent, tab);
			document.getElementById("display").replaceChildren(pageContent);

				// ATTACH EVENT LISTENERS 
			addEventPageFunctionality();
		}
	}
}

function showNoEvent(sportID, year) {
   const sport = runtime.allSports.getByID(sportID).name;

   const msg = `There is currently no information for ${sport} for the ` 
      + `20${year}-20${(Number(year) + 1)} school year.`;
   const p = buildElement("p", { text: msg });
   const div = buildElement("div", { children: p });
   document.getElementById('display').replaceChildren(div);
}




	// attaches event listeners
export function addEventPageFunctionality() {
	const container = document.getElementById('eventContainer');

		// this is one listener that handles clicks for all buttons on the event page
			// may be should move top level buttons to a more specific listener
		//////////////////////////////////////////////////////////////////////////////////////////////////////
	container.addEventListener('click', function(event) {
			// some buttons have span children for icons. some naked icons are treated like buttons
				// prioritize buttons if found. if not, use the naked span
		const target = event.target.closest("button") ?? event.target.closest("span");

		if (!target) return;

		const args = { target };
		const action = target.dataset.action;
		let handler;


			////////////////// call the correct function for the click by checking the target ////////////////////
			// order-action related. buttons for: AddOns, Editing, ShowingMessage, PrintingLabel, DownloadingInvoice 
				// also Submitting and Canceling those actions
		if (target.classList.contains("order-action")) {
			args.order = getOrderFromTableButton(target);
			handler = orderRowActions[action];
		} else if (target.classList.contains("inventory-action")) {
			console.log(target);
			args.eSite = runtime.stateEvent.getEventSiteByID(target.dataset.eventSiteID);
			handler = inventorySiteActions[action];
		} else if (target.classList.contains("report-action")) {
			handler = reportSiteActions[action];
		} else {
			handler = topActions[action];
		}

		if (handler) handler(args);
	});

	
		// next a listener for the inputs to ensure integer values
	container.addEventListener('input', (e) => {
		if (e.target.matches('input[type="number"]')) {
			e.target.value = e.target.value.replace(/[^\d-]/g, '');
		}
	});
	
		// toggleOrderCompleteness listeners
	container.addEventListener('change', function(event) {
		if (event.target.matches('input.orderChckBx')) {
			toggleOrderCompleteness(event.target, getOrderFromTableButton(event.target));
		} else if (event.target.matches('input.commentChckBx')) {
			changeCommentHandled(event.target);
		}
	});


	const modal = document.getElementById('myModal');
	modal.addEventListener('click', function(event) {
		const target = event.target;
		const rowOptions = {
				// pulls the order from runtime.activeOrder in the called function
			'button.quote' : () => { downloadInvoicePDF({ type: "Quote" }); },
			'button.receipt' : () => { downloadInvoicePDF({ type: "Receipt" }); }
		};

		for (const sel in rowOptions) {
			if (target.matches(sel)) {
				rowOptions[sel]();
				return;
			}
		}
	});
}



/////////////////// functions for acquiring an order from a DOM event. target will have a data-attribute for reference
		// get an order from the big ol runtime.stateEvent object
function getOrderFromTableButton(target) {
	if (runtime.stateEvent) {
		const order = runtime.stateEvent.getOrderByID(Number(target.closest('tbody').dataset.schoolOrderID));
		if (!order) return null;

		const esdID = Number(target.closest('table').dataset.eventSiteDivisionID);
		const eventSiteID = Number(target.closest('table').dataset.eventSiteID);

			// get the site, then division, then order. return null if not found
		const eventSite = runtime.stateEvent.getEventSiteByID(eventSiteID);
		if (!eventSite) return null;
		
		const esd = eventSite.esDivisions.find(div => div.id === esdID);
		if (!esd) return null;


			// make add on gender strings if necessary
		let divGenderStr = '';
		if (eventSite.gender) divGenderStr += ' ' + eventSite.gender.name;
		let sportGenderStr = '';
		if (order.genderID !== null) {
				if (order.genderID === 1) sportGenderStr += 'Boys ';
				if (order.genderID === 2) sportGenderStr += 'Girls ';
		}
		
			// hacky
				// but may be not in a bad way? how else would i transmit all this? sending div, site, and sport args also?
				// this is actually kind of clean considering the alternatives for getting this info where it needs to be.
		order.division = esd.division.name + divGenderStr;
		order.site = eventSite.site.name;
		order.sportStr =  sportGenderStr + runtime.stateEvent.sport.name;
		order.sportLblClr = runtime.stateEvent.sport.labelColor;
	
		return order;
	}
}