/**
 * PhantomJS-based web performance metrics collector
 *
 * Usage:
 *  phantomjs phantomas.js
 *    --url=<page to check>
 *    [--runs=<number of repetitive runs on given URL>]
 *    [--verbose]
 *    [--silent]
 *
 * @version 0.3
 */

// parse script arguments
var args = require('system').args,
	params = require('./lib/args').parse(args),
	phantomas = require('./core/phantomas').phantomas;

// support --runs parameter
var runs = parseInt(params.runs) || false;

if (runs === false) {
	// run phantomas in a single run mode
	new phantomas(params).run();
}
else {
	var metrics = [],
	run = function() {
		// force silent mode
		// params.silent = true;
		params.quitonload = true;
		var instance = new phantomas(params);

		instance.on('results', function(results) {
			var res = JSON.stringify(results.metrics);
			console.log(res);
			metrics.push(res);
		});

		instance.run(function() {
			if (--runs > 0) {
				instance.page.close();
				delete instance;
				run();
			}
			else {
				console.log(JSON.stringify(metrics, null, '\t'));
				phantom.exit(0);
			}
		});
	};

	run();
}

