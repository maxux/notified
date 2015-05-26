var net = require('net');

var Preprocessing = require('./preprocessing.js');
var Processing = require('./processing.js');
var Postprocessing = require('./postprocessing.js');

var settings = require('./settings.json');

//
// initializing workers
//
var preprocessing = new Preprocessing(settings);
var processing = new Processing(settings);
var postprocessing = new Postprocessing(settings);

function notification(item) {
	//
	// preprocessing: parse and modify if needed the request
	//
	preprocessing.process(item);
	
	//
	// processing: treat the message
	//
	processing.process(item);
	
	//
	// postprocessing: maybe useless
	//
	postprocessing.process(item);
}

function message(data) {
	try {
		var item = JSON.parse(data);
		notification(item);
		
	} catch (e) { console.log(e); }
}

//
// listening for clients
//
net.createServer(function (socket) {
	socket.on('data', function(data) {
		message(data);
		
		// TODO: response ?
		
		// single message connection, closing it
		socket.destroy();
	});

}).listen(5050);

console.log("[+] waiting notifications");
