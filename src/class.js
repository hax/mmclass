// ES5 Class util as ES6 max-min class semantics
// See: http://wiki.ecmascript.org/doku.php?id=strawman:maximally_minimal_classes

'use strict'
exports: Class

function Class(methods) {
	if (arguments.length === 0) return function(){}
	return createClass(methods)
}
Class.extend = function(obj, props) {
	var proto, superclass
	if (obj === null) {
		proto = null
	} else switch (typeof obj) {
		case 'function':
			if (typeof obj.prototype === 'object' || obj.prototype === null) {
				proto = obj.prototype
				superclass = obj
			} else throw TypeError('obj.prototype should be an object or null')
			break
		case 'object':
			proto = obj
			break
		default: throw TypeError('obj should be an object or null')
	}
	var pds = {}
	if (props !== undefined)
		for (var names = Object.getOwnPropertyNames(props), i = 0; i < names.length; i++) {
			var name = names[i]
			pds[name] = Object.getOwnPropertyDescriptor(props, name)
		}
	return function(methods) {
		return createClass(methods, Object.create(proto, pds), superclass)
	}
}

function createClass(methods, proto, superclass) {
	var methodDescriptors = {}
	if (methods !== undefined) {
		for (var names = Object.getOwnPropertyNames(methods), i = 0; i < names.length; i++) {
			var name = names[i]
			var pd = Object.getOwnPropertyDescriptor(methods, name)
			if ('value' in pd) {
				if (typeof pd.value === 'function')
					pd.value = createMethod(pd.value)
				else throw TypeError('[' + name + '] is not a function')
			} else {
				if (pd.get) pd.get = createMethod(pd.get)
				if (pd.set) pd.set = createMethod(pd.set)
			}
			pd.enumerable = false
			methodDescriptors[name] = pd
		}
	}
	var Ctor
	if (methodDescriptors.hasOwnProperty('constructor')) {
		Ctor = methodDescriptors.constructor.value
		if (Ctor === undefined) throw TypeError('constructor is not a function')
	} else {
		Ctor = function(){}
		methodDescriptors.constructor = {value: Ctor, writable: true, configurable: true}
	}
	if (arguments.length > 1) Ctor.prototype = proto
	Object.defineProperties(Ctor.prototype, methodDescriptors)
	Object.defineProperties(Ctor, {
		prototype: {writable: false, configurable: false, enumerable: false},
	})
	if (superclass) inherit(Ctor, superclass)
	return Ctor
}

function inherit(obj, proto) {
	if (!('__proto__' in {})) { // copy all properties from proto
		var pds = {}
		while (proto !== null && !proto.isPrototypeOf(obj)) { // stop if obj has the same prototype
			for (var names = Object.getOwnPropertyNames(proto), i = 0; i < names.length; i++) {
				var name = names[i]
				if (!obj.hasOwnProperty(name))
					Object.defineProperty(obj, name,
						Object.getOwnPropertyDescriptor(proto, name))
			}
			proto = Object.getPrototypeOf(proto)
		}
	}
	obj.__proto__ = proto
}

var f = function(){}
var toFunctionSource = f.toSource || f.toString

function createMethod(func, isConstructor) {
	var params = /\((.*?)\)/.exec(toFunctionSource.call(func))[1].split(/\s*,\s*/)
	var method
	if (params[0] === '$super') method = function() {
		var args = [].slice.call(arguments)
		args.unshift(createSuper(this))
		return func.apply(this, args)
	}
	else method = func
	//if (!isConstructor) method = method
	return method
}

function createSuper(self, parent) {
	if (parent === undefined) parent = Object.getPrototypeOf(Object.getPrototypeOf(self))
	if (parent === null) return null

	var $super = parent.constructor.bind(self)
	var pds = {}
	for (var names = Object.getOwnPropertyNames(parent), i = 0; i < names.length; i++) {
		var name = names[i]
		var pd = Object.getOwnPropertyDescriptor(parent, name)
		if ('value' in pd) {
			pd.value = typeof pd.value === 'function' ?
				pd.value.bind(self) : pd.value
		} else {
			if (pd.get) pd.get = pd.get.bind(self)
			if (pd.set) pd.set = pd.set.bind(self)
		}
		pds[name] = pd
	}
	Object.defineProperties($super, pds)
	inherit($super, createSuper(self, Object.getPrototypeOf(parent)))
	return $super
}

/*
extra API?

Class#defineMethod

support $this

Object.augment
*/