const button = document.getElementById("deployButton");
const message = document.getElementById("message");

button.addEventListener("click", () => {
  message.textContent = "CloudPipe deployment test is working!";
});