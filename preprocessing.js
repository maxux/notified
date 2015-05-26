var Preprocessing = function() {
	var self = this;
	
	var slaves = [
		'10.242.1.5'
	];
	
	var delegates = [
		debugging,
		forward,
	];

	function debugging(item) {
		console.log("[+] preprocessing message:");
		console.log(item);
	}
	
	function forward(item) {
		console.log("[+] forwarding message to slaves");
		
		for(var i = 0; i < slaves.length; i++) {
			// 
		}
	}
	
	this.process = function(item) {
		for(var i = 0; i < delegates.length; i++)
			delegates[i](item);
	}
	
	console.log("[+] preprocessing initialized: " + delegates.length + " process");
};

module.exports = Preprocessing;
