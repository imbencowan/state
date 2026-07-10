import { buildElement } from "../utilities.js";

    // builds a semi specific type of button. this condenses some styling used repeatedly
export function buildActionButton({ action, title = "", icon = null, text = "", classes = [], datasetExtra = {} }) {
    if (typeof classes === "string") classes = [classes];
    
    const children = [];
    if (icon) children.push(buildIcon(icon));
    if (text) children.push(text);

    return buildElement("button", {
        classes: ["topLevelButton", "clickable", ...classes],
        dataset: { action: action, ...datasetExtra },
        title,
        children
    });
}

    // builds spans that contain icons. helper function to decrease redundant code
export function buildIcon(type) {
   return buildElement("span", { classes: ["material-icons"], text: type });
}

    // takes a container, clears it, inserts a submit and cancel button
        // the listener container fires a submit or cancel click when 'ENTER' or 'ESC' are pressed
export function makeSubmitCancelButtons({ btnCntnr, lstnrCntnr, type, action, datasetExtra = {} }) {
    console.log({ btnCntnr, lstnrCntnr, type, action, datasetExtra })
        // first, clear the destination
    btnCntnr.innerHTML = '';

        // make the buttons // secondary classes guide listeners handling
    const submitButton = buildElement('button', { text: 'Submit', type: 'button',
        classes: ['addOnButton', `${type}-action`, `submit${action}`], 
        dataset: { action: makeTypeActionLabel('submit', action), ...datasetExtra }
    });
    const cancelButton = buildElement('button', { text: 'X', type: 'button',
        classes: ['addOnButton', `${type}-action`, `cancel${action}`], 
        dataset: { action: makeTypeActionLabel('cancel', action), ...datasetExtra }
    });
        // append them
    btnCntnr.append(submitButton, cancelButton);

        // add event listeners for ESC and ENTER
    if (lstnrCntnr) {
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

        lstnrCntnr.addEventListener('keydown', keyHandler);

            // define a cleanup helper
        function cleanup() {
            lstnrCntnr.removeEventListener('keydown', keyHandler);
        }
    }
}

export function makeTypeActionLabel(type, action) {
    const capAction = action[0].toUpperCase() + action.slice(1);
    return type + capAction;
}