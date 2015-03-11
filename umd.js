/* $package_name$ -- $package_description$
 * v$package_version$ $date$
 * Author: $package_author$
 */
void function(root, factory){
	if (typeof require === 'function' && typeof exports === 'object' && exports) {
		// CommonJS Module/1.0+
		factory(require, exports)
	} else if (typeof define === 'function' && (define.amd || define.cmd)) {
		// AMD or CMD
		define(factory)
	} else {
		factory(null, root)
	}
}(this, function(_, exports){

//$content$

})
