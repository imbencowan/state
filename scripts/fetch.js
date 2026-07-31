 //////////////////////////////////////////////////
 // all calls to the server, and the responses sent from it, are passed through this function
 
 import { modal, childModal } from './modal.js';
 import { ActionRequest } from './models/other-classes.js';
 
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
            
            
            // Throw on HTTP-level errors
        if (!response.ok) throw new Error(data?.error || data?.message || response.statusText);
            // back end error
        if (data?.success === false) throw new Error(data.message || "Unknown server error");
       

        console.log(request, data);
        return data;
    } catch (error) {
        console.error("Fetch Error:", error.message);
        modal.open("Fetch Error: " + error.message);
        return null;
    }
}


    // (php method, (of) php class, data sent along).   // utilize myFetch()
        // data should be an array where each element is one argument passed to func
export async function actionFetch(func, ssClass, data) {
    return myFetch(new ActionRequest(func, ssClass, data));
}