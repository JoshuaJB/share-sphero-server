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
	// Ignore any commands if we're not connected to the Sphero
	if (!isSpheroConnected)
		return;
	// For now, we only communicate the color
	orb.color(data)
	document.getElementById("status").innerHTML = "Recived color command: " + data;
}

setupID();
