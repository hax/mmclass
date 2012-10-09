imports: {Class} from: '../src/class.js'

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
dog.speak()

var cat = new Cat('Garfield')
cat.speak()
