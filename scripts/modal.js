// pop up container with a little logic

let modal;
let modalText;
let closeBtn;

function init() {
   modal = document.getElementById("myModal");
   modalText = document.getElementById("modalText");
   closeBtn = document.querySelector(".close");

   closeBtn.addEventListener("click", closeModal);
}

function openModal(content) {
   modalText.innerHTML = "";
   if (typeof content === "string") {
      modalText.textContent = content;
   } else {
      modalText.appendChild(content);
   }

   document.addEventListener('keydown', escListener);
   document.addEventListener('click', windowListener);

   modal.style.display = "block";
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
