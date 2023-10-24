function copyLink() {
  let input = document.createElement("input");
  input.value = document.querySelector("#linkToCopy").href;
  document.body.appendChild(input);
  input.select();
  document.execCommand("copy");
  document.body.removeChild(input);
  alert("Link copiado!");
}

document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".insert-page");

  form.addEventListener("submit", function (event) {
    if (checkForm()) {
      event.preventDefault();
    }
  });

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
});

document.querySelector("#close_msg_button").addEventListener("click", () => {
  document.querySelector("#msg_div").style.display = "none";
});

window.onload = function () {
  var status = document.querySelector("#msg_div");
  setTimeout(() => {
    status.classList.add("hidden");
  }, 4000);

  setTimeout(() => {
    status.style.display = "none";
    status.classList.remove("hidden");
  }, 5500);
};
