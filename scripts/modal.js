// modal.js

let modal;
let modalText;
let closeBtn;

function init() {
   modal = document.getElementById("myModal");
   modalText = document.getElementById("modalText");
   closeBtn = document.querySelector(".close");

   closeBtn.addEventListener("click", closeModal);
   window.addEventListener("click", (event) => {
      if (event.target === modal) {
         closeModal();
      }
   });
}

function openModal(content) {
   modalText.innerHTML = "";
   if (typeof content === "string") {
      modalText.textContent = content;
   } else {
      modalText.appendChild(content);
   }
   modal.style.display = "block";
}

function closeModal() {
   modal.style.display = "none";
}

export { init, openModal, closeModal };
