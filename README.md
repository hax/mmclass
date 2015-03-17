[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![Codacy badge][codacy-image]][codacy-url]
[![Downloads][downloads-image]][npm-url]


## What is MMClass ##

MMClass is just another JavaScript Class factory,
like Class in [Prototype](http://prototypejs.org/learn/class-inheritance),
[MooTools](http://mootools.net/docs/core/Class/Class) or
[Base2](http://base2.googlecode.com/svn/version/1.0.2/doc/base2.html#/doc/!base2.Base).
But it follow the semantics of ES6 max-min class draft,
so all codes written with MMClass are expected to be compatible with ES6.

## Example ##

### ES 6 syntax: ###

```js
Class Pet {
	constructor(name) {
		this._name = name
	}
	speak() {
		console.log(this._name + ' says...')
	}
}
Class Dog extends Pet {
	constructor(name) {
		super(name)
	}
	woof() {
		return 'Woof, woof!'
	}
	speak() {
		super.speak()
		console.log(this.woof() + " I'm a dog, pet me!")
	}
}
Class Cat extends Pet {
	meow() {
		return 'Meow ~~'
	}
	speak() {
		super()
		console.log(this.meow() + " I'm a cat, go away!")
	}
}
```

### ES5 version with MMClass: ###

```js
var Pet = Class({
	constructor: function(name) {
		this._name = name
	},
	speak: function() {
		console.log(this._name + ' says...')
	}
})

var Dog = Class.extend(Pet)({
	constructor: function($super, name) {
		$super(name)
	},
	woof: function() {
		return 'Woof, woof!'
	},
	speak: function($super) {
		$super.speak()
		console.log(this.woof() + " I'm a dog, pet me!")
	}
})

var Cat = Class.extend(Pet)({
	// if no constructor provided,
	// default to constructor(...args) { super(...args) }
	meow: function() {
		return 'Meow ~~'
	},
	speak: function($super) {
		$super() // same as $super.speak()
		console.log(this.meow() + " I'm a cat, go away!")
	}
})


var dog = new Dog('Odie')
dog.speak() // Output: Odie says... Woof, woof! I'm a dog, pet me!

var cat = new Cat('Garfield')
cat.speak() // Output: Garfield says... Meow ~~ I'm a cat, go away!
```

## More info about ES6 Class/ES5 MMClass ##

### You can extend a traditional ES5 constructor function ###

```js
function Pet(name) {
	this._name = name
}
Pet.prototype.speak = function() {
	console.log(this._name + ' says...')
}
```

ES6:

```js
class Dog extends Pet {...}
```

MMClass:

```js
var Dog = Class.extend(Pet)({...})
```

Note: As ES6, Dog.[[prototype]] should be Pet so that Dog class can inherit
all "static" properties on Pet. MMClass follow this semantic via setting
\_\_proto\_\_ . Most engines support this pseudo property, if it's not supported,
MMClass will copy all properties.

### You also can extend an object directly (aka. prototype-based inheritance) ###

```js
var pet = {
	constructor: function(name) {
		this._name = name
	},
	speak: function() {
		console.log(this._name + ' says...')
	}
}
```

ES6:

```js
class Dog extends pet {...}
```

MMClass:

```js
var Dog = Class.extend(pet)({...})
```

### You even can extend null to avoid inheriting the properties from Object.prototype (such as isPrototypeOf/hasOwnProperty/propertyIsEnumerable) ###

ES6:

```js
class NakedObject extends null {}
```

MMClass:

```js
var NakedObject = Class.extend(null)()
```

###

## Usage ##

**Note:** MMClass requires ES5 environment. You can try _es5-shim_ for legacy browsers (though untested yet).

### my.js ###

```js
'use strict'
'import Class from "$PATH_TO/mmclass/src/class.js"'
...
```
See [my.js](http://github.com/hax/my.js/) for more info

### NodeJS ###

Installation:
```
npm i mmclass
```

Source:
```js
var Class = require('mmclass').Class
...
```

### AMD / CMD ###

```js
define(function(require, exports) {
	var Class = require('$PATH_TO/mmclass/dist/mmclass').Class
	...
}
```

### Browser ###

```html
<script src="$PATH_TO/mmclass/dist/mmclass"></script>
```

## TODO ##

* Check the recent released ES6 draft to follow the changes
(the standard draft is changing dramatically...)


[npm-image]: https://img.shields.io/npm/v/mmclass.svg?style=flat-square
[npm-url]: https://npmjs.org/package/mmclass
[travis-image]: https://img.shields.io/travis/hax/mmclass/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/hax/mmclass
[coveralls-image]: https://img.shields.io/coveralls/hax/mmclass/master.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/hax/mmclass?branch=master
[downloads-image]: http://img.shields.io/npm/dm/mmclass.svg?style=flat-square
[codacy-image]: https://img.shields.io/codacy/4ce5706252da43709594735f4728ad83.svg?style=flat-square
[codacy-url]: https://www.codacy.com/public/hax/mmclass
