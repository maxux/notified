var net = require('net');

var Preprocessing = function(settings) {
	var self = this;
	
	var slaves = settings.slaves;
	
	var delegates = [
		debugging,
		forward,
	];

	function debugging(item) {
		console.log("[+] preprocessing message:");
		console.log(item);
	}
	
	function forwarder(node, payload) {
		var options = {
			host: node,
			port: 5050
		};
		
		var client = net.connect(options, function() {
			client.write(payload);
		});
	}
	
	function forward(item) {
		console.log("[+] forwarding message to slaves");
		
		for(var i = 0; i < slaves.length; i++)
			forwarder(slaves[i], JSON.stringify(item));
	}
	
	this.process = function(item) {
		for(var i = 0; i < delegates.length; i++)
			delegates[i](item);
	}
	
	console.log("[+] preprocessing initialized: " + delegates.length + " process");
};

module.exports = Preprocessing;
