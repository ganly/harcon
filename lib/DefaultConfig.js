let emptyLogFn = function () { console.log( arguments ) }

let dummyLogger = {
	dummy: true
}
let logFnNames = ['info', 'debug', 'error', 'silly', 'warn', 'verbose', 'log']
logFnNames.forEach(function ( name ) {
	dummyLogger[name] = emptyLogFn
})

module.exports = {
	name: 'Harcon',
	logger: dummyLogger,
	bender: {
		enabled: false,
		entity: './FireBender',
		forced: true,
		privileged: [ 'FireBender', 'Inflicter' ],
		igniteTermination: true
	},
	callStackExtension: {
		level: 1,
		enabled: true
	},
	igniteLevel: 'info',
	unfoldAnswer: false,
	suppressing: false,
	idLength: 32,
	blower: {
		commTimeout: 2000,
		tolerates: [ ]
	},
	connectedDivisions: [ ]
}
