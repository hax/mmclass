'use strict'

test('class {}', function(){
	var Test = Class()

	assert.isFunction(Test)
	assert.egal(Object.getPrototypeOf(Test), Function.prototype)
	assert.egal(Object.getPrototypeOf(Test.prototype), Object.prototype)
	assert.egal(Test.prototype.constructor, Test)
	var x = new Test()
	assert.instanceOf(x, Test)
})

test('class { constructor(){}; method(){}; }', function(){

	var Test = Class({
		constructor: function(name) {
			this._name = name
		},
		getName: function() {
			return this._name
		}
	})

	assert.isFunction(Test)
	assert.egal(Object.getPrototypeOf(Test), Function.prototype)
	assert.egal(Object.getPrototypeOf(Test.prototype), Object.prototype)
	assert.egal(Test.prototype.constructor, Test)
	var hax = new Test('hax')
	assert.instanceOf(hax, Test)
	assert.egal(hax.getName(), 'hax')
	assert.egal(Object.getPrototypeOf(hax), Test.prototype)
	//assert.egal(Object.getOwnPropertyDescriptor(Test.prototype, 'getName').enumerable, false)
	//assert.throws(function(){ new hax.getName() }, TypeError)
})

test('class extends null {}', function(){
	var Test = Class.extend(null)()

	assert.isFunction(Test)
	assert.egal(Object.getPrototypeOf(Test), Function.prototype)
	assert.egal(Object.getPrototypeOf(Test.prototype), null)
	assert.egal(Test.prototype.constructor, Test)
	assert.instanceOf(new Test(), Test)
})

test('class extends Super {}', function(){
	function Super() {}
	Super.className = 'Super'
	Super.prototype.getClassName = function() {
		return this.constructor.className
	}
	var Test = Class.extend(Super)()

	assert.isFunction(Test)
	if ('__proto__' in function(){}) {
		assert.egal(Object.getPrototypeOf(Test), Super)
	} else {
		assert.egal(Test.className, 'Super')
	}

	assert.egal(Object.getPrototypeOf(Test.prototype), Super.prototype)
	assert.egal(Test.prototype.constructor, Test)
	assert.instanceOf(new Test(), Test)
	assert.instanceOf(new Test(), Super)
	assert.egal(new Test().getClassName(), 'Super')
	Test.className = 'Test'
	assert.egal(new Test().getClassName(), 'Test')
})

test('class extends proto {}', function(){
	var proto = {
		_name: 'hax',
		getName: function() {
			return this._name
		}
	}
	var Test = Class.extend(proto)()

	assert.isFunction(Test)
	assert.egal(Object.getPrototypeOf(Test), Function.prototype)
	assert.egal(Object.getPrototypeOf(Test.prototype), proto)
	assert.egal(Test.prototype.constructor, Test)
	assert.instanceOf(new Test(), Test)
	assert.egal(new Test().getName(), 'hax')
})

test('class method override', function(){
	var A = Class({
		toString: function() { return 'a' }
	})
	var B = Class.extend(A)({
		toString: function() { return 'b' }
	})

	assert.instanceOf(new B(), B)
	assert.instanceOf(new B(), A)
	assert.egal(new A().toString(), 'a')
	assert.egal(new B().toString(), 'b')
})

test('super call', function(){
	var A = Class({
		constructor: function(name) {
			this._name = name
		},
		getName: function() {
			return this._name
		},
		toString: function() {
			return this.getName()
		}
	})
	var B = Class.extend(A)({
		constructor: function($super, name, desc) {
			$super(name)
			this._desc = desc
		},
		getDesc: function() {
			return this._desc
		},
		toString: function($super) {
			return $super() + ': ' + this.getDesc()
		}
	})
	var C = Class.extend(B)({
		getName: function($super) {
			return '[' + $super() + ']'
		}
	})

	var b = new B('test', 'Hello world!')
	assert.instanceOf(b, B)
	assert.instanceOf(b, A)
	assert.egal(b.getName(), 'test')
	assert.egal(b.getDesc(), 'Hello world!')
	assert.egal(b.toString(), 'test: Hello world!')

	var c = new C('test', 'Hello world!')
	assert.instanceOf(c, C)
	assert.instanceOf(c, B)
	assert.instanceOf(c, A)
	assert.egal(c.getName(), '[test]')
	assert.egal(c.getDesc(), 'Hello world!')
	assert.egal(c.toString(), '[test]: Hello world!')
})

/*test('class { static method() }', function(){
	var A = Class.statics
})*/

test('#1 multi-line constructor/method parameters', function () {

	var Test = Class({
		constructor: function (	a,
			b,
			c) {
				return [a, b, c]
		},
		test: function
			(	a,
				b,
				c) {
					return [a, b, c]
		}
	})

	assert.egal(Test.length, 3)
	assert.egal(Test.prototype.test.length, 3)

})
