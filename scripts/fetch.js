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
            // get the response
        const responseText = await response.text();
        let json;
            // convert to json or throw
        try {
            // console.log(responseText);
            json = JSON.parse(responseText);
        } catch {
            throw new Error("Invalid JSON returned from server");
        }

            // Treat any server-reported error as an exception
        if (json.success === false) throw new Error(json.eMessage || "Unknown server error");
            // Throw on HTTP-level errors
        if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);

        console.log(json);
        return json;
    } catch (error) {
        console.error("Fetch Error:", error.message);
        openModal("Fetch Error: " + error.message);
        return null;
    }
}