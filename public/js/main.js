function copyLink() {
  let input = document.createElement("input");
  input.value = document.querySelector("#linkToCopy").href;
  document.body.appendChild(input);
  input.select();
  document.execCommand("copy");
  document.body.removeChild(input);
  alert("Link copiado!");
}

let closeButtonMsg = document.querySelector("#close_msg_button");
if (closeButtonMsg) {
  closeButtonMsg.addEventListener("click", () => {
    document.querySelector("#msg_div").style.display = "none";
  });
}

let status = document.querySelector("#msg_div");
setTimeout(() => {
  status.classList.add("hidden");
}, 4000);

setTimeout(() => {
  status.style.display = "none";
  status.classList.remove("hidden");
}, 5500);

function checkForm() {
  let inputs = document.querySelectorAll("input");
  let err = true;
  let c = 0;
  inputs.forEach((e) => {
    e.value === "" ? c++ : null;
  });
  c == 11
    ? alert("Por favor, preencha ao menos um dos campos.")
    : (err = false);
  return err;
}

const form = document.querySelector(".insert-page");
if (form) {
  form.addEventListener("submit", function (event) {
    if (checkForm()) {
      event.preventDefault();
    }
  });
}
