## What is MMClass ##

MMClass is just another JavaScript Class factory,
like Class in [Prototype](http://prototypejs.org/learn/class-inheritance),
[MooTools](http://mootools.net/docs/core/Class/Class) or
[Base2](http://base2.googlecode.com/svn/version/1.0.2/doc/base2.html#/doc/!base2.Base).
But it follow the semantics of ES6 max-min class draft,
so all codes written with MMClass are expected to be compatible with ES6.

## Example ##

### ES 6 syntax: ###

```hx
Class Pet {
	constructor(name) {
		this.name = name
	}
	speak() {
		console.log(this.name + ' says...')
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
	constructor(name) {
		super(name)
	}
	meow() {
		return 'Meow ~~'
	}
	speak() {
		super.speak()
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
	constructor: function($super, name) {
		$super(name)
	},
	meow: function() {
		return 'Meow ~~'
	},
	speak: function($super) {
		$super.speak()
		console.log(this.meow() + " I'm a cat, go away!")
	}
})


var dog = new Dog('Odie')
dog.speak() // Output: Odie says... Woof, woof! I'm a dog, pet me!

var cat = new Cat('Garfield')
cat.speak() // Output: Garfield says... Meow ~~ I'm a cat, go away!
```

## Usage ##

Note: MMClass requires ES5 environment. You can try es5-shim for legacy browsers (though untested yet).

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
	<script src="$PATH_TO/mmclass/dist/mmclass">
```
