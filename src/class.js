// ES5 Class util as ES6 max-min class semantics
// See: http://wiki.ecmascript.org/doku.php?id=strawman:maximally_minimal_classes

'use strict'
'export {Class}'

function Class(methods) {
	if (arguments.length === 0) return function(){}
	return createClass(methods)
}
Class.extend = function(superclass, props) {
	var protoParent, constructorParent
	if (superclass === null) {
		protoParent = null
	} else switch (typeof superclass) {
		case 'function': // TODO: should be constructor
			if (typeof superclass.prototype === 'object' || superclass.prototype === null) {
				protoParent = superclass.prototype
				constructorParent = superclass
			} else throw TypeError('superclass.prototype should be an object or null')
			break
		case 'object':
			protoParent = superclass
			break
		default: throw TypeError('superclass should be an object or null')
	}
	var pds = {}
	if (props !== undefined)
		for (var names = Object.getOwnPropertyNames(props), i = 0; i < names.length; i++) {
			var name = names[i]
			pds[name] = Object.getOwnPropertyDescriptor(props, name)
		}
	return function(methods) {
		return createClass(methods, protoParent, pds, constructorParent)
	}
}

function createClass(methods, protoParent, protoPDs, constructorParent) {
	var methodDescriptors = {}
	if (arguments.length <= 1) protoParent = Object.prototype
	if (methods !== undefined) {
		for (var names = Object.getOwnPropertyNames(methods), i = 0; i < names.length; i++) {
			var name = names[i]
			var pd = Object.getOwnPropertyDescriptor(methods, name)
			if ('value' in pd) {
				if (typeof pd.value === 'function')
					pd.value = createMethod(name, pd.value, protoParent)
				else throw TypeError('[' + name + '] is not a function')
			} else {
				if (pd.get) pd.get = createMethod('get ' + name, pd.get, protoParent)
				if (pd.set) pd.set = createMethod('set ' + name, pd.set, protoParent)
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
		Ctor = function constructor() {
			if (protoParent !== null) protoParent.constructor.apply(this, arguments)
		}
		methodDescriptors.constructor = {value: Ctor, writable: true, configurable: true}
	}
	if (arguments.length > 1) Ctor.prototype = Object.create(protoParent, protoPDs)
	Object.defineProperties(Ctor.prototype, methodDescriptors)
	Object.defineProperties(Ctor, {
		prototype: {writable: false, configurable: false, enumerable: false}
	})
	if (constructorParent) inherit(Ctor, constructorParent)
	return Ctor
}

var _isPrototypeOf = {}.isPrototypeOf
var inherit = supportSetProto() ?
	function (obj, proto) { obj.__proto__ = proto } :
	function (obj, proto) {
		// copy all properties from proto
		while (proto !== null && !_isPrototypeOf.call(proto, obj)) { // stop if obj has the same prototype
			for (var names = Object.getOwnPropertyNames(proto), i = 0; i < names.length; i++) {
				var name = names[i]
				if (!obj.hasOwnProperty(name))
					Object.defineProperty(obj, name,
						Object.getOwnPropertyDescriptor(proto, name))
			}
			proto = Object.getPrototypeOf(proto)
		}
	}

function supportSetProto() {
	var x = {}
	x.__proto__ = C.prototype
	return x instanceof C
	
	function C() {}
}

var f = function(){}
var toFunctionSource = f.toSource || f.toString

function createMethod(name, func, base) {
	var params = /\((.*?)\)/.exec(toFunctionSource.call(func))[1].split(/\s*,\s*/)
	var method
	if (params[0] === '$super') method = function() {
		var args = [].slice.call(arguments)
		args.unshift(createSuper(this, base, name))
		return func.apply(this, args)
	}
	else method = func
	return method
}

function createSuper(actualThis, base, name) {
	if (base === null) return null

	// TODO: via Proxy?
	var Super = function() {
		return base[name].apply(actualThis, arguments)
	}
	Super.call = function(name) {
		[].shift.call(arguments)
		return base[name].apply(actualThis, arguments)
	}
	Super.get = function(name) {
		var p = base, get
		while (!(get = Object.getOwnPropertyDescriptor(p, name).get))
			p = Object.getPrototypeOf(p)
		return get.apply(actualThis)
	}
	Super.set = function(name, value) {
		var p = base, set
		while (!(set = Object.getOwnPropertyDescriptor(p, name).set))
			p = Object.getPrototypeOf(p)
		return set.apply(actualThis, [value])
	}
	inherit(Super, createSuperProto(actualThis, base))
	return Super
}

function createSuperProto(actualThis, base) {
	if (base === null) return null
	var pds = {}
	for (var names = Object.getOwnPropertyNames(base), i = 0; i < names.length; i++) {
		var name = names[i]
		var pd = Object.getOwnPropertyDescriptor(base, name)
		if ('value' in pd) {
			pd.value = typeof pd.value === 'function' ?
				pd.value.bind(actualThis) : pd.value
		} else {
			if (pd.get) pd.get = pd.get.bind(actualThis)
			if (pd.set) pd.set = pd.set.bind(actualThis)
		}
		pds[name] = pd
	}
	var proto = createSuperProto(actualThis, Object.getPrototypeOf(base))
	return Object.create(proto, pds)
}

/*
extra API?

Class#defineMethod

support $this

Object.augment
*/