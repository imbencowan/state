///////////////////////////////////////////////////////////////////////////////////////
// there is a handy function in here, show(table), which can even be called from the console
// to display a table from the database in the browser
/////////////////////////////////////////////////////////////////////////////////////////


let stateData;

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

class AddOrdersRequest {
	constructor(orders) {
		this.action = 'addOrders';
		this.orders = orders;
	}
}

class ChangeDoneRequest {
	constructor(id, isDone) {
		this.action = 'changeOrderDone';
		this.orderID = id;
		this.isDone = isDone;
	}
}

class AddAddOnsRequest {
	constructor(schoolOrderID, sizes) {
		this.action = 'updateAddOns';
		this.schoolOrderID = schoolOrderID;
		this.sizes = sizes;
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
////////////////////////// this file was 698 lines before refactoring with ActionRequest

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
function init() {
		// build the nav bar i guess
	buildNavList();
	buildNavList2();
	
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
		newLI.addEventListener('click', function(){ goToSportPage(sport); });
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

async function goToSportPage(sport) {
		//we'll want to swap year statements once this is out of test
	let year = currentYear;
	if (document.getElementById("selectYear")) {
		year = document.getElementById("selectYear").value;
	}
	let sportID = sport[1];
	const data = {'sportID': sportID, 'year': year}
	let request = new ActionRequest('showSport', 'Sport', data)

	let responseJSON = await myFetch(request);
	stateData = responseJSON.data;
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
			// if found, add the event listeners to specific <span>s
		if (articleSpan) articleSpan.addEventListener('click', () => {showOMessage(orderText); });
		if (addSpan) addSpan.addEventListener('click', () => {showAddOnInputs(schoolOrderID); });
		if (editSpan) editSpan.addEventListener('click', () => {showEditRowInputs(schoolOrderID); });
		
	});
		
		//next the PDF buttons
	const siteSoSButtons = document.querySelectorAll('[data-btnType="genSoSPDF"]');
	siteSoSButtons.forEach(btn => {
		btn.addEventListener('click', () => {genSoSPDF(); });
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
	let request = new AddOrdersRequest(orders);
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
	if (sport.includes('Boys')) {
		gender = 1;
		sport = sport.slice(0, -7);
	} else if (sport.includes('Girls')) {
		gender = 2;
		sport = sport.slice(0, -8);
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

	// marks an order as complete
async function changeOrderDone(id) {
	let isDone = document.getElementById('check' + id).checked;
	let row = document.getElementById('row' + id);
	
	// let request = new ChangeDoneRequest(id, isDone);
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
	const parent = document.querySelector(`[data-schoolOrderID="${orderID}"]`);
	if (parent) {
			// Get the second child of the parent. this will be the add ons tr
		const secondChild = parent.children[1];
		if (secondChild) {
			secondChild.classList.remove('hidden');
				// Get all <td> elements in the second row
			const cells = secondChild.querySelectorAll('td');

			if (cells.length >= 8) {
					// Add number inputs to the 2nd - 7th <td>
				for (let i = 1; i <= 6; i++) {
					cells[i].classList.add('tdWithInput');
					const input = document.createElement('input');
					input.type = 'number';
					input.name = `addOn${i}`;
					input.min = 0; // Optional: Minimum value for the input
					input.max = 99;
					cells[i].innerHTML = '';
					cells[i].appendChild(input);
				}
		
				// Append a submit button to the text in the first <td>
				const submitButton = document.createElement('button');
				submitButton.type = 'button';
				submitButton.textContent = 'Submit';
				submitButton.classList.add('addOnSubmitButton'); // Add a class for styling
				cells[7].innerHTML = '';
				cells[7].appendChild(submitButton);
				submitButton.addEventListener('click', () => { submitAddOns(orderID, secondChild); });
			} else {
				console.error(`Second child does not have enough <td> elements (expected at least 8).`);
			}
		} else {
			console.error(`Second child not found for orderID: ${orderID}`);
		}
	} else {
		console.error(`Element with data-schoolOrderID="${orderID}" not found.`);
	}
}

async function submitAddOns(orderID, row) {
	console.log(`Submit button clicked for orderID: ${orderID}`);
		// get the size inputs, and their values
	const inputs = row.querySelectorAll('input[type="number"]');
	const sizes = Array.from(inputs).map(input => input.value);
	console.log(sizes);
	
	let request = new AddAddOnsRequest(orderID, sizes);
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
    // Get the first and second children of the parent. These are the rows to work with.
    const firstChild = parent.children[0]; // First row
    const secondChild = parent.children[1]; // Second row
    
    if (firstChild && secondChild) {
			// Show the second row (which is the "add ons" row)
      secondChild.classList.remove('hidden');
			// Process both the first and second rows
      [firstChild, secondChild].forEach((currentRow, rowIndex) => {
			const cells = currentRow.querySelectorAll('td');
        
			if (cells.length >= 8) {
					// Add number inputs to the 2nd - 7th <td> for both rows
				for (let i = 1; i <= 6; i++) {
					const cell = cells[i];
					const currentValue = cell.textContent.trim();
						// Only add inputs to cells that have numeric values or are empty
					// if (currentValue !== '') {
						const input = document.createElement('input');
						input.type = 'number';
						input.name = `addOn${i}`;
						input.min = 0; // Optional: Minimum value for the input
						input.max = 99;
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
      secondChild.querySelectorAll('td')[7].innerHTML = ''; // Clear any previous content in last cell
      secondChild.querySelectorAll('td')[7].appendChild(submitButton);

      // Add event listener to submit button
      submitButton.addEventListener('click', () => {
        submitSizeEdits(orderID, firstChild, secondChild);
      });
    } else {
      console.error(`Second child does not have enough <td> elements (expected at least 8).`);
    }
  } else {
    console.error(`Element with data-schoolOrderID="${orderID}" not found.`);
  }
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








	///////////////////////////////////////////////////////////test stuff
function testPDF() {
	   // jsPDF logic
   const { jsPDF } = window.jspdf; // Access jsPDF from the global object
   const doc = new jsPDF();
	doc.setFontSize(16);
		// rotate this first line
   doc.text("Sport - Division", 10, 60, {angle: 90});
   doc.text("Site", 25, 20);
   doc.text("School Name", 20, 30);
	doc.setFontSize(11);
   doc.text("Sizes: S:  M:  L:  XL:  2XL:  3XL:  ", 20, 40);
   doc.text("Add Ons: S:  M:  L:  XL:  2XL:  3XL:  ", 20, 50);
	doc.setFontSize(14);
   doc.text("Due: ", 20, 60);
	// doc.autoPrint();
		// Generate a Blob URL and open it in a new tab
	const pdfBlob = doc.output("blob");
	const url = URL.createObjectURL(pdfBlob);
	window.open(url, "_blank"); // Opens in a new tab
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