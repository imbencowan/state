import { actionFetch } from "../fetch.js";
import { runtime } from "../runtime.js";

export async function showPage(action, actionClass, data) {
   const response = await actionFetch(action, actionClass, data);
	document.getElementById("display").innerHTML = response.html;

		// unset activeMode on new page
	runtime.activeMode = null;
}