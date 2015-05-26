var Postprocessing = function(settings) {
	var self = this;
	
	var delegates = [
		debugging,
	];

	function debugging(item) {
		console.log("[+] postprocessing message");
	}
	
	this.process = function(item) {
		for(var i = 0; i < delegates.length; i++)
			delegates[i](item);
	}
	
	console.log("[+] postprocessing initialized: " + delegates.length + " process");
};

module.exports = Postprocessing;
