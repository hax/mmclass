'use strict'

var fs = require('fs')

var umd = fs.readFileSync(__dirname + '/umd.js', 'utf-8')
var src = fs.readFileSync(__dirname + '/src/class.js', 'utf-8')

src = src.replace("'export {Class}'", 'exports.Class = Class')

var result = umd.replace('//$content$', src)

fs.writeFileSync(__dirname + '/dist/class.js', result)
