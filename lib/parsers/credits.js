var BASE_URL = require('../base_url');
var CREDITS_URL = BASE_URL + '/title/%s/fullcredits?ref_=tt_cl_sm';
var cheerio = require('cheerio');
var format = require('util').format;


/**
 * Parse all actors from full-credits page of a movie
 * @param  {string} body credits page in html
 * @return {array}      actors array
 */
function parse_credits (body) {
	var $ = cheerio.load(body);

	var cast_rows = $('table.cast_list tr');
	var actors = [];

	// Filter out rows that don't have actor
	cast_rows = cast_rows.filter(function () {
		return $(this).find('.itemprop').length !== 0;
	});

	// Parses each row of the table to get actors and characters
	cast_rows.each(function (index, element) {
		var actor_name = $(this).find("[itemprop='name']").text();
		var actor_url_path = $(this).find("[itemprop='url']").attr('href');
		var actor_url = BASE_URL + actor_url_path;
		var actor_id = actor_url_path.split('/')[2];

		/* 
		IMDB saves the original image as ...@@.jpg
		The image can be scaled down like ...@@._V1._SX{x}_SY{y}_.jpg 

		Note that the images are loaded late. So we need to grab the urls from
		the attribute called 'loadlate'
		*/
		var tiny_img = $(this).find('.primary_photo img');
		var tiny_img_url = tiny_img.attr('loadlate');
		var img_url_base;
		var medium_img_url;
		var original_img_url;

		if (tiny_img_url) {
			/*
			Example:
			tiny_img_url = http://ia.media-imdb.com/images/M/MV5BMTc0NDQzODAwNF5BMl5BanBnXkFtZTYwMzUzNTk3._V1_SX32_CR0,0,32,44_.jpg
			img_url_base = http://ia.media-imdb.com/images/M/MV5BMTc0NDQzODAwNF5BMl5BanBnXkFtZTYwMzUzNTk3.
			medium_img_url = http://ia.media-imdb.com/images/M/MV5BMTc0NDQzODAwNF5BMl5BanBnXkFtZTYwMzUzNTk3._V1_SX200.jpg
			original_img_url = http://ia.media-imdb.com/images/M/MV5BMTc0NDQzODAwNF5BMl5BanBnXkFtZTYwMzUzNTk3.jpg
			*/
			img_url_base = tiny_img_url.substring(0, tiny_img_url.lastIndexOf('.', tiny_img_url.length - 5) + 1);
			medium_img_url = img_url_base + '_V1_SX200.jpg';
			original_img_url = img_url_base + 'jpg';
		}
		
		var characters = $(this).find(".character div");
		var characterArray = [new Character()];
				
		characters.contents().each(function() {
			
			if ($(this).is('a')) {
					var url_path = $(this).attr('href');
					var id = url_path.split('/')[2];
					var url = BASE_URL + url_path;
					var name = $(this).text().trim();
					characterArray[characterArray.length -1] = new Character (id, name, url);
			}
			else { // Text node
				var text = $(this).text().trim();
				if (text) {
					if (text === '/') {
						characterArray.push(new Character());
					}
					else if (text.indexOf('/') != -1) {
						var charactersFromText = text.split('/');
						charactersFromText.forEach(function (element) {
							if (element.trim()) {
								characterArray.push(new Character('', element.trim()));
							}
						});
					}
					else {
						var last = characterArray[characterArray.length -1];
						if (last.name) {
							last.extra = text.trim();
						} else {
							last.name = text.trim();
						}
					}
				}
			}
		});

		var config = {
			name: actor_name,
			url: actor_url,
			id: actor_id,
			tiny_img_url: tiny_img_url,
			medium_img_url: medium_img_url,
			original_img_url: original_img_url,
			characters: characterArray
		};
		actors.push(new Actor(config));
	});

	return actors;
}

function Actor (config) {
    this.name = config.name;
    this.url = config.url || '';
    this.id = config.id || '';
    this.images = {
        'tiny': config.tiny_img_url,
        'medium': config.medium_img_url,
        'original': config.original_img_url,
    };

    this.characters = config.characters || [];
}

function Character (id, name, url) {
    this.id = id || '';
    this.name = name || '';
    this.url = url || '';
}

module.exports = {
	url: function (imdb_id) {
		return format(CREDITS_URL, imdb_id);
	},
	jobs: [
		{
			key: 'actors',
			parse_method: parse_credits
		}
	]
};