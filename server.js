"use strict";

var sphero = require("sphero");
var orb = sphero("/dev/rfcomm0");
var isSpheroConnected = false;
var id = null;
var peer = null;

orb.connect(function() {
	document.getElementById("status").innerHTML = "Connected to Sphero! Waiting on command...";
	isSpheroConnected = true;
  // TODO: Detect disconnects
});

function setupID() {
	// Generate a connection ID from 0-99
	var id = Math.floor(Math.random(Date.now()) * 100);
	// Start/restart listening on that channel
	listen(id);
	// Display ID to user
	document.getElementById("id").innerHTML = "Your connection id is: " + id;
}

function listen(id) {
	peer = new Peer(id, {host: 'sharesphero.azurewebsites.net', port: 80, path: "/share-sphero-broker"});
	peer.on('connection', attachListeners);
}

function attachListeners(conn) {
	conn.on("data", handleMessage);
}

function handleMessage(data) {
	// Verbosity for debugging
	document.getElementById("status").innerHTML = "Recieved command: " + data.type;
	// Ignore any commands if we're not connected to the Sphero
	if (!isSpheroConnected)
		return;
	var message = data;//JSON.parse(data);
	switch(message.type) {
		case "setmode":
			// TODO: Per-user state handling
			console.warn("Message type 'setmode' not implemented.");
			break;
		case "text":
			document.getElementById("message").innerHTML = message.from + ": " + message.body;
			break;
		case "drive":
			// TODO: Command pooling and validation
			orb.roll(message.speed, message.heading);
			break;
		case "heading":
			// TODO
			console.warn("Message type 'setmode' not implemented.");
			break;
		case "color":
			// TODO: Validation
			orb.color(message.color);
			break;
		default:
			console.warn("Message type '" + message.type + "' not implemented.");
	}
	// Verbosity for debugging
	document.getElementById("status").innerHTML = "Processed command: " + data.type;
}

setupID();
