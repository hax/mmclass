/* eslint-env node */
/* eslint strict: 0 */
/* global assert:true */
assert = require('assert')
assert.egal = function(actual, expect, message) {
	message = (message ? message + ': ' : '') +
		'expect ' + expect + ' but actual ' + actual
	if (actual === expect) {
		assert.ok(actual !== 0 || 1 / actual === 1 / expect, message)
	} else {
		assert.ok(actual !== actual && expect !== expect, message)
	}
}
assert.isFunction = function(f, message) {
	message = (message ? message + ': ' : '') +
		typeof f + ' is not a function'
	assert.ok(typeof f === 'function', message)
}
assert.instanceOf = function(x, y, message) {
	message = (message ? message + ': ' : '') +
		{}.toString.call(x) + ' is not a instance of ' + y
	assert.ok(x instanceof y, message)
}

/* global Class:true */
Class = require('../dist/class').Class
