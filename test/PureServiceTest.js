var Inflicter = require('../lib/Inflicter');

var inflicter = new Inflicter( { logger: { file: 'test.log', level: 'debug' }, idLength: 32 } );

/*
var marie = {
	name: 'marie',
	context: 'morning',
	simple: function(greetings1, greetings2, callback){
		marie.greetings = [ greetings1, greetings2 ];
		callback( null, 'Bonjour!' );
	}
};
var marieFS = inflicter.addicts( marie );

var julie = {
	name: 'julie',
	context: 'morning',
	wakeup: function( ignite, callback ){
		ignite( 'morning.simple', 'It is morning!', 'Time to wake up!', function(err, res){
			callback(err, res[0]);
		} );
	}
};
var julieFS = inflicter.addicts( julie );

inflicter.ignite( 'morning.wakeup', function(err, res){
	console.log( '>>>>>>>>>>', err, res );
} );
*/

inflicter.addict('peter', 'greet.*', function(greetings1, greetings2, callback){
	callback(null, 'Hi there!');
} );
inflicter.addict('walter', 'greet.*', function(greetings1, greetings2, callback){
	callback(null, 'My pleasure!');
} );
inflicter.addict('steve', 'gentle.greetings', function(ignite, callback){
	ignite( 'greet.all', 'Hi!', 'Hello!', function(err, res){
		callback(err, res);
	} );
} );

inflicter.ignite( 'gentle.greetings', function(err, res){
	console.log( err, res );
} );

setTimeout( function(){ inflicter.close(); }, 2000);