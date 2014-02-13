var request = require('request');
var async = require('async');
var credits = require('./lib/parsers/credits');
var keywords = require('./lib/parsers/keywords');
var aka_titles = require('./lib/parsers/aka_titles');
var company_credits = require('./lib/parsers/company_credits');
var business = require('./lib/parsers/business');
var actor_bio = require('./lib/parsers/actor_bio');


function searchMovie (imdb_id, cb) {
	var endpoints = [credits, keywords, aka_titles, company_credits,
					business];

	var result = {};
	async.eachLimit(endpoints, 2,
		function (endpoint, callback){
			request(endpoint.url(imdb_id), function (err, response, body) {
				endpoint.jobs.forEach(function (job) {
					result[job.key] = job.parse_method.call(null, body);
				});
				callback();
			});
		}, function (err) {
			if (err) {
				cb(null, {'error':err.message});
				return;
			}
			cb(null, [result]);
		}
	);
}

function searchActor (actor_id, callback) {
    var endpoint = actor_bio;

    var result = {};
    request(endpoint.url(actor_id), function (err, response, body) {
        endpoint.jobs.forEach(function (job) {
            result[job.key] = job.parse_method.call(null, body);
        });
        callback(null, [result]);
    });
}


module.exports = {
	searchMovie: searchMovie,
	searchActor: searchActor
};