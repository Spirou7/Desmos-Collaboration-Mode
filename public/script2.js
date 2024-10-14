var elt = document.getElementById('calculator');
var calculator = Desmos.GraphingCalculator(elt);

var socketStatus = document.getElementById("status");

addEventListener("keyup", (event) => {
  sendDesmosFormatting();
});

addEventListener("mouseup", (event) => {
  console.log("mouse up");
  setTimeout(function() {
    sendDesmosFormatting();
  }, 500);
})

elt.addEventListener('touchstart', function(event) {
  // do something when the screen is tapped
  sendDesmosFormatting();
}, false);

const socket = new WebSocket('wss://desmosliveserver.spirou7.repl.co/echo'); 

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
  var new_state = JSON.parse(state_string);
  var old_state = calculator.getState();
  
  var selected_id = calculator.selectedExpressionId;
  new_state.graph = old_state.graph;
  calculator.setState(new_state);
  
  calculator.focusFirstExpression();
  /*
  while(calculator.selectedExpressionId != selected_id && calculator.selectedExpressionId != null){
    console.log("selected expression ID " + calculator.selectedExpressionId);
    document.activeElement.dispatchEvent(new KeyboardEvent("keypress", { 
      key: "Tab" 
    }));
  }
  */
}