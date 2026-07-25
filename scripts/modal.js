// pop up containers with a little logic

   // a constant for ease
import { giveFirstFocus } from "./utilities.js";


export const modal = createModal("modal");
export const childModal = createModal("childModal", modal);


function createModal(id, parent = null) {
   const modal = document.getElementById(id);
   const modalWindow = modal.querySelector(".modal-window");
   const modalContent = modal.querySelector(".modal-content");

   const closeBtn = modal.querySelector(".close");

      // a way to pause the escape button listener for a parent modal
   let escPaused = false;
   function pauseEsc() {
      escPaused = true;
   }
   function resumeEsc() {
      escPaused = false;
   }

      // the base open and close methods for modals
   function open(content, size = "") {
      modalWindow.classList.remove("wide", "full");
      if (size) modalWindow.classList.add(size);

      modalContent.replaceChildren();

      if (typeof content === "string") {
         modalContent.innerHTML = content;
      } else {
         modalContent.appendChild(content);
      }
      
      document.addEventListener("keydown", escListener);
      document.addEventListener("click", windowListener);

      modal.style.display = "block";

      requestAnimationFrame(() => giveFirstFocus(modalContent));
   }

   function close() {
      document.removeEventListener("keydown", escListener);
      document.removeEventListener("click", windowListener);

      modal.style.display = "none";
      modalContent.replaceChildren();
   }

      // define the methods to return
   let api = {
      open,
      close
   };

      // if this is a child modal, over ride open/close to include pauseEsc/resumeEsc
   if (parent) {
      api = {
         open(...args) {
            parent.pauseEsc();
            open(...args);
         },
         close(...args) {
            close(...args);
            parent.resumeEsc();
         }
      };
   } else {
      api.pauseEsc = pauseEsc;
      api.resumeEsc = resumeEsc;
   }

      // set listeners to close the modal
   function escListener(e) {
      if (!escPaused && e.key === "Escape") api.close();
   }
   function windowListener(e) {
      if (e.target === modal) api.close();
   }
   closeBtn.addEventListener("click", api.close);

   return api;
}