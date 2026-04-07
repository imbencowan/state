// pop up container with a little logic

   // a constant for ease
import { giveFirstFocus } from './utilities.js';


let modal;
let modalContent;
let closeBtn;

function init() {
   modal = document.getElementById("myModal");
   modalContent = document.getElementById("modalContent");
   closeBtn = document.querySelector(".close");

   closeBtn.addEventListener("click", closeModal);
}

function openModal(content) {
   modalContent.innerHTML = "";

   if (typeof content === "string") {
      modalContent.innerHTML = content;
   } else {
      modalContent.appendChild(content);
   }

   document.addEventListener('keydown', escListener);
   document.addEventListener('click', windowListener);

   modal.style.display = "block";

      // requestAnimationFrame() to delay for DOM changes
   requestAnimationFrame(() => giveFirstFocus(modalContent));
}

function escListener(e) {
   if (e.key === 'Escape') closeModal();
}

function windowListener(e) {
   if (e.target === modal) closeModal();
}

function closeModal() {
   document.removeEventListener('keydown', escListener);
   document.removeEventListener('click', windowListener);
   modal.style.display = "none";
}

export { init, openModal, closeModal };
