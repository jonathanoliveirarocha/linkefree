function copyLink() {
  const linkToCopy = document.querySelector("#linkToCopy").href;

  const input = document.createElement("input");
  input.value = linkToCopy;

  document.body.appendChild(input);
  input.select();
  document.execCommand("copy");
  document.body.removeChild(input);

  alert("Link copiado!");
}

function closeMessage() {
  const msgDiv = document.querySelector("#msg_div");
  if (msgDiv) {
    msgDiv.style.display = "none";
  }
}

function hideStatusAfterDelay() {
  const status = document.querySelector("#msg_div");

  setTimeout(() => {
    if (status) {
      status.classList.add("hidden");
    }
  }, 4000);

  setTimeout(() => {
    if (status) {
      status.style.display = "none";
      status.classList.remove("hidden");
    }
  }, 5500);
}

function checkForm() {
  const inputs = document.querySelectorAll("input");
  let emptyInputsCount = 0;

  inputs.forEach((input) => {
    if (input.value === "") {
      emptyInputsCount++;
    }
  });

  if (emptyInputsCount === 11) {
    alert("Por favor, preencha ao menos um dos campos.");
    return true;
  }

  return false;
}

const form = document.querySelector(".insert-page");
if (form) {
  form.addEventListener("submit", function (event) {
    if (checkForm()) {
      event.preventDefault();
    }
  });
}

const closeButtonMsg = document.querySelector("#close_msg_button");
if (closeButtonMsg) {
  closeButtonMsg.addEventListener("click", closeMessage);
}

hideStatusAfterDelay();
