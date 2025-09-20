	/////////////////////////////////////////////////////////
	//test stuff
import { ActionRequest } from "./models/other-classes.js";
import { myFetch } from "./fetch.js";
import { openModal } from "./modal.js";



export function changeSelectedTable(tableSelect) {
	console.log('Selected ' + tableSelect.value);
}

export async function getAnItem() {
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

export async function getAllItems() {
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

export async function addAnItem() {
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

export async function deleteAnItem() {
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
export async function showTable(item) {
		// a fall back
	let year = 24;
        // now get the selected year
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