 //////////////////////////////////////////////////
 // all calls to the server, and the responses sent from it, are passed through this function
 
 import { openModal } from './modal.js';
 
    // all fetch requests go to controller.php
export async function myFetch(request) {
    try {
        const response = await fetch('controller.php', {
            method: "POST", 
            headers: {'Content-Type': 'application/json'}, 
            body: JSON.stringify(request)
        });
            // get the response data
        const data = await response.json().catch(() => null);
        // let json;
        //     // convert to json or throw
        // try {
        //     // console.log(responseText);
        //     json = JSON.parse(responseText);
        // } catch {
        //     throw new Error("Invalid JSON returned from server");
        // }

        //     // Treat any server-reported error as an exception
        // if (json.success === false) throw new Error(json.eMessage || "Unknown server error");
            // Throw on HTTP-level errors
        // if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            
            
            // Throw on HTTP-level errors
        if (!response.ok) throw new Error(data?.error || data?.message || response.statusText);
            // back end error
        if (data?.success === false) throw new Error(data.message || "Unknown server error");
       

        console.log(data);
        return data;
    } catch (error) {
        console.error("Fetch Error:", error.message);
        openModal("Fetch Error: " + error.message);
        return null;
    }
}