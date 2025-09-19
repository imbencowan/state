 //////////////////////////////////////////////////
 // all calls to the server, and the responses sent from it, are passed through this function
 
 import { openModal } from './modal.js';
 
    // all fetch requests go to controller.php
export async function myFetch(request) {
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
            // console.log(responseText);
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