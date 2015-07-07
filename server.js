/* global Peer */
"use strict";

var sphero = require("sphero");
try {
	var orb = sphero("/dev/rfcomm0");
} catch (err) {
	updateStatus("Sphero unavailable.");
}
var isSpheroConnected = false;
var id = null;
// Peer: Our 'Peer' object. Serves as PeerJS's entry point
var peer = null;
// CalibrationHandle: The current user with a handle on calibration or null
var calibrationHandle = null;
// Users: A dictionary of usernames to calibration and connection info
var users = {};
// Debug: Enable/Disable verbosity
var DEBUG = true;

orb.connect(function() {
	updateStatus("Connected to Sphero! Waiting on command...");
	isSpheroConnected = true;
	// TODO: Detect disconnects
});
 
function setupID() {
	// Generate a connection ID from 0-99
	var id = Math.floor(Math.random(Date.now()) * 4096);
	// Start/restart listening on that channel
	listen(id);
	// Display ID to user
	document.getElementById("id").innerHTML = "Your connection id is: " + id.toString(16).toUpperCase();
}

function listen(id) {
	peer = new Peer(id, {host: 'sharesphero.azurewebsites.net', port: 80, path: "/share-sphero-broker"});
	peer.on('connection', attachListeners);
}

function attachListeners(conn) {
	peer.connect();
	conn.on("data", function(message){message.label = conn.label;handleMessage(message);});
	users[conn.label] = {mode:"setup",connection:conn};
}

function handleMessage(message) {
	// Verbosity for debugging
	updateStatus("Recieved command: '" + message.type + "' from " + message.label);
	// Ignore any commands if we're not connected to the Sphero
	if (!isSpheroConnected && !DEBUG)
		return;
	if (!users[message.label]) {
		console.warn(message.label + " is a spoofed name! Beware hacking.");
		return;
	}
	switch(message.type) {
		case "setmode":
			// TODO: Ask host to permit calibration request
			if (message.mode == "drive" && message.label == calibrationHandle) {
				// Restore state
				calibrationHandle = null;
				orb.finishCalibration();
			}
			else if (message.mode == "calibrate" && !calibrationHandle) {
				// Switch on the Sphero calibration light and lockdown interference
				calibrationHandle = message.label;
				orb.startCalibration();
			}
			else {
				console.warn("Invalid attempt to set mode to '" + message.mode + "'");
				break;
			}
			broadcastMessage(message);
			break;
		case "text":
			if (!message.body)
				return;
			document.getElementById("messages").innerHTML += message.label + ": " + message.body + "<br>";
			broadcastMessage(message);
			break;
		case "drive":
			// TODO: Command pooling and validation
			orb.roll(message.speed, message.heading);
			broadcastMessage(message);
			break;
		case "heading":
			// Verify that this is an allowable command sequence
			if (!calibrationHandle || !message.heading || message.heading < 0 || message.heading > 255)
				break;
			// Calibration information is local to the server, so the messages are not broadcasted
			orb.setHeading(message.heading);
			users[message.label].headingBias = message.heading;
			break;
		case "color":
			try {
				orb.color(message.color);
				broadcastMessage(message);
			} catch (err) {
				console.warn("Unable to set color to '" + message.color + "'");
			};
			break;
		default:
			console.warn("Message type '" + message.type + "' not implemented.");
	}
	// Verbosity for debugging
	if (DEBUG)
		console.log("Processed command: " + JSON.stringify(message));
}

function broadcastMessage(data) {
	for (var user in users) {
		users[user].connection.send(data);
	}
}

function updateStatus(str) {
	document.getElementById("status").innerHTML = str;
}

setupID();
