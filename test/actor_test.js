var imdb = require('../index');


exports.actor = function (test) {
	var actor_id = 'nm0000235';
	imdb.searchActor(actor_id, function (err, actor) {
		test.equal(actor.name, "Uma Thurman");
		test.equal(actor.image, 'http://ia.media-imdb.com/images/M/MV5BNzk3NTUyOTMyNl5BMl5BanBnXkFtZTcwMjQzNDcwMg@@.jpg' );
		test.equal(actor.overview.name, "Uma Thurman" );
		test.notEqual(actor.biographies.length, 0 );
		test.notEqual(actor.trivias.length, 0 );

		test.done();
	});
};

exports.actor2 = function (test) {
	var actor_id = 'blabla';
	imdb.searchActor(actor_id, function (err, actor) {
		test.equal(actor.name, "");
		test.equal(actor.image, "" );
		test.equal(actor.biographies.length, 0 );
		test.equal(actor.trivias.length, 0 );

		test.done();
	});
};