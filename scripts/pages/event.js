/////////////////////////////////////////////////////////////////////////////////////////////
// js functions for the event page
import { runtime } from '../runtime.js';
import { myFetch } from '../fetch.js';
import { sizeList } from '../constants.js';
import { ActionRequest } from '../models/other-classes.js';
import { StateEvent, SchoolOrder, School } from '../models/db-classes.js';
import { openModal, closeModal } from '../modal.js';
import { parseToInstancesArr } from '../utilities.js';
import { printBoxLabel, printUndoneBoxLabels, downloadInvoicePDF, printAllInvoices, 
			printSoSPDF, printAllSoSPDF, printOMessages, genIHSAATotals } from '../print.js';


export async function goToEventPage(sport) {
		// get the current school year
	const sixMonthsAgo = new Date();
	sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
	let year = sixMonthsAgo.getFullYear() % 100;
		// but reset it based off the select. the previous year calculation is really a fall back
	if (document.getElementById("selectYear")) {
		year = document.getElementById("selectYear").value;
	}
	let sportID = sport[1];

	let request = new ActionRequest('showEventBySportAndYear', 'Event', { 'year': year, 'sportID': sportID });

	let responseJSON = await myFetch(request);
	
	document.getElementById("display").innerHTML = responseJSON.html;
	
		// reset mode on load
	runtime.activeMode = null;
	

	if (responseJSON.data !== null) {
		runtime.stateEvent = StateEvent.fromJSON(responseJSON.data);
			// ATTACH EVENT LISTENERS 
		addEventPageFunctionality();
	}	
}

export function addEventPageFunctionality() {
		// PRE LOAD 
	runtime.allItems.load();



	const container = document.getElementById('eventContainer');
		// this is one listener that handles clicks for all buttons on the event page
			// may be should move top level buttons to a more specific listener
		//////////////////////////////////////////////////////////////////////////////////////////////////////
	container.addEventListener('click', function(event) {
		const target = event.target;

			////////////////// call the correct function for the click by checking the target ////////////////////
			
			// order-action related. buttons for: AddOns, Editing, ShowingMessage, PrintingLabel, DownloadingInvoice 
				// also Submitting and Canceling those actions
		if (target.classList.contains('order-action')) {
				// get the order to pass
			const order = getOrderFromTableButton(target);

				// define actions. 'selector': function to call
			const orderActions = {
				'span.editSizes': () => { if (!runtime.activeMode) showEditSizeInputs(order); },
				'span.addAddOns': () => {
					if (!runtime.activeMode || runtime.activeMode === 'add') showAddOnInputs(order);
				},
				'span.showMessage': () => showOMessage(order),
				'span.printLabel': () => { if (!runtime.activeMode) printBoxLabel(order); },
				'span.dlInvoice': () => { if (!runtime.activeMode) downloadInvoicePDF(order); },
				'span.showMore' : () => showMoreRowOptions(order),
				'button.submitAddOns': () => submitAddOns(target, order),
				'button.submitEdit': () => submitSizeEdit(target, order),
				'button.cancelAddOns': () => cancelAddOns(target),
				'button.cancelEdit': () => cancelSizeEdit(target)
			};


				// check if the target matches any of the above selectors, call it's function and exit if so
			for (const sel in orderActions) {
				if (target.matches(sel)) {
					orderActions[sel]();
					return;
				}
			}
			return; // nothing matched, exit. this will skip the rest of the listener
		}

			// top-level buttons. 'selector': function to call
		const topLevelActions = {
			'button.genUndoneBoxLabelsBtn': () => printUndoneBoxLabels(),
			'button.genTotalsBtn': () => genIHSAATotals(),
			'button.printInvoicesBtn': () => printAllInvoices(),
			'button.printMessagesBtn': () => printOMessages(),
			'button.newOrderBtn': () => makeBlankOrder(),
			'button.printAllSoSPDF': () => printAllSoSPDF(),
			'button.printSoSPDF': () => printSoSPDF(runtime.stateEvent.getDivisionByID(target.dataset.eshdid))
		};

		for (const sel in topLevelActions) {
			if (target.matches(sel)) {
				topLevelActions[sel]();
				return;
			}
		}
	});



	
		// next a listener for the inputs to ensure integer values
	container.addEventListener('input', (e) => {
		if (e.target.matches('input[type="number"]')) {
			e.target.value = e.target.value.replace(/[^\d-]/g, '');
		}
	});
	
		// changeOrderCompleteness listeners
	container.addEventListener('change', function(event) {
		if (event.target.matches('input.orderChckBx')) {
			changeOrderCompleteness(event.target, getOrderFromTableButton(event.target));
		} else if (event.target.matches('input.commentChckBx')) {
			changeCommentHandled(event.target);
		}
	});


	const modal = document.getElementById('myModal');
	modal.addEventListener('click', function(event) {
		const target = event.target;
		const rowOptions = {
			'button.quote' : () => { downloadInvoicePDF(null, "Quote"); },
			'button.receipt' : () => { downloadInvoicePDF(null, "Receipt"); }
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
			// get ids from data-attributes
		const orderID = Number(target.closest('tbody').getAttribute('data-school-order-id'));
		const divID = Number(target.closest('table').getAttribute('data-event-site-division-id'));
		const eventSiteID = Number(target.closest('table').getAttribute('data-event-site-id'));
	
		return getOrderByIDs(eventSiteID, divID, orderID);
	}
}
		
function getOrderByIDs(eventSiteID, divID, orderID) {
	if (runtime.stateEvent) {
			// get the site, then division, then order. return null if not found
		const eventSite = runtime.stateEvent.eventSites.find(eSite => eSite.id === eventSiteID);
		if (!eventSite) return null;
		
		const division = eventSite.esDivisions.find(div => div.id === divID);
		if (!division) return null;

		const order = division.schoolOrders.find(order => order.id === orderID);

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
		order.division = division.division.name + divGenderStr;
		order.site = eventSite.site.name;
		order.sportStr =  sportGenderStr + runtime.stateEvent.sport.name;
		
		return order || null;
	}
}


////////////////// functions for editing orders in the page

function showAddOnInputs(order) {
		// set mode. prevents edit being called while this is open
	runtime.activeMode = 'add';
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
			
				// make an identifier for the first input so we can focus later
			let firstInput = null;
				// create the inputs for the middle rows
			for (let i = 0; i < tdCount - 3; i++) {
				const newTd = document.createElement('td');
				const input = makeInput(i);
				newTd.appendChild(input);  
				newTr.appendChild(newTd);  
				if (!firstInput) firstInput = input;
			}
			
				// submit/cancel td
			const btnTD = document.createElement('td');
			newTr.appendChild(btnTD);
				// put submit and cancel buttons in the btnTD, unless there already is one
			if (prnt.querySelector('button.submitAddOns') === null) makeSubmitCancelButtons(btnTD, prnt, 'AddOns');
			
				// a final empty cell to maintain form
			const lastTd = document.createElement('td');
			newTr.appendChild(lastTd);

				// Append the newly created <tr> to the <tbody>
			prnt.appendChild(newTr);
			
				// give focus to the first input
			firstInput.focus();
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
		let style = runtime.sizeCodesByStyles.find(style => style.id === styleID);
			// get the inputs
		const inputs = Array.from(row.querySelectorAll('input[type="number"]'))
			.filter(input => parseInt(input.value, 10) > 0);
		inputs.forEach((input) => {
				// match quantities with itemIDs, then push them to an array
			const sizeChar = input.dataset.sizeChar;
			const itemID = style.sizeMap[sizeChar].id;
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
	const data = {'orderID': order.id, 'addItems': addItems };
	let request = new ActionRequest('addAddOns', 'SOrderItem', data);
	let responseJSON = await myFetch(request);
	
	if (responseJSON.success) {
		order.updateFromJSON(responseJSON.data.newOrder);
		cleanInputRows(rows);
			// exit 'add' mode
		runtime.activeMode = null;
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
	runtime.activeMode = null;
}

function makeSubmitCancelButtons(td, tbody, action) {
	const submitButton = document.createElement('button');
	submitButton.type = 'button';
	submitButton.textContent = 'Submit';
	submitButton.classList.add('addOnButton', 'order-action', 'submit' + action);
	td.appendChild(submitButton);
	
	const cancelButton = document.createElement('button');
	cancelButton.type = 'button';
	cancelButton.textContent = 'X';
	cancelButton.classList.add('addOnButton', 'order-action', 'cancel' + action);
	td.appendChild(cancelButton);

		// add event listeners for ESC and ENTER
	if (tbody) {
		// define the listener as a named function
		const keyHandler = function(e) {
			if (e.key === 'Escape') {
					cancelButton.click();
					cleanup();
			} else if (e.key === 'Enter') {
					submitButton.click();
					cleanup();
			}
		};

		tbody.addEventListener('keydown', keyHandler);

		// define a cleanup helper
		function cleanup() {
			tbody.removeEventListener('keydown', keyHandler);
		}
	}
}

function buildAddOnSelect(prnt) {
		// get the styles that have already been added. get the rows with the attribute, then pull the ids with .map()
	const rows = Array.from(prnt.querySelectorAll('tr[data-style-id]'))
	const preStyleIDs = rows.map(tr => Number(tr.getAttribute('data-style-id')));
	
	const newSlct = document.createElement('select');
	runtime.sizeCodesByStyles.forEach((style) => {
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
		if ((total === 0) && (row !== row.parentElement.firstElementChild)) row.remove();
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
	const input = document.createElement('input');
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
	runtime.activeMode = 'edit';
		// get the parent element with the specified data attribute
	const prnt = document.querySelector(`[data-school-order-id="${order.id}"]`);
	if (prnt) {
			// get the rows for the order
		const rows = Array.from(prnt.children);
			// make an identifier for the first input so we can focus later
		let firstInput = null;

			// make inputs
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

				if (!firstInput) firstInput = input;
			}
			let totalCell = cells[cells.length - 2];
			totalCell.dataset.oValue = totalCell.textContent.trim();
			totalCell.textContent = '';
      });
		
			// put submit and cancel in the right place
		const firstCells = rows[0].querySelectorAll('td');
		const btnTD = firstCells[firstCells.length - 2];
		makeSubmitCancelButtons(btnTD, prnt, 'Edit');
			// give focus
		firstInput.focus()
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
	runtime.activeMode = null;
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
		let style = runtime.sizeCodesByStyles.find(style => style.id === styleID);
			// get the inputs
		let inputs = Array.from(row.querySelectorAll('input[type="number"]'));
		inputs.forEach(input => {
				// if the value has been changed, add it to the array
			let oValue = input.closest('td').dataset.oValue;
			if (oValue === '-' || oValue === '') oValue = 0;
			if (input.value != oValue) {
				const sizeChar = input.closest('td').title;
				const itemID = style.sizeMap[sizeChar].id;
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
	const data = { 'orderID': order.id, 'items': items };	
	const request = new ActionRequest('editSizes', 'SchoolOrder', data);
	let responseJSON = await myFetch(request);

	if (responseJSON.success) {
		order.updateFromJSON(responseJSON.data.newOrder);
		cleanInputRows(rows);
			// exit edit mode
		runtime.activeMode = null;
	}
}


	// shows the original message
function showOMessage(order) {
	if (!order.messageOrders[0]) {
		openModal("No order message");
	} else {
		let mText = order.messageOrders[0].orderText;
		console.log(order);
			// if there is a second messageOrder, append it's text
		if (order.messageOrders[1]) mText += "\n\n" + order.messageOrders[1].orderText;
			// display it
		openModal(mText);
	}
}


	// toggles an order as done / not done
async function changeOrderCompleteness(box, order) {
	if (order.shirtsByStyle.length === 0) {
		openModal("You can not mark an order with no shirts complete");
		box.checked = false;
	} else {
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
				updateNeeded(order);
			} else {
				tbody.classList.remove("doneRow", "partDoneRow");
				tbody.classList.add("unDoneRow");
				updateNeeded(order, false);
			}
		} else {
			box.checked = !completeness;
		}
	}
}

	// updates a one row table at the top of the page displaying how many more of each size are needed
function updateNeeded(order, add = true) {
	const tds = document.querySelectorAll('.needTable tbody tr td');
	order.getTeamStyle().sizes.forEach(size => {
		const match = Array.from(tds).find(td => td.title === size.charName);
      if (match) {
         let current = parseInt(match.textContent.trim(), 10);
         if (isNaN(current)) current = 0;
         const delta = add ? -size.quantity : size.quantity;
         match.textContent = current + delta;
			
			const totalCell = Array.from(tds).find(td => td.title === "total");
         let currentTotal = parseInt(totalCell.textContent.trim(), 10);
         if (isNaN(currentTotal)) currentTotal = 0;
         totalCell.textContent = currentTotal + delta;
      }
	});
}


	// marks a comment as handled
async function changeCommentHandled(box) {
	const data = {'id': box.dataset.orderId, 'handled': box.checked};
	let request = new ActionRequest('changeCommentHandled', 'MessageOrder', data);
	let responseJSON = await myFetch(request);
	
	if (responseJSON) {
			// remove the comment
		box.closest('tr').remove();
	}
}

    // add an itemless schoolOrder to an event. will add it to db, and current display 
        // useful when a school orders add ons before submitting a roster through ihsaa
async function makeBlankOrder() {
	let allSchools = Object.values(await runtime.allSchools.load());
	allSchools.sort((a, b) => a.shortName.localeCompare(b.shortName));

	    // Create content as a DOM fragment / wrapper
	const wrapper = document.createElement('div');
	wrapper.innerHTML = 
      `<label for="schoolInput">Select School:</label>
		<input list="schoolList" id="schoolInput" name="schoolInput" />
		<datalist id="schoolList"></datalist>
		<p id="schoolIDDisplay">Selected School ID: <span id="schoolID"></span></p>`;
	if (runtime.stateEvent.sport.name.toLowerCase() === "soccer") {
		wrapper.innerHTML += 
			`<form class="genderRadio"d>
				<p>Gender:</p>
				<label><input type="radio" name="gender" value="1">Boys</label>
				<label><input type="radio" name="gender" value="2">Girls</label>
				<p id="gndrMsg"></p>
			</form>`;
	}
	wrapper.innerHTML += `<button id="addSchoolBtn">Add School</button>`;

        // setTimeout() to delay the code that follows. give the DOM time to catch up
	setTimeout(() => {
		wrapper.querySelector('#schoolInput')?.focus();
	}, 0);

        // make a list of schools to select from
	const schoolMap = {};
	const dl = wrapper.querySelector('#schoolList');
	allSchools.forEach(school => {
		const optn = document.createElement('option');
		optn.value = school.shortName;
		dl.appendChild(optn);
		schoolMap[school.shortName] = school;
	});

        // update schoolID <span> on selection change
	wrapper.querySelector("#schoolInput").addEventListener("change", (e) => {
		const schoolName = e.target.value;
		const school = schoolMap[schoolName] || "Not found";
		wrapper.querySelector("#schoolID").textContent = school.id;
	});

        // add a listener for the submit button
	wrapper.querySelector("#addSchoolBtn").addEventListener("click", async () => {
			// get the school
		const schoolName = wrapper.querySelector("#schoolInput").value;
		const school = schoolMap[schoolName];
		if (!school) {
			wrapper.querySelector("#schoolID").textContent = "School not found";
			return;
		}

			// initialize gender as null
		let gender = null;
			// check if the gender form exists. currently only true for soccer
		const genderForm = wrapper.querySelector(".genderRadio");
		if (genderForm) {
			const selected = genderForm.querySelector('input[name="gender"]:checked');
			if (selected) {
					gender = selected.value;
			} else {
						// optionally, handle case where nothing is selected
					wrapper.querySelector("#gndrMsg").textContent = "Gender is required for this sport";
					return;
			}
		}
            // close the modal on submit
		closeModal();

            // get the eventSiteDivision so we can add this new order appropriately
		const esd = runtime.stateEvent.getEsdByDivIDAndGenderID(school.division.id, gender);
			// check if this school already has an order
		if (esd.hasSchoolByID(school.id)) {
				// if so, reopen modal just to show a message
			openModal("This school is already in this event.");
		} else {
				// if not, add it
			const request = new ActionRequest('addNewOrder', 'SchoolOrder', [esd.id, school.id, gender]);
			const responseJSON = await myFetch(request);
			const orderID = responseJSON.data;
                // get the appropriate table to append this order to
			let table = document.querySelector(`table.orderTable[data-event-site-division-id='${esd.id}']`);
                // if it doesn't already exist, create it
            if (!table) {
				table = document.createElement('table');
				table.innerHTML = `<thead><tr>
									<th>School</th>
									<th>S</th><th>M</th><th>L</th><th>XL</th><th>2X</th><th>3X</th><th>Total</th>
									<th><span class="material-icons">more_horiz</span></th>
									</tr></thead>`;
				table.className = "orderTable";
				table.dataset.eventId = runtime.stateEvent.id;
				table.dataset.eventSiteDivisionId = esd.id;
				
					// Find the h3 with the matching division id, so we can navigate the DOM to place the table
				const h3 = document.querySelector(`h3[data-event-site-division-id='${esd.id}']`);
				if (!h3) {
					console.error(`Could not find h3 for division id ${esd.id}`);
					return;
				}

					// Traverse upward to find the previous h2 so we can get a data-attribute
				let current = h3.previousElementSibling;
				while (current && current.tagName !== 'H2') {
					current = current.previousElementSibling;
				}

				if (current && current.dataset.eventSiteId) {
					table.dataset.eventSiteId = current.dataset.eventSiteId;
				} else {
					console.error(`Could not find corresponding h2 for division id ${esd.id}`);
					return;
				}

					// Insert the table after the h3
				h3.insertAdjacentElement('afterend', table);
			}
    
                // populate the new <tr>
			const rowContent = `<tr data-style-id="9">
					<td title="${orderID} / ">${schoolName}</td>
					<td title="S">-</td>
					<td title="M">-</td>
					<td title="L">-</td>
					<td title="XL">-</td>
					<td title="2XL">-</td>
					<td title="3XL">-</td>
					<td title="total">-</td>
					<td>
						<span class="material-icons clickable order-action addAddOns" title="add add ons">add</span><span class="material-icons clickable order-action editSizes" title="edit the sizes">edit</span>
						<span class="material-icons clickable order-action showMessage" title="view the original message">article</span>
						<span class="material-icons clickable order-action printLabel" title="print box label">print</span>
						<span class="material-icons clickable order-action dlInvoice" title="download invoice">request_quote</span>
						<input class="orderChckBx" type="checkbox" id="" name="" 
							value="${orderID}" title="mark order complete" />
					</td>
				</tr>`;
                // make a new tbody to hold the new tr
			const newTbody = document.createElement('tbody');
			newTbody.innerHTML = rowContent;
			newTbody.id = 'row' + orderID;
			newTbody.className = 'unDoneRow';
			newTbody.dataset.schoolOrderId = orderID;

                // we'll use these to place the new tbody at the right spot in the table
			const tbodies = Array.from(table.querySelectorAll("tbody"));
			let inserted = false;

			for (const tbody of tbodies) {
                    // get the first tr of the tbody
				const row = tbody.querySelector("tr");
                    // get the school name so we can check order
				const cellText = row?.querySelector("td")?.textContent?.trim();
                    // compare names, insert when appropriate
				if (cellText && schoolName.localeCompare(cellText, undefined, { sensitivity: 'base' }) < 0) {
					tbody.before(newTbody);  // newTbody should be a full <tbody> with a <tr> inside
					inserted = true;
                        // break on insertion. don't keep looking.
					break;
				}
			}
                // fallback, append to end of the table
			if (!inserted) {
				table.appendChild(newTbody);  
			}

                // finally, add the new order to the runtime
                    // make the order object, use data from above
                    //constructor({ id, eshdID, school, completeness = 0, due = null, paid = null, schoolOrderNote = null, 
                    // invoiceSent = null, messageOrders = [], shirtsByStyle = [], site = undefined, sport = undefined }) 
            const order = new SchoolOrder({
                id: orderID,
                eshdID: esd.id,
                school: school
            });

            esd.schoolOrders.push(order);
                // sort the addition
            esd.sortSchoolOrders();
		}
	});

        // finally attach everything
   openModal(wrapper); 
}


function showMoreRowOptions(order) {
		// set so modal function can access
	runtime.activeOrder = order

	const wrapper = document.createElement('div');
	let html = `<button class="clickable quote" title="download add on quote">Quote</button>
					<label>Download the invoice as a quote</label>
					<br />
					<button class="clickable receipt" title="download add on receipt">Receipt</button>
					<label>Download the invoice as a Receipt</label>`;

	wrapper.innerHTML = html;
	openModal(wrapper);
}