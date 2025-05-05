	// global containers
let stateEvent;
let sizeCodesByStyles;
	// this one prevents different actions being called while others are still open
let activeMode;
	// modal stuff
let modal;
let modalText;
let closeBtn;



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// CLASSES	
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
class InputOrder {
		//we're using 'sport' in place of 'event' because event is a key word
	constructor(orderedBy, school, division, sport, gender, sizes, fileName, orderText, comment) {
		this.sport = sport;
		this.division = division;
		this.school = school;
		this.gender = gender;
		this.sizes = sizes;
		this.fileName = fileName;
		this.orderedBy = orderedBy;
		this.orderText = orderText;
		this.comment = comment;
	}
}


class ActionRequest {
	constructor(action, actionClass, data) {
		this.action = action;
		this.actionClass = actionClass;
		this.data = data;
	}
}

class Coord{
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}

	// used in pdf functions
class Label {
	constructor(doc, origin) {
		this.doc = doc;
		this.origin = origin;
		this.oX = origin.x;
		this.oY = origin.y;
		this.padding = 6;
		this.height = labelPage.labelHeight;
		this.width = labelPage.labelWidth;
		this.lineSpaces = [4.5, 7, 9];
		this.offsetX = 14;
		this.offsetY = 10;
		this.indentX = origin.x + this.offsetX + 5;
		this.alignX = origin.x + this.offsetX;
		this.gridX = origin.x + 41;
		this.gridStep = 8.5;
			// define where the cursor starts
		this.lineX = origin.x + this.offsetX;
		this.lineY = origin.y + this.offsetY;
	}
	
	lineDown(step) {
		this.lineY += this.lineSpaces[step];
	}
	
	rectText(txt, color = '#000000', style = 'S') {
		this.doc.setDrawColor(color);
		this.doc.setFillColor(color);
		const txtWdth = this.doc.getTextWidth(txt);
		const txtHt = this.doc.getFontSize() / this.doc.internal.scaleFactor;
		this.doc.rect((this.lineX - 2), (this.lineY + 2), (txtWdth + 4), -(txtHt + 1.7), style);
		this.doc.text(txt, this.lineX, this.lineY);
		
			// unset colors
		this.doc.setDrawColor('#000000');
		this.doc.setFillColor('#000000');
	}
	
	centerTextInLabel(txt) {
		let txtWdth = this.doc.getTextWidth(txt);
		let x = this.origin.x + ((this.width - txtWdth) / 2);
		this.doc.text(txt, x, this.lineY);
	}
	
	addSiteDivision(site, div) {
		this.doc.setFontSize(14);
		const txt = site + " - " + div;
		const txtWdth = this.doc.getTextWidth(txt);
		const y = this.origin.y + (this.height / 2) + (txtWdth / 2);
			// rotate this first line
		this.doc.text(txt, (this.origin.x + this.padding + 2), y, {angle: 90});
	}
	
	addGridSizes(min, max) {
		this.doc.setFontSize(12);
		let x = this.gridX;
		for (let i = min - 1; i < max; ++i) {
			this.doc.text(sizeList[i], x, this.lineY);
			x += this.gridStep;
		}
	}
	
	addGridQuantities(sizes, min) {
		this.doc.setFontSize(11);
		sizes.forEach(size => {
			console.log(size);
			let x = this.gridX + (this.gridStep * (size.id - min));
			console.log(String(size.quantity), x, this.lineY);
			this.doc.text(String(size.quantity), x, this.lineY);
		});
	}
}


////////////////////////////////////////////////////////////
// db classes
	// define how an event works from json
class StateEvent {
   constructor({ id, sport, startDate, endDate, year, eventSites = [] }) {
      this.id = id;
      this.sport = sport;
      this.startDate = startDate;
      this.endDate = endDate;
      this.year = year;
      this.eventSites = eventSites.map(site => site instanceof EventSite ? site : EventSite.fromJSON(site));
   }

   static fromValues(id, sport, startDate, endDate, year, eventSites = []) {
      return new StateEvent({ id, sport, startDate, endDate, year, eventSites });
   }

   static fromJSON(json) {
      return new StateEvent(json);
   }
	
	getUndoneOrders() {
		let orders = [];
		this.eventSites.forEach(eventSite => {
			eventSite.divisions.forEach(eshd => {
				eshd.schoolOrders.forEach(order => {
						// check completeness. 0 == incomplete.
					if (!order.completeness) {
						order.division = eshd.division.name;
						order.site = eventSite.site.name;
						order.sport = stateEvent.sport.name;
						orders.push(order);
					}
				});
			});
		});
		return orders;
	}
}

class Sport {
   constructor({ id, name, isGendered, isIndividualed, maxTeamSize, minDiv }) {
      this.id = id;
      this.name = name;
      this.isGendered = isGendered;
      this.isIndividualed = isIndividualed;
      this.maxTeamSize = maxTeamSize;
      this.minDiv = minDiv;
   }

   static fromValues(id, name, isGendered, isIndividualed, maxTeamSize, minDiv) {
      return new Sport({ id, name, isGendered, isIndividualed, maxTeamSize, minDiv });
   }

   static fromJSON(json) {
      return new Sport(json);
   }
}

class EventSite {
   constructor({ id, eventID, site, managerName, vehicle, divisions = [] }) {
		this.id = id;
		this.eventID = eventID;
		this.site = site instanceof Site ? site : site != null ? Site.fromJSON(site) : null;
		this.managerName = managerName;
		this.vehicle = vehicle instanceof Vehicle ? vehicle : vehicle != null ? Vehicle.fromJSON(vehicle) : null;
		this.divisions = divisions.map(div => div instanceof EventSiteDivision ? div : EventSiteDivision.fromJSON(div));
	}

   static fromValues(id, eventID, site, managerName, vehicle, divisions = []) {
      return new EventSite({ id, eventID, site, managerName, vehicle, divisions });
   }

   static fromJSON(json) {
      return new EventSite(json);
   }
}

class Site {
   constructor({ id, name, city }) {
      this.id = id;
      this.name = name;
      this.city = city;
   }

   static fromValues(id, name, city) {
      return new Site({ id, name, city });
   }

   static fromJSON(json) {
      return new Site(json);
   }
}

class Vehicle {
   constructor({ id, name, isUnique }) {
      this.id = id;
      this.name = name;
      this.isUnique = isUnique;
   }

   static fromValues(id, name, isUnique) {
      return new Vehicle({ id, name, isUnique });
   }

   static fromJSON(json) {
      return new Vehicle(json);
   }
}

class EventSiteDivision {
   constructor({ id, eventSiteID, division, schoolOrders = [] }) {
      this.id = id;
      this.eventSiteID = eventSiteID;
      this.division = division instanceof Division ? division : Division.fromJSON(division);
      this.schoolOrders = schoolOrders.map(so => so instanceof SchoolOrder ? so : SchoolOrder.fromJSON(so));
   }

   static fromValues(id, eventSiteID, division, schoolOrders = []) {
      return new EventSiteDivision({ id, eventSiteID, division, schoolOrders });
   }

   static fromJSON(json) {
      return new EventSiteDivision(json);
   }
}

class Division {
   constructor({ id, name, minPop, pre24Name }) {
      this.id = id;
      this.name = name;
      this.minPop = minPop;
      this.pre24Name = pre24Name;
   }

   static fromValues(id, name, minPop, pre24Name) {
      return new Division({ id, name, minPop, pre24Name });
   }

   static fromJSON(json) {
      return new Division(json);
   }
}

class SchoolOrder {
   constructor({ id, eshdID, school, completeness, due, paid, schoolOrderNote, invoiceSent, messageOrders = [], shirts = [], 
					division, site, sport }) {
      this.id = id;
      this.eshdID = eshdID;
      this.school = school;
      this.completeness = completeness;
      this.due = due;
      this.paid = paid;
      this.schoolOrderNote = schoolOrderNote;
      this.invoiceSent = invoiceSent;
      this.messageOrders = messageOrders;
      this.shirts = shirts.map(style => style instanceof Style ? style : Style.fromJSON(style));
      this.division = division;
      this.site = site;
      this.sport = sport;
   }

   static fromValues(id, eShdID, school, completeness, due, paid, schoolOrderNote, invoiceSent, messageOrders, shirts, division, 
							site, sport) {
      return new SchoolOrder({ id, eShdID, school, completeness, due, paid, schoolOrderNote, invoiceSent, messageOrders, shirts, 
										division, site, sport });
   }

   static fromJSON(json) {
      return new SchoolOrder(json);
   }
	
	getTeamSizes() {
		return this.shirts.find(shirt => shirt.shortName === 'Dairy Hoods').sizes;
	}
	
	getAddedStyles() {
		
	}
	
	getMinSize() {
		let min = Infinity;
		this.shirts.forEach(style => {
			style.sizes.forEach(size => {
				if (size.id < min) min = size.id;
			});
		});
		return min;
	}
	
	getMaxSize() {
		let max = 0;
		this.shirts.forEach(style => {
			style.sizes.forEach(size => {
				if (size.id > max) max = size.id;
			});
		});
		return max;
	}
}

class MessageOrder {
   constructor({id, schoolOrderID, genderID, orderedBy, mOrderComment, mOrderCommentHandled, orderText, fileName, orderDate}) {
      this.id = id;
      this.schoolOrderID = schoolOrderID;
      this.genderID = genderID;
      this.orderedBy = orderedBy;
      this.mOrderComment = mOrderComment;
      this.mOrderCommentHandled = mOrderCommentHandled;
      this.orderText = orderText;
      this.fileName = fileName;
      this.orderDate = orderDate;
   }

   static fromValues(id, schoolOrderID, genderID, orderedBy, mOrderComment, mOrderCommentHandled, orderText, fileName, orderDate) {
      return new MessageOrder({id, schoolOrderID, genderID, orderedBy, mOrderComment, mOrderCommentHandled, orderText, fileName, orderDate});
   }

   static fromJSON(json) {
      return new MessageOrder(json);
   }
}

class Style {
   constructor({ id, name, shortName, vShortName, brandID, code, sizes = [] }) {
      this.id = id;
      this.name = name;
      this.shortName = shortName;
      this.vShortName = vShortName;
      this.brandID = brandID;
      this.code = code;
      this.sizes = sizes.map(size => size instanceof Size ? size : Size.fromJSON(size));
			
      this.sizeMap = {};
      for (const size of this.sizes) {
         this.sizeMap[size.charName] = size;
		}
   }

   static fromValues(id, name, shortName, vShortName, brandID, code, sizes = []) {
      return new Style({ id, name, shortName, vShortName, brandID, code, sizes });
   }

   static fromJSON(json) {
      return new Style(json);
   }
}

class Size {
   constructor({ id, name, charName, quantity }) {
      this.id = id;
      this.name = name;
      this.charName = charName;
      this.quantity = quantity;
   }

   static fromValues(id, name, charName, quantity) {
      return new Size({ id, name, charName, quantity });
   }

   static fromJSON(json) {
      return new Size(json);
   }
}



const teamStyle = "Dairy Hoods";
const currentYear = 24;

	// this list is used to match sizes when reading the email string
const sizeList = ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'];

const labelPage4 = {
	labels : 4,
	width : 215,
	height : 279,
	xMargin : 4,
	yMargin : 13,
	labelWidth : 101.6,
	labelHeight : 127,
	xCenter : 108,
	yCenter : 140,
	origins : [ new Coord(4, 14), new Coord(107.4, 14), new Coord(4, 140), new Coord(107.4, 140) ],
	padding : 6
}

const labelPage6 = {
	labels : 6,
	width : 215,
	height : 279,
	xMargin : 4,
	yMargin : 13,
	labelWidth : 103,
	labelHeight : 85,
	xCenter : 108,
	yCenter : 140,
	origins : [
		new Coord(4, 13), new Coord(109, 13), new Coord(4, 98), new Coord(109, 98), new Coord(4, 183), new Coord(109, 183)
	],
	padding : 6
}

const labelPage = labelPage4;


	// this list is used to build the nav bar.
		// this is no longer necessary, since each sport now has one associated id in the db
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
   ['Softball', 15],
   ['Baseball', 16],
   ['Tennis', 17],
   ['Track', 18]
];



	// init is called onload() and does stuff after the script and html is in place
		// importantly it adds event listeners after the elements exist
async function init() {
		// build the nav bar i guess
	buildNavList();
	buildNavList2();
	
	let request = new ActionRequest('loadSizeCodesByStyle', 'Item')
	let sizeData = await myFetch(request);
	sizeCodesByStyles = sizeData.data.map(styleData => Style.fromJSON(styleData));
	
		// Get modal elements
	modal = document.getElementById("myModal");
	modalText = document.getElementById("modalText");
	closeBtn = document.querySelector(".close");
		// Close modal when the "x" is clicked
	closeBtn.addEventListener("click", closeModal);
}

function buildNavList() {
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
	const nav2Items = [
		['Year', 'showYear', 'Year', null],
		['Schools', 'showSchools', 'School', null],
		['Items', 'showItems', 'Item', null],
		['Tests', 'showTests', 'Test', null]
	];
	nav2Items.forEach((item) => {
			// create the element
		let newLI = document.createElement("li");
		newLI.innerHTML = item[0];
			// add a listener to load the appropriate content when clicked
		newLI.addEventListener('click', function(){ showPage(item[1], item[2], item[3]); });
			// add it to the page
		navList.appendChild(newLI);
	});
}


	// all fetch requests go to controller.php
async function myFetch(request) {
	const url = 'controller.php';
	try {
		const response = await fetch(url, {
			method: "POST", 
			headers: {'Content-Type': 'application/json'}, 
			body: JSON.stringify(request)
		});
			// get the response, convert to json or throw. or what ever.
		const responseText = await response.text();
		let json;
		try {
			json = JSON.parse(responseText);
		} catch {
			throw new Error("Invalid JSON returned from server");
		}
			// handle other error cases
		if (!response.ok) {
			if (response.status === 400 && json.error) {
				openModal(json.error);
				return null;
			}
			throw new Error(`Response status: ${response.status} ${response.statusText}`);
		}

		console.log(json);
		return json;
	} catch (error) {
		console.error("Fetch Error:", error.message);
		return null;
	}
}

async function goToEventPage(sport) {
		//we'll want to swap year statements once this is out of test
	let year = currentYear;
	if (document.getElementById("selectYear")) {
		year = document.getElementById("selectYear").value;
	}
	let sportID = sport[1];
	const data = {'sportID': sportID, 'year': year}
	let request = new ActionRequest('showEvent', 'Event', data)

	let responseJSON = await myFetch(request);
	// stateEvent = responseJSON.data;
	console.log(responseJSON.data);
	stateEvent = StateEvent.fromJSON(responseJSON.data);


	console.log(stateEvent);
	document.getElementById("display").innerHTML = responseJSON.html;
	
		// reset mode on load
	activeMode = null;
	
	///// ATTACH EVENT LISTENERS /////////////////////////////////////////////////////////
	const container = document.getElementById('eventContainer');
		// first the in table action buttons
		// this is one listener that handles clicks for all the buttons in the table
			///////////////////////////////////////////////////////////////////////////////////////////////////////////
			// buttons for: AddOns, Editing, ShowingMessage, PrintingLabel. also Submitting and Canceling those actions
	container.addEventListener('click', function(event) {
		const target = event.target
			// call the correct function, send the order and may be the event target
		if (target.classList.contains('order-action')) {
				// get the order for these actions
			const order = getOrderFromTableButton(target);
			
			if (target.matches('span.showMessage')) {
			  showOMessage(order);
			} else if (target.matches('span.printLabel')) {
				printBoxLabel(order);
			} else if (target.matches('span.addAddOns')) {
					// don't do this if some thing else is active
				if (activeMode === null || activeMode === 'add') showAddOnInputs(order);
			} else if (target.matches('span.editSizes')) {
					// don't allow this if we're already active
				if (!activeMode) showEditSizeInputs(order);
			} else if (target.matches('button.submitAddOns')) {
				submitAddOns(target, order);
			} else if (target.matches('button.submitEdit')) {
				submitSizeEdit(target, order);
			}
		} else if (target.matches('button.cancelAddOns')) {
			cancelAddOns(target);
		} else if (target.matches('button.cancelEdit')) {
			cancelSizeEdit(target);
		}
	});
		// next a listener for the inputs to ensure integer values
	container.addEventListener("input", (e) => {
		if (e.target.matches('input[type="number"]')) {
			e.target.value = e.target.value.replace(/[^\d-]/g, '');
		}
	});
		// changeOrderCompleteness listeners
	container.addEventListener('change', function(event) {
		if (event.target.matches('input[type="checkbox"]')) {
			changeOrderCompleteness(event.target, getOrderFromTableButton(event.target));
		}
	});
		// next the PDF buttons
			// sign off sheet buttons
	const siteSoSButtons = document.querySelectorAll('[data-btnType="genSoSPDF"]');
	siteSoSButtons.forEach(btn => {
		btn.addEventListener('click', () => {genSoSPDF(); });
	});
		// box label button
	const undoneBLButton = document.querySelector('[data-btnType="genBoxLabels"]');
	undoneBLButton.addEventListener('click', () => {printBoxLabels(); });
}


async function submitOrderFiles() {
	let files = document.getElementById("fileInput").files;
		// check if no files were selected, and exit the function in that case
    if (files.length === 0) {
        console.log("No files selected.");
        return; 
    }
		// read the files and build orders from them
	let orders = await readFiles(files);
	let request = new ActionRequest('uploadOrders', 'SchoolOrder', { 'orders': orders });
	// constructor(action, actionClass, data)
	let responseJSON = await myFetch(request);
	document.getElementById("display").innerHTML = responseJSON.html;
}	

	// this came from gpt, because i'm still fuzzy on how to work with promises. and map.
async function readFiles(files) {
	let orders = [];
	const fileArray = Array.from(files); // Convert FileList to an array. i believe so that we can map it
	const promises = fileArray.map(file => {
	  return new Promise((resolve) => {
			let reader = new FileReader();
			reader.readAsText(file);
			reader.onload = async function() {
				 let orderText = reader.result;
				 let order = await getOrder(orderText, file.name);
				 orders.push(order);
				 resolve(); // Resolve the promise when the order is pushed
			};
	  });
	});
		// Wait for all file reading promises to resolve
	await Promise.all(promises);
		// Code here will run after all orders have been pushed
	console.log("All orders processed:", orders);
	return orders;
};
	
	// this function does the actual reading of the text file submitted, with the help of getSlice()
function getOrder(orderText, fileName) {
		// inputString is an invented object, with orderText, subStart, and subEnd properties
			// this way we can pass the object repeatedly to getSlice() and have it update subStart/End each call
				// (a function can't return > 1 value, but it can change properties of an object passed to it)
	let inputString = new Object;
	inputString.str = orderText;
	
		// get the COMMENT if there is one
	let comment = '';
	let commentIndex = inputString.str.indexOf('COMMENT');
	
	if (commentIndex > -1) {
		inputString.subStart = commentIndex + 9;
		inputString.subEnd = inputString.str.indexOf('-----------------', inputString.subStart);
		comment = inputString.str.slice(inputString.subStart, inputString.subEnd);
	}
	
		// reset the start and end for SHIRTS
	inputString.subStart = inputString.str.indexOf('SHIRTS') + 8;
	inputString.subEnd = inputString.str.indexOf('\n', inputString.subStart);
	
	let orderedBy = inputString.str.slice(inputString.subStart, inputString.subEnd);
	let school = getSlice(inputString);
	let division = getSlice(inputString);
	let sport = getSlice(inputString);
	let gender = 3;
		// make it match the names in the db
	if (sport.includes('Boys')) {
		gender = 1;
		sport = sport.slice(0, -7);
		if (sport == "Basketball") sport = "Boys Basketball";
	} else if (sport.includes('Girls')) {
		gender = 2;
		sport = sport.slice(0, -8);
		if (sport == "Basketball") sport = "Girls Basketball";
	} 
	
	let sizes = getSizes(inputString);
	let order = new InputOrder(orderedBy, school, division, sport, gender, sizes, fileName, orderText, comment);
	
	return order;
}

	// the inputString argument is an object with properties that include the str to operate on, and 
		// subStart and subEnd, to track where to slice it
			// it's magic
				// really it just cuts off at a new line, and relies on the input being formatted as expected
function getSlice(inputString) {
	inputString.subStart = inputString.subEnd + 1;
	inputString.subEnd = inputString.str.indexOf('\n', inputString.subStart);
	// console.log(inputString.subEnd);
	return inputString.str.slice(inputString.subStart, inputString.subEnd);
}

	// gets the sizes from the order text
function getSizes(inputString) {
	let sizes = [0, 0, 0, 0, 0, 0];
	inputString.subStart = inputString.subEnd + 1;
	
	let i = 0;
	sizeList.forEach((size) => {
			// check if each size is included
		let check = inputString.str.indexOf('\n' + size + ':', inputString.subStart);
		// console.log(check);
			//if the size is included, get the quantity and add it to the size list
		if (check != -1) {
			inputString.subStart = inputString.str.indexOf(' ', inputString.subStart) + 1;
			// console.log(inputString.subStart);
			inputString.subEnd = inputString.str.indexOf('\n', inputString.subStart);
			// console.log(inputString.subEnd);
				// parseInt to change the string to a number
			sizes[i] = parseInt(inputString.str.slice(inputString.subStart, inputString.subEnd));
		}
		++i;
	});
	return sizes;
}


async function showPage(action, actionClass, data) {
	let year = currentYear;
	if (document.getElementById("selectYear")) {
		year = document.getElementById("selectYear").value;
	}
	const request = new ActionRequest(action, actionClass, data);
	let responseJSON = await myFetch(request);
	// console.log(responseJSON.data);
	document.getElementById("display").innerHTML = responseJSON.html;
}


	//////////////////////////////////////////////////////////////////////////////////////////////
	// js functions
		// get an order from the big ol stateEvent object
function getOrderFromTableButton(target) {
	if (stateEvent) {
			// get ids from data-attributes
		const orderID = Number(target.closest('tbody').getAttribute('data-school-order-id'));
		const divID = Number(target.closest('table').getAttribute('data-event-site-division-id'));
		const eventSiteID = Number(target.closest('table').getAttribute('data-event-site-id'));
	
		return getOrderByIDs(eventSiteID, divID, orderID);
	}
}
		
function getOrderByIDs(eventSiteID, divID, orderID) {
	if (stateEvent) {
			// get the site, then division, then order. return null if not found
		const eventSite = stateEvent.eventSites.find(eSite => eSite.id === eventSiteID);
		if (!eventSite) return null;
		
		const division = eventSite.divisions.find(div => div.id === divID);
		if (!division) return null;

		const order = division.schoolOrders.find(order => order.id === orderID);
		
			// hacky
				// but may be not in a bad way? how else would i transmit all this? sending div, site, and sport args also?
				// this is actually kind of clean considering the alternatives for getting this info where it needs to be.
		order.division = division.name;
		order.site = eventSite.site.name;
		order.sport = stateEvent.sport.name;
		
		return order || null;
	}
}



function showAddOnInputs(order) {
		// set mode. prevents edit being called while this is open
	activeMode = 'add';
		// get the parent element with the specified data attribute
	const prnt = document.querySelector(`[data-school-order-id="${order.id}"]`);
	if (prnt) {
			// don't add more rows than there are styles
		if (prnt.querySelectorAll('tr').length < 9) {
				// get the first tr
			const firstTr = prnt.querySelector('tr');
			
			const tdCount = firstTr ? firstTr.children.length : 0;

			const newTr = document.createElement('tr');
			newTr.classList.add('addOnRow');
				// create the style select
			const newTd = document.createElement('td');
				// send the parent so we can omit options that already exist
			const newSlct = buildAddOnSelect(prnt);
			newTd.appendChild(newSlct);
			newTr.appendChild(newTd);
			
				// create the inputs for the middle rows
			for (let i = 0; i < tdCount - 3; i++) {
				const newTd = document.createElement('td');
				const input = makeInput(i);
				newTd.appendChild(input);  
				newTr.appendChild(newTd);  
			}
			
				// submit/cancel td
			const btnTD = document.createElement('td');
				// put submit and cancel buttons in the btnTD, unless there already is one
			if (prnt.querySelector('button.submitAddOns') === null) makeSubmitCancelButtons(btnTD, 'AddOns');
			newTr.appendChild(btnTD);
			
				// an final empty cell to maintain form
			const lastTd = document.createElement('td');
			newTr.appendChild(lastTd);
			
				// Append the newly created <tr> to the <tbody>
			prnt.appendChild(newTr);
		}
	} else {
		console.error(`Element with data-school-order-id="${order.id}" not found.`);
	}
}

async function submitAddOns(target, order) {
	const tbody = target.closest('tbody');
		// get an array of rows with select elements
	const rows = Array.from(tbody.querySelectorAll('tr')).filter(row => row.querySelector('select'));
		// check if the multiple styles are duplicate
	if (checkDuplicateAddedStyles(rows)) {
		openModal("Two of your styles to add are identical, fix this before submitting");
		return;
	}
	
		// get the additions
	let addItems = [];
	rows.forEach((row) => {
			// get the itemID
		let styleID = Number(row.querySelector('select').value);
		let style = sizeCodesByStyles.find(style => style.id === styleID);
			// get the inputs
		const inputs = Array.from(row.querySelectorAll('input[type="number"]'))
			.filter(input => parseInt(input.value, 10) > 0);
		inputs.forEach((input) => {
				// match quantities with itemIDs, then push them to an array
			const sizeChar = input.dataset.sizeChar;
			const itemID = style.sizeMap[sizeChar].itemID;
			const shirt = {
				itemID: itemID,
				quantity: input.value
			};
			addItems.push(shirt);
		});
	});
	
		// cancel if no thing was input
	if (addItems.length === 0) {
		cancelAddOns(target);
		return;
	}
	
		// send it to the server
	const data = {'schoolOrderID': order.id, 'addItems': addItems };
	let request = new ActionRequest('addAddOns', 'SOrderItem', data);
	let responseJSON = await myFetch(request);
	
	if (responseJSON.success) {
		updateObject(order, responseJSON.newOrder);
		cleanInputRows(rows);
			// exit 'add' mode
		activeMode = null;
	}
}

function cancelAddOns(target) {
	const tbody = target.closest('tbody');
   const rows = Array.from(tbody.querySelectorAll('tr'));

   rows.forEach(row => {
      if (row.querySelector('select')) {
         row.remove();
      }
   });
		// exit add on mode
	activeMode = null;
}

function makeSubmitCancelButtons(td, action) {
	const submitButton = document.createElement('button');
	submitButton.type = 'button';
	submitButton.textContent = 'Submit';
	submitButton.classList.add('addOnButton', 'order-action', 'submit' + action);
	td.appendChild(submitButton);
	
	const cancelButton = document.createElement('button');
	cancelButton.type = 'button';
	cancelButton.textContent = 'X';
	cancelButton.classList.add('addOnButton', 'cancel' + action);
	td.appendChild(cancelButton);
}

function buildAddOnSelect(prnt) {
		// get the styles that have already been added. get the rows with the attribute, then pull the ids with .map()
	const rows = Array.from(prnt.querySelectorAll('tr[data-style-id]'))
	const preStyleIDs = rows.map(tr => Number(tr.getAttribute('data-style-id')));
	
	const newSlct = document.createElement('select');
	sizeCodesByStyles.forEach((style) => {
			// exclude the preexisting styles
		if (!preStyleIDs.includes(style.id)) {
			const newOptn = document.createElement('option');
			newOptn.textContent = style.shortName;
			newOptn.value = style.id;
			newSlct.appendChild(newOptn);
		}
	});
	return newSlct;
}

	// takes the values of inputs, puts them directly in table cells
function cleanInputRows(rows) {
		// check if the row was marked complete. if so, change to partial. uncheck the box
	const tbody = rows[0].closest('tbody');
	if (tbody.classList.contains('doneRow')) {
		tbody.classList.remove('doneRow');
		tbody.classList.add('partDoneRow');
		tbody.querySelector('input[type="checkbox"]').checked = false;
	}
	rows.forEach((row) => {
		const cells = row.querySelectorAll('td');
			// if the first element contains a select, get it's name and make that the first td
		const slct = row.querySelector('select');
		if (slct) {
			const name = slct.options[slct.selectedIndex].text;
			cells[0].textContent = "+ " + name;
				// be sure to set the data-attributej
			row.dataset.styleId = slct.value;
		}
		
		let total = 0;
		let zeroReplacement = '';
			// if this is the first row, use '-'
		if (row === row.parentElement.firstElementChild) zeroReplacement = '-';

			
			// skip the first and last two cells
		for (let i = 1; i < cells.length - 2; i++) {
			const input = cells[i].querySelector('input');
			let value = 0;
			if (input) {
					// if the input.value > 0, put it in the cell, otherwise empty the cell
				value = parseInt(input.value) || 0;
				cells[i].textContent = (value > 0) ? value : zeroReplacement;
			}
			total += value;
			
				// add a title for new rows
			if (!cells[i].title) cells[i].title = sizeList[i - 1];
		}
		
			// set the total, and DONT ensure the final cell is empty, because it might hold the buttons
		cells[cells.length - 2].textContent = total;
		// cells[cells.length - 1].textContent = '';
			// remove the row if the row if it was empty
		if (total === 0) row.remove();
	});
}

	// a check for adding to an order, makes sure you don't try to add the same style twice
function checkDuplicateAddedStyles(rows) {
		// get an array of selected values from rows
	const selectedValues = [];
	Array.from(rows).forEach((row) => {
		const slct = row.querySelector('select');
		if (slct.value) selectedValues.push(slct.value);
	})
		// some() checks if array values are unique here
   let check = selectedValues.some((val, idx, arr) => arr.indexOf(val) !== idx);
	return check;
}

function makeInput(i) {
	input = document.createElement('input');
		input.type = 'number';
		input.name = `addOn${i}`;
		input.min = 0; 
		input.max = 99;
		input.step = 1;
		input.dataset.sizeChar = sizeList[i];
	return input;
}



function showEditSizeInputs(order) {
		// set mode. prevents addOns being activated while edit is in progress
	activeMode = 'edit';
		// get the parent element with the specified data attribute
	const prnt = document.querySelector(`[data-school-order-id="${order.id}"]`);
	if (prnt) {
			// get the rows for the order
		const rows = Array.from(prnt.children);
  
      rows.forEach((currentRow) => {
			const cells = currentRow.querySelectorAll('td');
				// Add number inputs to all but the first, and last two cells of each row
			for (let i = 1; i < cells.length - 2; i++) {
				const currentValue = cells[i].textContent.trim();
				const input = makeInput(i);
					// Set initial value from current text in <td>
				input.value = currentValue;
					// also make a data-attribute to compare against on submit
				cells[i].dataset.oValue = currentValue;
				cells[i].textContent = ''; // Clear existing content
				cells[i].appendChild(input);
			}
			let totalCell = cells[cells.length - 2];
			totalCell.dataset.oValue = totalCell.textContent.trim();
			totalCell.textContent = '';
      });
		
			// put submit and cancel in the right place
		const firstCells = rows[0].querySelectorAll('td');
		const btnTD = firstCells[firstCells.length - 2];
		makeSubmitCancelButtons(btnTD, 'Edit');
			
	} else {
		console.error(`Element with data-schoolOrderID="${orderID}" not found.`);
	}
}

function cancelSizeEdit(target) {
	const tbody = target.closest('tbody');
   const rows = Array.from(tbody.querySelectorAll('tr'));
		// a quick clean. remove the inputs and set the cell values to the oValues we stored in a data attribute
   rows.forEach(row => {
		const cells = Array.from(row.querySelectorAll('td'));
		for (let i = 1; i < cells.length -1; i++) {
			cells[i].textContent = cells[i].dataset.oValue;
		}
   });
		// exit edit mode
	activeMode = null;
}

async function submitSizeEdit(target, order) {
	const tbody = target.closest('tbody');
		// get the rows
	const rows = Array.from(tbody.querySelectorAll('tr'));
		
		// check which items have changed
	let items = [];
	rows.forEach((row) => {
			// get the style
		let styleID = Number(row.dataset.styleId);
		let style = sizeCodesByStyles.find(style => style.id === styleID);
			// get the inputs
		let inputs = Array.from(row.querySelectorAll('input[type="number"]'));
		inputs.forEach(input => {
				// if the value has been changed, add it to the array
			let oValue = input.closest('td').dataset.oValue;
			if (oValue === '-' || oValue === '') oValue = 0;
			if (input.value != oValue) {
				const sizeChar = input.closest('td').title;
				const itemID = style.sizeMap[sizeChar].itemID;
				let shirt = {
					itemID: itemID,
					quantity: input.value
				};
				items.push(shirt);
			}
		});
	});
	
		// cancel if no thing was changed
	if (items.length === 0) {
		cancelSizeEdit(target);
		return;
	}
	
		// send it to the server
	const data = { 'schoolOrderID': order.id, 'items': items };	
	const request = new ActionRequest('editSizes', 'SchoolOrder', data);
	let responseJSON = await myFetch(request);

	if (responseJSON.success) {
		updateObject(order, responseJSON.newOrder);
		console.log(order);
		cleanInputRows(rows);
			// exit edit mode
		activeMode = null;
	}
}



	// shows the original message
function showOMessage(order) {
	mText = order.messageOrders[0].orderText;
		// if there is a second messageOrder, append it's text
	if (order.messageOrders[1]) mText += "\n\n" + order.messageOrders[1].orderText;
		// display it
	openModal(mText);
}


	// toggles an order as done / not done
async function changeOrderCompleteness(box, order) {
	let completeness = box.checked;
	let tbody = box.closest('tbody');
	
	const data = {'id': order.id, 'completeness': completeness};
	let request = new ActionRequest('changeOrderCompleteness', 'SchoolOrder', data);
	let responseJSON = await myFetch(request);
	
	if (responseJSON) {
		order.completeness = completeness;
		if (completeness) {
			tbody.classList.remove("unDoneRow", "partDoneRow");
			tbody.classList.add("doneRow");
		} else {
			tbody.classList.remove("doneRow", "partDoneRow");
			tbody.classList.add("unDoneRow");
		}
	}
}


function printBoxLabel(order) {
	console.log(order);
		// Access jsPDF from the global object
	const { jsPDF } = window.jspdf; 
   const doc = new jsPDF('p', 'mm', 'letter');
	genBoxLabel(doc, order, labelPage.origins[0]);
	
		// Generate a Blob URL and open it in a new tab
	const pdfBlob = doc.output("blob");
	const url = URL.createObjectURL(pdfBlob);
	window.open(url, "_blank", "noopener");
}

function printBoxLabels() {
		// get all incomplete orders
	let orders = stateEvent.getUndoneOrders();
	
		// format is jsPDF(orientation, unit, format); 'p' = portrait
	const { jsPDF } = window.jspdf; 
   const doc = new jsPDF('p', 'mm', 'letter');
	
		// add a page as necessary
	for (let i = 0; i < orders.length; i++) {
		genBoxLabel(doc, orders[i], labelPage.origins[(i % 4)]);
		if ((i % 4 === 3) && (i < orders.length - 1)) doc.addPage();
	}
		// Generate a Blob URL and open it in a new tab
	const pdfBlob = doc.output("blob");
	const url = URL.createObjectURL(pdfBlob);
	window.open(url, "_blank", "noopener");
}



function genBoxLabel(doc, order, origin) {
	drawLabelRects(doc);	
	
	const lbl = new Label(doc, origin);	
		
		// this one is rotated to be vertical along the left edge
	lbl.addSiteDivision(order.site, order.division);
	
		// start the horizontal rows
	lbl.centerTextInLabel(order.sport);
	
	lbl.lineY += 9;
	doc.setFontSize(18);
		// box the school name
	lbl.rectText(order.school.shortName, '#cfcfff', 'F');

	
	lbl.lineY += 8;
	lbl.addGridSizes(order.getMinSize(), order.getMaxSize());
	lbl.lineY += 4.5;
	doc.setFontSize(11);
   doc.text("Team Hoods:", lbl.alignX, lbl.lineY);
	
		// put in the team quantities
	lbl.addGridQuantities(order.getTeamSizes(), order.getMinSize());
	
		// only do this if there are additional styles in order.shirts
	if (order.shirts.length > 1) {
		lbl.lineY += 8;
		doc.setTextColor('666666');
		doc.text("Additional", lbl.indentX, lbl.lineY);
			// omit Dairy Hoods
		order.shirts
		.filter(style => style.shortName !== 'Dairy Hoods')
		.forEach(style => {
			lbl.lineY += 6;
			doc.text(style.shortName, lbl.alignX, lbl.lineY);
			lbl.addGridQuantities(style.sizes, order.getMinSize());
		});
		doc.setFontSize(14);
		lbl.lineY += 9;
		doc.setTextColor('#000000');
		txt = "Due: $" + order.due;
		if (!order.paid) {
			txtWdth = doc.getTextWidth(txt);
			doc.setFillColor('#ffff00');
			doc.rect((lbl.lineX - 1), (lbl.lineY + 1), (txtWdth + 2), -7, "F");
		}
		doc.text(txt, lbl.lineX, lbl.lineY);
		if (order.paid) {
			doc.setTextColor('#ff0000'); // red
			txtWdth = doc.getTextWidth(txt);
			doc.text(" PAID", lbl.lineX + txtWdth, lbl.lineY);
			doc.setTextColor('#000000'); // Black
		}
	}
	
	addReturnWarning(doc, lbl);
}

// function genBoxLabel(doc, order, origin) {
	// drawLabelRects(doc);	
	
		// // origin, padding, indentLeft, lineSpaces, offsetX, offsetY
	// const lbl = new Label(doc, origin);	
		
		// // this one is rotated to be vertical along the left edge
	// lbl.addSiteDivision(order.site, order.division);
	
		// // start the horizontal rows
	// lbl.centerTextInLabel(order.sport);
	// lbl.lineY += 9;
	// doc.setFontSize(18);
   // // doc.text(order.school.shortName, (lbl.lineX - 1), lbl.lineY);
		// // box the school name
	// lbl.rectText(order.school.shortName);
	// // txtWdth = doc.getTextWidth(order.school.shortName);
	// // let txtHt = doc.getFontSize() / doc.internal.scaleFactor;
	// // doc.rect((lbl.lineX - 2), (lbl.lineY + 1), (txtWdth + 3), -(txtHt + 1.5));
	// // doc.line((lbl.lineX - 1), lbl.lineY + 1, (lbl.lineX - 1 + txtWdth), lbl.lineY + 1);

	
	// doc.setFontSize(11);
	// lbl.lineY += 8;
   // doc.text("Team Hoods:", lbl.indentX, (lbl.oY + 27));
	// lbl.lineY += 4.5;
	
		// // ?s for safety. only reads the property if it exists, rather than erroring if it doesn't it returns undefined
	// const teamSizes = order.shirts?.find(shirt => shirt.shortName === 'Dairy Hoods').sizes;
	// if (hasItems(teamSizes)) {
		// doc.text(genBLSizesString(teamSizes), lbl.lineX, lbl.lineY);
	// }
	
		// // only do this if there are additional styles in order.shirts
	// if (order.shirts.length > 1) {
			// // omit Dairy Hoods
		// order.shirts
		// .filter(style => style.shortName !== 'Dairy Hoods')
		// .forEach(style => {
			// lbl.lineY += 6;
			// doc.text("Additional " + style.shortName + ":", lbl.indentX, lbl.lineY);
			// lbl.lineY += 4.5;
			// doc.text(genBLSizesString(style.sizes), lbl.lineX, lbl.lineY);
		// });
		// doc.setFontSize(14);
		// lbl.lineY += 9;
		// txt = "Due: $" + order.due;
		// if (!order.paid) {
			// txtWdth = doc.getTextWidth(txt);
			// doc.setFillColor('#ffff00');
			// doc.rect((lbl.lineX - 1), (lbl.lineY + 1), (txtWdth + 2), -7, "F");
		// }
		// doc.text(txt, lbl.lineX, lbl.lineY);
		// if (order.paid) {
			// doc.setTextColor('#ff0000'); // red
			// txtWdth = doc.getTextWidth(txt);
			// doc.text(" PAID", lbl.lineX + txtWdth, lbl.lineY);
			// doc.setTextColor('#000000'); // Black
		// }
	// }
	
	// addReturnWarning(doc, lbl);
// }

function addReturnWarning(doc, lbl) {
	lbl.lineX = lbl.alignX;
	lbl.lineY = lbl.origin.y + 75;
	
	doc.line(lbl.lineX, lbl.lineY, (lbl.oX + lbl.width - lbl.padding), lbl.lineY)
	lbl.lineY += 7;
	
	doc.setTextColor(255, 0, 0); // red
	// doc.setFont('helvetica', 'bold');
	doc.setFontSize(18);
	lbl.centerTextInLabel("NO EXCHANGES");
		// switch the text back
	doc.setFont('helvetica', 'normal');
	doc.setTextColor(0, 0, 0); // black
	lbl.lineY += 4.5;
	
	
	doc.setFontSize(10);
	const explnTxt = "All orders are pre-printed to the specifications of the order submitted by your administrator.";
	const maxWidth = lbl.width - lbl.offsetX - lbl.padding;
		// multi line
	let lines = doc.splitTextToSize(explnTxt, maxWidth);
	doc.text(lines, lbl.lineX, lbl.lineY);
	
	lbl.lineY += 12;
	doc.setFontSize(12);
	const rtrnTxt = "Please verify contents before distributing. If there are any discrepancies between the contents in the box " +
						 "and the printed label on the box the ENTIRE order and box must be returned";

	
	lines = doc.splitTextToSize(rtrnTxt, maxWidth);
	// const lineHeight = doc.getFontSize() / doc.internal.scaleFactor + 2; // add padding between lines if needed

	let underlineWord = "ENTIRE";
	let x = lbl.lineX;
	let y = lbl.lineY;

	lines.forEach((line, i) => {
		doc.text(line, x, y);
		if (line.includes(underlineWord)) {
				// Find offset of the word within the line
			const parts = line.split(underlineWord);
			const beforeWidth = doc.getTextWidth(parts[0]);
			const wordWidth = doc.getTextWidth(underlineWord);

				// Draw underline under the word
			const underlineY = y + 0.7; // a little below baseline
			doc.line(x + beforeWidth, underlineY, x + beforeWidth + wordWidth, underlineY);
		}

		y += 5;
	});
}


function genBLSizesString(sizes) {
   return Object.values(sizes)
        .sort((a, b) => sizeList.indexOf(a.charName) - sizeList.indexOf(b.charName)) // Sort based on the sizeList
        .map(size => size.charName + ": " + size.quantity)
        .join(", ");
}


function genSoSPDF() {
	const btn = event.currentTarget;
	const eventSiteID = btn.dataset.eventSiteID;
	// const sport = btn.closest('h1');
	const siteName = btn.closest('h2').firstChild.textContent.trim();
	const division = "";
	console.log(siteName);
}







	// Modal functions ////////////////////////////////////////////////////////
	// Function to open the modal
function openModal(content) {
  modalText.textContent = content; // Set the modal's text
  modal.style.display = "block"; // Show the modal
}

	// Function to close the modal
function closeModal() {
  modal.style.display = "none"; // Hide the modal
}

	// Close modal when clicking outside the modal content
window.addEventListener("click", (event) => {
  if (event.target === modal) {
    closeModal();
  }
});




//////////////////////////////////////////////////////////////////////////////////
// ARBITRARY HELPERS

	// delete all properties from an object, and assign properties from a new object. wanted to update a nested object
function updateObject(obj, newObj) {
    Object.keys(obj).forEach(key => delete obj[key]);
    Object.assign(obj, newObj);
}

function hasItems(arr) {
   return (Array.isArray(arr) && arr.length > 0);
}






	/////////////////////////////////////////////////////////
	//test stuff
	
function testPDF() {
	const { jsPDF } = window.jspdf; 
   const doc = new jsPDF('p', 'mm', 'letter');
	
	let origin = labelPage.origins[0];
		// doc, origin, lbl.padding, indentLeft, lineSpaces, offsetX, offsetY
	let lbl = new Label(doc, origin);
	
	drawLabelRects(doc);
	const halfLabelX = lbl.oX + lbl.width / 2;
	const halfLabelY = lbl.oY + lbl.height / 2;
	// doc.line(halfLabelX, lbl.oY, halfLabelX, lbl.oY + lbl.height);
	// doc.line(lbl.oX, halfLabelY, lbl.oX + lbl.width, halfLabelY);
	// doc.line(lbl.oX, lbl.oY, lbl.oX + lbl.width, lbl.oY + lbl.height);
	// doc.line(lbl.oX, lbl.oY + lbl.height, lbl.oX + lbl.width, lbl.oY);
	
		// variables
	const division = "6A";
	const site = "Northwest Nazarene University";
	const sport = "Girls Basketball";
	const school = "American Heritage Charter";
	const sizeList = [
         { charName: 'S', quantity: 22 },
         { charName: 'M', quantity: 22 },
         { charName: 'L', quantity: 22 },
         { charName: 'XL', quantity: 22 },
         { charName: '2X', quantity: 22 },
         { charName: '3X', quantity: 22 }
      ];
	let teamShirts = { 'Adult Hoods': { sizes: sizeList } };
	let addedShirts = { 'Adult Hoods': { sizes: sizeList, shortName: 'Adult Hoods' }, 
								'Adult Crews': { sizes: sizeList, shortName: 'Adult Crews' },
								'Youth Hoods': { sizes: sizeList, shortName: 'Yth Hoods' }  };
	const due = 1218;
	const paid = false;
	
	let txt;
	let txtWdth;
	
	
	doc.setFontSize(14);
	lbl.addSiteDivision(site, division);
	
		// start the normal rows
   // doc.text(sport, lbl.indentX, lbl.lineY);
	lbl.centerTextInLabel(sport);
	doc.setFontSize(18);
	lbl.lineY += 9;
   doc.text(school, (lbl.lineX - 1), lbl.lineY);
	txtWdth = doc.getTextWidth(school);
	doc.line((lbl.lineX - 1), lbl.lineY + 1, (lbl.lineX - 1 + txtWdth), lbl.lineY + 1);
	// doc.rect((lbl.lineX - 1), lbl.lineY, txtWdth, -10);

	
	doc.setFontSize(11);
	lbl.lineY += 8;
   doc.text("Team Hoods:", lbl.indentX, (lbl.oY + 27));
	lbl.lineY += 4.5;
	
	const sizes = teamShirts?.['Adult Hoods']?.sizes;
	if (sizes && Object.keys(sizes).length > 0) {
		doc.text(genBLSizesString(sizes), lbl.lineX, lbl.lineY);
	}
	
	if (!Array.isArray(addedShirts)) {
		Object.values(addedShirts).forEach(style => {
			lbl.lineY += 6;
			doc.text("Additional " + style.shortName + ":", lbl.indentX, lbl.lineY);
			lbl.lineY += 4.5;
			doc.text(genBLSizesString(style.sizes), lbl.lineX, lbl.lineY);
		});
		doc.setFontSize(14);
		lbl.lineY += 9;
		txt = "Due: $" + due.toLocaleString();
		if (!paid) {
			txtWdth = doc.getTextWidth(txt);
			doc.setFillColor('ffff00'); // yellow
			doc.rect((lbl.lineX - 1), (lbl.lineY + 1), (txtWdth + 2), -6, "F");
		}
		doc.text(txt, lbl.lineX, lbl.lineY);
		if (paid) {
			doc.setTextColor(255, 0, 0); // red
			txtWdth = doc.getTextWidth(txt);
			doc.text(" PAID", lbl.lineX + txtWdth, lbl.lineY);
			doc.setTextColor(0, 0, 0); // Black
		}
	}
	
	lbl.lineX += 60;
	lbl.rectText("Box 1/2", '#ff5844', 'F');
	lbl.lineX -= 60;
	
	addReturnWarning(doc, lbl);
	
	
	/////////////////////////////////////////////////////////////////////////////////////
		// a second label to compare
	lbl = new Label(doc, labelPage.origins[1]);
	
	lbl.addSiteDivision(site, division);
	
		// start the normal rows
   doc.text(sport, lbl.indentX, lbl.lineY);
	
		// put school in a rectangle
	doc.setFontSize(18);
	lbl.lineY += 9;
	lbl.rectText(school);

	
	doc.setFontSize(11);
	lbl.lineY += 8;
	txt = "Team";
	txtWdth  = doc.getTextWidth(txt);
   doc.text(txt, lbl.lineX, (lbl.oY + 27));
	
	lbl.lineX = lbl.origin.x + 42;
	sizeList.forEach(size => {
		doc.text(size.charName, lbl.lineX, (lbl.oY + 27));
		lbl.lineX += 8;
	});
	lbl.lineX = lbl.alignX;
	lbl.lineY += 4.5;
	
	doc.text("Hoods", lbl.lineX, lbl.lineY);
	lbl.lineX = lbl.origin.x + 42;
	sizeList.forEach(size => {
		doc.text(String(size.quantity), lbl.lineX, lbl.lineY);
		lbl.lineX += 8;
	});
	lbl.lineX = lbl.alignX;
	
	
	doc.setTextColor('444444');
	
	if (!Array.isArray(addedShirts)) {
		lbl.lineY += 7;
		txt = "Additional: ";
		txtWdth = doc.getTextWidth(txt);
		
		doc.text("Additional: ", lbl.indentX, lbl.lineY);
		
		Object.values(addedShirts).forEach(style => {
			lbl.lineY += 6;
			doc.text(style.shortName + ":", (lbl.origin.x + lbl.offsetX), lbl.lineY);
			lbl.lineX = lbl.origin.x + 42;
			sizeList.forEach(size => {
				doc.text(String(size.quantity), lbl.lineX, lbl.lineY);
				lbl.lineX += 8;
			});
		});
		
		lbl.lineX = lbl.alignX;
		
		doc.setTextColor('000000');
		doc.setFontSize(14);
		lbl.lineY += 9;
		txt = "Due: $" + due.toLocaleString();
		if (!paid) {
			txtWdth = doc.getTextWidth(txt);
			doc.setFillColor('ffff00');
			doc.rect((lbl.lineX - 1), (lbl.lineY + 1), (txtWdth + 2), -6, "F");
		}
		doc.text(txt, lbl.lineX, lbl.lineY);
		if (paid) {
			doc.setTextColor(255, 0, 0); // red
			txtWdth = doc.getTextWidth(txt);
			doc.text(" PAID", lbl.lineX + txtWdth, lbl.lineY);
			doc.setTextColor(0, 0, 0); // Black
		}
	}
	
	lbl.lineX += 60;
	lbl.rectText("Box 1/2", '#ff5844', 'F');
	lbl.lineX -= 60;
	
	addReturnWarning(doc, lbl);
	
	
	/////////////////////////////////////////////////////////////////////////////////////
		// a third label to compare
	lbl = new Label(doc, labelPage.origins[2]);
	
	
	doc.setFontSize(14);
	txt = site + " - " + division;
	txtWdth = doc.getTextWidth(txt);
	rotY = lbl.oY + txtWdth + lbl.padding;
	// doc.rect((lbl.oX+ lbl.padding), rotY, -10, -txtWdth);
		// rotate this first line
   doc.text(txt, (lbl.oX + lbl.padding), rotY, {angle: 90});
	
		// start the normal rows
   doc.text(sport, lbl.indentX, lbl.lineY);
	// lbl.centerTextInLabel(sport);
	
	doc.setFontSize(18);
	lbl.lineY += 9;
	lbl.rectText(school, '#ccccff', 'F');
	

	
	doc.setFontSize(11);
	lbl.lineY += 8;
   doc.text("Team Hoods:", lbl.indentX, (lbl.oY + 27));
	lbl.lineY += 4.5;
	
	if (sizes && Object.keys(sizes).length > 0) {
		doc.text(genBLSizesString(sizes), lbl.lineX, lbl.lineY);
	}
	
	doc.setTextColor('333333');
	
	if (!Array.isArray(addedShirts)) {
		Object.values(addedShirts).forEach(style => {
			lbl.lineY += 6;
			doc.text("Additional " + style.shortName + ":", lbl.indentX, lbl.lineY);
			lbl.lineY += 4.5;
			doc.text(genBLSizesString(style.sizes), lbl.lineX, lbl.lineY);
		});
		
		doc.setTextColor('000000');
		doc.setFontSize(14);
		lbl.lineY += 9;
		txt = "Due: $" + due.toLocaleString();
		if (!paid) {
			txtWdth = doc.getTextWidth(txt);
			doc.setFillColor(255, 255, 0);
			doc.rect((lbl.lineX - 1), (lbl.lineY + 1), (txtWdth + 2), -6, "F");
		}
		doc.text(txt, lbl.lineX, lbl.lineY);
		if (paid) {
			doc.setTextColor(255, 0, 0); // red
			txtWdth = doc.getTextWidth(txt);
			doc.text(" PAID", lbl.lineX + txtWdth, lbl.lineY);
			doc.setTextColor(0, 0, 0); // Black
		}
	}
	
	lbl.lineX += 60;
	lbl.rectText("Box 1/2", '#ff5844', 'F');
	lbl.lineX -= 60;
	
	addReturnWarning(doc, lbl);
	
		// Generate a Blob URL and open it in a new tab
	const pdfBlob = doc.output("blob");
	const url = URL.createObjectURL(pdfBlob);
	window.open(url, "_blank", "noopener");
}

function drawLabelRects(doc) {
	labelPage.origins.forEach(coord => {
		doc.rect(coord.x, coord.y, labelPage.labelWidth, labelPage.labelHeight);
	});
}

function changeSelectedTable(tableSelect) {
	console.log('Selected ' + tableSelect.value);
}

async function getAnItem() {
	let table = document.getElementById('selectTable').value;
		// remove the 's'
	let className = table.slice(0, -1);
	let id = document.getElementById('getByNameSelect').value;
	const data = {'className': className, 'id': id };
	let request = new ActionRequest('getItemByID', 'Test', data);
	let responseJSON = await myFetch(request);
	console.log(request);
	console.log(responseJSON);
	openModal(JSON.stringify(responseJSON.item));
}

async function getAllItems() {
	let table = document.getElementById('selectTable').value;
		// remove the 's'
	let className = table.slice(0, -1);
	const data = {'className': className };
	let request = new ActionRequest('getAllItems', 'Test', data);
	let responseJSON = await myFetch(request);
	console.log(request);
	console.log(responseJSON);
	let responseClass = responseJSON.data.className;
	openModal(JSON.stringify(responseJSON.items, null, 2));
}

async function addAnItem() {
	let table = document.getElementById('selectTable').value;
		// remove the 's'
	let className = table.slice(0, -1);
	let name = document.getElementById('nameInput').value;
	const data = {'className': className, 'name': name };
	let request = new ActionRequest('addItem', 'Test', data);
	let responseJSON = await myFetch(request);
	console.log(request);
	console.log(responseJSON);
	openModal(JSON.stringify(responseJSON));
}

async function deleteAnItem() {
	let table = document.getElementById('selectTable').value;
		// remove the 's'
	let className = table.slice(0, -1);
	let id = document.getElementById('deleteByNameSelect').value;
	const data = {'className': className, 'id': id };
	let request = new ActionRequest('deleteItem', 'Test', data);
	let responseJSON = await myFetch(request);
	console.log(request);
	console.log(responseJSON);
	openModal(JSON.stringify(responseJSON));
}




	//////////////////////////////////////////////////////////
	// DON'T LEAVE THIS IN PRODUCTION
	//////////////////////////////////////////////////////////
async function showTable(item) {
		// make sure we have the correct year
	let year = currentYear;
	if (document.getElementById("selectYear")) {
		year = document.getElementById("selectYear").value;
	}
		// make sure we have an item
	if (!item) {
		if (document.getElementById("selectTable")) {
			item = document.getElementById("selectTable").value;
		} else {
			item = "colors";
		}
	}
	const data = {'table': item, 'year': year}
	showPage('showTable', 'Test', data);
}