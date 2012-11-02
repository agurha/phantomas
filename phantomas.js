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

try {
	if (runs === false) {
		// run phantomas in a single run mode
		new phantomas(params).run(function() {
			phantom.exit(0);
		});
	}
	else {
		var metrics = [],
		run = function() {
			// force silent mode
			params.silent = true;
			var instance = new phantomas(params);

			instance.on('results', function(results) {
				console.log(JSON.stringify(results.metrics));

				metrics.push(results.metrics);
			});

			instance.run(function() {
				if (--runs > 0) {
					setTimeout(run, 0);
				}
				else {
					console.log(JSON.stringify(metrics, null, '\t'));
					phantom.exit(0);
				}
			});
		};

		run();
	}
}
catch(ex) {
	console.log('phantomas v' + phantomas.version + ' failed with an error:');
	console.log(ex);

	phantom.exit(1);
}

