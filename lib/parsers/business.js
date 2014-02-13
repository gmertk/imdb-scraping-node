var BASE_URL = require('../base_url');
var BUSINESS_URL = BASE_URL + '/title/%s/business?ref_=tt_dt_bus';
var cheerio = require('cheerio');
var format = require('util').format;


function parse_business(body) {
	var $ =  cheerio.load(body);	
	var contents = $('#tn15content').contents();
	var result = {};
	var currentHeader;
	contents.each(function () {
		var isHeader5 = $(this).is('h5'); 
		var isHeader3 = $(this).is('h3');
		if (isHeader5) {
			currentHeader = $(this).text().trim().toLowerCase().replace(" ", "_");
			result[currentHeader] = [""];
		}
		else if (isHeader3) {
			return false;
		}
		else {
			if (currentHeader) {
				var isBr = $(this).is('br');
				if (isBr) {
					result[currentHeader].push("");
				}
				else {
					var lastIndex = result[currentHeader].length - 1;
					result[currentHeader][lastIndex] += $(this).text();
				}
			}
		}
	});

	var titlesToBeParsed = ["opening_weekend", "gross", "weekend_gross", "budget"];
	var resultToReturn = {};
	for(var key in result) {
		if (result.hasOwnProperty(key)) {
			if (titlesToBeParsed.indexOf(key) > -1) {
				resultToReturn[key] = [];

				var arr = result[key];
				for (var i = 0; i < arr.length; i++) {
					var lineObj = parse_line(arr[i], key);
					if (lineObj) {
						resultToReturn[key].push(lineObj);
					}
				}
			}
		}
	}

	return resultToReturn;

	/**
	 * Parses a line into an object. Lines can be from Budget, Opening Weekend, Gross,
	 * Weekend Gross, Admissions, Rentals, and maybe some others.
	 * Line examples: 
	 * '$10,250 (USA) (27 October 2013) (23 Screens)'
	 * '$13,552,653 (USA) (4 August 2013)'
	 * 'SEK 34,207,647 (Sweden) (30 December 1999)'
	 * '$63,000,000 (estimated)
	 * 
	 * @param  {[string]} line 
	 * @return {[object]}     
	 */
	function parse_line (line, key) {
		line = line.trim();
		var lineObj;
		var elementsOfLine = line.split(/[()]/);

		if (line) {
			lineObj = {};
			elementsOfLine = elementsOfLine.filter(function(e) {
				return e.trim() !== "";
			});
			lineObj.money = elementsOfLine[0] && elementsOfLine[0].trim() || "";
			lineObj.country = elementsOfLine[1] || "";
			lineObj.date = elementsOfLine[2] || "";
			lineObj.extra = elementsOfLine[3] || "";

			if (key == "budget") {
				lineObj.extra = lineObj.country;
				lineObj.country = "";
			}
		}
	
		return lineObj;	
	}
}


module.exports = {
	url: function (imdb_id) {
		return format(BUSINESS_URL, imdb_id);
	},
	jobs: [
		{
			key: 'business',
			parse_method: parse_business
		}
	]
};