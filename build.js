'use strict'

var pack = require('./package')
var fs = require('fs')

var umd = fs.readFileSync(__dirname + '/umd.js', 'utf-8')
var src = fs.readFileSync(__dirname + '/src/class.js', 'utf-8')

src = src.replace("'export {Class}'", 'exports.Class = Class')

var result = umd.
	replace(/\$date\$/g, new Date().toISOString()).
	replace(/\$package_(.+?)\$/g, function (_, prop) {
		return pack[prop]
	}).
	replace('//$content$', src)

fs.writeFileSync(__dirname + '/dist/class.js', result)
