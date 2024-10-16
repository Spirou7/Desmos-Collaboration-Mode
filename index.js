/*
First establish the express server properly
*/
const express = require('express');//Set up the express module
var expressWs = require('express-ws');

const app = express();
const wsInstance = expressWs(app);

const router = express.Router();
const cors = require('cors');
const path = require('path');
const bodyParser = require("body-parser");
const Transform = require("stream").Transform;
const fs = require("fs");

app.use(cors());
app.use(bodyParser.json());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));

app.get('/', (req, res) => {
  res.send('Hello, you have reached the Express server!');
});

const clients = new Map(); // Store connected clients and their IDs


app.ws('/echo', (ws, req) => {
  console.log("a connection was made");

  
  ws.on("message", function message(message) {
    displayMessageInfo(message);
    var data = JSON.parse(message);

    if (data.session_id != null) {
      console.log("client registered under session " + data.session_id);
      clients.set(ws, data.session_id); // Associate ws with session_id using a Map
    }
    else {
      // Broadcast the received message to all connected clients
      wsInstance.getWss().clients.forEach((client) => {
        console.log("client session ID:" + clients[client]);
        console.log("current session ID:" + clients[ws]);
        if (client !== ws && clients.get(client) == clients.get(ws)) {
          console.log("client from session has been updated!");
          client.send(message);
        }
      });
    }
  })

  ws.on('close', function() {
    //...
    delete clients[ws]; // Remove the client from the clients object
  })
})

function displayMessageInfo(message) {
  console.log("message received!");
}
// set the "public" folder to be the default domain
app.use(express.static("public"));
let server = app.listen(3000, function() {
  console.log("to end press Ctrl + C");
  //console.log('Server listening:', `http://${server.address().address}:${server.address().port}`);
});

//console.log('Server listening:', `http://${server.address().address}:${server.address().port}`);
