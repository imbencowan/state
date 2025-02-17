///////////////////////////////////////////////////////////////////////////////////////
// there is a handy function in here, show(table), which can even be called from the console
// to display a table from the database in the browser
/////////////////////////////////////////////////////////////////////////////////////////


let eventOrders;
let sizeCodesByStyles;


class InputOrder {
		//we're using 'sport' in place of 'event' because event is a key word
	constructor(orderedBy, school, division, sport, gender, sizes, fileName, orderText) {
		this.sport = sport;
		this.division = division;
		this.school = school;
		this.gender = gender;
		this.sizes = sizes;
		this.fileName = fileName;
		this.orderedBy = orderedBy;
		this.orderText = orderText;
	}
}

class SizeEditRequest {
	constructor(schoolOrderID, teamSizes, addOnsizes) {
		this.action = 'updateSizes';
		this.schoolOrderID = schoolOrderID;
		this.teamSizes = teamSizes;
		this.addOnSizes = addOnsizes;
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

const currentYear = 24;


	// this list is used to match sizes when reading the email string
		// '2XL' or 'XXL'? '3XL' or 'XXXL'?
const sizeList = ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'];


	// this list is used to build the nav bar.
		// this is no longer necessary, since each sport now has one associated id in the db
const sportList = [];
sportList.push(['Golf', 1]);
sportList.push(['Soccer', 2]);
sportList.push(['Volleyball', 3]);
sportList.push(['X-Country', 4]);
sportList.push(['Swimming', 5]);
sportList.push(['Football', 6]);
sportList.push(['Drama', 7]);
sportList.push(['G Basketball', 8]);
sportList.push(['Wrestling', 9]);
sportList.push(['Dance', 10]);
sportList.push(['Cheer', 11]);
sportList.push(['B Basketball', 12]);
sportList.push(['Debate', 13]);
sportList.push(['Speech', 14]);
sportList.push(['Softball', 15]);
sportList.push(['Baseball', 16]);
sportList.push(['Tennis', 17]);
sportList.push(['Track', 18]);

let modal;
let modalText;
let closeBtn;


	// init is called onload() and does stuff after the script and html is in place
		// importantly it adds event listeners after the elements exist
async function init() {
		// build the nav bar i guess
	buildNavList();
	buildNavList2();
	
	let request = new ActionRequest('loadSizeCodesByStyle', 'Item')
	sizeCodesByStyles = await myFetch(request);
	
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

const nav2Items = [];
nav2Items.push(['Year', 'showYear', 'Year', null]);
nav2Items.push(['Schools', 'showSchools', 'School', null]);
nav2Items.push(['Items', 'showItems', 'Item', null]);
nav2Items.push(['Tests', 'showTests', 'Test', null]);

function buildNavList2() {
		// get the nav bar
	let navList = document.getElementById("nav2List");
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
		if (!response.ok) {throw new Error(`Response status: ${response.status} ${response.statusText}`);}

		const json = await response.json();
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
	eventOrders = responseJSON.data;
	console.log(eventOrders);
	document.getElementById("display").innerHTML = responseJSON.html;
	
	///// ATTACH EVENT LISTENERS /////////////////////////////////
		// first the in table action buttons
	const rows = document.querySelectorAll('tbody[data-schoolOrderID]');
	rows.forEach(row => {
			// get the ID
		const schoolOrderID = row.getAttribute('data-schoolOrderID');
		const orderText = row.getAttribute('data-messageOrderText');
			// make an array of spans in the row. these will become 'buttons'
		const spans = Array.from(row.querySelectorAll('span'));
			// Find the specific <span>s by innerHTML 
		const articleSpan = spans.find(span => span.innerHTML.trim() === 'article');
		const addSpan = spans.find(span => span.innerHTML.trim() === 'add');
		const editSpan = spans.find(span => span.innerHTML.trim() === 'edit');
		const printSpan = spans.find(span => span.innerHTML.trim() === 'print');
			// if found, add the event listeners to specific <span>s
		if (articleSpan) articleSpan.addEventListener('click', () => {showOMessage(orderText); });
		if (addSpan) addSpan.addEventListener('click', () => {showAddOnInputs(schoolOrderID); });
		if (editSpan) editSpan.addEventListener('click', () => {showEditRowInputs(schoolOrderID); });
		if (printSpan) printSpan.addEventListener('click', () => {printBoxLabel(schoolOrderID); });
		
	});
		
		//next the PDF buttons
	const siteSoSButtons = document.querySelectorAll('[data-btnType="genSoSPDF"]');
	siteSoSButtons.forEach(btn => {
		btn.addEventListener('click', () => {genSoSPDF(); });
	});
	const siteBLButtons = document.querySelectorAll('[data-btnType="genBoxLabels"]');
	siteBLButtons.forEach(btn => {
		btn.addEventListener('click', () => {printBoxLabels(); });
	});
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
		if (sport == "Basketball") sport = "Boys Basketbal";
	} else if (sport.includes('Girls')) {
		gender = 2;
		sport = sport.slice(0, -8);
		if (sport == "Basketball") sport = "Girls Basketball";
	} 
	
	let sizes = getSizes(inputString);
	let order = new InputOrder(orderedBy, school, division, sport, gender, sizes, fileName, orderText);
	
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

	// toggles an order as done / not done
async function changeOrderDone(id) {
	let isDone = document.getElementById('check' + id).checked;
	let row = document.getElementById('row' + id);
	
	const data = {'id': id, 'isDone': isDone};
	let request = new ActionRequest('changeOrderDone', 'SchoolOrder', data);
	let responseJSON = await myFetch(request);
	
	if (responseJSON) {
		if (isDone) {
			row.classList.remove("unDoneRow");
			row.classList.add("doneRow");
		} else {
			row.classList.remove("doneRow");
			row.classList.add("unDoneRow");
		}
	}
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


	//////////////////////////////////////////////////////////////////////
	// js functions
function showOMessage(mText) {
  openModal(mText);
  // console.log(mText);
}

function showAddOnInputs(orderID) {
		// Find the parent element with the specified data attribute
	const prnt = document.querySelector(`[data-schoolOrderID="${orderID}"]`);
	if (prnt) {
			// count the tds in the first row
		const firstTr = prnt.querySelector('tr');
		
			// increase the button's rowcount
		let lastTd = firstTr.querySelector('td:last-child');
			// get the current rowcount, or default to 0
		let currentValue = lastTd.getAttribute('rowspan');;
			// Set the new value in the last <td>
		lastTd.setAttribute('rowspan', 1 + +currentValue);
		console.log(lastTd.getAttribute('rowspan'));
		
		const tdCount = firstTr ? firstTr.children.length : 0;

		const newTr = document.createElement('tr');
		newTr.classList.add('addOnRow');
		const newTd = document.createElement('td');
		newTd.textContent = 'Style';  
		newTr.appendChild(newTd);
		
			// create the inputs
		for (let i = 0; i < tdCount - 3; i++) {
			const newTd = document.createElement('td');
			const input = makeInput(i);
			newTd.appendChild(input);  
			newTr.appendChild(newTd);  
		}
		
			// put a submit button in the last <td>
		lastTd = document.createElement('td');
		const submitButton = document.createElement('button');
		submitButton.type = 'button';
		submitButton.textContent = 'Submit';
		submitButton.classList.add('addOnButton');
			// add an event listenter
		submitButton.addEventListener('click', () => { submitAddOns(orderID, newTr); });
		lastTd.appendChild(submitButton);
		const cancelButton = document.createElement('button');
		cancelButton.type = 'button';
		cancelButton.textContent = 'X';
		cancelButton.classList.add('addOnButton');
			// add an event listenter
		cancelButton.addEventListener('click', () => { cancelAddOns(orderID, newTr); });
		lastTd.appendChild(cancelButton);
		newTr.appendChild(lastTd);
		
			// Append the newly created <tr> to the <prnt>
		prnt.appendChild(newTr);
	} else {
		console.error(`Element with data-schoolOrderID="${orderID}" not found.`);
	}
}

function cancelAddOns(orderID, row) {
		// decrement the rowspan for the buttons td
	const firstTr = row.parentElement.firstElementChild;
   if (firstTr) {
      const lastTd = firstTr.querySelector('td:last-child');
      if (lastTd && lastTd.hasAttribute('rowspan')) {
         let currentRowspan = parseInt(lastTd.getAttribute('rowspan'), 10);

         if (!isNaN(currentRowspan) && currentRowspan > 1) {
            lastTd.setAttribute('rowspan', currentRowspan - 1);
         }
      }
   }
	row.remove(); 
}

async function submitAddOns(orderID, row) {
	// console.log(`Submit button clicked for orderID: ${orderID}`);
		// get the size inputs, and their values
	const inputs = row.querySelectorAll('input[type="number"]');
	const sizes = Array.from(inputs).map(input => input.value);
	
	const data = {'schoolOrderID': orderID, 'sizes': sizes };
	console.log(data);
	return;
	
	let request = new ActionRequest('updateAddOns', 'SchoolOrder', data);
	let responseJSON = await myFetch(request);
	
	let total = 0;
		// Replace inputs with the plain text values
	inputs.forEach((input, index) => {
		total += Number(input.value);
			// Find the <td> that contains the input
		const cell = input.closest('td');
		const textNode = document.createTextNode(input.value); 
			// clear the cell before adding the new text
		cell.innerHTML = '';
		cell.appendChild(textNode); 
	});
		// Remove the submit button
	const submitButton = row.querySelector('button');
	if (submitButton) submitButton.remove();
		// Remove the 'add' span from the sibling row
	const spans = row.closest('tbody').querySelectorAll('tr span');
	spans.forEach(span => {
		if (span.textContent.trim() === 'add') span.remove();
	});
	
		// Add the total value in place of the submit button
	const totalCell = row.querySelectorAll('td')[7]; // Assuming the total cell is in the 8th column (index 7)
	totalCell.innerHTML = ''; // Clear existing content
	const totalTextNode = document.createTextNode(total); // create a node for the total
	totalCell.appendChild(totalTextNode); // Append the total text
}

function showEditRowInputs(orderID) {
		// Find the parent element with the specified data attribute
	const parent = document.querySelector(`[data-schoolOrderID="${orderID}"]`);
  
	if (parent) {
			// get the rows for the order
		const rows = Array.from(parent.children);
  
      rows.forEach((currentRow, rowIndex) => {
			const cells = currentRow.querySelectorAll('td');
        
			if (cells.length >= 8) {
					// Add number inputs to the 2nd - 7th <td> for both rows
				for (let i = 1; i <= 6; i++) {
					const cell = cells[i];
					const currentValue = cell.textContent.trim();
						// Only add inputs to cells that have numeric values or are empty
					// if (currentValue !== '') {
						const input = makeInput(i);
						input.value = currentValue; // Set initial value from current text in <td>
						cell.innerHTML = ''; // Clear existing content
						cell.appendChild(input);
					// }
				}
			}
      });
			// Append a submit button to the second row (last cell of the second row)
      const submitButton = document.createElement('button');
      submitButton.type = 'button';
      submitButton.textContent = 'Submit';
      submitButton.classList.add('addOnSubmitButton'); // Add a class for styling
			// Add event listener to submit button
      submitButton.addEventListener('click', () => { submitSizeEdits(orderID, rows); });
		
			// Get all <td> elements in the last row
		const cells = rows[rows.length - 1].children;
			// put the button in the right place
		if (rows.length == 1) {
				// append the submit to the next-to-last <td>, if there are enough <td>s
			if (cells.length > 2) {
				targetCell = cells[cells.length - 2];
				targetCell.innerHTML = '';
				targetCell.appendChild(submitButton);
			}
		} else {
			if (cells.length > 2) {
				targetCell = cells[cells.length - 1];
				targetCell.innerHTML = '';
				targetCell.appendChild(submitButton);
			}
		}
	} else {
		console.error(`Element with data-schoolOrderID="${orderID}" not found.`);
	}
}

function makeInput(i) {
	input = document.createElement('input');
						input.type = 'number';
						input.name = `addOn${i}`;
						input.min = 0; // Optional: Minimum value for the input
						input.max = 99;
	return input;
}

async function submitSizeEdits(orderID, teamRow, addOnRow) {
	console.log(`Submit button clicked for orderID: ${orderID}`);
		// get the size inputs and their values
	const teamInputs = teamRow.querySelectorAll('input[type="number"]');
	const addOnInputs = addOnRow.querySelectorAll('input[type="number"]');
	const teamSizes = Array.from(teamInputs).map(input => input.value === '' ? 0 : Number(input.value));
	const addOnSizes = Array.from(addOnInputs).map(input => input.value === '' ? 0 : Number(input.value));

	console.log(teamSizes, addOnSizes);
	
	let request = new SizeEditRequest(orderID, teamSizes, addOnSizes);
	let responseJSON = await myFetch(request);
	
	let teamTotal = 0;
	let addOnTotal = 0;
		// Replace inputs with the plain text values
	teamInputs.forEach((input, index) => {
		teamTotal += Number(input.value);
		putValueInCell(input);
	});
	addOnInputs.forEach((input, index) => {
		addOnTotal += Number(input.value);
		putValueInCell(input);
	});
	
	
		// Remove the submit button
	const submitButton = addOnRow.querySelector('button');
	if (submitButton) submitButton.remove();
	
	putTotalInCell(teamRow, teamTotal);
	putTotalInCell(addOnRow, addOnTotal);
	
	function putTotalInCell(row, total) {
			// Add the total value in place of the submit button
		const totalCell = row.querySelectorAll('td')[7]; // Assuming the total cell is in the 8th column (index 7)
		totalCell.innerHTML = ''; // Clear existing content
		const totalTextNode = document.createTextNode(total); // create a node for the total
		totalCell.appendChild(totalTextNode); // Append the total text
	}
	
	function putValueInCell(input) {
			// Find the <td> that contains the input
		const cell = input.closest('td');
		const textNode = document.createTextNode(input.value); 
			// clear the cell before adding the new text
		cell.innerHTML = '';
		cell.appendChild(textNode); 
	}
}


function printBoxLabels() {
	let orders = [];
	Object.values(eventOrders.eventSites).forEach(eventSite => {
      Object.values(eventSite.divisions).forEach(division => {
         Object.values(division.schoolOrders).forEach(schoolOrder => {
            if (!schoolOrder.isDone) {
					schoolOrder.division = division.name;
					schoolOrder.site = eventSite.site.name;
					schoolOrder.sport = eventOrders.sport.name;
					orders.push(schoolOrder);
            }
         });
      });
   });
	
	const { jsPDF } = window.jspdf; 
   const doc = new jsPDF('p', 'mm', 'letter');
	let origin;
	let i = 0;
	let j = 0;
	orders.forEach(order => {
		origin = labelPage.labelOrigins[i];
		// console.log(origin, i);
		genBoxLabel(doc, order, origin);
		++i;
		++j;
		if (i == 6 && (j < orders.length)) {
			doc.addPage();
			i = 0;
		}
	});
	
		// Generate a Blob URL and open it in a new tab
	const pdfBlob = doc.output("blob");
	const url = URL.createObjectURL(pdfBlob);
	window.open(url, "_blank", "noopener");
}


function printBoxLabel(orderID) {
	orderID = Number(orderID);
	let order;
	Object.values(eventOrders.eventSites).forEach(eventSite => {
      Object.values(eventSite.divisions).forEach(division => {
         Object.values(division.schoolOrders).forEach(schoolOrder => {
            if (schoolOrder.orderID === orderID) {
               order = schoolOrder;
					order.division = division.name;
					order.site = eventSite.site.name;
					order.sport = eventOrders.sport.name;
            }
         });
      });
   });
	console.log(order);
		// Access jsPDF from the global object
	const { jsPDF } = window.jspdf; 
   const doc = new jsPDF('p', 'mm', 'letter');
	genBoxLabel(doc, order, labelPage.labelOrigins[0]);
	
		// Generate a Blob URL and open it in a new tab
	const pdfBlob = doc.output("blob");
	const url = URL.createObjectURL(pdfBlob);
	window.open(url, "_blank", "noopener");
}

function genBoxLabel(doc, order, origin) {
   
	drawLabelRects(doc);
	
	const oX = origin.x;
	const oY = origin.y;
	const padding = 8;
	const labelHeight = 85;
	const indentX = oX + 21;
	const lineSpace = 9;
	const lineX = oX + 16;
		// use lineY so forEach will work
	let lineY = oY + 10;
	
	let txt = order.division + " - " + order.site;
	let txtWdth = doc.getTextWidth(txt);
	let rotY = oY + (labelHeight / 2) + (txtWdth / 2);
		// rotate this first line
	doc.setFontSize(14);
   doc.text(txt, (oX + padding), rotY, {angle: 90});
	
		// start the normal rows
   doc.text(order.sport, indentX, lineY);
	doc.setFontSize(18);
	lineY += 9;
   doc.text(order.school.shortName, (lineX - 1), lineY);

	
	doc.setFontSize(11);
	lineY += 8;
   doc.text("Team Hoods:", indentX, (oY + 27));
	lineY += 7;
	
	const sizes = order.teamShirts?.['Adult Hoods']?.sizes;
	if (sizes && Object.keys(sizes).length > 0) {
		doc.text(genBLSizesString(sizes), lineX, lineY);
	}
	
	if (!Array.isArray(order.addedShirts)) {
		Object.values(order.addedShirts).forEach(style => {
			lineY += 9;
			doc.text("Additional " + style.shortName + ":", indentX, lineY);
			lineY += 7;
			doc.text(genBLSizesString(style.sizes), lineX, lineY);
		});
		doc.setFontSize(14);
		lineY += 9;
		txt = "Due: $" + order.due;
		if (!order.paid) {
			txtWdth = doc.getTextWidth(txt);
			doc.setFillColor(255, 255, 0);
			doc.rect((lineX - 1), (lineY + 1), (txtWdth + 2), -7, "F");
		}
		doc.text(txt, lineX, lineY);
		if (order.paid) {
			doc.setTextColor(255, 0, 0); // red
			txtWdth = doc.getTextWidth(txt);
			doc.text(" PAID", lineX + txtWdth, lineY);
			doc.setTextColor(0, 0, 0); // Black
		}
	}
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



const labelPage = {
	width : 215,
	height : 279,
	xMargin : 4,
	yMargin : 13,
	labelWidth : 103,
	labelHeight : 85,
	xCenter : 108,
	yCenter : 140,
	labelOrigins : [
		new Coord(4, 13), new Coord(109, 13), new Coord(4, 98), new Coord(109, 98), new Coord(4, 183), new Coord(109, 183)
	],
	padding : 6
}

// 210 x 295





	/////////////////////////////////////////////////////////
	//test stuff
	
function testPDF() {
	// Access jsPDF from the global object
   const { jsPDF } = window.jspdf; 
   const doc = new jsPDF('p', 'mm', 'letter');
	doc.setFontSize(10);
	doc.setLineWidth(1);
	// doc.rect(100, 0, 10, 295)
	// doc.rect(0, 100, 210, 10)
	let x = labelPage.xMargin;
	// let xInc = 103;
	// let yInc = 85;
	// labelPage.labelOrigins.forEach(coord => {
		// doc.rect(coord.x, coord.y, xInc, yInc);
	// });
	drawLabelRects(doc);
	
		// Generate a Blob URL and open it in a new tab
	const pdfBlob = doc.output("blob");
	const url = URL.createObjectURL(pdfBlob);
	window.open(url, "_blank"); // Opens in a new tab
}

function drawLabelRects(doc) {
	labelPage.labelOrigins.forEach(coord => {
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