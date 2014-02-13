var imdb = require('../index');


exports.movie = function (test) {
	var imdb_id = 'tt0266697';
	imdb.searchMovie(imdb_id, function (err, movie) {
		test.equal(movie.length, 1, "should return a movie");
		test.notEqual(movie[0].keywords.length, 0 );
		test.notEqual(movie[0].actors.length, 0 );
		test.notEqual(movie[0].aka_titles.length, 0 );
		test.notEqual(movie[0].release_dates.length, 0 );
		test.notEqual(movie[0].company_credits.length, 0 );
		test.notEqual(movie[0].business.length, 0 );

		test.done();
	});
};