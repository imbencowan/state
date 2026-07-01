   // self explanatory, separate layer to avoid import issues else where
import { runtime } from './runtime.js';
import { Transfer } from './models/db-classes.js';



export function getTransferDisplayName(t) {
      // if runtime.stateEvent exists, properly name 'sub events'
   if (t.transferName === 'sub events' && runtime.stateEvent) {
      return `${runtime.stateEvent.sport.name} events`;
   } else {
      return t.transferName
   }
}

export function getTransferInvoiceName(t) {
   return "McUs add on transfers - " + getTransferDisplayName(t);
}

   // generate a pdf and open it in a new tab
export function openBlobInNewTab(doc, target = "_blank") {
   const url = getPDFURL(doc);
   window.open(url, target, "noopener");
      // clean it up
   setTimeout(() => URL.revokeObjectURL(url), 3000);
}

   // download a pdf
export function downloadPDF(doc, filename) {
   const url = getPDFURL(doc);
   const a = document.createElement("a");
   a.href = url;
   a.download = filename;

   document.body.appendChild(a);
   a.click();
   document.body.removeChild(a);

   URL.revokeObjectURL(url);
}

   // generate a blob url
export function getPDFURL(doc) {
   const pdfBlob = doc.output("blob");
   return URL.createObjectURL(pdfBlob);
}