var elt = document.getElementById('calculator');
var calculator = Desmos.GraphingCalculator(elt);


var send_button = document.getElementById("connect_btn");
var socketStatus = document.getElementById("status");

send_button.addEventListener("click", sendDesmosFormatting);

addEventListener("keyup", (event) => {
  sendDesmosFormatting();
});

const socket = new WebSocket('wss://8080-cs-bcde6355-336f-4181-8031-5d0f8d1291ad.cs-us-west1-ijlt.cloudshell.dev/echo'); 

socket.onopen = function(event) {
    socketStatus.innerHTML = 'Connected to: ' + event.currentTarget.url;
    socketStatus.className = 'open';
}

socket.addEventListener('open', (event) => {
  console.log('Connected to the server.');
});

socket.onmessage = function(event){
  var message = event.data;
  applyDesmosFormatting(message);
}

function sendDesmosFormatting(){
  // Save the current state of a calculator instance
  var state = calculator.getState();
  socket.send(JSON.stringify(state));
}

function applyDesmosFormatting(state_string){
  var state = JSON.parse(state_string);
  var focusedElement = document.activeElement;
  console.log(focusedElement);
  
  calculator.setState(state);
  focusedElement.click();
}