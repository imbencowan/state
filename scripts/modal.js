// pop up containers with a little logic

   // a constant for ease
import { giveFirstFocus } from "./utilities.js";

function createModal(id) {
   const modal = document.getElementById(id);
   const modalWindow = modal.querySelector(".modal-window");
   const modalContent = modal.querySelector(".modal-content");
   const closeBtn = modal.querySelector(".close");

   closeBtn.addEventListener("click", close);

   function open(content, size = "") {
      modalBox.classList.remove("wide", "full");
      if (size) modalBox.classList.add(size);

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

   function escListener(e) {
      if (e.key === "Escape") close();
   }

   function windowListener(e) {
      if (e.target === modal) close();
   }

   return {
      open,
      close,
      get isOpen() {
         return modal.style.display === "block";
      }
   };
}


export const modal = createModal("modal");
export const childModal = createModal("childModal");




// import { giveFirstFocus } from './utilities.js';


// let modal;
// let modalBox;
// let modalContent;
// let closeBtn;

// function init() {
//    modal = document.getElementById("myModal");
//    modalBox = document.querySelector(".modal-content");
//    modalContent = document.getElementById("modalContent");
//    closeBtn = document.querySelector(".close");

//    closeBtn.addEventListener("click", closeModal);
// }

// function openModal(content, size = "") {
//    modalBox.classList.remove("wide", "full");
//    if (size) modalBox.classList.add(size);   
   
//    modalContent.innerHTML = "";

//    if (typeof content === "string") {
//       modalContent.innerHTML = content;
//    } else {
//       modalContent.appendChild(content);
//    }

//    document.addEventListener('keydown', escListener);
//    document.addEventListener('click', windowListener);

//    modal.style.display = "block";

//       // requestAnimationFrame() to delay for DOM changes
//    requestAnimationFrame(() => giveFirstFocus(modalContent));
// }

// function escListener(e) {
//    if (e.key === 'Escape') closeModal();
// }

// function windowListener(e) {
//    if (e.target === modal) closeModal();
// }

// function closeModal() {
//    document.removeEventListener('keydown', escListener);
//    document.removeEventListener('click', windowListener);
//    modal.style.display = "none";
//       // clear the modal
//    modalContent.replaceChildren();
// }

// export { init, openModal, closeModal };
