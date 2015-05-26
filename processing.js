var sqlite3 = require('sqlite3').verbose();
var notifier = require('node-notifier');
var request = require('request');

var Processing = function(settings) {
	var self = this;
	var db   = new sqlite3.Database('notifications.sqlite3');
	
	var delegates = [
		debugging,
		database,
		daemon,
		mobile,
	];
	
	function database(item) {
		console.log("[+] saving to database");
		
		var query = "INSERT INTO history " + 
		            "(received, source, title, message, level, tag) " +
		            "VALUES (?, ?, ?, ?, ?, ?) ";
		
		var stmt = db.prepare(query);
		
		stmt.run(
			parseInt(new Date().getTime() / 1000),
			item.source,
			item.title,
			item.message,
			item.level,
			(item.tag) ? item.tag : null
		);
	}
	
	function daemon(item) {
		notifier.notify({
			title: item.source,
			message: item.message,
		});
	}
	
	function mobile(item) {
		if(!item.tag || item.tag != "mobile")
			return;
		
		console.log("[+] sending push notification");
		
		var options = {
			method: 'POST',
			url: 'https://api.pushbullet.com/v2/pushes',
			headers: { 'Authorization': 'Bearer ' + settings.pushbullet.key },
			json: true,
			body: {
				type: "note",
				title: item.title,
				body: item.message,
				device_iden: settings.pushbullet.device
			},
		};
		
		request(
			options,
			function (error, response, body) {
				if (error || response.statusCode != 200) {
					console.log(error);
					console.log(body);
				}
			}
		);
	}

	function debugging(item) {
		console.log("[+] processing message:");
		console.log(item);
	}
	
	this.process = function(item) {
		for(var i = 0; i < delegates.length; i++)
			delegates[i](item);
	}
	
	console.log("[+] processing initialized: " + delegates.length + " process");
};

module.exports = Processing;