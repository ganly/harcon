'use strict'

let Firestarter = require('./Firestarter')

let ignorable = [ 'init', 'close', 'ignite' ]

let _ = require('isa.js')

let Cerobee = require('clerobee')
let clerobee = new Cerobee( 16 )

let path = require('path')


function isFunction (value) {
	return typeof value === 'function' || false
}
function functions (obj) {
	let res = []
	for (let m in obj)
		if ( !ignorable.includes(m) && isFunction(obj[m]) )
			res.push(m)
	return res
}

function distinguishPostfix ( distinguish ) {
	if (!distinguish) return ''

	return _.isBoolean( distinguish ) ? clerobee.generate() : distinguish
}

/**
* Firestormstarter is a wrapper for listener object where its functions are the listeners routed by its 'context' property
*
* @class Firestormstarter
* @constructor
*/
function Firestormstarter ( config, barrel, object, blower, logger ) {
	this.config = config || {}
	this.division = object.division || ''
	this.auditor = object.auditor

	this.concealed = object.concealed

	this.name = object.name || 'Unknown flames'
	this.distinguishedName = this.name + distinguishPostfix( object.distinguish )

	this.active = true

	this.context = object.context || ''
	this.path = this.context.split( '.' )
	this.pathLength = this.path.length

	this.barrel = barrel
	this.object = object

	this.timeoutRefs = []
	this.intervalRefs = []
	this.object = require('../util/Extender').extend( this, this.object, path.join( __dirname, 'ext' ), { suppressing: this.config.suppressing } )

	this.events = functions( object )

	this.logger = logger
	if (this.config.suppressing || !this.object.harconlog)
		this.object.harconlog = logger.harconlog

	this.terms = {}

	this.blower = blower
}

Firestormstarter.prototype = new Firestarter()

let firestorm = Firestormstarter.prototype

firestorm.services = function ( ) {
	return this.events
}

firestorm.parameters = function ( service ) {
	return this.parametersOf( this.object[service] )
}

firestorm.matches = function ( comm ) {
	if ( !comm.event || !this.sameDivision( comm.division ) ) return false

	let index = comm.event.lastIndexOf( '.' )
	let prefix = comm.event.substring(0, index)
	let fnName = comm.event.substring(index + 1)

	let matches = fnName && this.events.includes( fnName )

	if ( matches && this.name !== prefix && this.distinguishedName !== prefix ) {
		let eventPath = index === -1 ? [] : prefix.split( '.' ), len = eventPath.length
		for (let i = 0; i < len && i < this.pathLength; i += 1)
			if ( this.path[i] !== eventPath[i] ) {
				matches = false
				break
			}
	}

	this.logger.harconlog( null, 'Matching', {events: this.events, eventName: comm.event, matches: matches}, 'silly' )

	return matches
}

firestorm.getServiceFn = function ( comm ) {
	let index = comm.event.lastIndexOf( '.' )
	let eventName = comm.event.substring( index + 1 )

	return this.object[ eventName ]
}

firestorm.innerBurn = function ( comm, callback, serviceFn, igniteFn, params ) {
	try {
		serviceFn.apply( this.object, params )
	} catch (ex) {
		callback( ex )
	}
}

firestorm.close = function ( callback ) {
	try {
		this.timeoutRefs.forEach( function (ref) {
			clearTimeout(ref)
		} )
		this.timeoutRefs.length = 0
		this.intervalRefs.forEach( function (ref) {
			clearInterval(ref)
		} )
		this.intervalRefs.length = 0
	} catch (err) { this.logger.harconlog(err) }

	if ( this.object.close )
		this.object.close( callback )
	else if (callback)
		callback( null, 'Done.' )
}

module.exports = Firestormstarter
