var BASE_URL = require('../base_url');
var AKA_TITLES_URL = BASE_URL + '/title/%s/releaseinfo?ref_=tt_dt_dt#akas';
var cheerio = require('cheerio');
var format = require('util').format;


function parse_aka_titles (body) {
	var $ = cheerio.load(body);
	var aka_titles = [];

	$('#akas tr').each(function (index, element) {
		var $children = $(this).children();
		aka_titles.push({
			country: $children.first().text().trim(),
			title: $children.last().text().trim()
		});
	});

	return aka_titles;
}

function parse_release_dates (body) {
	var $ = cheerio.load(body);
	var release_dates = [];

	$('#release_dates tr').each(function (index, element) {
		var $children = $(this).children();
		release_dates.push({
			country: $children.eq(0).text().trim(),
			date: $children.eq(1).text().trim(),
			festival: $children.eq(2).text().trim()
		});
	});

	return release_dates;
}


module.exports = {
	url: function (imdb_id) {
		return format(AKA_TITLES_URL, imdb_id);
	},
	jobs: [
		{
			key: 'aka_titles',
			parse_method: parse_aka_titles
		},
		{
			key: 'release_dates',
			parse_method: parse_release_dates
		}
	]
};