/* eslint-env node */

'use strict'

var pack = require('./package')
var fs = require('fs')
var path = require('path')

var umd = fs.readFileSync(path.join(__dirname, 'umd.js'), 'utf-8')
var src = fs.readFileSync(path.join(__dirname, 'src', 'class.js'), 'utf-8')

src = src.replace("'export {Class}'", 'exports.Class = Class')

var result = umd
	.replace(/\$date\$/g, new Date().toISOString())
	.replace(/\$package_(.+?)\$/g, function (_, prop) {
		return pack[prop]
	})
	.replace('//$content$', src)

fs.writeFileSync(path.join(__dirname, 'dist', 'class.js'), result)
