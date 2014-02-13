var BASE_URL = require('../base_url');
var COMPANY_CREDITS_URL = BASE_URL + '/title/%s/companycredits?ref_=ttfc_ql_5';
var cheerio = require('cheerio');
var format = require('util').format;


/**
 * Parse company credits page of a movie
 * @param  {string} body company credits page in html
 * @return {array}     
 */
function parse_company_credits (body) {
	var $ = cheerio.load(body);
	var companies = [];

	$('#production+ .simpleList li').each(function (index, element) {
		var company = {
			name: $('a', this).text().trim(),
			extra: $(this).text().trim()
		};
		company.extra = company.extra.replace(company.name, '').trim();
		companies.push(company);
	});

	return companies;
}


module.exports = {
	url: function (imdb_id) {
		return format(COMPANY_CREDITS_URL, imdb_id);
	},
	jobs: [
		{
			key: 'company_credits',
			parse_method: parse_company_credits
		}
	]
};