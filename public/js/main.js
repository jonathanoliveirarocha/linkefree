function copyLink() {
  let input = document.createElement("input");
  input.value = document.querySelector("#linkToCopy").href;
  document.body.appendChild(input);
  input.select();
  document.execCommand("copy");
  document.body.removeChild(input);
  alert("Link copiado!");
}
