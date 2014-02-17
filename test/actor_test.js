var imdb = require('../index');


exports.actor = function (test) {
	var actor_id = 'nm0000235';
	imdb.searchActor(actor_id, function (err, actor) {
		test.equal(actor.length, 1, "should return a actor");
		test.equal(actor[0].name, "Uma Thurman");
		test.notEqual(actor[0].image.length, 0 );
		test.notEqual(actor[0].overview.length, 0 );
		test.notEqual(actor[0].biographies.length, 0 );
		test.notEqual(actor[0].trivias.length, 0 );

		test.done();
	});
};

exports.actor2 = function (test) {
	var actor_id = 'blabla';
	imdb.searchActor(actor_id, function (err, actor) {
		test.equal(actor.length, 1, "should return an empty actor");
		test.equal(actor[0].name, "");
		test.equal(actor[0].image, "" );
		test.equal(actor[0].biographies.length, 0 );
		test.equal(actor[0].trivias.length, 0 );

		test.done();
	});
};