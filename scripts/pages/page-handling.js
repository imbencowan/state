import { ActionRequest } from "../models/other-classes.js";
import { myFetch } from "../fetch.js";

export async function showPage(action, actionClass, data) {
	// let year = currentYear;
	// if (document.getElementById("selectYear")) {
	// 	year = document.getElementById("selectYear").value;
	// }
	const request = new ActionRequest(action, actionClass, data);
	let responseJSON = await myFetch(request);
	document.getElementById("display").innerHTML = responseJSON.html;
}