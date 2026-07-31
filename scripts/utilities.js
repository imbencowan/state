/////////////////////////////////////////////////////////////////////////////////////////////
//    TRY NOT TO IMPORT TO UTILITIES


const FOCUSABLE_SELECTOR = 'input, button, select, textarea, a[href], [tabindex]:not([tabindex="-1"])';

const booleanAttrs = new Set([
   "hidden",
   "disabled",
   "checked",
   "selected",
   "multiple",
   "required",
   "readonly",
   "autofocus",
   "open",
   "novalidate"
]);




export function parseToInstancesArr(data, ClassRef) {
        // takes data, and returns an array of object of the class given by ClassRef
            // expects data to be an array of objects, or an object where each property is an object
                // we end up with the latter from associative arrays from php
   return Object.values(data || {})
            // .map makes the array from the data
      .map(item => (item instanceof ClassRef) 
                // if (item instanceof ClassRef), put the item in the .mapped array
         ? item 
                // else check if there actually is an item, and if ClassRef has a .fromJSON()
         : (item != null && typeof ClassRef.fromJSON === 'function') 
                    // if that was true, try to make a ClassRef object
            ? ClassRef.fromJSON(item) 
                    // else map null
            : null)
                // filter out nonconforming elements
      .filter(Boolean);
}

export function parseToInstance(value, ClassRef) {
        // returns an instance of ClassRef from value if possible
   return (value instanceof ClassRef) ? 
      value
      : (value != null && typeof ClassRef.fromJSON === 'function')
         ? ClassRef.fromJSON(value)
         : null;
}

export function safeParseDate(input) {
   if (!input || typeof input !== 'string') return null;

   const date = new Date(input.replace(' ', 'T'));
   return isNaN(date.getTime()) ? null : date;
}



export function buildElement(tag, { text, html, classes, id, title, attrs, dataset, styles, on, children } = {}) {
   const el = document.createElement(tag);

   if (text != null) el.textContent = text;
   if (html != null) el.innerHTML = html;
   if (id) el.id = id;
   if (title) el.title = title;

   if (classes) {
      if (Array.isArray(classes)) {
         el.classList.add(...classes);
      } else {
         el.className = classes;
      }
   }

   if (attrs) {
      for (const [k, v] of Object.entries(attrs)) {
         if (booleanAttrs.has(k)) {
            if (v) el.setAttribute(k, "");
         } else {
            el.setAttribute(k, v);
         }
      }
   }

   if (dataset) {
      for (const [k, v] of Object.entries(dataset)) {
         el.dataset[k] = v;
      }
   }

   if (styles) {
      for (const [k, v] of Object.entries(styles)) {
         el.style[k] = v;
      }
   }

   if (on) {
      for (const [event, handler] of Object.entries(on)) {
         el.addEventListener(event, handler);
      }
   }

   if (children != null) {
      const childList = Array.isArray(children) ? children : [children];

      for (const child of childList) {
         el.appendChild(
            typeof child === "string"
               ? document.createTextNode(child)
               : child
         );
      }
   }

   return el;
}

export function buildTD(text) {
   return buildElement("td", { text: text });
}

export function buildDollarTD(value) {
   return buildTD(formatCurrency(value));
}




    // assumes objs is an array of objects that all have a unique id property
export function mapObjsBy(objs, key = 'id') {
	const result = {};
		// {} in case objs is null, etc
	for (const obj of Object.values(objs || {})) {
		result[obj[key]] = obj;
	}
	return result;
}


export function distributeElementsToRows(containerSelector, minItemWidth = 100) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const itemCount = container.children.length;
    if (itemCount === 0) return;

    // Get container width in pixels
    const containerWidth = container.clientWidth;

    // Calculate max columns that fit by minItemWidth
    let columnsByWidth = Math.floor(containerWidth / minItemWidth);
    columnsByWidth = Math.min(columnsByWidth, itemCount); // can't have more columns than items
    columnsByWidth = Math.max(columnsByWidth, 1);         // at least 1 column

    // Now find the divisor of itemCount closest to columnsByWidth for balanced rows
    let bestColumns = 1;
    let bestDiff = Infinity;

    for (let c = 1; c <= columnsByWidth; c++) {
        let diff = Math.abs(itemCount / c - Math.round(itemCount / c));
        if (diff < bestDiff) {
        bestDiff = diff;
        bestColumns = c;
        }
    }

    container.style.display = 'grid';
    container.style.gridTemplateColumns = `repeat(${bestColumns}, 1fr)`;
    container.style.gap = '10px';
}



   // compares arrays' elements, disregarding order
      // returns true/false
export function arraysEqualIgnoreOrder(a, b) {
   if (!Array.isArray(a) || !Array.isArray(b)) return false;
   if (a.length !== b.length) return false;

      // reorder the arrays identically
   const sortedA = [...a].sort();
   const sortedB = [...b].sort();

      // checks if every val of sortedA === sortedB at the same idx, using the built in Array.every()
   return sortedA.every((val, idx) => val === sortedB[idx]);
}


export function appndSbmtCnclBtns(prnt, actn) {
   const btnDiv = document.createElement('div');

	const submitButton = document.createElement('button');
	submitButton.type = 'button';
	submitButton.textContent = 'Submit';
   submitButton.dataset.action = 'submit' + actn;
	btnDiv.appendChild(submitButton);
	
	const cancelButton = document.createElement('button');
	cancelButton.type = 'button';
	cancelButton.textContent = 'X';
   cancelButton.dataset.action = 'cancel' + actn;
	btnDiv.appendChild(cancelButton);

   	// add event listeners for ESC and ENTER
   if (prnt) {
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

      prnt.addEventListener('keydown', keyHandler);

      // define a cleanup helper
      function cleanup() {
         prnt.removeEventListener('keydown', keyHandler);
      }

      prnt.appendChild(btnDiv);
   }
}


   // finds the first focusable element in a container. ignores disabled and some hidden elements
export function getFirstFocusable(container = document) {
   return [...container.querySelectorAll(FOCUSABLE_SELECTOR)]
      .find(el => !el.disabled && el.offsetParent !== null);
}

   // gives focus to the first focusable element in a container. ignores disabled and some hidden elements
export function giveFirstFocus(container = document) {
   const el = getFirstFocusable(container);
   el?.focus();
   el?.select?.();
   return el;
}


   // standards a string as a *slug* fit for urls
      // lowercases. // trims.  // replaces ' ' with '-', so Boys  Basketball => boys-basketball
export function slugify(str) {
   return str.toLowerCase().trim().replace(/\s+/g, '-');
}

   // standardize printing $ amounts
export function formatCurrency(value) {
	return `${(value ?? 0).toFixed(2)}`;
}

   // takes a Date object, returns a String: yyyy-mm-dd
export function formatDateInput(date) {
   const y = date.getFullYear();
   const m = String(date.getMonth() + 1).padStart(2, "0");
   const d = String(date.getDate()).padStart(2, "0");
   return `${y}-${m}-${d}`;
}


export function getPropertyValues(array, property = "id") {
   if (!Array.isArray(array)) {
      throw new Error("Expected an array");
   }

   return array.map(item => item[property]);
}

   // returns a string representing a start and end date
export function getDateRangeString(d1, d2) {
   const start = d1.toLocaleDateString("en-US", { month: "long", day: "numeric" });

      // one-day event
   if (sameCalendarDay(d1, d2)) return start;

   let end;
   let conjunction;

         // same month
   if ((d1.getFullYear() === d2.getFullYear()) && (d1.getMonth() === d2.getMonth())) {
      end = String(d2.getDate());
      conjunction = "-";
         // different months
   } else {
      end = d2.toLocaleDateString("en-US", {
         month: "long",
         day: "numeric"
      });
      conjunction = " - ";
   }

      // the regex replaces the last normal space before the final 'word' with a non-breaking space.
         // prevents October 31 - November 1 hanging the '1' on to a new line by it's self
   return (start + conjunction + end).replace(/ (\S+)$/, "\u00A0$1");
}

function sameCalendarDay(d1, d2) {
   return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
   );
}

   // turns a string date ('yyyy-mm-dd') in to a LOCAL TIME Date object
export function parseInputDate(value) {
   const [year, month, day] = value.split("-").map(Number);
   return new Date(year, month - 1, day);
}





// function hasItems(arr) {
//    return (Array.isArray(arr) && arr.length > 0);
// }
