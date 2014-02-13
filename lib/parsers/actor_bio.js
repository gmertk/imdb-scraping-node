var BASE_URL = require('../base_url');
var ACTOR_BIO_URL = BASE_URL + '/name/%s/bio?ref_=nm_ov_bio_sm';
var cheerio = require('cheerio');
var format = require('util').format;


function parse_actor_name (body) {
	var $ = cheerio.load(body);

	return $('.parent a').text();
}

function parse_actor_image (body) {
	var $ = cheerio.load(body);
	
	var imgUrl = $('.poster').attr('src');
	return _parse_img_url(imgUrl);
}

function parse_actor_overview(body) {
	var $ = cheerio.load(body);
	
	var overview = {};
	$('#overviewTable tr').each(function (index, element) {
		var cells = $('td', this);
		var label = cells.eq(0).text().trim();
		label = label.toLowerCase().split(" ").join("_");

		var data = cells.eq(1).text().trim();//.replace('/n', ' ');
		overview[label] = data;
	});

    overview.name = $('.parent a').text();
	
	return overview;
}

function parse_actor_bio(body) {
	var $ = cheerio.load(body);

	var bios = [];
	var bio_divs = $('a[name="mini_bio"]').next().nextUntil('h4').filter('div.soda');

	$(bio_divs).each(function (index, element) {
		bios.push($(this).text().trim());
	});
	
	return bios;
}

function parse_actor_trivia(body) {
	var $ = cheerio.load(body);

	var trivias = [];
	var trivia_divs = $('a[name="trivia"]').next().nextUntil('h4').filter('div.soda');
	$(trivia_divs).each(function (index, element) {
		trivias.push($(this).text().trim());
	});

	return trivias;
}

/**
 * removes sizing (such as V1_SX67_CR0,0,67,98_.jpg) from imdb img urls
 * assumes the url has the sizing string
 * @param  {string} url
 * @return {string}
 */
function _parse_img_url (url) {
	var indexOfLastDot = url.lastIndexOf('.');
	var fileExtension = url.substring(indexOfLastDot);
	var indexOfSecondLastDot = url.lastIndexOf('.', indexOfLastDot - 1);
	var urlBase = url.substring(0, indexOfSecondLastDot);

	return urlBase + fileExtension;
}

module.exports =  {
    url: function(actor_id) {
		return format(ACTOR_BIO_URL, actor_id);
    },
    jobs: [
        {
            key: 'name',
            parse_method: parse_actor_name
        },
		{
            key: 'image',
            parse_method: parse_actor_image
        },
        {
            key: 'overview',
            parse_method: parse_actor_overview
        },
        {
            key: 'biographies',
            parse_method: parse_actor_bio
        },
        {
            key: 'trivias',
            parse_method: parse_actor_trivia
        }
    ]
};