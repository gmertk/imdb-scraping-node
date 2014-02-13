var BASE_URL = require('../base_url');
var KEYWORDS_URL = BASE_URL + '/title/%s/keywords?ref_=tt_stry_kw';
var cheerio = require('cheerio');
var format = require('util').format;


/**
 * Parse keywords from keywords page of a movie
 * @param  {string} body keywords html page
 * @return {array}      keywords
 */
function parse_keywords (body) {
	var $ = cheerio.load(body);
	var keywords = [];
	var anchors = $('#keywords_content a');
	
	anchors.each(function (index, element) {
		var path = $(this).attr('href');
		keywords.push({
			name: $(this).text(),
			href: BASE_URL + path,
			id: path.split(/\?|\//)[2]
		});
	});

	return keywords;
}


module.exports = {
	url: function (imdb_id) {
		return format(KEYWORDS_URL, imdb_id);
	},
	jobs: [
		{
			key: 'keywords',
			parse_method: parse_keywords
		}
	]
};