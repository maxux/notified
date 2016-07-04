var net = require('net');

var Preprocessing = function(settings) {
	var self = this;
	
	var slaves = settings.slaves;
	
	var delegates = [
		debugging,
		forward,
		acpi,
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
		
		var client = net.createConnection(options, function() {
			client.write(payload);
			
		}).on('error', function() {
			console.log("[-] cannot connect: " + node);
		});
	}
	
	function forward(item) {
		console.log("[+] forwarding message to slaves");
		
		for(var i = 0; i < slaves.length; i++)
			forwarder(slaves[i], JSON.stringify(item));
	}
	
	function acpi(item) {
		if(item.source.lastIndexOf("ACPI", 0) == -1)
			return;
					
		item.title = item.source;

		var translate = {
			"button/mute MUTE 00000080 00000000 K": "Button: mute",
			"button/volumeup VOLUP 00000080 00000000 K": "Button: volume up",
			"button/volumedown VOLDN 00000080 00000000 K": "Button: volume down",
			"button/lid LID open": "Monitor: opened",
			"button/lid LID close": "Monitor: closed",
			"jack/headphone HEADPHONE unplug": "Sound: jack unplugged",
			"jack/headphone HEADPHONE plug": "Sound: jack plugged",
			"battery PNP0C0A:00 00000080 00000001": "Battery: status change"
		}
		
		if(translate[item.message])
			item.message = translate[item.message];
	}
	
	this.process = function(item) {
		for(var i = 0; i < delegates.length; i++)
			delegates[i](item);
	}
	
	console.log("[+] preprocessing initialized: " + delegates.length + " process");
};

module.exports = Preprocessing;
