 /*!
  * Harmony JavaScript Library v0.1pre
  * © Fred Yang - http://semanticsworks.com
  * License: MIT (http://www.opensource.org/licenses/mit-license.php)
  *
  * Date: Wed Feb 6 14:52:14 2013 -0500
  */
(function( $, window, undefined ) {
	"use strict";

	/**
	 * a wrapper over a Node constructor,
	 * [value] is optional
	 */
	var hm = window.hm = function( path, value ) {
			return new Node( path, value );
		},
		Node = function( path, value ) {
			path = path || "";
			this.path = toPhysicalPath( path, true /* create shadow if necessary */ );
			if (!isUndefined( value )) {
				this.set( value );
			}
		},
		hmFn,
		extend = $.extend,
		repository = {},
		isArray = $.isArray,
		isFunction = $.isFunction,
		primitiveTypes = { 'undefined': undefined, 'boolean': undefined, 'number': undefined, 'string': undefined },
		shadowNamespace = "__hm",
		rShadowKey = /^__hm\.([^\.]+?)(?:\.|$)/,
	//try to match xxx in string this.get("xxx")
		rWatchedPath = /this\.(?:get)\s*\(\s*(['"])([\*\.\w\/]+)\1\s*\)/g,

	//key is referencedPath
	//value is array of referencingPath
		referenceTable = {},
		defaultOptions = {},
		rootNode,
		shadowRoot = repository[shadowNamespace] = {},
		hasOwn = repository.hasOwnProperty,
		Array = window.Array,
		arrayPrototype = Array.prototype,
		stringPrototype = String.prototype,
		slice = arrayPrototype.slice,
		trigger,
		beforeUpdate = "beforeUpdate",
		afterUpdate = "afterUpdate",
		beforeCreate = "beforeCreate",
		afterCreate = "afterCreate",
		rJSON = /^(?:\{.*\}|\[.*\])$/,
		rUseParseContextAsContext = /^\.(\.*)([\.\*])/,
		rMainPath = /^\.<(.*)/,
		rBeginDotOrStar = /^[\.\*]/,
		rDotStar = /[\.\*]/,
		rHashOrDot = /#+|\./g,
		rHash = /#+/g,
		RegExp = window.RegExp,
		rParentKey = /^(.+)[\.\*]\w+$/,
		mergePath,
		rIndex = /^.+\.(\w+)$|\w+/,
		util,
		isUndefined,
		isPrimitive,
		isString,
		isObject,
		isBoolean,
		isNumeric = $.isNumeric,
		isPromise,
		toTypedValue,
		toPhysicalPath,
		toLogicalPath,
		clearObj,
		$fn = $.fn,
		clone,
		rSupplant = /\{([^\{\}]*)\}/g;

	//#debug
	//if you are using debug version of the library
	//you can use debugging facilities provided here
	//they are also used in unit test to test some internal variable which is
	//not exposed in production version
	//In debug version, you can turn on logging by setting hm.debug.enableLog = true
	//and turn on debugger by setting hm.debug.enableDebugger = true
	//
	//In production version, there is no logging or debugger facilities
	hm.debug = {};
	hm.debug.enableLog = true;
	hm.debug.enableDebugger = false;

	window.log = window.log || function() {
		if (hm.debug.enableLog && window.console) {
			console.log( Array.prototype.slice.call( arguments ) );
		}
	};
	//#end_debug


	function augment ( prototype, extension ) {
		for (var key in extension) {
			if (!prototype[key]) {
				prototype[key] = extension[key];
			}
		}
	}

	augment( arrayPrototype, {
		indexOf: function( obj, start ) {
			for (var i = (start || 0); i < this.length; i++) {
				if (this[i] == obj) {
					return i;
				}
			}
			return -1;
		},

		contains: function( item ) {
			return (this.indexOf( item ) !== -1);
		},

		remove: function( item ) {
			var position = this.indexOf( item );
			if (position != -1) {
				this.splice( position, 1 );
			}
			return this;
		},

		removeAt: function( index ) {
			this.splice( index, 1 );
			return this;
		},

		pushUnique: function( item ) {
			if (!this.contains( item )) {
				this.push( item );
			}
			return this;
		},

		merge: function( items ) {
			if (items && items.length) {
				for (var i = 0; i < items.length; i++) {
					this.pushUnique( items[i] );
				}
			}
			return this;
		},
		//it can be sortObject()
		//sortObject(by)
		sortObject: function( by, asc ) {
			if (isUndefined( asc )) {
				if (isUndefined( by )) {
					asc = true;
					by = undefined;
				} else {
					if (isString( by )) {
						asc = true;
					} else {
						asc = by;
						by = undefined;
					}
				}
			}

			if (by) {
				this.sort( function( a, b ) {
					var av = a[by];
					var bv = b[by];
					if (av == bv) {
						return 0;
					}
					return  asc ? (av > bv) ? 1 : -1 :
						(av > bv) ? -1 : 1;
				} );
			} else {
				asc ? this.sort() : this.sort().reverse();
			}
			return this;
		}
	} );

	augment( stringPrototype, {
		startsWith: function( text ) {
			return this.indexOf( text ) === 0;
		},
		contains: function( text ) {
			return this.indexOf( text ) !== -1;
		},
		endsWith: function( suffix ) {
			return this.indexOf( suffix, this.length - suffix.length ) !== -1;
		},
		supplant: function( obj ) {
			return this.replace( rSupplant,
				function( a, b ) {
					var r = obj[b];
					return typeof r ? r : a;
				} );
		},
		format: function() {
			var source = this;
			$.each( arguments, function( index, value ) {
				source = source.replace( new RegExp( "\\{" + index + "\\}", "g" ), value );
			} );
			return source;
		}
	} );

	hmFn = Node.prototype = hm.fn = hm.prototype = {

		constructor: Node,

		//get()
		//get(true)
		//
		//subPath can be null, undefined, "", or "any string"
		//get(subPath)
		//get(subPath, p1, p2)
		//
		//does not support the following, as will be implemented as get((subPath = p1), p2)
		//get(p1, p2)
		get: function( subPath /*, p1, p2, .. for parameters of model functions*/ ) {

			var currentValue, accessor = this.accessor( subPath, true );

			if (accessor) {

				if (isFunction( accessor.hostObj )) {

					return accessor.hostObj.apply( this.cd( ".." ), slice.call( arguments ) );

				}
				else {

					currentValue = !accessor.index ?
						accessor.hostObj :
						accessor.hostObj[accessor.index];

					if (isFunction( currentValue )) {

						//inside the function, "this" refer the parent model of accessor.physicalPath
						return currentValue.apply( this.cd( subPath ).cd( ".." ), slice.call( arguments, 1 ) );

					} else {

						return currentValue;
					}
				}
			}
			//else return undefined
		},

		getJson: function() {
			return JSON.stringify( this.get.apply( this, slice.call( arguments ) ) );
		},

		raw: function( subPath, value ) {
			var accessor;
			if (isFunction( subPath )) {
				value = subPath;
				subPath = "";
			}
			if (!value) {
				accessor = this.accessor( subPath, true );
				if (accessor) {
					return !accessor.index ?
						accessor.hostObj :
						accessor.hostObj[accessor.index];
				}
			} else {
				accessor = this.accessor( subPath );
				return ( accessor.index in accessor.hostObj ) ?
					this.update( subPath, value, accessor ) :
					this.create( subPath, value, accessor );
			}

		},

		//return node
		//you can use node.set to call the function at the path
		//the function context is bound to current proxy's parent
		//what is different for get function is that, set will return a proxy
		//and get will return the result of the function
		set: function( force, subPath, value ) {
			//allow set(path, undefined)
			if (arguments.length == 1) {
				if (this.path == "") {
					throw "root object can not changed";
				} else {
					rootNode.set( this.path, force, subPath );
					return this;
				}
			}

			var args = slice.call( arguments );

			if (!isBoolean( force )) {
				value = subPath;
				subPath = force;
				force = false;
			} else if (arguments.length == 2) {
				rootNode.set( force, this.path, subPath );
				return this;
			}

			var accessor = this.accessor( subPath );
			var currentValue = accessor.hostObj[accessor.index];

			if (isFunction( currentValue )) {

				//inside the function, "this" refer the parent model of accessor.physicalPath
				currentValue.apply( this.cd( subPath ).cd( ".." ), slice.call( args, 1 ) );
				return this;

			} else {

				return ( accessor.index in accessor.hostObj ) ?
					this.update( force, subPath, value, accessor ) :
					this.create( force, subPath, value, accessor );

			}
		},

		accessor: function( subPath, readOnly /*internal use only*/ ) {
			//if it is not readOnly, and access out of boundary, it will throw exception
			if (subPath === 0) {
				subPath = "0";
			}

			var i,
				index,
			//the hostObj start from root
				hostObj = repository,
			//the fullPath can be logicalPath , for example hm("person").getPath("*");
			//it can also be a physicalPath like hm("person*").getPath();
				fullPath = this.getPath( subPath ),
			//make sure we are working on a physicalPath
				physicalPath = toPhysicalPath( fullPath, true /*create shadow if necessary*/ ),
				parts = physicalPath.split( "." );

			if (parts.length === 1) {

				index = physicalPath;

			} else {

				//index is the last part
				index = parts[parts.length - 1];

				//traverse to the second last node in the parts hierarchy
				for (i = 0; i < parts.length - 1; i++) {
					hostObj = hostObj[parts[i]];
					if (hostObj === undefined) {
						break;
					}
				}
			}

			if (isPrimitive( hostObj )) {
				if (readOnly) {
					return;
				}
				else {
					throw "invalid update on unreachable node '" + toLogicalPath( fullPath ) + "'";
				}
			}

			return {
				physicalPath: physicalPath,
				hostObj: hostObj,
				index: index
			};
		},

		create: function( force, subPath, value, accessor /* accessor is used internally */ ) {

			if (!isBoolean( force )) {
				accessor = value;
				value = subPath;
				subPath = force;
				force = false;
			}

			accessor = accessor || this.accessor( subPath );

			var physicalPath = accessor.physicalPath;

			var hostObj = accessor.hostObj,
				index = accessor.index,
				isHostObjArray = isArray( hostObj );

			if (isHostObjArray && isNumeric( index )) {
				if (index > hostObj.length) {
					throw "you can not add item with hole in array";
				}
			} else {
				if (index in hostObj) {
					throw "value at path: '" + toLogicalPath( accessor.physicalPath ) + "' has been defined, " +
					      "try use update method instead";
				}
			}

			if (!force && trigger( physicalPath, physicalPath, beforeCreate, value ).hasError()) {
				return false;
			}

			if (isHostObjArray && isNumeric( index )) {
				if (index == hostObj.length) {
					hostObj[index] = value;

				} else if (index < hostObj.length) {
					//insert an item x into array [ 1, 2, 3] at position 2,
					// and it becomes [1, x, 2, 3]
					hostObj.splice( accessor.index, 0, value );
				}

			} else {
				hostObj[accessor.index] = value;
			}

			trigger( physicalPath, physicalPath, afterCreate, value );
			traverseModel( physicalPath, value );
			return this;
		},

		extend: function( subPath, object ) {
			var newModel;
			if (!object) {
				object = subPath;
				newModel = this;
			} else {
				newModel = this.cd( subPath );
			}
			for (var key in object) {
				newModel.set( key, object[key] );
			}
			return this;
		},

		/* accessor is used internally */
		//update(value)
		//update(subPath, value)
		//most of the time force is not used, by default is it is false
		//by in case you want to bypass validation you can explicitly set to true
		update: function( force, subPath, value, accessor ) {

			if (arguments.length == 1) {
				if (this.path == "") {
					throw "root object can not updated";
				} else {
					rootNode.update( this.path, force );
					return this;
				}
			}

			if (!isBoolean( force )) {
				accessor = value;
				value = subPath;
				subPath = force;
				force = false;
			} else if (arguments.length == 2) {
				rootNode.update( force, this.path, subPath );
				return this;
			}

			accessor = accessor || this.accessor( subPath );

			if (!( accessor.index in accessor.hostObj )) {
				throw "value at path: '" + toLogicalPath( accessor.physicalPath ) + "' has been not defined, " +
				      "try use create method instead";
			}

			var physicalPath = accessor.physicalPath;

			var originalValue = accessor.hostObj[accessor.index];
			//use "==" is purposeful, we want it to be flexible.
			// If model value is null, and textBox value is "", because null == "",
			// so that "" can not be set, same for "9" and 9
			if (originalValue == value) {
				return this;
			}

			if (!force && trigger( physicalPath, physicalPath, beforeUpdate, value, originalValue ).hasError()) {
				return false;
			}

			accessor.hostObj[accessor.index] = value;

			if (!force) {
				trigger( physicalPath, physicalPath, afterUpdate, value, originalValue );
			}

			traverseModel( physicalPath, value );
			return this;
		},

		del: function( subPath ) {
			if (isUndefined( subPath )) {
				if (this.path) {
					return rootNode.del( this.path );
				}
				throw "root can not be deleted";
			}

			var accessor = this.accessor( subPath ),
				hostObj = accessor.hostObj,
				physicalPath = accessor.physicalPath,
				removedValue = hostObj[accessor.index],
				isHostObjectArray = isArray( hostObj );

			if (trigger( physicalPath, physicalPath, "beforeDel", undefined, removedValue ).hasError()) {
				return false;
			}

			if (isHostObjectArray) {

				hostObj.splice( accessor.index, 1 );

			} else {

				delete hostObj[accessor.index];

			}

			for (var i = 0; i < onDeleteHandlers.length; i++) {
				onDeleteHandlers[i]( physicalPath, removedValue );
			}

			trigger( physicalPath, physicalPath, "afterDel", undefined, removedValue );
			return removedValue;
		},

		createIfUndefined: function( subPath, value ) {
			if (isUndefined( value )) {
				throw "missing value argument";
			}
			var accessor = this.accessor( subPath );
			return ( accessor.index in accessor.hostObj ) ?
				this :
				this.create( subPath, value, accessor );
		},

		//navigation methods
		pushStack: function( newNode ) {
			newNode.previous = this;
			return newNode;
		},

		cd: function( relativePath ) {
			return this.pushStack( hm( this.getPath( relativePath ) ) );
		},

		parent: function() {
			return this.cd( ".." );
		},

		shadow: function() {
			return this.cd( "*" );
		},

		sibling: function( path ) {
			return this.cd( ".." + path );
		},

		main: function() {

			return this.pushStack( hm( getMainPath( this.path ) ) );
		},

		//--------------path methods---------------
		getPath: function( subPath ) {
			//join the context and subPath together, but it is still a logical path
			return mergePath( this.path, subPath );
		},

		//to get the logicalPath of current model, leave subPath empty
		logicalPath: function( subPath ) {
			return toLogicalPath( this.getPath( subPath ) );
		},

		//to get the physicalPath of current model, leave subPath empty
		physicalPath: function( subPath ) {
			return toPhysicalPath( this.getPath( subPath ) );
		},

		pathContext: function() {
			return contextOfPath( this.path );
		},

		pathIndex: function() {
			return indexOfPath( this.path );
		},

		//call the native method of the wrapped value
		invoke: function( methodName /*, p1, p2, ...*/ ) {
			if (arguments.length === 0) {
				throw "methodName is missing";
			}

			var context = this.get();
			return context[methodName].apply( context, slice.call( arguments, 1 ) );
		},

		//region array methods
		indexOf: function( item ) {
			return this.get().indexOf( item );
		},

		contains: function( item ) {
			return (this.indexOf( item ) !== -1);
		},

		first: function( fn ) {
			return fn ? this.filter( fn )[0] : this.get( "0" );
		},

		last: function() {
			var value = this.get();
			return value[value.length - 1];
		},

		push: function( item ) {
			return this.create( this.get().length, item );
		},

		pushRange: function( items ) {
			for (var i = 0; i < items.length; i++) {
				this.push( items[i] );
			}
			return this;
		},

		pushUnique: function( item ) {
			return !this.contains( item ) ?
				this.push( item ) :
				this;
		},

		pop: function() {
			return this.removeAt( this.get().length - 1 );
		},

		shift: function() {
			return this.del( 0 );
		},

		unshift: function( item ) {
			return this.create( 0, item );
		},

		insertAt: function( index, item ) {
			return this.create( index, item );
		},

		updateAt: function( index, item ) {
			return this.update( index, item );
		},

		removeAt: function( index ) {
			return this.del( index );
		},

		move: function( fromIndex, toIndex ) {
			var count = this.count();

			if (fromIndex !== toIndex &&
			    fromIndex >= 0 && fromIndex < count &&
			    toIndex >= 0 && toIndex < count) {

				var item = this.del( fromIndex );
				this.insertAt( toIndex, item );
				trigger( this.path, this.path, "move", toIndex, fromIndex );
			}
			return this;
		},

		replaceItem: function( oldItem, newItem ) {
			if (oldItem == newItem) {
				return this;
			}

			var index = this.indexOf( oldItem );

			if (index != -1) {
				return this.updateAt( index, newItem );
			}
			return this;
		},

		removeItem: function( item ) {
			var index = this.indexOf( item );
			return index !== -1 ? this.removeAt( index ) : this;
		},

		removeItems: function( items ) {
			for (var i = 0; i < items.length; i++) {
				this.removeItem( items[i] );
			}
			return this;
		},

		clear: function() {
			var items = this.get(),
				oldItems = items.splice( 0, items.length );

			trigger( this.path, this.path, "afterCreate", items, oldItems );
			return this;
		},

		count: function() {
			return this.get().length;
		},

		//fn is like function (index, item) { return item == 1; };
		filter: function( fn ) {
			return $( this.get() ).filter( fn ).get();
		},

		each: function( directAccess, fn ) {
			if (!isBoolean( directAccess )) {
				fn = directAccess;
				directAccess = false;
			}

			var hasChange, i, status, items;

			if (directAccess) {

				items = this.get();

				for (i = items.length - 1; i >= 0; i--) {
					//this in the fn refer to the parent array
					status = fn( i, items[i], items );
					if (status === true) {
						hasChange = true;
					} else if (status === false) {
						break;
					}
				}

				if (hasChange) {
					this.triggerChange();
				}

			} else {
				for (i = this.count() - 1; i >= 0; i--) {
					//this in the fn, refer to the parent model
					var itemModel = this.cd( i );
					if (fn.call( itemModel, i, itemModel, this ) === false) {
						break;
					}
				}
			}
			return this;
		},

		map: function( fn ) {
			return $.map( this.get(), fn );
		},

		sort: function( by, asc ) {
			return trigger( this.path, this.path, "afterUpdate", this.get().sortObject( by, asc ) );
		},
		//#endregion

		//-------model link method -----------
		reference: function( /*targetPath1, targetPath2, ..*/ ) {
			for (var i = 0; i < arguments.length; i++) {
				reference( this.path, arguments[i] );
			}
			return this;
		},

		dereference: function( /*targetPath1, targetPath2, ..*/ ) {
			for (var i = 0; i < arguments.length; i++) {
				dereference( this.path, arguments[i] );
			}
			return this;
		},

		//endregion

		//-------other methods---------
		isEmpty: function( subPath ) {
			var value = this.get( subPath );
			return !value ? true :
				!isArray( value ) ? false :
					(value.length === 0);
		},

		isShadow: function() {
			return this.path.startsWith( shadowNamespace );
		},

		toJSON: function( subPath ) {
			return JSON.stringify( this.get( subPath ) );
		},

		compare: function( expression ) {
			if (expression) {
				expression = toTypedValue( expression );
				if (isString( expression )) {
					if (this.get() == expression) {
						return true;
					} else {
						try {
							return eval( "this.get()" + expression );
						} catch (e) {
							return false;
						}
					}
				} else {
					return this.get() == expression;
				}
			} else {
				return this.isEmpty();
			}
		},

		saveLocal: function( subPath ) {
			util.local( this.getPath( subPath ), this.get() );
			return this;
		},

		getLocal: function( subPath ) {
			return util.local( this.getPath( subPath ) );
		},

		restoreLocal: function( subPath ) {
			rootNode.set( this.getPath( subPath ), this.getLocal( subPath ) );
			return this;
		},

		clearLocal: function( subPath ) {
			util.local( this.getPath( subPath ), undefined );
			return this;
		}

	};

	function expandToHashes ( $0 ) {
		return $0 === "." ? "#" : //if it is "." convert to "#"
			Array( $0.length + 2 ).join( "#" ); ////if it is "#" convert to "##"
	}

	var onAddOrUpdateHandlers = [function /*inferNodeDependencies*/ ( context, index, value ) {

		//only try to parse function body
		//if it is a parameter-less function
		//or it has a magic function name "_"
		if (!isFunction( value ) || (value.name && value.name.startsWith( "_" ))) {
			return;
		}

		var functionBody = value.toString(),
			path = context ? context + "." + index : index,
			watchedPaths = inferDependencies( functionBody );

		for (var i = 0; i < watchedPaths.length; i++) {
			reference( path, context ? mergePath( context, watchedPaths[i] ) : watchedPaths[i] );
		}
	}];

	function processNewNode ( contextPath, indexPath, modelValue ) {
		for (var i = 0; i < onAddOrUpdateHandlers.length; i++) {
			onAddOrUpdateHandlers[i]( contextPath, indexPath, modelValue );
		}
	}

	function getMainPath ( shadowPath ) {
		if (shadowPath === shadowNamespace) {
			return "";
		}
		var match = rShadowKey.exec( shadowPath );
		return match ? convertShadowKeyToMainPath( match[1] ) : shadowPath;
	}

	function convertShadowKeyToMainPath ( key ) {
		return key.replace( rHash, reduceToDot );
	}

	function reduceToDot ( hashes ) {
		return hashes == "#" ? "." : // if is # return .
			Array( hashes.length ).join( "#" ); // if it is ## return #
	}

	/* processCurrent is used internally, don't use it */
	function traverseModel ( modelPath, modelValue, processCurrent ) {
		var contextPath,
			indexPath,
			indexOfLastDot = modelPath.lastIndexOf( "." );

		if (isUndefined( processCurrent )) {
			processCurrent = true;
		}

		if (processCurrent) {

			if (indexOfLastDot === -1) {
				contextPath = "";
				indexPath = modelPath;
			} else {
				contextPath = modelPath.substring( 0, indexOfLastDot );
				indexPath = modelPath.substring( indexOfLastDot + 1 );
			}

			processNewNode( contextPath, indexPath, modelValue );
		}

		if (!isPrimitive( modelValue )) {

			for (indexPath in modelValue) {

				//do not remove the hasOwnProperty check!!
				//if (hasOwn.call( modelValue, index )) {
				processNewNode( modelPath, indexPath, modelValue[indexPath] );
				traverseModel( modelPath + "." + indexPath, modelValue[indexPath], false );
				//}
			}
		}
	}

	function reference ( referencingPath, referencedPath ) {
		referencedPath = toPhysicalPath( referencedPath );
		var referencingPaths = referenceTable[referencedPath];
		if (!referencingPaths) {
			referenceTable[referencedPath] = referencingPaths = [];
		}
		referencingPaths.pushUnique( referencingPath );
	}

	function dereference ( referencingPath, referencedPath ) {
		referencedPath = toPhysicalPath( referencedPath );
		var referencingPaths = referenceTable[referencedPath];
		referencingPaths.remove( referencingPath );
		if (!referencingPaths.length) {
			delete referenceTable[referencedPath];
		}
	}

	function inferDependencies ( functionBody ) {
		var memberMatch,
			rtn = [];

		while ((memberMatch = rWatchedPath.exec( functionBody ) )) {
			rtn.pushUnique( memberMatch[2] );
		}
		return rtn;
	}

	function contextOfPath ( path ) {
		var match = rParentKey.exec( path );
		return match && match[1] || "";
	}

	function indexOfPath ( path ) {
		var match = rIndex.exec( path );
		return match[1] || match[0];
	}

	var dummy = {};

	var Class = function _ ( seed ) {
		var temp;

		if (!(this instanceof _)) {
			temp = new _( dummy );
			return _.apply( temp, arguments );
		}

		if (arguments[0] === dummy) {
			return this;
		}

		this.initialize.apply( this, arguments );
		return this;
	};

	var superPrototype;
	extend( Class.prototype, {

		callProto: function( methodName ) {
			var method = this.constructor.prototype[methodName];
			return method.apply( this, slice.call( arguments, 1 ) );
		},

		//instance.callBase("method1", p1, p2,...);
		callBase: function( methodName ) {
			//superPrototype is global object, we use this
			// because assume js in browser is a single threaded

			//starting from "this" instance
			superPrototype = superPrototype || this;
			superPrototype = superPrototype.constructor.__super__;

			if (!superPrototype) {
				return;
			}

			var method = superPrototype[methodName];
			var rtn = method.apply( this, slice.call( arguments, 1 ) );

			//when it done, set it back to null
			superPrototype = null;
			return rtn;
		},

		/* the subType's initialize should be like
		 *
		 initialize: function( seed ) {
		 //do things
		 this.callBase( "initialize", seed );
		 },
		 */
		//the default initialize is to extend the instance with seed data
		initialize: function( seed ) {
			extend( this, seed );
		},

		//this function will be called when JSON.stringify() is called
		toJSON: function() {
			var rtn = extend( true, {}, this );

			for (var key in rtn) {
				if (key.startsWith( "__" )) {
					delete rtn[key];
				}
			}
			return rtn;
		}

	} );

	extend( Class, {

		//create an array of items of the same type
		//if You have a subType called Person
		//you can Person.list([ seed1, seed2 ]);
		//to create an array of typed items
		list: function( seeds ) {

			var i,
				seed,
				rtn = [],
				itemIsObject;

			if (isUndefined( seeds )) {

				return rtn;

			} else if (isArray( seeds )) {

				itemIsObject = seeds.itemIsObject;

				for (i = 0; i < seeds.length; i++) {
					seed = seeds[i];

					rtn.push(
						itemIsObject || !isArray( seed ) ?
							new this( seed ) :
							this.apply( null, seed )
					);
				}
			} else {
				rtn.push( seeds );
			}

			return rtn;
		},

		//to create a new Type call

		extend: function( instanceProperties, staticProperties ) {
			var Child,
				Parent = this;

			// The constructor function for the new subclass is either defined by you
			// (the "constructor" property in your `extend` definition), or defaulted
			// by us to simply call the parent's constructor.
			if (instanceProperties && instanceProperties.hasOwnProperty( "constructor" )) {
				Child = instanceProperties.constructor;
			} else {
				Child = function _ () {
					var temp;

					if (!(this instanceof _)) {
						temp = new _( dummy );
						return _.apply( temp, arguments );
					}

					if (arguments[0] === dummy) {
						return this;
					}
					//this is similar like : base(arguments)
					Parent.apply( this, arguments );
					return this;
				};
			}

			// Add static properties to the constructor function, if supplied.
			extend( Child, Parent, staticProperties );

			// Set the prototype chain to inherit from `parent`, without calling
			// `parent`'s constructor function.
			var Surrogate = function() { this.constructor = Child; };
			Surrogate.prototype = Parent.prototype;
			Child.prototype = new Surrogate();

			// Add prototype properties (instance properties) to the subclass,
			// if supplied.
			if (instanceProperties) {
				extend( Child.prototype, instanceProperties );
			}

			// Set a convenience property in case the parent's prototype is needed
			// later.
			Child.__super__ = Parent.prototype;

			return Child;
		}

	} );

	//helpers
	extend( hm, {

		Class: Class,

		util: util = {

			//user do not need to use createShadowIfNecessary parameter
			//it is for internal use
			//it is only used in two places. It is, when a model is created
			// and when accessor is build,
			// even in these two case when the parameter is true,
			// shadow is not necessary created
			// it is only created when
			// the the physical path is pointing to a shadow
			// and the main model has been created
			// and the shadow's parent is an object
			toPhysicalPath: toPhysicalPath = function( logicalPath, createShadowIfNecessary /* internal use*/ ) {

				var match, rtn = "", leftContext = "", mainValue, shadowKey, mainPath;

				while ((match = rDotStar.exec( logicalPath ))) {
					//reset logical Path to the remaining of the search text
					logicalPath = RegExp.rightContext;
					leftContext = RegExp.leftContext;

					if (match[0] == ".") {

						if (rtn) {
							//mainPath = rtn + "." + leftContext
							if (rtn == shadowNamespace && createShadowIfNecessary && !shadowRoot[leftContext]) {
								mainPath = convertShadowKeyToMainPath( leftContext );
								if (!isUndefined( rootNode.get( mainPath ) )) {
									shadowRoot[leftContext] = {};
								}
								//!isUndefined( rootNode.get( mainPath ) )
								/*	if (createShadowIfNecessary &&
								 !shadowRoot[shadowKey] &&
								 rtn != shadowNamespace &&
								 !isUndefined( mainValue = rootNode.get( mainPath ) )) {
								 */
							}
							rtn = rtn + "." + leftContext;
							//shadowRoot[shadowKey]
							//if (rtn ==)
						} else {
							rtn = leftContext;
						}

					} else {

						//if match is "*", then it is shadow
						//if rtn is not empty so far
						if (rtn) {
							//shadowKey will be
							//convertMainPathToShadowKey
							shadowKey = ( rtn ? rtn.replace( rHashOrDot, expandToHashes ) : rtn) + "#" + leftContext;
							mainPath = rtn + "." + leftContext;
						} else {
							if (leftContext) {
								shadowKey = leftContext;
								mainPath = leftContext;

							} else {

								shadowKey = "";
								mainPath = "";
							}
						}

						rtn = shadowNamespace + (shadowKey ? "." + shadowKey : "");

						//only when main model exists , and host of the object exists
						//then create shadow
						if (createShadowIfNecessary && !shadowRoot[shadowKey] &&
						    rtn != shadowNamespace && !isUndefined( mainValue = rootNode.get( mainPath ) )) {

							shadowRoot[shadowKey] = {};
						}
					}
				}

				return !logicalPath ? rtn :
					rtn ? rtn + "." + logicalPath :
						logicalPath;
			},
			toLogicalPath: toLogicalPath = function( physicalPath ) {

				var index, logicalPath, mainPath, match;

				if (physicalPath === shadowNamespace) {
					return "*";
				}

				match = rShadowKey.exec( physicalPath );
				if (match) {
					// if physical path is like __hm.key.x
					// convert the key path into mainPath
					index = RegExp.rightContext;
					mainPath = convertShadowKeyToMainPath( match[1] );
					logicalPath = mainPath + "*" + index;
					return toLogicalPath( logicalPath );

				} else {

					return physicalPath;
				}

			},

			/*join the context and subPath together, if path is not necessary the same as logical path
			 *convertSubPathToRelativePath by default is true, so that if you specify subPath as "b"
			 * and  context is "a", it will be merged to "a.b" . If explicitly specify
			 * convertSubPathToRelativePath to false, they will not be merged, so the "b" will be
			 * returned as merge path*/
			mergePath: mergePath = function( contextPath, subPath, convertSubPathToRelativePath
			                                 /*used internally*/ ) {

				if (subPath == "_" || contextPath == "_") {
					return "_";
				}

				contextPath = toPhysicalPath( contextPath );

				var match;
				if (!isUndefined( subPath ) && subPath !== null) {
					subPath = subPath + "";
					if (subPath.startsWith( "/" )) {
						return subPath.substr( 1 );
					}
				}
				if (isUndefined( convertSubPathToRelativePath )) {
					convertSubPathToRelativePath = true;
				}

				if (convertSubPathToRelativePath && subPath && contextPath && !rBeginDotOrStar.test( subPath )) {
					subPath = "." + subPath;
				}

				if (!subPath || subPath == ".") {

					return contextPath;

				} else if (!rBeginDotOrStar.test( subPath )) {

					return subPath;

				} else if ((match = rUseParseContextAsContext.exec( subPath ))) {
					//if subPath is like ..xyz or .*xyz
					var stepsToGoUp = 1 + (match[1] ? match[1].length : 0),
						remaining = RegExp.rightContext,
						mergedContext = contextPath;

					while (stepsToGoUp) {
						mergedContext = contextOfPath( mergedContext );
						stepsToGoUp--;
					}

					//use rule's context as context
					//.. or .*
					//$2 is either "." or "*"
					return remaining ?
						(mergedContext ? mergedContext + match[2] + remaining : remaining) :
						(match[2] === "*" ? mergedContext + "*" : mergedContext);

					//if subPath is like .ab or *ab
				} else if ((match = rMainPath.exec( subPath ))) {

					return mergePath( getMainPath( contextPath ), match[1] );

				}
				return contextPath + subPath;
			},

			isUndefined: isUndefined = function( obj ) {
				return (obj === undefined);
			},
			isPrimitive: isPrimitive = function( obj ) {
				return (obj === null ) || (typeof(obj) in primitiveTypes);
			},
			isString: isString = function( val ) {
				return typeof val === "string";
			},
			isObject: isObject = function( val ) {
				return $.type( val ) === "object";
			},
			isBoolean: isBoolean = function( object ) {
				return typeof object === "boolean";
			},
			toTypedValue: toTypedValue = function( stringValue ) {
				if (isString( stringValue )) {
					stringValue = $.trim( stringValue );
					try {
						stringValue = stringValue === "true" ? true :
							stringValue === "false" ? false :
								stringValue === "null" ? null :
									stringValue === "undefined" ? undefined :
										isNumeric( stringValue ) ? parseFloat( stringValue ) :
											//Date.parse( stringValue ) ? new Date( stringValue ) :
											rJSON.test( stringValue ) ? $.parseJSON( stringValue ) :
												stringValue;
					} catch (e) {}
				}
				return stringValue;
			},
			isPromise: isPromise = function( object ) {
				return !!(object && object.promise && object.done && object.fail);
			},
			clearObj: clearObj = function( obj ) {
				if (isPrimitive( obj )) {
					return null;
				}
				for (var key in obj) {
					if (hasOwn.call( obj, key )) {
						obj[key] = clearObj( obj[key] );
					}
				}
				return obj;
			},
			clone: clone = function( original, deepClone ) {
				return isPrimitive( original ) ? original :
					isArray( original ) ? original.slice( 0 ) :
						isFunction( original ) ? original :
							extend( !!deepClone, {}, original );
			},

			local: function( key, value ) {
				if (arguments.length == 1) {
					return JSON.parse( localStorage.getItem( key ) );
				} else {
					if (isUndefined( value )) {
						localStorage.removeItem( key );
					} else {
						localStorage.setItem( key, JSON.stringify( value ) );
					}
				}
			},

			toString: function( value ) {
				return (value === null || value === undefined) ? "" : "" + value;
			},

			encodeHtml: function( str ) {
				var div = document.createElement( 'div' );
				div.appendChild( document.createTextNode( str ) );
				return div.innerHTML;
			},

			_referenceTable: referenceTable

		},

		//this is used to process the new node added to repository
		onAddOrUpdateNode: function( fn ) {
			if (fn) {
				onAddOrUpdateHandlers.push( fn );
				return this;
			} else {
				return onAddOrUpdateHandlers;
			}
		},

		onDeleteNode: function( fn ) {
			if (fn) {
				onDeleteHandlers.push( fn );
				return this;
			} else {
				return onDeleteHandlers;
			}
		},

		//use this for configure options
		options: defaultOptions
	} );

	var onDeleteHandlers = [
		function /*removeModelLinksAndShadows*/ ( physicalPath, removedValue ) {

			var watchedPath,
				mainPath,
				physicalPathOfShadow,
				logicalShadowPath,
				logicalPath = toLogicalPath( physicalPath );

			//remove modelLinks whose publisherPath == physicalPath
			for (watchedPath in referenceTable) {
				dereference( physicalPath, watchedPath );
			}

			//remove modelLinks whose subscriber == physicalPath
			for (watchedPath in referenceTable) {
				if (watchedPath.startsWith( physicalPath )) {
					delete referenceTable[watchedPath];
				}
			}

			//delete shadow objects,
			// which are under the direct shadow of main path
			for (mainPath in shadowRoot) {

				physicalPathOfShadow = shadowNamespace + "." + mainPath;
				logicalShadowPath = toLogicalPath( physicalPathOfShadow );

				if (logicalShadowPath == logicalPath ||
				    logicalShadowPath.startsWith( logicalPath + "*" ) ||
				    logicalShadowPath.startsWith( logicalPath + "." )) {
					rootNode.del( physicalPathOfShadow );
				}
			}
		}
	];

	$( "get,set,del,extend".split( "," ) ).each( function( index, value ) {
		hm[value] = function() {
			return rootNode[value].apply( rootNode, slice.call( arguments ) );
		};
	} );

	rootNode = hm();

	$fn.hmData = function( name, value ) {

		var data = this.data( "hmData" );

		if (arguments.length === 0) {

			return data;

		} else if (arguments.length === 1) {

			return data && data[name];

		} else {
			//arguments.length == 2
			if (isUndefined( data )) {
				this.data( "hmData", data = {} );
			}
			data[name] = value;
		}
	};

	/*	pathsWatching: function() {
	 var key, links, rtn = [], path = this.path;
	 for (key in modelLinks) {
	 links = modelLinks[key];
	 if (links.contains( path )) {
	 rtn.push( key );
	 }
	 }
	 return rtn;
	 },

	 ,*/



//<@depends>repository.js</@depends>



	var workflowStore,
		rSpaces = /[ ]+/,
		rEndWithStarDot = /\*\.$/,
		rDotOrStar = /\.|\*/g,
	//rOriginalEvent = /^(.+?)(\.\d+)?$/,
		subscriptionManager,
		viewId = 0,
		rInit = /init(\d*)/,
		workflowType,
	//the handler string should be like
	// "get set convert finalize initialize"
		activityTypes = "get,set,convert,finalize,initialize".split( "," );

	function returnFalse () {
		return false;
	}

	function returnTrue () {
		return true;
	}

	function Event ( publisher, originalPublisher, eventType, proposed, removed ) {
		this.publisher = tryWrapPublisherSubscriber( publisher );
		this.originalPublisher = tryWrapPublisherSubscriber( originalPublisher );
		this.type = eventType;
		this.originalType = eventType;
		this.proposed = proposed;
		this.removed = removed;
	}

	Event.prototype = {
		constructor: Event,

		/*	isOriginal: function() {
		 return this.publisher.path == this.originalPublisher.path;
		 },

		 isBubbleUp: function() {
		 return (this.publisher.path != this.originalPublisher.path) &&
		 (this.publisher.path.startsWith( this.originalPublisher.path ));
		 },*/
		isDependent: function() {
			return (!this.publisher.path.startsWith( this.originalPublisher.path ));
		},

		stopPropagation: function() {
			this.isPropagationStopped = returnTrue;
		},

		stopImmediatePropagation: function() {
			this.isImmediatePropagationStopped = returnTrue;
			this.isPropagationStopped = returnTrue;
			this.isCascadeStopped = returnTrue;
		},

		stopCascade: function() {
			this.isCascadeStopped = returnTrue;
		},

		error: function() {
			this.hasError = returnTrue;
		},

		isCascadeStopped: returnFalse,
		isPropagationStopped: returnFalse,
		isImmediatePropagationStopped: returnFalse,
		hasError: returnFalse,
		level: 0
	};

	// raise model event,
	trigger = function( path, originalPath, eventType, proposed, removed ) {

		var e = new Event( path, originalPath, eventType, proposed, removed );

		//event can be changed inside the function
		callbackModelSubscriptionHandler( e );

		if (!e.isPropagationStopped() && e.publisher.path) {

			if (e.isDependent()) {
				//if is dependent event, the original event has been
				// bubbled up in its direct hierarchy
				//we need to change the hierarchy by setting the target
				e.originalPublisher.path = e.publisher.path;
			}

			//continue to the same instance of event object
			do {

				e.publisher.path = e.publisher.pathContext();
				e.level++;
				e.type = e.originalType + "." + e.level;
				callbackModelSubscriptionHandler( e );

			} while (!e.isPropagationStopped() && e.publisher.path);
		}

		//restore previous values
		e.type = eventType;
		e.originalPublisher.path = originalPath;
		e.publisher.path = path;
		return e;
	};


	subscriptionManager = (function() {

		var subscriptionStore = [ ];

		//target is either publisher or subscriber
		function canRemoveSubscriptionData ( target, publisher, subscriber ) {
			if (target === publisher || target === subscriber) {
				return true;
			} else {
				//if target is model path
				if (isString( target )) {
					return ( isString( publisher ) && publisher.startsWith( target + "." )) ||
					       ( isString( subscriber ) && subscriber.startsWith( target + "." ));
				} else {
					return false;
				}
			}

		}

		function getSubscriptionsBy ( target, match ) {
			if (isString( target )) {
				target = toPhysicalPath( target );
			}

			var rtn = [];
			for (var i = 0, item; i < subscriptionStore.length; i++) {
				item = subscriptionStore[i];
				if (match( item, target )) {
					rtn.push( item );
				}
			}
			return rtn;
		}

		return {

			//subscriptions whose publisher is the parameter
			//publisher can be a model path or dom element, or object
			getByPublisher: function( publisher ) {
				return getSubscriptionsBy( publisher, function( item, target ) {
					return item.publisher == target;
				} );
			},

			//subscriptions whose subscriber is the parameter
			//subscriber can be a model path or dom element, or object
			getBySubscriber: function( subscriber ) {
				return getSubscriptionsBy( subscriber, function( item, target ) {
					return item.subscriber == target;
				} );
			},

			//object can be a model path or dom element, or object
			getBy: function( subscriberOrPublisher ) {
				return getSubscriptionsBy( subscriberOrPublisher, function match ( item, target ) {
					return item.subscriber == target || item.publisher == target;
				} );
			},

			getAll: function() {
				return subscriptionStore;
			},

			add: function( subscriber, publisher, eventTypes, workflowInstance ) {
				if (isString( publisher )) {

					var events = eventTypes.split( rSpaces );
					for (var i = 0; i < events.length; i++) {
						var special = this.special[events[i]];
						special && special.setup && special.setup( subscriber, publisher );
					}
				}

				subscriptionStore.push( {
					publisher: publisher,
					subscriber: subscriber,
					eventTypes: eventTypes,
					workflow: workflowInstance
				} );
			},

			removeBy: function( subscriberOrPublisher ) {

				var i,
					j,
					special,
					subscription,
					workflowInstance,
					subscriptionsRemoved = [];

				for (i = subscriptionStore.length - 1; i >= 0; i--) {
					subscription = subscriptionStore[i];
					workflowInstance = subscription.workflow;

					if (canRemoveSubscriptionData( subscriberOrPublisher, subscription.publisher, subscription.subscriber )) {

						//if publisher is an view object, need to unbind or undelegate
						//the jQuery event handler
						if (!isString( subscription.publisher )) {
							if (workflowInstance.delegateSelector) {
								$( subscription.publisher ).undelegate( workflowInstance.delegateSelector, subscription.eventTypes, viewHandlerGateway );

							} else {
								$( subscription.publisher ).unbind( subscription.eventTypes, viewHandlerGateway );
							}
						}

						subscriptionsRemoved.push( subscriptionStore.splice( i, 1 )[0] );
					}
				}

				for (i = subscriptionsRemoved.length - 1; i >= 0; i--) {
					subscription = subscriptionsRemoved[i];
					if (isString( subscription.publisher )) {
						var events = subscription.eventTypes.split( rSpaces );
						for (j = 0; j < events.length; j++) {
							special = this.special[events[j]];
							special && special.teardown && special.teardown( subscription.subscriber, subscription.publisher );
						}
					}
				}
			},

			special: {
				/*validityChanged: {
				 setup: function (publisher, subscriber) {},
				 teardown: function (publisher, subscriber) {}
				 }
				 */
			}

		};
	})();

	function getMember ( e ) {

		var workflowInstance = e.workflow,
			propertyName = workflowInstance.getName,
		//getSubProperty is used for properties like css, attr, prop
			subPropertyName = workflowInstance.getParas,
			publisher = e.publisher;

		return subPropertyName ? publisher[propertyName]( subPropertyName ) :
			isFunction( publisher[propertyName] ) ? publisher[propertyName]() :
				publisher[propertyName];
	}

	function setMember ( value, e ) {
		var workflowInstance = e.workflow,
			propertyName = workflowInstance.setName,
		//setSubProperty is used for properties like css, attr, prop
			subPropertyName = workflowInstance.setParas,
			subscriber = this;

		subPropertyName ? subscriber[propertyName]( subPropertyName, value ) :
			isFunction( subscriber[propertyName] ) ? subscriber[propertyName]( value ) :
				subscriber[propertyName] = value;
	}

	extend( hm, {

		//Event: Event,

		trigger: trigger,

		subscription: subscriptionManager,

		//handler can be a function (e) {}
		// a string like "get set convert int"
		//or "*get *set *convert *int"
		//or it can be "*commonHandler"
		//or it can be { get:xx, set:xx, convert:xx, initialize: xx}
		//it can be a javascript object, dom element, but it can not be a jQuery object
		//subscriber can be null, "_", "null" to represent a case where there is not subscriber
		sub: function( subscriber, publisher, eventTypes, workflow, workflowOptions, delegateSelector ) {

			if (subscriber instanceof hm) {
				subscriber = subscriber.path;
			}

			if (publisher instanceof hm) {
				publisher = publisher.path;
			}

			if (isString( subscriber ) && subscriber.startsWith( "$" )) {
				subscriber = $( subscriber.substr( 1 ) );
			}

			if (subscriber && subscriber.jquery) {
				//subscriber is like $()
				//need to convert jQuery object into dom or raw element
				if (!subscriber.length && !subscriber.selector) {
					subscriber = null;
				} else {
					subscriber.each( function( index, element ) {
						//unwrap jQuery element
						hm.sub( element, publisher, eventTypes, workflow, workflowOptions, delegateSelector );
					} );
					return;
				}
			}

			if (isString( publisher ) && publisher.startsWith( "$" )) {
				publisher = $( publisher.substr( 1 ) );
			}

			if (publisher && publisher.jquery) {
				publisher.each( function( index, element ) {
					hm.sub( subscriber, element, eventTypes, workflow, workflowOptions, delegateSelector );
				} );
				return;
			}

			if (!publisher && publisher !== "") {
				throw "publisher can not be null";
			}

			if (!eventTypes) {
				throw "eventTypes can not be null";
			}

			//allow subscriber "", because this is the path of root model
			if (subscriber === "_" || subscriber == "null" || subscriber === null) {
				subscriber = dummy;
			}

			if (workflowOptions === "_") {
				workflowOptions = undefined;
			}

			var isPublisherModel = isString( publisher ),
				isSubscriberModel = isString( subscriber );

			viewIdManager.mark( publisher );
			viewIdManager.mark( subscriber );

			if (isPublisherModel) {
				//subscriber is a model
				publisher = toPhysicalPath( publisher );
			}

			if (isSubscriberModel) {
				//subscriber is a model
				subscriber = toPhysicalPath( subscriber );

			}

			if (isPublisherModel) {

				subscribeModelEvent( publisher, eventTypes, subscriber, workflow, workflowOptions );

			} else {

				subscribeViewEvent( publisher, eventTypes, subscriber, workflow, workflowOptions, delegateSelector );
			}
		},

		handle: function( /* publisher, eventTypes, workflow, workflowOptions, delegateSelector */ ) {
			return this.sub.apply( this, [null].concat( slice.call( arguments ) ) );
		},

		//a workflowPrototype can be a string like "get set convert initialize finalize"
		// or it can be an object
		/*
		 {
		 get: "xx" or function () {},
		 set: "xx" or function () {},
		 convert: "xx" or function () {},
		 initialize: "xx" or function () {},
		 finalize: "xx" or function () {}
		 }
		 */
		workflowType: workflowType = function( name, workflowPrototype ) {

			if (isObject( name )) {
				for (var key in name) {
					workflowStore[key] = buildWorkflowType( name[key] );
				}
				return;
			}

			if (isUndefined( name )) {
				return workflowStore;
			}

			if (isUndefined( workflowPrototype )) {
				return workflowStore[name];
			}

			return (workflowStore[name] = buildWorkflowType( workflowPrototype ));

		},
		//common getter and setter are special activity in they way they are used
		//other activities use the key directly to reference the activities
		// but getters and setters need to use "*key" to reference getters and setters
		// if your getter/setter key does not begin with "*", then it will use the defaultGet
		//or defaultSet, and they key will become the getProperty, and optionally,
		// use options to pass the getProp value, the defaultGet/defaultSet
		// are not meant to be used directly like other common getters or setters
		activity: {

			//initialize( publisher, subscriber, workflowInstance, workflowOptions );
			//inside initialize function, 'this' refer to the window
			initialize: {},

			//value = workflowInstance.get.apply( subscriber, [e].concat( triggerData ) );
			//inside the getter function, 'this' refer to the subscriber
			//get(e)
			get: {
				getMember: getMember,

				//the original get is "get" current
				//because of event bubbling, the default get method for model
				//will not return the value you want, so need to getOriginal
				getOriginal: function( e ) {
					return e.originalPublisher.get();
				},

				skipGet: returnTrue
			},

			//workflowInstance.set.call( subscriber, value, e );
			//inside setter function 'this' refer to the subscriber
			//set(value, e)
			set: {
				setMember: setMember,
				skipSet: $.noop

			},

			//workflowInstance.convert.call( subscriber, value, e );
			//inside converter function 'this' refer to subscriber
			convert: {

				toString: util.toString,

				toTypedValue: util.toTypedValue,

				toNumber: function( value ) {
					return +value;
				},

				toDate: function( value ) {
					return new Date( value );
				}


			},

			//workflowInstance.finalize.call( subscriber, value, e );
			//inside the afterSet function, 'this' refer to the subscriber
			finalize: {
				//				saveLocal: function( value, e ) {
				//					util.local( e.publisher.path, value );
				//				}
			}
		}
	} );

	workflowStore = {

		triggerChange: {
			get: function( e ) {
				rootNode.triggerChange( e.workflow.options );
			}
		},
		saveLocal: {
			get: function( e ) {
				var path = e.publisher.path;
				setTimeout( function() {
					hm( path ).saveLocal();
				}, 1 );
			}
		}
	};

	var viewIdManager = {

		getId: function( elem ) {
			return $( elem ).hmData( "viewId" );
		},

		unMark: function( elem ) {
			$( elem ).hmData( "viewId", undefined );
		},

		mark: function( elem ) {
			if (isObject( elem ) && !$( elem ).hmData( "viewId" )) {
				$( elem ).hmData( "viewId", ++viewId );
			}
		}
	};

	// -------- private ------------- //
	//the reason that we want to buildUniqueViewEventTypes is that
	//when unbind or undelegate the viewEventTypes, we want to the viewEventTypes
	//as unique as possible, check the unsubscribe method
	//
	//input: getUniqueViewEventTypes("click dblClick", viewWithViewId3, "customer")
	//output: "click.__hm.3.customer dblClick.__hm.3.customer"
	//input: getUniqueViewEventTypes("click dblClick", viewWithViewId3, viewWithViewId4)
	//output: "click.__hm.3.4 dblClick.__hm.3.4"
	//it try to append an event name with and ".__hm.viewId.subscriberId"
	function buildUniqueViewEventTypes ( originalEventTypes, publisherView, subscriber ) {

		var publisherViewId = viewIdManager.getId( publisherView );

		/*	if original viewEvents is "click dblClick",
		 and it bind to path "firstName", it will convert to
		 click.__hm.firstName dblClick.__hm.firstName, the reason is that
		 when path is deleted, the method unbind(object) need to unbind
		 event by a namespace, if firstName is deleted, we can unbind ".__hm.firstName"*/
		return $.map(
			originalEventTypes.split( rSpaces ),
			function( originalEventName ) {
				return isString( subscriber ) ?
					originalEventName + "." + shadowNamespace + "." + publisherViewId + "." + subscriber :
					originalEventName + "." + shadowNamespace + "." + publisherViewId + "." + viewIdManager.getId( subscriber );
			}
		).join( " " );
	}

	//if object is dom element or jQuery selector then wrap into jQuery
	//if object is model path, wrap it into model
	//if it is pure object, return as it is
	//if it is _, return null
	function tryWrapPublisherSubscriber ( publisherOrSubscriber ) {
		if (isString( publisherOrSubscriber )) {
			return hm( publisherOrSubscriber );

		} else if (publisherOrSubscriber == dummy) {
			return null;
		}
		else if (isObject( publisherOrSubscriber ) && !publisherOrSubscriber.nodeType) {
			//not a DOM element
			return publisherOrSubscriber;
		} else {
			return $( publisherOrSubscriber );
		}
	}

	function replaceDotOrStar ( match ) {
		//if match is ".", normalize it to "\\."
		//if match is "*", normalize it to ".*"
		return match == "." ? "\\." : ".*";
	}

	//if one of the subscribed events is matched with triggering event
	//return that subscribed event
	function getMatchedSubscribedEvent ( subscribedEvents, triggeringEvent ) {

		var match,
			source,
			rMatchWithTriggeringEvent,
			eventSubscribed,
			isEndWithStarDot,
			i;

		if (subscribedEvents === "*") {
			return "*";
		}

		subscribedEvents = subscribedEvents.split( rSpaces );

		for (i = 0; i < subscribedEvents.length; i++) {

			eventSubscribed = subscribedEvents[i];

			isEndWithStarDot = rEndWithStarDot.test( eventSubscribed );

			source = isEndWithStarDot ?
				//if eventSubscribed is like "*." or "before*.";
				eventSubscribed.replace( rEndWithStarDot, "" ) :
				eventSubscribed;

			source = source.replace( rDotOrStar, replaceDotOrStar );

			source = isEndWithStarDot ? "^" + source : "^" + source + "$";

			rMatchWithTriggeringEvent = new RegExp( source );

			match = rMatchWithTriggeringEvent.test( triggeringEvent );

			if (match) {
				if (isEndWithStarDot) {
					//in other browser, in the following is enough
					//var remaining = RegExp.rightContext;
					//
					//however in IE has a bug that, if rTemp is /^/, RegExp.rightContext return ""
					//while other browser RegExp.rightContext return the remaining
					//see http://jsbin.com/ikakuw/2/edit
					var remaining = source == "^" ? triggeringEvent : RegExp.rightContext;

					//if remaining is empty or remaining does not contains "."
					if (!remaining || !remaining.contains( "." )) {
						return subscribedEvents[i];
					}
				} else {
					return subscribedEvents[i];
				}
			}
		}
	}

	//check if subscription matched with the triggering event,
	// and invoke its workflow, and also cascade the events to
	//horizontally, e is mutable
	function callbackModelSubscriptionHandler ( e ) {

		var subscription,
			referencingNodes,
			cascadeEvent,
			i,
			j,
			subscriptionsByPublisher = e.publisher.subsToMe();

		for (i = 0; i < subscriptionsByPublisher.length; i++) {

			subscription = subscriptionsByPublisher[i];

			e.matchedType = getMatchedSubscribedEvent( subscription.eventTypes, e.type );

			if (e.matchedType) {
				executeWorkflowInstance( tryWrapPublisherSubscriber( subscription.subscriber ), subscription.workflow, e );
			}

			if (e.isImmediatePropagationStopped()) {
				return;
			}
		}

		if (!e.isCascadeStopped()) {

			referencingNodes = referenceTable[e.publisher.path];

			if (referencingNodes) {
				for (j = 0; j < referencingNodes.length; j++) {

					cascadeEvent = trigger(
						referencingNodes[j],
						e.originalPublisher.path,
						e.type
					);

					if (cascadeEvent.isImmediatePropagationStopped() || cascadeEvent.isImmediatePropagationStopped()) {
						return;
					}

					if (cascadeEvent.hasError()) {
						e.error();
					}
				}
			}
		}
	}

	//#debug

	if (location.search.contains( "debug" )) {
		defaultOptions.debug = true;
	}

	function unwrapObject ( object ) {
		if (object) {
			if (!isUndefined( object.path )) {
				return hm.util.toLogicalPath( object.path );
			} else {
				return object[0];
			}
		} else {
			return "null"
		}
	}

	//#end_debug

	function executeWorkflowInstance ( subscriber, workflowInstance, e, triggerData ) {

		//#debug
		if (defaultOptions.debug) {
			log( unwrapObject( e.publisher ),
				e.type,
				unwrapObject( subscriber ),
				workflowInstance,
				unwrapObject( e.originalPublisher )
			);
		}
		//#end_debug

		var value,
			clonedEventArg;

		e.workflow = workflowInstance;
		e.subscriber = subscriber;

		if (!isUndefined( triggerData )) {
			//in the get method "this" refer to the handler
			value = workflowInstance.get.apply( subscriber, [e].concat( triggerData ) );
		} else {
			//in the get method "this" refer to the handler
			value = workflowInstance.get.call( subscriber, e );
		}

		if (isPromise( value )) {
			clonedEventArg = extend( true, {}, e );
			value.done( function( value ) {
				if (workflowInstance.convert) {
					//in the convert method "this" refer to the handler
					value = workflowInstance.convert.call( subscriber, value, e );
				}

				if (!isUndefined( value )) {
					//make sure it is a real promise object
					if (isPromise( value )) {
						value.done( function( value ) {
							setAndFinalize( subscriber, workflowInstance, value, clonedEventArg );
						} );

					} else {
						return setAndFinalize( subscriber, workflowInstance, value, e );
					}
				}
			} );
		} else {
			if (workflowInstance.convert) {
				//in the convert method "this" refer to the handler
				value = workflowInstance.convert.call( subscriber, value, e );
			}

			if (!isUndefined( value )) {
				//make sure it is a real promise object
				if (isPromise( value )) {
					clonedEventArg = extend( true, {}, e );
					value.done( function( value ) {
						setAndFinalize( subscriber, workflowInstance, value, clonedEventArg );
					} );

				} else {
					setAndFinalize( subscriber, workflowInstance, value, e );
				}
			}
		}

	}

	function setAndFinalize ( subscriber, workflowInstance, value, e ) {
		if (!isUndefined( value )) {
			workflowInstance.set && workflowInstance.set.call( subscriber, value, e );
			workflowInstance.finalize && workflowInstance.finalize.call( subscriber, value, e );
		}
	}

	function subscribeModelEvent ( publisherPath, eventTypes, subscriber, handler, options ) {

		var match,
			delayMiniSecond,
			initEvent,
			workflowInstance,
			events;

		events = eventTypes.split( " " );

		for (var i = 0; i < events.length; i++) {
			match = rInit.exec( events[i] );
			if (match) {
				initEvent = events[i];
				delayMiniSecond = +match[1];
				events.splice( i, 1 );
				eventTypes = events.join( " " );
				break;
			}
		}

		workflowInstance = buildWorkflowInstance( handler, publisherPath, subscriber, options );

		if (eventTypes) {
			subscriptionManager.add( subscriber, publisherPath, eventTypes, workflowInstance );
		}

		if (initEvent) {
			var init = function() {
				var e = new Event( publisherPath, publisherPath, initEvent );
				executeWorkflowInstance( tryWrapPublisherSubscriber( subscriber ), workflowInstance, e );
			};

			if (delayMiniSecond) {
				setTimeout( init, delayMiniSecond );
			} else {
				init();
			}
		}
	}

	//subscribe jQuery event
	function subscribeViewEvent ( viewPublisher, eventTypes, subscriber, handler, options, delegateSelector ) {

		//get/set/convert/[init]/[options]
		var needInit,
			eventSeedData,
			workflowInstance,
			temp;

		temp = eventTypes.split( " " );

		if (temp.contains( "init" )) {
			needInit = true;
			eventTypes = temp.remove( "init" ).join( " " );
		}

		workflowInstance = buildWorkflowInstance( handler, viewPublisher, subscriber, options );

		eventSeedData = {
			workflow: workflowInstance,
			subscriber: subscriber
		};

		if (eventTypes) {
			eventTypes = buildUniqueViewEventTypes( eventTypes, viewPublisher, subscriber );

			if (delegateSelector) {
				workflowInstance.delegateSelector = delegateSelector;
				$( viewPublisher ).delegate( delegateSelector, eventTypes, eventSeedData, viewHandlerGateway );

			} else {
				$( viewPublisher ).bind( eventTypes, eventSeedData, viewHandlerGateway );

			}

			//we have passed handler, subscriber, options as jQuery eventSeedData,
			//we still need to add them to subscriptions so that
			//the view event handler can be unbind or undelegate
			subscriptionManager.add( subscriber, viewPublisher, eventTypes, workflowInstance );

			if (needInit) {
				if (delegateSelector) {
					$( viewPublisher ).find( delegateSelector ).trigger( eventTypes );
				} else {
					$( viewPublisher ).trigger( eventTypes );
				}
			}

		} else if (needInit) {

			$( viewPublisher ).one( "init", eventSeedData, viewHandlerGateway );
			$( viewPublisher ).trigger( "init" );

		}
	}

	//the general jQuery event handler
	function viewHandlerGateway ( e ) {

		e.publisher = tryWrapPublisherSubscriber( e.currentTarget );
		e.originalPublisher = tryWrapPublisherSubscriber( e.target );
		var subscriber = tryWrapPublisherSubscriber( e.data.subscriber );

		var workflowInstance = e.data.workflow;
		delete e.data;

		if (arguments.length > 1) {
			executeWorkflowInstance( subscriber, workflowInstance, e, slice.call( arguments, 1 ) );

		} else {
			executeWorkflowInstance( subscriber, workflowInstance, e );
		}
	}

	function buildWorkflowInstance ( workflowPrototype, publisher, subscriber, initializeOptions ) {

		var workflowInstance;

		workflowPrototype = workflowPrototype || "";

		if (isString( workflowPrototype )) {

			workflowInstance = buildWorkflowInstanceFromString( workflowPrototype, publisher, subscriber, initializeOptions );

		} else if (isFunction( workflowPrototype )) {

			workflowInstance = extend( {
					get: workflowPrototype,
					options: initializeOptions
				},
				workflowPrototype
			);

		} else if (isObject( workflowPrototype ) && workflowPrototype.get) {

			workflowInstance = extend( {
				options: initializeOptions
			}, workflowPrototype );

		} else {
			throw "invalid workflow expression";
		}

		initializeWorkflowInstance( workflowInstance, publisher, subscriber, initializeOptions );

		convertStringAccessorToFunction( "get", workflowInstance, publisher, subscriber );
		convertStringAccessorToFunction( "set", workflowInstance, publisher, subscriber );
		//
		convertStringActivityToFunction( workflowInstance, "convert" );
		convertStringActivityToFunction( workflowInstance, "finalize" );

		return workflowInstance;
	}

	// workflowString is like "*workflowType" or "get set convert initialize finalize"
	function buildWorkflowInstanceFromString ( workflowString, publisher, subscriber, initializeOptions ) {

		//get set convert initialize finalize
		var workflowInstance,
			embeddedHandler,
			activityName,
			activityNames = workflowString.split( rSpaces ),
			activityType;

		if (activityNames.length == 1) {

			if (workflowString.startsWith( "*" )) {

				workflowInstance = workflowStore[workflowString.substr( 1 )];
				if (!workflowInstance) {
					throw "common workflow " + workflowString + " does not exist";
				}

				workflowInstance = extend( {}, workflowInstance );

			} else if ((embeddedHandler = tryGetEmbeddedHandler( workflowString, publisher, subscriber ))) {

				if (isFunction( embeddedHandler )) {
					workflowInstance = extend( {
						get: embeddedHandler,
						options: initializeOptions
					}, embeddedHandler );
				} else if (isObject( embeddedHandler ) && embeddedHandler.get) {
					workflowInstance = extend( {
						options: initializeOptions
					}, embeddedHandler );
				} else {
					throw "missing handler";
				}

			} else if (!isUndefined( publisher ) && !isUndefined( subscriber )) {

				workflowInstance = inferWorkflowInstanceFromSingleActivity(
					publisher,
					subscriber,
					workflowString );

			} else {
				//either model is empty or view is empty,
				// and the workflow string is a single
				//key, and the key is not workflow type
				throw "invalid handler";
			}

		} else {
			//this is the case
			//activityNames.length > 1

			workflowInstance = { };

			for (var i = 0; i < activityTypes.length; i++) {
				activityName = activityNames[i];
				activityType = activityTypes[i];

				if (activityName && (activityName !== "_" && activityName != "null")) {
					workflowInstance[activityType] = activityName;
				}
			}
		}
		return workflowInstance;
	}

	//get embedded handler helper by path
	//the path should be a path prefix with "#"
	//that path can be absolute path like "#/a.b"
	//or it can be relative path relative to subscriber model or publisher model
	function tryGetEmbeddedHandler ( path, publisher, subscriber ) {

		if (path.startsWith( "#" )) {

			var modelPath = path.substr( 1 );

			modelPath = isString( subscriber ) ? mergePath( subscriber, modelPath ) :
				isString( publisher ) ? mergePath( publisher, modelPath ) :
					modelPath;

			return rootNode.raw( modelPath );
		}
	}

	function initializeWorkflowInstance ( workflowInstance, publisher, subscriber, workflowOptions ) {

		var initialize = workflowInstance.initialize;

		if (isString( initialize )) {
			if (initialize.startsWith( "*" )) {
				initialize = hm.activity.initialize[initialize.substring( 1 )];
				if (!initialize) {
					throw "initialize activity does not exist!";
				}
			} else {
				var path = initialize;
				if (!rootNode.raw( path )) {
					throw "initialize activity does not exist at path " + path;
				}
				initialize = function( publisher, subscriber, workflowInstance, options ) {
					rootNode.set( path, publisher, subscriber, workflowInstance, options );
				};
			}
		}

		if (initialize) {
			initialize( tryWrapPublisherSubscriber( publisher ), tryWrapPublisherSubscriber( subscriber ), workflowInstance, workflowOptions );
			delete workflowInstance.initialize;
		} else if (!isUndefined( workflowOptions )) {
			workflowInstance.options = workflowOptions;
		}
	}

	function inferWorkflowInstanceFromSingleActivity ( publisher, subscriber, activityName ) {
		//now workflowString does not startsWith *, it is not a workflow type
		//infer handler from publisher and subscriber
		//
		var workflowInstance,
			isPublisherModel = isString( publisher ),
			isSubscriberModel = isString( subscriber );

		if (isPublisherModel) {
			//if publisher is model, then the logic is
			//will get model's value using default get activity,
			//and update the view using workflow or  default "set" activity
			//
			workflowInstance = {

				get: "get",

				//if workflowString is not empty, it is the set method, for example
				//$("#lable").sub(hm("message"), "text");
				//
				//if workflowString is empty,
				// then it should be the case when model subscribe model
				//copy value of one node to an other node
				//hm("message").sub(hm("name"), "afterUpdate");
				set: activityName || "set"


			};

		} else if (isSubscriberModel) {

			// model subscribe view event

			if (activityName) {
				//hm("name").sub($("#textBox", "change");
				workflowInstance = {
					get: activityName,
					set: "set"
				};
			} else {

				//if workflowString is empty
				//when model subscribe view without handler
				//the model is the handler by itself
				//e.g
				//hm("functionNode").subscribe($("button"), "click");
				var temp = rootNode.raw( subscriber );
				if (isFunction( temp )) {

					workflowInstance = {
						get: rootNode.raw( subscriber )
					};

				} else if (isObject( temp ) && temp.get) {

					workflowInstance = temp;

				} else {
					throw "missing handler";
				}
			}

		} else {
			//view subscribe view's event
			//this is rarely the case, but it is still supported
			//for example, a label subscribe the change of another label
			//$("#lable2").sub("#lable1", "text");
			workflowInstance = {
				get: activityName,
				set: activityName
			};
		}

		return workflowInstance;
	}

	function buildWorkflowType ( workflowPrototype ) {

		var workflowInstance;

		if (isString( workflowPrototype )) {

			workflowInstance = buildWorkflowTypeFromString( workflowPrototype );

		} else if (isFunction( workflowPrototype ) || (isObject( workflowPrototype ) && workflowPrototype.get)) {

			workflowInstance = workflowPrototype;
			if (isFunction( workflowPrototype )) {

				workflowInstance = extend(
					{
						get: workflowPrototype
					},
					workflowInstance );
			}

		} else {
			throw "invalid workflow expression";
		}

		convertStringActivityToFunction( workflowInstance, "initialize" );
		//
		convertStringAccessorToFunction( "get", workflowInstance );
		convertStringAccessorToFunction( "set", workflowInstance );
		//
		convertStringActivityToFunction( workflowInstance, "convert" );
		convertStringActivityToFunction( workflowInstance, "finalize" );

		return workflowInstance;
	}

	function buildWorkflowTypeFromString ( workflowString ) {

		var workflowInstance,
			activityName,
			activityNames = workflowString.split( rSpaces ),
			activityType;

		if (activityNames.length > 1) {

			workflowInstance = { };

			for (var i = 0; i < activityTypes.length; i++) {
				activityName = activityNames[i];
				activityType = activityTypes[i];

				if (activityName && (activityName !== "_" && activityName != "null")) {
					workflowInstance[activityType] = activityName;
				}
			}
		} else {
			throw "invalid workflow type";
		}

		return workflowInstance;
	}

	function getActivitySet ( activityType ) {
		return hm.activity[activityType];
	}

	// publisher, subscriber is optional
	function convertStringAccessorToFunction ( accessorType, workflowInstance, publisher, subscriber ) {

		//by default workflow.get == "get", workflow.set = "set"
		var accessorKey = workflowInstance[accessorType];

		if (accessorKey && isString( accessorKey )) {

			var accessors = getActivitySet( accessorType );

			if (accessorKey.startsWith( "*" )) {

				accessorKey = accessorKey.substr( 1 );
				workflowInstance[accessorType] = accessors[accessorKey];

				if (!workflowInstance[accessorType]) {
					throw accessorKey + " does not exists " + accessorType + " Activity";
				}

			} else {

				var keys = accessorKey.split( "*" );

				//use defaultGet or defaultSet and decorate, if accessorKey does not begin with "*"
				// handler.setProperty = accessorKey or
				// handler.getProperty = accessorKey
				workflowInstance[accessorType] = accessorType == "get" ? getMember : setMember;
				workflowInstance[accessorType + "Name"] = keys[0];

				if (keys[1]) {
					//accessorKey = "css*color"
					workflowInstance[accessorType + "Paras"] = keys[1];
				}

				if (!isUndefined( publisher ) && !isUndefined( subscriber )) {
					var publisherOrSubscriber = accessorType == "get" ? publisher : subscriber;
					ensureTargetHasAccessor( accessorType, keys[0], publisherOrSubscriber );
				}
			}
		}
	}

	function ensureTargetHasAccessor ( accessorType, activityName, target ) {
		var missingMember;
		if (isString( target )) {

			if (!hmFn[activityName]) {

				missingMember = true;
			}

		} else {
			if (target.nodeType) {
				if (!$fn[activityName]) {
					missingMember = true;
				}
			} else if (!(activityName in target)) {
				missingMember = true;
			}
		}

		if (missingMember) {
			throw (accessorType == "get" ? "publisher" : "subscriber") +
			      " does not have a member " + activityName;
		}
	}

	//activityType is like initialize, convert, finalize
	function convertStringActivityToFunction ( workflowInstance, activityType ) {
		//because it is optional, we need make sure handler want to have this method
		var activityName = workflowInstance[activityType];
		if (isString( activityName )) {

			if (activityName.startsWith( "*" )) {
				workflowInstance[activityType] = getActivitySet( activityType )[activityName.substr( 1 )];
				if (!workflowInstance[activityType]) {
					throw  activityName + "Activity does not exists";
				}

			} else {
				workflowInstance[activityType] = function() {
					return rootNode.raw( activityName ).apply( this, arguments );
				};
			}
		}
	}

	function unsubscribe ( target ) {
		if (isObject( target )) {
			if (!viewIdManager.getId( target )) {
				return;
			}
			viewIdManager.unMark( target );
		}
		subscriptionManager.removeBy( target );
	}

	hm.onDeleteNode( unsubscribe );

	//subscription shortcut method for model
	extend( hmFn, {

		trigger: function( subPath, eventName, proposed, removed ) {

			if (!arguments.length) {
				throw "missing arguments";
			}

			if (arguments.length <= 3) {
				removed = proposed;
				proposed = eventName;
				eventName = subPath;
				subPath = "";
			}

			var physicalPath = this.physicalPath( subPath );
			trigger( physicalPath, physicalPath, eventName, proposed, removed );
			return this;
		},

		triggerChange: function( subPath ) {
			var physicalPath = this.physicalPath( subPath ),
				value = this.get( subPath );
			trigger( physicalPath, physicalPath, "afterUpdate", value, value );
			return this;
		},

		sub: function( publisher, events, handler, options, delegateSelector ) {
			hm.sub( this.path, publisher, events, handler, options, delegateSelector );
			return this;
		},

		handle: function( eventTypes, workflow, workflowOptions, delegate ) {
			hm.sub( null, this, eventTypes, workflow, workflowOptions, delegate );
			return this;
		},

		subBy: function( subscriber, events, handler, options, delegateSelector ) {
			hm.sub( subscriber, this.path, events, handler, options, delegateSelector );
			return this;
		},

		subsToMe: function() {
			return subscriptionManager.getByPublisher( this.path );
		},

		subsFromMe: function() {
			return subscriptionManager.getBySubscriber( this.path );
		},

		subscriptions: function() {
			return subscriptionManager.getBy( this.path );
		},

		/*
		 map an model event to a new model event based on a condition, like the following

		 hm("inventory").mapEvent(
		 "afterUpdate",
		 "inventoryLow",
		 function (value) {
		 return value <= 100;
		 }
		 );

		 condition is optional, if it is missing, the target event will always be triggered
		 when the source event is triggered
		 */
		mapEvent: function( sourceEvent, targetEvent, condition ) {
			condition = condition || returnTrue;
			hm.handle( this.path, sourceEvent, function( e ) {
				if (condition.call( this, e )) {
					e.publisher.trigger( targetEvent, e.proposed, e.removed );
				}
			} );
			return this;
		},

		cacheable: function( subPath ) {
			hm.handle( this.getPath( subPath ), "init after*", "*saveLocal" );
			return this;
		}

	} );

	//subscription shortcut method for jQuery object
	extend( $fn, {

		sub: function( publisher, events, handler, options, delegate ) {
			if (this.length) {
				hm.sub( this, publisher, events, handler, options, delegate );
			}
			return this;
		},

		handle: function( eventTypes, workflow, workflowOptions, delegate ) {
			if (this.length) {
				hm.sub( null, this, eventTypes, workflow, workflowOptions, delegate );
			}
			return this;
		},

		subBy: function( subscriber, events, handler, options, delegate ) {
			if (this.length) {
				hm.sub( subscriber, this, events, handler, options, delegate );
			}
			return this;
		},

		subsToMe: function() {
			return subscriptionManager.getByPublisher( this[0] );
		},

		subsFromMe: function() {
			return subscriptionManager.getBySubscriber( this[0] );
		},

		subscriptions: function() {
			return subscriptionManager.getBy( this[0] );
		},

		initView: function( path, workflow, options ) {
			hm.sub( this, path, "init", workflow, options );
			return this;
		},

		/*
		 map a view event to a new view event based on a condition, condition is optional,
		 if it is missing, the target event will always be triggered when the source
		 event is triggered

		 usage
		 $("button").mapEvent("click", "update");
		 */
		mapEvent: function( sourceEvent, targetEvent, condition, eventData ) {
			if (condition) {
				if (!isFunction( condition )) {
					eventData = condition;
					condition = returnTrue;
				}
			} else {
				condition = returnTrue;
			}

			return this.handle( sourceEvent, function( e ) {
				if (condition.call( this, e )) {
					e.type = targetEvent;
					e.eventData = eventData;
					e.publisher.trigger( e );
				}
			} );
		}
	} );

	// create a special jQuery event (y) based on an existing jQuery event (x)
	// when event x is raised, and condition returns true, event y will be raised
	//
	// you can subscribe event y, just like any other jQuery event using
	//$("button").bind("y", fn);
	//
	//unlike $().mapEvent("click", "y"), this method create a new event type for all
	//jQuery object
	hm.newViewEvent = function( event, base, condition ) {
		if (isObject( event )) {
			for (var key in event) {
				hm.newViewEvent( key, event[key][0], event[key][1] );
			}
			return this;
		}
		var handler = function( e ) {
			if (condition === true || condition( e )) {
				$( e.target ).trigger( extend( {}, e, {
					type: event,
					currentTarget: e.target
				} ) );
			}
		};

		if ($.event.special[event]) {
			throw "event '" + event + "' has been defined";
		}

		$.event.special[event] = {
			setup: function() {
				$( this ).bind( base, handler );
			},
			teardown: function() {
				$( this ).unbind( base, handler );
			}
		};
		return this;
	};

	var _cleanDataForUnsubscribe = $.cleanData;
	//when an dom element is remove unsubscribe it first
	$.cleanData = function( elems ) {
		$( elems ).each( function() {
			unsubscribe( this );
		} );
		_cleanDataForUnsubscribe( elems );
	};

	util.getUniqueViewEventTypes = buildUniqueViewEventTypes;
	util._viewHandlerGateway = viewHandlerGateway;



//
//<@depends>subscription.js, repository.js</@depends>


	var rSubscriptionProperty = /([!$]?)([\w \+\-\*\.]+?):([\w\W]+?)\s*(?:[;]\s*|$)/g,
		rGroupText = /^([^|]+)(\|(.*))?$/,
		rSubscriptionValueSeparator = /\s*\|\s*/g;

	defaultOptions.subsAttr = "data-sub";
	defaultOptions.autoparseSub = true;

	function mergeOptions ( parentOptions, localOptions ) {
		if (localOptions !== "_") {
			return  (localOptions && localOptions.startsWith( "_" )) ?
				localOptions.substr( 1 ) :
				parentOptions || localOptions;
		}
	}

	function getInheritedNamespace ( elem ) {

		var $parent = $( elem );

		while (($parent = $parent.parent()) && $parent.length) {

			var ns = $parent.hmData( "ns" );

			if (!isUndefined( ns )) {
				return ns;
			}
		}
		return "";
	}

	//support
	//new Group()
	//new Group(groupValue, parentGroup)
	//new Group("$click|*alert;val:path", parentGroup);
	function Group ( subscriptionText, parentGroup, groupNs, groupOptions ) {

		var nsProperty, match, emptyGroup;

		//new Group()
		if (!subscriptionText) {
			//
			//shared property
			this.subscriptions = [];
			return;
		}

		//new Group (elem);
		if (subscriptionText.nodeType) {
			var elem = subscriptionText;
			subscriptionText = $.trim( $( elem ).attr( defaultOptions.subsAttr ) );
			if (subscriptionText) {
				emptyGroup = new Group();
				emptyGroup.elem = elem;
				emptyGroup.ns = getInheritedNamespace( elem );
				return new Group( subscriptionText, emptyGroup );
			}
			return;
		}

		//new Group(subscriptionText);
		if (!parentGroup) {
			emptyGroup = new Group();
			//fake an elem
			emptyGroup.elem = {};
			return new Group( subscriptionText, emptyGroup );
		}

		//new Group(subscriptionText, parentGroup);
		//
		//private data
		this.sub = [];
		this.pub = [];
		this.groups = [];

		while ((match = rSubscriptionProperty.exec( subscriptionText ))) {

			var prefix = match[1],
				key = match[2],
				value = match[3],
				keyValuePair = {
					key: key,
					value: value
				};

			if (prefix) {

				this[prefix == "$" ? "pub" : "sub"].push( keyValuePair );

			} else {

				if (key == "ns") {
					nsProperty = value;

				} else {
					this.groups.push( keyValuePair );
				}
			}
		}

		this.ns = mergePath( mergePath( parentGroup.ns, groupNs ), nsProperty );
		//shared data
		this.text = subscriptionText;
		this.elem = parentGroup.elem;
		this.subscriptions = parentGroup.subscriptions;

		if (parentGroup.elemGroup) {
			this.elemGroup = parentGroup.elemGroup;
		} else {
			this.elemGroup = this;
			$( this.elem ).hmData( "ns", this.ns );
		}

		this.options = mergeOptions( parentGroup.options, groupOptions );

		this.importGroup();
		this.importSubscriptions( "sub" );
		this.importSubscriptions( "pub" );

		this.debug && this.print();

	}

	Group.prototype = {

		importGroup: function() {

			var i,
				groupName,
				referencedGroup,
				group,
				subTextParts,
				groupNs,
				groupOptions,
				groups = this.groups;

			for (i = 0; i < groups.length; i++) {

				group = groups[i];
				groupName = group.key;

				//if value is "path|option1|option2"
				//
				subTextParts = rGroupText.exec( group.value );
				groupNs = subTextParts[1]; // "path"
				groupOptions = subTextParts[3]; //"option1|option2"

				referencedGroup = hm.groups[groupName];

				if (isFunction( referencedGroup )) {

					referencedGroup(
						this.elem,
						mergePath( this.ns, groupNs ),
						this,
						mergeOptions( this.options, groupOptions )
					);

				} else if (isString( referencedGroup )) {

					//recursively import referencedGroup
					new Group( referencedGroup, this, groupNs, groupOptions );

				}
			}
		},

		//subscriptionType is either "pub" or "sub"
		importSubscriptions: function( subscriptionType ) {

			var i,
				subscriptionEntry,
				subscriptionParts,
				publisher,
				eventTypes,
				subscriber,
				subscriptionEntries = this[subscriptionType];

			for (i = 0; i < subscriptionEntries.length; i++) {

				subscriptionEntry = subscriptionEntries[i];
				eventTypes = subscriptionEntry.key;

				subscriptionParts = subscriptionEntry.value.split( rSubscriptionValueSeparator );

				if (subscriptionType == "sub") {

					//path|handler|options|delegate
					publisher = subscriptionParts[0];

					publisher = publisher.startsWith( "$" ) ?
						publisher : //publisher is a view
						mergePath( this.ns, publisher );

					subscriber = this.elem;

				} else {
					//path|handler|options|delegate
					publisher = this.elem;

					subscriber = subscriptionParts[0];
					subscriber = subscriber.startsWith( "$" ) ?
						subscriber : //subscriber is a view
						mergePath( this.ns, subscriber );
				}

				this.appendSub(
					subscriber,
					publisher,
					eventTypes,
					subscriptionParts[1], //handler
					toTypedValue( mergeOptions( this.options, subscriptionParts[2] ) ), //options
					subscriptionParts[3] //delegate
				);
			}

		},

		appendSub: function( subscriber, publisher, eventTypes, handler, options, delegate ) {
			this.subscriptions.push( {
				publisher: publisher,
				eventTypes: eventTypes,
				subscriber: subscriber,
				handler: handler,
				options: options,
				delegate: delegate
			} );
		},

		prependSub: function prependSub ( subscriber, publisher, eventTypes, handler, options, delegate ) {
			this.subscriptions.unshift( {
				publisher: publisher,
				eventTypes: eventTypes,
				subscriber: subscriber,
				handler: handler,
				options: options,
				delegate: delegate
			} );
		},

		clearSubs: function() {
			this.subscriptions.splice( 0, this.subscriptions.length );
		}
	};

	function buildElemGroup ( elem ) {
		var elemGroup, subscriptions, i, subscription, $elem = $( elem );

		if (!$elem.hmData( "parsed" ) && $elem.attr( defaultOptions.subsAttr )) {

			elemGroup = new Group( elem );
			subscriptions = elemGroup.subscriptions;

			elemGroup.preSub && elemGroup.preSub();

			for (i = 0; i < subscriptions.length; i++) {

				subscription = subscriptions[i];
				hm.sub(
					subscription.subscriber,
					subscription.publisher,
					subscription.eventTypes,
					subscription.handler,
					subscription.options,
					subscription.delegate
				);
			}

			elemGroup.postSub && elemGroup.postSub();
			//
			$elem.hmData( "parsed", true );
		}

		$elem.children().each( function() {
			buildElemGroup( this );
		} );
	}

	//delay auto parse to way for some dependencies to resolve asynchronously
	setTimeout( function() {
		$( function() {
			if (defaultOptions.autoparseSub) {
				buildElemGroup( document.documentElement );
			}
		} );
	}, 1 );

	$fn.parseSub = function() {
		return this.each( function() {
			buildElemGroup( this );
		} );
	};

	var logModel = hm( "*log", [] );
	extend( hm, {

		groups: {

			code: function( elem, path, elemGroup, options ) {
				rootNode.get( path, elem, path, elemGroup, options );
			},

			preSub: function( elem, path, elemGroup, options ) {
				elemGroup.preSub = function() {
					rootNode.get( path, elem, path, elemGroup, options );
				};
			},

			postSub: function( elem, path, elemGroup, options ) {
				elemGroup.postSub = function() {
					rootNode.get( path, elem, path, elemGroup, options );
				};
			}
		},

		Group: Group,

		log: function( message, color ) {
			message = color ? "<div style='color:" + color + "'>" + message + "</div> " : message;
			logModel.push( message );
		},

		clearlog: function() {
			logModel.clear();
		}
	} );

//#debug
//
//<@depends>subscription.js, repository.js, declarative.js</@depends>


	Group.prototype.print = function() {
		var subscriptions = this.subscriptions,
			elem = this.elem;

		var message = "<table border='1' cellpadding='6' style='border-collapse: collapse '>" +
		              "<tr><td>element</td><td colspan='6'>" + formatPrint( elem ) + "</td> </tr>" +
		              "<tr><td>ns</td><td colspan='6'>" + formatPrint( this.ns ) + "</td></tr>" +
		              "<tr><td>text</td><td colspan='6'>" + formatPrint( this.text ) + "</td></tr>" +
		              "<tr><td>sub</td><td colspan='6'>" + formatPrint( this.sub ) + "</td></tr>" +
		              "<tr><td>pub</td><td colspan='6'>" + formatPrint( this.pub ) + "</td></tr>" +
		              "<tr><td>groups</td><td colspan='6'>" + formatPrint( this.groups ) + "</td></tr>";

		if (subscriptions.length) {

			message += "<tr>" +
			           "<th></th>" +
			           "<th>subscriber</th>" +
			           "<th>publisher</th>" +
			           "<th>eventTypes</th>" +
			           "<th>handler</th>" +
			           "<th>options</th>" +
			           "<th>delegate</th>" +
			           "</tr>";

			for (var i = 0; i < subscriptions.length; i++) {
				var subscription = subscriptions[i];
				message += "<tr>" +
				           "<td>" + (i + 1) + "</td>" +
				           "<td>" + formatPrint( subscription.subscriber, elem ) + "</td>" +
				           "<td>" + formatPrint( subscription.publisher, elem ) + "</td>" +
				           "<td>" + formatPrint( subscription.eventTypes ) + "</td>" +
				           "<td>" + formatPrint( subscription.handler ) + "</td>" +
				           "<td>" + formatPrint( subscription.options ) + "</td>" +
				           "<td>" + formatPrint( subscription.delegate ) + "</td>" +
				           "</tr>";
			}
		}

		message += "</table>";
		hm.log( message );

	};

	function formatPrint ( obj, elem ) {
		if (!obj) {
			return "";
		} else if (isString( obj )) {
			return obj;
		}
		if (obj === elem) {
			return "element";
		} else if (obj.nodeType) {
			return util.encodeHtml( obj.outerHTML ).substr( 0, 40 ) + "...";
		} else if (isFunction( obj )) {
			return util.encodeHtml( obj + "" ).substr( 0, 40 ) + "...";
		} else {
			return JSON.stringify( obj );
		}
	}

	hm.groups.debug = function( elem, path, group, options ) {
		group.debug = true;
	};

	hm.printGroup = function( elem ) {
		if (isString(elem)) {
			elem = $("<div></div>" ).attr(hm.options.subsAttr, elem)[0];
		} else if (elem.jquery) {
			elem = elem[0];
		}

		(new hm.Group( elem )).print();
	};

//#end_debug//
//<@depends>subscription.js, repository.js, declarative.js</@depends>


	var template,
		templateEngineAdapters = {},
		renderContent = {
			initialize: "*templateOptions",
			get: "get", //extensible
			convert: "*dataToMarkup",
			set: "html", //extensible
			finalize: "*parseSub"
		};

	function newTemplateWorkflow ( getter, setter, finalizer ) {
		return extend( {}, renderContent,
			isObject( getter ) ? getter : {
				get: getter,
				set: setter,
				finalize: finalizer
			} );
	}

	//options can be : templateId,wrapItem,engineName
	//
	//or it can be
	// {
	//  templateId: "xxx",
	//  wrapItem: true,
	//  engineName: "xxx"
	//}
	hm.activity.initialize.templateOptions = function( publisher, subscriber, handler, options ) {
		if (isString( options )) {

			options = options.split( "," );
			handler.templateId = $.trim( options[0] );
			handler.wrapDataInArray = $.trim( options[1] ) == "true";
			handler.engineName = options[2];

		} else if (isObject( options ) && options.templateId) {

			extend( handler, options );

		} else {

			if (!(handler.templateId = subscriber.hmData( "embeddedTemplate" ))) {

				var templateSource = $.trim( subscriber.html() );
				if (templateSource) {
					templateSource = templateSource.replace( rUnescapeTokens, unescapeTokens );
					handler.templateId = "__" + $.uuid++;
					template.compile( handler.templateId, templateSource );
					subscriber.hmData( "embeddedTemplate", handler.templateId );
					subscriber.empty();
				} else {
					throw "missing template";
				}
			}
		}
	};

	var rUnescapeTokens = /&lt;|&gt;/g;
	var unescapeMap = {
		"&lt;": "<",
		"&gt;": ">"
	};

	var unescapeTokens = function( token ) {
		return unescapeMap[token] || "";
	};

	function RenderContext ( e ) {
		this.modelPath = e.publisher.path;
		this.e = e;
	}

	//shortcut to this.e.publisher.get(xxx);
	RenderContext.prototype.get = function() {
		var publisher = this.e.publisher;
		return publisher.get.apply( publisher, slice.call( arguments ) );
	};

	//this converter is used in handlers which can want to convert data
	// to markup, these handler includes foreach, and newTemplateWorkflow
	//which is the core of all templateHandler
	hm.activity.convert.dataToMarkup = function( data, e ) {

		//if dataSource is an array, it has item(s)
		//or dataSource is non-array
		if (data &&
		    (
			    (isArray( data ) && data.length) || !isArray( data )
			    )
			) {

			//if wrapDataInArray is true, wrap data with [], so that it is an item of an array, explicitly
			//some template engine can automatically wrap your data if it is not an array.
			//if you data is already in array, it treat it as an array of items.
			//however, if you want to want to treat your array as item, you need to wrap it by your
			//self, wrapDataInArray is for this purpose

			var workflow = e.workflow,

			//handler.templateId, handler.wrapDataInArray, handler.engineName is
			//built in during initialization , see initializers.templateOptions
				content = renderTemplate(

					workflow.templateId,

					workflow.wrapDataInArray ? [data] : data,

					//this context can be used to access model within the template
					new RenderContext( e ),

					workflow.engineName );

			if (isPromise( content )) {
				return content;
			}
			if (isString( content )) {

				content = $.trim( content );
			}

			//to work around a bug in jQuery
			// http://jsfiddle.net/jgSrn/1/
			return $( $( "<div />" ).html( content )[0].childNodes );
		} else {
			return "";
		}
	};

	//when the template is render, need to recursively import declarative subscriptions
	hm.activity.finalize.parseSub = function( value, e ) {
		$( value ).parseSub();

	};

	//add reusable event handler
	hm.workflowType( {
		renderContent: renderContent,
		renderSelf: newTemplateWorkflow( "get", "replaceWith" )
	} );

	extend( hm.groups, {
		//this is for render everything but just once, after that it will not update itself
		"for": "!init:.|*renderContent",

		//this is for render a single object inside a container
		forSelf: "!init after*.:.|*renderContent",

		//this is for render an array inside of container view
		//data-sub="forChildren:path|templateId"
		forChildren: "!init after*. after*.1:.|*renderContent",

		//this is for render everything, and update view on change of any decedent
		forAll: "!init after*:.|*renderContent",

		//data-sub="renderSelf:path|templateId"
		renderSelf: "!init:.|*renderSelf"
	} );

	//templateOptions is templateId,wrapDataInArray,templateEngineName
	//$("div").renderContent(templateId, path)
	//$("div").renderContent(templateId, path, fn)
	$fn.renderContent = function( templateOptions, modelPath, templateHandlerExtension ) {

		modelPath = modelPath || "";

		if (isFunction( templateHandlerExtension )) {
			templateHandlerExtension = {
				finalize: templateHandlerExtension
			};
		}

		return this.initView(

			modelPath,

			templateHandlerExtension ?
				extend( {}, renderContent, templateHandlerExtension ) :
				"*renderContent",

			templateOptions
		);
	};

	//templateOptions is templateId,wrapDataInArray,templateEngineName
	//$("div").render(path, templateId)
	$fn.renderSelf = function( templateOptions, modelPath, templateHandlerExtension ) {

		if (isFunction( templateHandlerExtension )) {
			templateHandlerExtension = {
				finalize: templateHandlerExtension
			};
		}

		return this.initView(
			modelPath,
			templateHandlerExtension ? extend( {}, hm.workflowType( "renderSelf" ), templateHandlerExtension ) : "*renderSelf",
			templateOptions
		);
	};

	function getTemplateEngine ( engineName ) {
		engineName = engineName || template.defaultEngine;
		if (!engineName) {
			throw "engine name is not specified or default engine name is null";
		}
		var engineAdapter = templateEngineAdapters[engineName];
		if (!engineAdapter) {
			throw "engine '" + engineAdapter + "' can not be found.";
		}
		return engineAdapter;

	}

	function renderTemplate ( templateId, data, renderContext, engineName ) {

		var engineAdapter = getTemplateEngine( engineName, templateId );

		templateId = $.trim( templateId );

		if (engineAdapter.isTemplateLoaded( templateId )) {

			return engineAdapter.render( templateId, data, renderContext );

		} else if (engineAdapter.renderAsync) {

			return engineAdapter.renderAsync( templateId, data, renderContext );

		} else {

			var defer = $.Deferred(),
				cloneEvent = extend( true, {}, renderContext.e ),
				publisher = extend( true, {}, cloneEvent.publisher ),
				clonedContext = extend( true, {}, renderContext );

			cloneEvent.publisher = publisher;
			clonedContext.e = cloneEvent;

			//template.load is implemented in external-template.js
			template.load( templateId ).done( function() {

				var content = engineAdapter.render( templateId, data, clonedContext ),
					rtn = $( content );

				defer.resolve( rtn.selector || !rtn.length ? content : rtn );

			} );

			return defer.promise();

		}
	}

	hm.template = template = {

		defaultEngine: "",

		/*
		 hm.template.myEngine = {
		 render: function( templateId, data, context ) {},
		 compile: function( templateId, source ) {},
		 isTemplateLoaded: function( templateId ) {}
		 };
		 */
		engineAdapter: function( name, engineAdapter ) {
			if (!name) {
				return templateEngineAdapters;
			}
			if (!engineAdapter) {
				return templateEngineAdapters[name];
			}
			engineAdapter.isTemplateLoaded = engineAdapter.isTemplateLoaded || returnTrue;
			templateEngineAdapters[name] = engineAdapter;
			template.defaultEngine = name;
		},

		//dynamically load a template by templateId,
		//it is called by template.render
		//The default implementation required matrix.js
		//but you can override this, all you need
		// is to return is that a promise, when the promise is
		// done, the template should be ready to used
		load: function( templateId ) {
			throw "not implemented";
		},

		//this should be called by hm.template.load after the method
		//get the source of the template
		compile: function( templateId, source, engineName ) {
			return getTemplateEngine( engineName ).compile( templateId, source );
		},

		//build a customized handler which handle the change of model
		//by default
		//getFilter is "get" which is to get model value,
		// it can be a string or function (e) {}
		//
		//setFilter is "html" which is to change the content of the view
		//it can be a string or function (e, value)
		newTemplateWorkflow: newTemplateWorkflow
	};


	if ($.render && $.templates) {

		var engine;


		template.engineAdapter( "jsrender", engine = {

			render: function( templateId, data, context ) {
				if (!$.render[templateId]) {
					this.compile( templateId, document.getElementById( templateId ).innerHTML );
				}
				return $.render[templateId]( data, context );
			},

			compile: function( templateId, source ) {
				$.templates( templateId, {
					markup: source,
					debug: engine.templateDebugMode,
					allowCode: engine.allowCodeInTemplate
				} );
			},

			isTemplateLoaded: function( templateId ) {
				return !!$.render[templateId] || !!document.getElementById( templateId );
			},

			//templateDebugMode is jsRender specific setting
			templateDebugMode: false,

			//allowCodeInTemplate is jsRender specific setting
			allowCodeInTemplate: true
		} );

		var tags = $.views.tags;

		//the following tags a jsrender specific helper
		tags( {
			//#debug
			//{{debugger /}} so that it can stop in template function
			"debugger": function x ( e ) {
				if (x.enabled) {
					debugger;
				}
				return "";
			},
			//#end_debug

			//{{ts /}} so that it can emit a timestamp
			ts: function x () {
				return x.enabled ?
					"<span style='color:red' data-sub='show:/*ts'>updated on:" + (+new Date() + "").substring( 7, 10 ) + "</span>" :
					"";
			},

			//{{indexToNs /}}
			indexToNs: function() {
				var index = this.tagCtx.view.index,
					path = this.ctx.modelPath;

				if (isUndefined( index )) {
					//this is the case when template is render with
					// a single data item instead of array
					index = (this.ctx.e.publisher.count() - 1);
				}

				return "ns:/" + path + "." + index;
			},

			get: function () {
				var publisher = this.ctx.e.publisher;
				return publisher.get.apply( publisher, slice.call( arguments ) );
			},

			prop: function() {
				var index = this.tagCtx.view.index;

				if (isUndefined( index )) {
					//this is the case when template is render with
					// a single data item instead of array
					index = (this.ctx.e.publisher.count() - 1);
				}

				var itemNode = this.ctx.e.publisher.cd( index );
				return itemNode.get.apply( itemNode, slice.call( arguments ) );
			},

			//{{keyToNs /}}
			keyToNs: function() {
				return "ns:/" + this.ctx.modelPath + ".table." + this.ctx.e.publisher.itemKey( this.tagCtx.view.data );
			},

			//{{dataPathAsNs /}}
			dataPathAsNs: function() {
				return "ns:/" + this.ctx.modelPath;
			}

		} );

		tags.ts.render.enabled = true;
		//#debug
		tags["debugger"].render.enabled = true;
		//#end_debug

		hm( "*ts", false );

	}



//


	if (typeof Handlebars != "undefined") {

		hm.template.engineAdapter( "handlebars", {

			render: function( templateId, data, context ) {

				return Handlebars.partials[templateId]( data, {
					data: {renderContext: context}
				} );
			},

			compile: function( templateId, source ) {
				Handlebars.registerPartial( templateId, Handlebars.compile( source ) );
			},

			isTemplateLoaded: function( templateId ) {
				return !!Handlebars.partials[templateId];
			}

		} );

		//{{modelPath}}
		Handlebars.registerHelper( "modelPath", function( options ) {
			return options.data.renderContext.modelPath;
		} );

		//{{indexToNs}}
		Handlebars.registerHelper( "indexToNs", function( options ) {
			return "ns:/" + options.data.renderContext.modelPath + "." + options.data.index + ";";
		} );


		//{{keyToNs}}
		Handlebars.registerHelper( "keyToNs", function( options ) {
			var renderContext = options.data.renderContext;

			var rtn =  "ns:/" + renderContext.modelPath + ".table." +
			       renderContext.e.publisher.itemKey( this );
			return rtn;
		} );

		//{{get "..hardCode" name}}
		Handlebars.registerHelper( "get", function() {
			var args = arguments,
				last = args.length - 1,
			//args[last].data is options.data
				renderContext = args[last].data.renderContext;

			return renderContext.get.apply( renderContext, slice.call( args, 0, last ) );
		} );

		//{{{prop "link"}}}
		Handlebars.registerHelper( "prop", function() {
			var slice = [].slice,
				args = arguments,
				last = args.length - 1,
				options = args[last],
				data = options.data,
				renderContext = data.renderContext,
				itemNode = renderContext.e.publisher.cd( data.index );

			return itemNode.get.apply( itemNode, slice.call( args, 0, last ) );
		} );

		$( function() {
			$( "script[type=handlebars]" ).each( function() {
				Handlebars.registerPartial( this.id, Handlebars.compile( $( this )[0].innerHTML ) );
			} );
		} );

	}



//
//<@depends>subscription.js, repository.js, declarative.js, template.js</@depends>


	function getCheckableControlValue ( $elem ) {
		var elem = $elem[0];
		if (elem.value == "true") {
			return true;
		} else if (elem.value == "false") {
			return false;
		} else if (elem.value !== "on") {
			return elem.value;
		} else {
			return elem.checked;
		}
	}

	//don't change it to because we want to control the search order
	//check findValueAdapter($elem, adapterName)
	//{
	//   name1: adapter1,
	//   name2: adapter2
	//}
	var valueAdapters = [
		{
			//the default view adapter
			name: "textBoxOrDropDown",
			get: function( $elem ) {
				return $elem.val();
			},
			set: function( $elem, value ) {
				if ($elem.val() !== value) {
					$elem.val( value );
				}
			},
			match: returnTrue
		},
		{
			name: "checkbox",
			get: getCheckableControlValue,
			set: function setCheckbox ( $elem, value ) {
				var elem = $elem[0];
				if (isBoolean( value )) {
					elem.checked = value;
				} else {
					elem.checked = (value == elem.value);
				}
			},
			match: function( $elem ) {
				return $elem.is( ":checkbox" );
			}
		},
		{
			name: "radio",
			get: getCheckableControlValue,
			set: function( $elem, value, e ) {
				var elem = $elem[0];
				if (!elem.name) {
					elem.name = e.publisher.path;
				}
				elem.checked = ( util.toString( value ) == elem.value );
			},
			match: function( $elem ) {
				return $elem.is( ":radio" );
			}
		},
		{
			name: "listBox",
			get: function( $elem ) {
				var options = [];
				$elem.children( "option:selected" ).each( function() {
					options.push( this.value );
				} );
				return options;
			},
			set: function( $elem, value ) {

				$elem.children( "option:selected" ).removeAttr( "selected" );

				function fn () {
					if (this.value == itemValue) {
						this.selected = true;
					}
				}

				for (var i = 0, itemValue; i < value.length; i++) {
					itemValue = value[i];
					$elem.children( "option" ).each( fn );
				}
			},
			match: function( $elem ) {
				return $elem.is( "select[multiple]" );
			}
		}
	];

	function findValueAdapter ( $elem, adapterName ) {
		var i, adapter;

		if (adapterName) {
			for (i = valueAdapters.length - 1; i >= 0; i--) {
				adapter = valueAdapters[i];
				if (adapter.name == adapterName) {
					return adapter;
				}
			}
		} else {
			//search from tail to head
			for (i = valueAdapters.length - 1; i >= 0; i--) {
				adapter = valueAdapters[i];
				if (adapter.match && adapter.match( $elem )) {
					return adapter;
				}
			}
		}
	}

	hm.activity.get.getViewValue = function( e ) {
		//e.workflow.getViewValue is initialized when on subscription
		return e.workflow.getViewValue( e.publisher );
	};

	hm.activity.set.setViewValue = function( value, e ) {
		//e.workflow.setViewValue is initialized when on subscription
		return e.workflow.setViewValue( this, value, e );
	};

	function initAdapterMethodForView ( view, workflow, adapterName, methodName ) {

		var adapter = findValueAdapter( view, adapterName );

		if (!adapter || !adapter[methodName]) {

			throw "can not find " + methodName + " method for view";
		}

		workflow[methodName + "ViewValue"] = adapter[methodName];

		if (adapter.convert) {
			workflow.convert = adapter.convert;
		}

		if (!view.hmData( "valueBound" )) {

			adapter.initialize && adapter.initialize( view );

			view.hmData( "valueBound", true );

		}
	}

	hm.workflowType( {

		//set view value with model value
		updateViewValue: {
			initialize: function( publisher, subscriber, workflow, adapterName ) {
				//subscriber is view, trying to getModel setView
				initAdapterMethodForView( subscriber, workflow, adapterName, "set" );

			},
			get: "get",
			set: "*setViewValue"
		},

		//set model value with view value
		updateModelValue: {

			initialize: function( publisher, subscriber, workflow, adapterName ) {
				//publisher is view, trying to getView setModel
				initAdapterMethodForView( publisher, workflow, adapterName, "get" );

			},
			get: "*getViewValue",
			set: "set"
		}
	} );

	//add value adapter
	//the last added using the method, will be evaluated first
	/*
	 //a view adapter is is like
	 {
	 //optional if match function is present
	 name: "adapterName",
	 //
	 //optional if name is present
	 match: function ($elem) { return true; },
	 //
	 //prepare $element
	 initialize: function ($elem) {}
	 //
	 //get a value from element
	 get: function ($elem) {},
	 //
	 //set a value to $element
	 set: function( $elem, value ) {},
	 //
	 //optional, if get function already convert, you don't need this
	 convert: "*commonConvertActivityName" or function (value) {}

	 }
	 * */
	hm.valueAdapter = function( adapter ) {
		if (adapter) {
			valueAdapters.push( adapter );
		} else {
			return valueAdapters;
		}
	};

	//dynamic group
	//support the following
	//
	//val:path
	//val:path|keypress
	//val:path|,updateModel
	//val:path|,updateView
	//val:path|,,date
	//val:path|updateEvent,updateDirection,adapterName
	hm.groups.val = function( elem, path, group, options ) {

		var updateDirection,
			updateEvent,
			adapterName;

		options = options || "";

		if (!options) {
			updateEvent = "change";
		} else {
			options = options.split( "," );
			updateEvent = options[0] || "change"; //by default it is "change"
			updateDirection = options[1]; //undefined, updateView or updateModel
			adapterName = options[2];
		}

		if (!updateDirection || updateDirection == "updateView") {
			group.appendSub( elem, path, "init1 after*", "*updateViewValue", adapterName );
		}

		if (!updateDirection || updateDirection == "updateModel") {

			group.appendSub( path, elem, updateEvent + " resetVal", "*updateModelValue", adapterName );

		}

	};

	hm.groups.resetFormValues = function( elem, path, subscriptions, options ) {

		var $elem = $( elem );

		//this will update the input which use "val" subscription group
		//to update the model with the default value of the input
		function reset () {
			$elem.find( ":input" ).trigger( "resetVal" );
		}

		$elem.bind( "reset", function() {
			//the timeout is necessary,because
			//when the reset event trigger, the default behavior of
			//html that resetting all the value of the input is not done yet
			//so delay the fromReset event
			setTimeout( reset, 1 );
		} );
	};



//
//<@depends>subscription.js, repository.js, declarative.js, template.js</@depends>


	defaultOptions.confirmMessage = "Are you sure?";

	function addGroupAndWorkflowType ( features ) {
		for (var name in features) {
			var item = features[name];
			hm.groups[name] = item[0];
			hm.workflowType( name, item[1] );
		}
	}

	hm.activity.get.compareTruthy = function( e ) {
		var expression = e.workflow.options,
			publisher = e.publisher;
		return isUndefined( expression ) ?
			!publisher.isEmpty() :
			publisher.compare( expression );
	};

	hm.activity.initialize.extractClass = function( publisher, subscriber, workflow, options ) {
		var parts = options.split( "," );
		workflow.className = parts[0];
		workflow.options = parts[1];
	};

	addGroupAndWorkflowType( {

		//--------changing view----------
		options: [
			"!init after*:.|*options",
			//add model workflows
			//render <select> options
			{
				//this is actually the execute function, in this workflow
				//there is no set, the content of the view is render
				//in the get function.
				get: function( e ) {

					var options = e.workflow.options,
						subscriber = this,
						value = subscriber.val();

					subscriber.children( "option[listItem]" )
						.remove().end().append(
						function() {
							var html = "";
							$( e.publisher.get() ).each( function() {
								html += "<option listItem='1' value='" + options.value( this ) + "'>" + options.name( this ) + "</option>";
							} );
							return html;
						} ).val( value );

					if (subscriber.val() !== value) {
						$( subscriber.trigger( "change" ) );
					}
				},

				initialize: function( publisher, subscriber, workflow, options ) {
					if (options) {
						var parts = options.split( "," );
						var textColumn = parts[0];
						var valueColumn = parts[1] || parts[0];

						workflow.options = {
							name: function( item ) {
								return item[textColumn];
							},
							value: function( item ) {
								return item[valueColumn];
							}
						};

					} else {

						workflow.options = {
							name: function( item ) {
								return item.toString();
							},
							value: function( item ) {
								return item.toString();
							}
						};
					}
				}
			}
		],

		show: [

			//data-sub="`show:path"
			"!init after*:.|*show",

			{

				get: "*compareTruthy",

				set: function( truthy ) {

					this[truthy ? "show" : "hide"]();

				}
			}

		],

		hide: [

			"!init after*:.|*hide",

			{
				get: "*compareTruthy",

				//use subscription group instead
				set: function( truthy ) {

					this[ truthy ? "hide" : "show"]();
				}
			}
		],

		enable: [

			"!init after*:.|*enable",

			{
				get: "*compareTruthy",

				set: function( truthy ) {

					this.attr( "disabled", !truthy );
				}
			}
		],

		disable: [

			"!init after*:.|*disable",
			{
				get: "*compareTruthy",

				set: function( truthy ) {
					this.attr( "disabled", truthy );
				}
			}
		],

		addClass: [

			"!init after*:.|*addClass",
			{

				initialize: "*extractClass",

				get: "*compareTruthy",

				set: function( truthy, e ) {

					this[truthy ? "addClass" : "removeClass"]( e.workflow.className );
				}
			}
		],

		removeClass: [

			"!init after*:.|*removeClass", {

				initialize: "*extractClass",

				get: "*compareTruthy",

				set: function( truthy, e ) {

					this[truthy ? "removeClass" : "addClass"]( e.workflow.className );

				}
			}
		],

		toggleClass: [

			"!init after*:.|*toggleClass", {

				get: function( e ) {
					if (e.type == "init") {
						this.addClass( e.publisher.get() );
					} else {
						this.removeClass( e.removed ).addClass( e.proposed );
					}
				}
			}
		],

		//focus:*isEditMode
		//focus on a view if model is not empty
		focus: [
			"!init after*:.|*focus",
			{
				get: "*compareTruthy",

				set: function( truthy, e ) {

					if (truthy) {
						var subscriber = this;
						setTimeout( function() {
							subscriber.focus().select();
						}, 1 );
					}
				}
			}
		],

		count: [

			"!init after*:.|*count",

			function( e ) {
				var value = e.publisher.get(),
					count = ( "length" in value) ? value.length : value;

				this.text( count );
			}
		],

		dump: [

			"!init *:.|*dump",

			function( e ) {
				if (!e.type.startsWith( "before" )) {
					this.html( "<span style='color:red'>" + e.publisher.path + " : " + e.publisher.toJSON() + "</span>" );
				}
			}
		],

		//alert:path //this will alert the data in model
		//alert:_|hello world //this will alert "hello world"
		alert: [

			"$click:.|*alert",

			function( e ) {
				alert( isUndefined( e.workflow.options ) ? this.get() : e.workflow.options );
			}

		],

		preventDefault: [

			"$click:_|*preventDefault",

			function( e ) {
				e.preventDefault();
			}
		],

		stopPropagation: [

			"$click:_|*stopPropagation",

			function( e ) {
				e.stopPropagation();
			}
		],

		//confirm:_
		//confirm:path
		//confirm:_|your message
		confirm: [

			//replacing "$click:.|*confirm", with dynamic group,
			//so that it can be fix the problem caused by mapEvent
			//as long as it is placed before mapEvent subscription group
			function( elem, path, group, options ) {
				hm.sub( path, elem, "click", "*confirm", options );
			},

			function( e ) {

				var message = isUndefined( e.workflow.options ) ?
					this && this.get && this.get() || defaultOptions.confirmMessage :
					e.workflow.options;

				if (!confirm( message )) {
					e.stopImmediatePropagation();
					e.preventDefault && e.preventDefault();
				}
			}
		],

		///------changing model------------
		hardCode: [
			"$click:.|*hardCode",
			{
				initialize: function( publisher, subscriber, workflowInstance, options ) {
					workflowInstance.hardCode = toTypedValue( options );
				},
				get: function( e ) {
					this.set( e.workflow.hardCode );
				}
			}
		],

		"0": [
			"$click:.|*0",
			function( /*e*/ ) {
				this.set( 0 );
			}
		],

		emptyString: [
			"$click:.|*empty",
			function( /*e*/ ) {
				this.set( "" );
			}
		],

		"null": [
			"$click:.|*null",

			function( /*e*/ ) {
				this.set( null );
			}
		],

		"true": [

			"$click:.|*true",

			function( /*e*/ ) {
				this.set( true );
			}
		],

		"++": [
			"$click:.|*++",

			function( /*e*/ ) {
				this.set( this.get() + 1 );
			}
		],

		"--": [
			"$click:.|*--",
			function( /*e*/ ) {
				this.set( this.get() - 1 );
			}
		],

		"false": [
			"$click:.|*false",
			function( /*e*/ ) {
				this.set( false );
			}
		],

		toggle: [

			"$click:.|*toggle",
			function( /*e*/ ) {
				var subscriber = this;
				subscriber.set( !subscriber.get() );
			}
		],

		sortItems: [
			"$click:.|*sortItems",
			{
				initialize: function( publisher, subscriber, workflow, options ) {
					options = (options || "") && options.split( "," );
					workflow.by = options[0];
					//because options[1] default is undefined
					//so asc is by default
					workflow.asc = !!options[1];
				},
				get: function( e ) {
					var workflow = e.workflow;
					this.sort( workflow.by, workflow.asc );
					workflow.asc = !workflow.asc;
				}
			}
		],

		clear: [

			"$click:.|*clear",

			function( /*e*/ ) {
				this.clear();
			}
		],

		del: [
			"$click:.|*del",

			function( /*e*/ ) {
				this.del();
			}
		]
	} );

	extend( hm.groups, {

		caption: function( elem, path, group, options ) {

			$( elem ).prepend( "<option value=''>" + (options || hm.get( path )) + "</option>" );
		},

		autofocus: function( elem ) {
			setTimeout( function() {
				$( elem ).focus();
			}, 1 );
		},

		mapEvent: function( elem, path, subscriptions, options ) {
			options = options.split( "," );
			$( elem ).mapEvent( options[0], options[1], options[2] );

		},

		mapClick: function( elem, path, subscriptions, options ) {
			options = options.split( "," );
			$( elem ).mapEvent( "click", options[0], options[1] );
		},

		logPanel: function( elem, path, group, options ) {

			var $elem = $( elem ),
				$ol = $elem.is( "ol" ) ? $elem : $( "<ol style='font-family: monospace, serif' />" ).appendTo( $elem ),
				ol = $ol[0];

			//		appendSub: function( subscriber, publisher, eventTypes, handler, options, delegate ) {
			group.appendSub( ol, "*log", "init", function( e ) {
				var allLogs = e.publisher.get();
				for (var i = 0; i < allLogs.length; i++) {
					$ol.append( "<li>" + allLogs[i] + "</li>" );
				}
			} );

			group.appendSub( ol, "*log", "afterCreate.1", function( e ) {
				$ol.append( "<li>" + e.originalPublisher.raw() + "</li>" );
			} );

			group.appendSub( ol, "*log", "afterCreate", function( e ) {
				$ol.empty();
			} );
		},

		clearlog: "clear:/*log",

		//data-sub="enableLater:path"
		enableLater: "!after*:.|*enable",

		//data-sub="disableLater:path"
		disableLater: "!after*:.|*disable",

		//data-sub="html:path"
		html: "!init after*:.|get html *toString",

		//data-sub="text:path"
		text: "!init after*:.|get text *toString"

	} );

	hm.newViewEvent( {

		enter: ["keyup", function( e ) {
			return (e.keyCode === 13);
		}],

		esc: ["keyup", function( e ) {
			return (e.keyCode === 27);
		}],

		ctrlclick: ["click", function( e ) {
			return e.ctrlKey;
		}]
	} );





})( jQuery, window );

