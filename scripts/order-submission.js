import { ihsaaSizeList } from './constants.js';
import { actionFetch, myFetch } from './fetch.js';
import { ActionRequest, InputOrder } from './models/other-classes.js';
import { runtime } from './runtime.js';
import { modal, childModal } from './modal.js';
import { buildElement } from './utilities.js';

export async function submitOrderFiles() {
		// load some look ups
	await runtime.allActivities.load();

	let files = document.getElementById("fileInput").files;
		// check if no files were selected, and exit the function in that case
    if (files.length === 0) {
        console.log("No files selected.");
        return; 
    }
		// read the files and build orders from them
	let orders = await readFiles(files);
	
		// constructor(action, actionClass, data)
	let request = new ActionRequest('uploadOrders', 'SchoolOrder', { 'orders': orders });
	let responseJSON = await myFetch(request);

	if (!responseJSON) return;

	modal.open(buildOrderUploadResults(responseJSON.ordersAdded, responseJSON.preexistingOrders));
}

	// this came from gpt, because i'm still fuzzy on how to work with promises. and map.
async function readFiles(files) {
	let orders = [];
		// convert FileList to an array, so that we can map it
	const fileArray = Array.from(files);
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
	
	return orders;
}
	
	// this function does the actual reading of the text file submitted, with the help of getSlice()
function getOrder(orderText, fileName) {
		// Normalize line endings
   orderText = orderText.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

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
	const school = getSlice(inputString);
	const division = getSlice(inputString);
	let activity = getSlice(inputString);
	let series;
	let gender = 3;

		// get the series based on activity. // make it match the names in the db
	if (activity.includes('Boys')) {
		gender = 1;
			// remove the 'Boys ' prefix
		activity = activity.slice(0, -7);
		series = activity;
		if (activity == "Basketball") series = "Boys Basketball";
	} else if (activity.includes('Girls')) {
		gender = 2;
		activity = activity.slice(0, -8);
		series = activity;
		if (activity == "Basketball") series = "Girls Basketball";
	} else if (activity == 'Dance' || activity == 'Cheer'){
		series = 'Dance & Cheer';
	} else {
		series = activity;
	}

	const activityID = runtime.allActivities.getByName(activity).id;
	
	let sizes = getSizes(inputString);
	let order = { orderedBy, school, division, activity, activityID, series, gender, sizes, fileName, orderText, comment };
	
	return order;
}

	// the inputString argument is an object with properties that include the str to operate on, and 
		// subStart and subEnd, to track where to slice it
			// it's magic
				// really it just cuts off at a new line, and relies on the input being formatted as expected
function getSlice(inputString) {
		// move to the next stretch of the string
	inputString.subStart = inputString.subEnd + 1;
		// find the end of the line
	inputString.subEnd = inputString.str.indexOf('\n', inputString.subStart);
		// handle end of file with no line break.
	if (inputString.subEnd === -1) inputString.subEnd = inputString.str.length;

	let slice = inputString.str.slice(inputString.subStart, inputString.subEnd);

   // trim whitespace and remove any \r
   return slice.replace(/\r/g, '').trim();
}



	// gets the sizes from the order text
function getSizes(inputString) {
	let sizes = [0, 0, 0, 0, 0, 0];
	inputString.subStart = inputString.subEnd + 1;
	
	let i = 0;
	ihsaaSizeList.forEach((size) => {
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




//////////////////////////////////////////////////////////////////////////////////////////////////////////
// display upload results

function buildOrderUploadResults(ordersAdded = [], preexistingOrders = []) {
	const results = buildElement('div');
	const added = sortOrders(ordersAdded);
	const preexisting = sortOrders(preexistingOrders);

	if (!added.length && !preexisting.length) {
		results.appendChild(document.createTextNode('no orders were submitted'));
	}

	if (added.length) {
		results.appendChild(buildElement('h2', { text: 'Orders Added' }));
		results.appendChild(buildAddedOrdersTable(added));

		const commentOrders = added.filter(order => order.comment !== '');
		if (commentOrders.length) results.appendChild(buildCommentsTable(commentOrders));
	}

	if (preexisting.length) {
		results.appendChild(buildElement('p', { text: 'There is already an order for: ' }));
		results.appendChild(buildElement('ul', {
			children: preexisting.map(order => buildElement('li', {
				title: order.fileName,
				text: `${order.shortSchool} ${order.gender.name} ${order.series} ${order.year}`
			}))
		}));
	}

	return results;
}

function sortOrders(orders) {
	return [...(orders || [])].sort((a, b) =>
		compareValues(a.series, b.series) ||
		compareValues(a.division, b.division) ||
		String(a.school).localeCompare(String(b.school))
	);
}

function compareValues(a, b) {
	if (a === b) return 0;
	return a < b ? -1 : 1;
}

function buildAddedOrdersTable(orders) {
	const headings = ['Sport', 'School', 'Gender', 'Year', 'S', 'M', 'L', 'XL', '2X', '3X'];
	const thead = buildElement('thead', {
		children: buildElement('tr', { children: headings.map(text => buildElement('th', { text })) })
	});
	const tbody = buildElement('tbody', {
		children: orders.map(order => buildElement('tr', {
			classes: 'unDoneRow',
			children: [
				buildElement('td', { title: order.fileName, text: order.series }),
				buildElement('td', { text: order.shortSchool }),
				buildElement('td', { text: order.gender.name }),
				buildElement('td', { text: order.year }),
				...(order.sizes || []).slice(0, 6).map(size => buildElement('td', { text: size }))
			]
		}))
	});

	return buildElement('table', { classes: 'addedOrdersTable', children: [thead, tbody] });
}

function buildCommentsTable(orders) {
	const headings = ['School', 'Division', 'Comment', 'Handled'];
	const thead = buildElement('thead', {
		children: buildElement('tr', { children: headings.map(text => buildElement('th', { text })) })
	});
	const tbody = buildElement('tbody', {
		children: orders.map(order => {
			const checkbox = buildElement('input', {
				classes: 'commentChckBx',
				attrs: { type: 'checkbox' },
				dataset: { orderId: order.messageOrderID }
			});
			return buildElement('tr', { children: [
				buildElement('td', { title: order.schoolOrderID, text: order.shortSchool }),
				buildElement('td', { text: order.division }),
				buildElement('td', { text: order.comment }),
				buildElement('td', { children: checkbox })
			] });
		})
	});
	const table = buildElement('table', { id: 'commentsTable', children: [thead, tbody] });

	table.addEventListener('change', async event => {
		if (!event.target.matches('input.commentChckBx')) return;

		const checkbox = event.target;
		const response = await actionFetch('changeCommentHandled', 'MessageOrder', {
			id: checkbox.dataset.orderId,
			handled: checkbox.checked
		});
		if (response?.data?.rowsAffected) {
			const body = checkbox.closest('tbody');
			checkbox.closest('tr').remove();
			if (!body.querySelector('tr')) table.remove();
		} else {
			checkbox.checked = false;
			modal.open('Something went wrong marking this comment as handled');
		}
	});

	return buildElement('div', {
		children: [buildElement('br'), buildElement('h2', { text: 'Comments' }), table]
	});
}



	// emails receives the cc email address. we need to update the submission code to accept that.
export async function getEmailOrders() {
		// load a look up
	await runtime.allActivities.load();

	let request = new ActionRequest('getEmailOrders', 'MailAccess', {});
	let response = await myFetch(request);
	if (response.success) {
		const emails = response.data;
		console.log('emails', emails);

		const orders = [];

		for (const email of emails) {
			for (const attachment of email.attachments) {
				orders.push(getOrder(attachment.content, attachment.filename));
			}
		}

		request = new ActionRequest('uploadOrders', 'SchoolOrder', { 'orders': orders });
		response = await myFetch(request);

		if (response.success) {
			const emailIDs = emails.map(email => email.id);
			request = new ActionRequest('markEmailsRead', 'MailAccess', { emailIDs });
			await myFetch(request);

			modal.open(buildOrderUploadResults(response.ordersAdded, response.preexistingOrders));
		}
	}
}