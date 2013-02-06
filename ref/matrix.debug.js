/*!
 * matrix.js JavaScript Library v0.31pre
 * © Fred Yang - http://semanticsworks.com
 * License: MIT (http://www.opensource.org/licenses/mit-license.php)
 *
 * Date: Sat Feb 2 23:14:37 2013 -0500
 */
jQuery.Deferred && (function( $, undefined ) {

	var urlStore = {},
		promiseStore = {},
		dependencyStore = {},
		loaderDefinitionStore = {},
		loaderStore = {},
		dummyLink = document.createElement( "a" ),
		rComma = /,/,
		rSpace = /\s+/g,
		slice = [].slice,
		rQuery = /\?/,
		rFileExt = /\.(\w+)$/,
		rFileName = /(.+)\.\w+$/,
		fileExtsion,
		fileName,
		loaderCommands,
		loadFilters,
		require,
	//match "http://domain.com" , "/jkj"
		rAbsoluteUrl = /^http[s]?:\/\/|^\//,
		rUrl = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/,
		ajaxLocParts = rUrl.exec( location.href.toLowerCase() ) || [],
		hashValue = "",
		hashKey = "v",
		rHash,
		loadCallbacks = [],
		failCallbacks = [],
		unloadCallbacks = [],
		arrayPrototype = Array.prototype,
		loaderFinders,
		loaderMapper = {},
	//for parallel loading
	// matrix([holdReady,] moduleIdString, loadByOrder)
	//
	//for serial loading and mixed serial/parallel loading strategy
	// matrix([holdReady,] moduleIdArray)
		matrix = window.matrix = function( holdReady, moduleIds, loadByOrder ) {
			var rtnPromise;
			if (typeof holdReady !== "boolean") {
				//by default it is false
				loadByOrder = moduleIds;
				moduleIds = holdReady;
				holdReady = false;
			}
			if (!moduleIds) {
				return;
			}

			holdReady = holdReady && !$.isReady;

			rtnPromise = loadModule( moduleIds, loadByOrder );

			if (holdReady) {

				$.holdReady( true );

				rtnPromise.done( function() {
					$.holdReady();
					//same as the following
					//$.holdReady( false );
					//$.ready( true );
				} );
			}

			return rtnPromise.done( invokeLoadCallbacks ).fail( invokeFailCallbacks );
		};

	arrayPrototype.indexOf = arrayPrototype.indexOf || function( obj, start ) {
		for (var i = (start || 0); i < this.length; i++) {
			if (this[i] == obj) {
				return i;
			}
		}
		return -1;
	};

	arrayPrototype.contains = arrayPrototype.contains || function( item ) {
		return (this.indexOf( item ) !== -1);
	};

	arrayPrototype.remove = arrayPrototype.remove || function( item ) {
		var position = this.indexOf( item );
		if (position != -1) {
			this.splice( position, 1 );
		}
		return this;
	};

	arrayPrototype.pushUnique = arrayPrototype.pushUnique || function( item ) {
		if (!this.contains( item )) {
			this.push( item );
		}
		return this;
	};

	arrayPrototype.merge = arrayPrototype.merge || function( items ) {
		if (items && items.length) {
			for (var i = 0; i < items.length; i++) {
				this.pushUnique( items[i] );
			}
		}
		return this;
	};

	function invokeCallbacks ( callbacks ) {
		return function() {
			var args = slice.call( arguments );
			for (var i = 0; i < callbacks.length; i++) {
				callbacks[i].apply( this, args );
			}
		};
	}

	var invokeFailCallbacks = invokeCallbacks( failCallbacks ),
		invokeLoadCallbacks = invokeCallbacks( loadCallbacks ),
		invokeUnloadCallbacks = invokeCallbacks( unloadCallbacks );

	function loadModule ( moduleIds, loadByOrder ) {

		if (typeof moduleIds === "string") {

			if (loadByOrder) {
				var i = 1,
					keys = splitByComma( moduleIds );

				//create dependency in order
				while (i < keys.length) {
					require( keys[i], keys[i - 1] );
					i++;
				}
				moduleIds = keys[keys.length - 1];
			}

			return loadModuleInParallel( moduleIds );

		} else if ($.isArray( moduleIds )) {

			//if it is moduleIdArray, load one after previous is fully loaded
			return loadModuleInSerial( moduleIds );

		}
		throw "resource parameter should be an array or string";
	}

	//resourceString is like "a.js, b.css, c.tmpl"
	function loadModuleInParallel ( moduleIdString ) {
		var promises = [],
			rtnPromise,
			resourceArray = splitByComma( moduleIdString );

		if (resourceArray.length === 1) {
			rtnPromise = loadIndependentModule( resourceArray[0] );
		}
		else {
			for (var i = 0; i < resourceArray.length; i++) {
				promises.push( loadIndependentModule( resourceArray[i] ) );
			}
			rtnPromise = $.when.apply( $, promises );
		}

		return augmentPromise( rtnPromise ).fail( function() {
			matrix.unload( moduleIdString );
		} );
	}

	//resources can be "a.js, b.css, c.tmpl"
	//it can be ["a.js", "b.css", "c.tmpl"]
	//or ["a.js,b.css", ["c.tmpl", "d.tmpl"], "e.css"] and so on
	//it serial load the top level resource unit, within each resource unit, use smart
	//loader matrix
	function loadModuleInSerial ( moduleIdArray ) {
		var rtnPromise,
			i,
			toReleaseResource = [],
			currentResourceStringOrArray,
			sharedState = {
				ok: true
			};

		for (i = 0; i < moduleIdArray.length; i++) {
			currentResourceStringOrArray = moduleIdArray[i];
			toReleaseResource.push( currentResourceStringOrArray );

			if (i === 0) {

				rtnPromise = loadModule( currentResourceStringOrArray )
					.fail( makeReleaseFn( currentResourceStringOrArray, sharedState ) );

			} else {

				rtnPromise = rtnPromise.nextLoad( currentResourceStringOrArray )
					.fail( makeReleaseFn( toReleaseResource.slice(), sharedState ) );
			}
		}

		return augmentPromise( rtnPromise );
	}

	function makeReleaseFn ( resourceStringOrArray, sharedState ) {
		return function() {
			if (sharedState.ok) {
				matrix.unload( resourceStringOrArray );
				sharedState.ok = false;
			}
		};
	}

	function loadIndependentModule ( moduleId ) {
		var loader = findLoader( moduleId );
		if (loader) {

			return loadIndependentModuleWithLoader( moduleId, loader );

		} else {

			//#debug
			matrix.debug.log( "try to load missing loader " + fileExtsion( moduleId ) + ".loader" );
			//#end_debug

			return matrix( fileExtsion( moduleId ) + ".loader" ).nextLoad( moduleId );
		}
	}

	function loadIndependentModuleWithLoader ( moduleId, loader ) {

		//#debug
		matrix.debug.log( "try to load " + moduleId + " @ " + matrix.url( moduleId ) );
		//#end_debug

		var promise = accessPromise( moduleId );

		if (!promise) {

			//#debug
			matrix.debug.log( "  loading " + moduleId + " @ " + matrix.url( moduleId ) );
			//#end_debug

			promise = loader.load( moduleId );
			if (!promise || !promise.done) {
				//if it is not a promise
				promise = $.Deferred().resolve( moduleId, promise ).promise();
			}

			if (!loader.noRefCount) {
				//add the promise to cache,
				//in the future, it can be retrieved by accessPromise(moduleId)
				accessPromise( moduleId, promise );
			}
		}
		//#debug
		else {
			matrix.debug.log( "  found loaded module " + moduleId + " @ " + matrix.url( moduleId ) );
		}
		//#end_debug

		//preload module will never be counted for reference
		//as we don't want that to be unloaded
		if (promise.refCount !== "staticLoaded") {
			promise.refCount = promise.refCount ? promise.refCount + 1 : 1;
		}
		return promise;
	}

	function accessPromise ( moduleId, promise ) {
		if (moduleId === undefined) {
			return promiseStore;
		} else {
			if (promise === undefined) {
				if (arguments.length === 1) {
					return promiseStore[moduleId];
				} else {
					delete promiseStore[moduleId];
				}
			} else {
				return (promiseStore[moduleId] = promise);
			}
		}
	}

	//add a promise.nextLoad method dynamically, so that it can
	//be used load other module when current promise finished
	//the nextLoad method is a smartLoad method, use the same way in which
	//you call matrix
	function augmentPromise ( promise ) {
		var nextDefer = $.Deferred();

		//nextLoad method load after the current currentPromise is done
		promise.nextLoad = function( moduleId ) {
			var nextLoadArguments = slice.call( arguments );
			promise.then(
				function() {
					matrix.apply( null, nextLoadArguments ).then(
						function() {
							nextDefer.resolve.apply( nextDefer, slice.call( arguments ) );
						},
						function() {
							nextDefer.reject( moduleId );
						} );
				},
				function() {
					nextDefer.reject( moduleId );
				} );

			return augmentPromise( nextDefer.promise() );
		};

		promise.andLoad = function() {
			var currentPromise = matrix.apply( null, arguments );
			return augmentPromise( $.when( currentPromise, promise ) );
		};

		return promise;
	}

	function splitByComma ( text ) {
		return text.replace( rSpace, "" ).split( rComma );
	}

	function isCrossDomain ( url ) {
		var parts = rUrl.exec( url.toLowerCase() );
		return !!( parts &&
		           ( parts[ 1 ] != ajaxLocParts[ 1 ] || parts[ 2 ] != ajaxLocParts[ 2 ] ||
		             ( parts[ 3 ] || ( parts[ 1 ] === "http:" ? 80 : 443 ) ) !=
		             ( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? 80 : 443 ) ) )
			);
	}

	function fullUrl ( urlRelativeToBaseUrl ) {

		dummyLink.href = rAbsoluteUrl.test( urlRelativeToBaseUrl ) ? urlRelativeToBaseUrl :
			matrix.baseUrl + urlRelativeToBaseUrl;

		return isCrossDomain( urlRelativeToBaseUrl ) ? dummyLink.href : addHash( dummyLink.href );
	}

	function convertPipelineToLoadFunction ( pipeline ) {

		for (var key in pipeline) {
			attachFilter( pipeline, key );
		}

		var staticLoaded = pipeline.staticLoaded || loadFilters.staticLoaded.returnFalse,
			getSource = pipeline.getSource || loadFilters.getSource.getTextByAjax,
			compile = pipeline.compile || loadFilters.compile.globalEval,
			crossSiteLoad = pipeline.crossSiteLoad || loadFilters.crossSiteLoad.getScript,
			buildDependencies = pipeline.buildDependencies || loadFilters.buildDependencies.parseRequireTag,
			buildUnload = pipeline.buildUnload || loadFilters.buildUnload.parseUnloadTag;

		if (!compile && !crossSiteLoad) {
			throw "module loader must implement at least one of compile, crossSiteLoad";
		}

		return function( moduleId ) {
			var defer = $.Deferred(),
				promise = defer.promise(),
				url;

			if (staticLoaded( moduleId )) {

				//#debug
				matrix.debug.log( "    bypass staticLoadeded module " + moduleId + " @ " + matrix.url( moduleId ) );
				//#end_debug
				promise.refCount = "staticLoaded";
				defer.resolve( moduleId );

			} else {
				url = matrix.url( moduleId );
				if (!compile || isCrossDomain( url )) {

					if (!crossSiteLoad) {
						throw "loader does not support cross domain loading";
					}
					//#debug
					matrix.debug.log( "    cross-site fetch " + moduleId + " @ " + url );
					//#end_debug
					var crossSiteLoadPromise = crossSiteLoad( moduleId );
					if (crossSiteLoadPromise && crossSiteLoadPromise.done) {
						//crossSiteLoad need to load depedencies as well
						return crossSiteLoadPromise;
					} else {
						defer.resolve( moduleId, crossSiteLoadPromise );
					}

				} else {

					//#debug
					matrix.debug.log( "    local fetch " + moduleId + " @ " + url );
					//#end_debug

					getSource( moduleId ).then(
						function( sourceCode ) {

							//#debug
							matrix.debug.log( "      parsing content of " + moduleId );
							//#end_debug

							if (buildUnload) {

								//#debug
								matrix.debug.log( "        buildUnload for " + moduleId );
								//#end_debug

								var unload = buildUnload( sourceCode, moduleId );

								if (unload) {
									//#debug
									matrix.debug.log( "          unload created for " + moduleId );
									//#end_debug

									accessPromise( moduleId ).unload = unload;
								}

							}

							if (buildDependencies) {

								//#debug
								matrix.debug.log( "        buildDependencies for " + moduleId );
								//#end_debug

								var embeddedDependencies = buildDependencies( moduleId, sourceCode );
								if (embeddedDependencies) {
									//#debug
									matrix.debug.log( "          dependencies found for " + moduleId + ":" + embeddedDependencies );
									//#end_debug
									require( moduleId, embeddedDependencies );
								}
							}

							var runcompile = function() {

								//#debug
								matrix.debug.log( "      compiling " + moduleId + " @ " + url );
								//#end_debug

								var result = compile && compile( moduleId, sourceCode );
								//delay defer.resolve a for while to wait for the compile result
								//to take effect, if compile is $.globalEval
								setTimeout( function() {
									if (!defer.dontResolve) {
										defer.resolve( moduleId, result );
										delete promise.defer;
									}
								}, 5 );
							};

							var dependencies = require( moduleId );

							//load dependencies because it combines static dependentModuleString
							//and dynamic dependentModuleString
							if (dependencies) {
								matrix( dependencies ).then( runcompile, function() {
									defer.reject( moduleId );
									delete promise.defer;
								} );
							} else {
								runcompile();
							}

						},
						function() {
							defer.reject( moduleId );
							delete promise.defer;
						}
					);
				}
				if (!isResolved( defer )) {
					promise.defer = defer;
				}
			}
			return promise;
		};
	}

	var isResolved = $.Deferred().isResolved ? function( promise ) {
		return promise.isResolved();
	} : function( promise ) {
		return promise.state() == "resolved";
	};

	function addHash ( url ) {
		url = removeHash( url );
		return hashValue ?
			url + ( rQuery.test( url ) ? "&" : "?" ) + hashKey + "=" + hashValue :
			url;
	}

	function removeHash ( url ) {
		if (hashValue === "") {
			return url;
		} else {
			return url.replace( rHash, "" );
		}
	}

	$.extend( matrix, {

		//unload(loadCallback) or unload(unloadCallback, remove=true)
		//unload(moduleIdString)
		//unload(moduleIdArray)
		unload: function( moduleIds, remove ) {
			var i,
				moduleId,
				dependencies,
				promise;

			if ($.isFunction( moduleIds )) {
				if (remove) {
					unloadCallbacks.remove( moduleIds );
				} else {
					unloadCallbacks.push( moduleIds );
				}

			} else {

				if (typeof moduleIds === "string") {
					moduleIds = splitByComma( moduleIds );
				}

				//if there is only one module
				if (moduleIds.length != 1) {

					for (i = 0; i < moduleIds.length; i++) {
						matrix.unload( moduleIds[i] );
					}

				} else {

					//unload serveral modules
					moduleId = moduleIds[0];
					promise = accessPromise( moduleId );

					//make sure it will not throw exception when
					// unloading some module which is not in page
					if (promise && promise.refCount != "staticLoaded") {

						if (--promise.refCount === 0 || remove) {
							var unload = promise.unload || findLoader( moduleId ).unload;

							if (unload) {
								//#debug
								matrix.debug.log( "unloading " + moduleId + " @ " + matrix.url( moduleId ) );
								//#end_debug
								unload( moduleId );
							}

							//delete the promises associated with the module
							accessPromise( moduleId, undefined );
							dependencies = require( moduleId );
							if (dependencies) {
								matrix.unload( dependencies, remove );
							}
						}
						invokeUnloadCallbacks();
					}
				}
			}
		},

		//register a url for module key
		//or get the url of module key
		url: function( moduleId, url ) {
			if (typeof moduleId === "object") {
				for (var k in moduleId) {
					matrix.url( k, moduleId[k] );
				}
				return;
			}

			//if resource's url is not in cache
			//and user is trying to get it
			if (url === undefined) {

				if (arguments.length == 1) {

					if (urlStore[moduleId]) {
						return urlStore[moduleId];
					}

					var loader = findLoader( moduleId );

					if (loader && loader.url) {
						//because it by pass the following, loader.url function should resolve
						//the resulted url relative to the location.href
						//return addVersionHash( loader.url( moduleId ) );
						return fullUrl( loader.url( moduleId ) );

					}

					// register it first, then return the result
					// the default strategy of url resolving is use matrix.baseUrl + moduleId
					return fullUrl( loader && loader.fileExt ?
						fileName( moduleId ) + "." + loader.fileExt :
						moduleId );

				} else {

					//allow access(key, undefined)
					//to delete the key from storage
					delete urlStore[moduleId];
				}

			} else {
				//user explicit register an url
				var oldUrl = matrix.url( moduleId );
				var newUrl = fullUrl( url );

				if (oldUrl != newUrl) {
					var oldPromise = accessPromise( moduleId );
					if (oldPromise && isResolved( oldPromise )) {
						reload( moduleId, function() {
							urlStore[moduleId] = newUrl;
						} );
					} else {
						urlStore[moduleId] = newUrl;
					}
				}
			}
		},

		// members to configure matrix

		//add dependency to a resource key
		//or get the depeendency of a resource key
		//user can set dependentResourceString manually , which is called static
		//dependentResourceString
		// or can use loader.depend method to return dependentResourceString which is called
		//dynamic dependentResourceString,
		//or we can combind them together
		require: require = function( moduleId, dependencies ) {

			if (typeof moduleId === "object") {
				for (var key in moduleId) {
					if (moduleId.hasOwnProperty( key )) {
						require( key, moduleId[key] );
					}
				}
				return;
			}

			if (dependencies === undefined) {
				//get dependencies
				if (arguments.length == 1) {
					var staticDepencencies = dependencyStore[moduleId];
					var loader = findLoader( moduleId );

					if (loader && loader.require) {
						var dynamicDependencies = loader.require( moduleId );
						if (dynamicDependencies && staticDepencencies) {
							return dynamicDependencies + "," + staticDepencencies;
						} else if (dynamicDependencies) {
							return dynamicDependencies;
						} else {
							return staticDepencencies;
						}
					} else {
						return staticDepencencies;
					}

				} else {
					//delete dependencies
					delete dependencyStore[moduleId];
				}

			} else if (dependencies === true) {
				//for debugging purpuse matrix.depend(moduleId, true)
				var moduleIds = require( moduleId );
				moduleIds = moduleIds && splitByComma( moduleIds );
				if (moduleIds) {
					var rtn = [];
					for (var i = 0; i < moduleIds.length; i++) {
						if (matrix.fileExt( moduleIds[i] ) !== "module") {
							rtn.pushUnique( matrix.url( moduleIds[i] ) );
						}
						rtn.merge( require( moduleIds[i], true ) );
					}
					return rtn;
				}

			} else {
				var newStaticDependencies = getNewStaticDependencies( moduleId, dependencies );
				var oldStaticDependencies = dependencyStore[moduleId];

				if (isDependencisDifferent( newStaticDependencies, oldStaticDependencies )) {

					var oldPromise = accessPromise( moduleId );
					if (oldStaticDependencies && oldPromise && isResolved( oldPromise )) {
						reload( moduleId, function() {
							dependencyStore[moduleId] = newStaticDependencies;
						} );
					} else {
						dependencyStore[moduleId] = newStaticDependencies;
					}
				}
			}
		},

		//the url relative to the current window location, for example "js/"
		//the suffix "/" is important
		//it is used to calculate the real relative url of resource key
		baseUrl: "",

		//matrix.hash(true) --> set a timestamp as hash ?v=2347483748
		//matrix.hash(1,x) --> ?x=1
		//matrix.hash(1) --> ?v=1
		hash: function( value, key ) {
			if (arguments.length) {
				hashValue = value === true ? $.now() : value;
				hashKey = key !== undefined ? key : (hashKey || "v");
				rHash = new RegExp( "[?&]" + hashKey + "=[^&]*" );
			}
			return hashValue === "" ? "" : hashKey + "=" + hashValue;
		},

		//loader name can by the type of a set of resource, such js, tmpl, css
		//or it can be the name of resource itself such as xxx.js
		loader: {
			//create a load function
			resolveDependencies: function( actionAfterDependenciesResolved ) {
				return function( moduleId ) {
					var defer = $.Deferred(),
						dependentResourceString = matrix.require( moduleId );

					if (dependentResourceString) {
						matrix( dependentResourceString ).done( function() {
							defer.resolve( moduleId, actionAfterDependenciesResolved( moduleId ) );
						} );
					} else {
						defer.resolve( moduleId, actionAfterDependenciesResolved( moduleId ) );
					}
					return defer.promise();
				};
			},

			//create a loader
			//matrix.set(loaderName, loaderDefinition);
			//matrix.set(loaderName, baseloaderName, loaderDefinition);
			set: function( loaderName, baseloaderName, loaderDefinition ) {

				if (typeof baseloaderName !== "string") {
					loaderDefinition = baseloaderName;
					baseloaderName = null;
				}
				loaderDefinition = loaderDefinitionStore[loaderName] = $.extend(
					true,
					{},
					loaderDefinitionStore[baseloaderName],
					loaderDefinition );

				var loader = $.extend( true, {}, loaderDefinition );

				$.each( "load,unload,url,require".split( "," ), function() {
					attachCommand( loader, this );
				} );

				if ($.isPlainObject( loader.load )) {
					//it is a pipeline, but not a function
					loader.load = convertPipelineToLoadFunction( loader.load );
				}

				if (!$.isFunction( loader.load )) {
					throw "missing load function from loader";
				}

				loaderStore[loaderName] = $.extend( {}, loaderStore[baseloaderName], loader );
			},

			get: function( loaderName ) {
				return loaderName ? loaderDefinitionStore[loaderName] : loaderDefinitionStore;
			},

			commands: loaderCommands = {
				//
				load: {
					//name: function (moduleId) {
					// return a promise object, but make sure to defer.resolve(moduleId, optionalResultValue);
					//or
					// return optionalResultValue
					// }
				},
				unload: {
					//name: function (moduleId) {}
				},
				url: {
					//name: function (moduleId) {
					//  return a url
					// }
				},
				require: {
					//name: function (moduleId) {
					// return a moduleIdString or moduleIdArray
					// return "a.html, b.js"
					// }
				}
			},

			//strategies to find the name of the loader based on moduleId
			//the basic strategy is use the extension as the loader name
			//however you can add your own strategis
			finders: loaderFinders = [
				//find loader by by file extensions directly
				function( moduleId ) {
					return fileExtsion( moduleId );
				},
				//find loader by by file extensions using mapper
				function( moduleId ) {
					var extension = fileExtsion( moduleId );
					var mappedType = loaderMapper[extension];
					if (mappedType) {
						return mappedType;
					}
				}
			],
			//if you want to load a file "*.jpg", which should be loaded
			//with "*.img" loader you should specify matrix.loader.mapFiles("img", "jpg");
			mapFileExtsToLoader: function( fileExtensions, loaderName ) {
				fileExtensions = splitByComma( fileExtensions );
				for (var i = 0; i < fileExtensions.length; i++) {
					loaderMapper[fileExtensions[i]] = loaderName;
				}
			},

			loadFilters: loadFilters = {
				staticLoaded: {
					//name: function (moduleId) {
					//
					//}
				},
				getSource: {

				},
				compile: {
					//name: function( url, sourceCode, moduleId ) {
					//
					//}
				},
				crossSiteLoad: {
					//name: function( url, moduleId ) {
					//}
				},
				buildUnload: {
					//name: function( sourceCode, moduleId ) {
					//  return new Function (sourceCode);
					//}
				},
				buildDependencies: {
					//name: buildDependencies: function( sourceCode, moduleId ) {
					//return "x.js, b.html, c.css";
					//}
				}
			}
		},

		// public utilities

		//if moduleId is xyz.task
		//then resourceType is "task"
		fileExt: fileExtsion = function( moduleId ) {
			return rFileExt.exec( moduleId )[1];
		},

		//if resource key is "a.b.c", then resource name is "a.b"
		fileName: fileName = function( moduleId ) {
			return rFileName.exec( moduleId )[1];
		},

		//define a module
		//dependencies is optional
		//load is the code of the module
		define: function( moduleId, dependencies, load, unload ) {

			if ($.isFunction( dependencies )) {
				unload = load;
				load = dependencies;
				dependencies = null;
			}

			var promise = accessPromise( moduleId );
			if (!promise) {
				//this is the case when matrix.provide is call in a static loaded js
				var defer = $.Deferred();
				promise = defer.promise();
				promise.defer = defer;
				accessPromise( moduleId, promise );
			}

			//introduce dontReoslve flag telling the consumer don't resolve it
			//as it will be taken care inside importCode,
			promise.defer.dontResolve = true;

			if (dependencies) {
				require( moduleId, dependencies );
				return matrix( dependencies ).done(
					function() {
						defineModule( moduleId, load, unload );
					}
				);
			} else {
				defineModule( moduleId, load, unload );
			}
		},

		done: function( fn, remove ) {
			if (remove) {
				loadCallbacks.remove( fn );
			} else {
				loadCallbacks.push( fn );
			}
		},

		fail: function( fn, remove ) {
			if (remove) {
				failCallbacks.remove( fn );
			} else {
				failCallbacks.push( fn );
			}
		},

		defaultLoader: "js"
	} );

	function reload ( moduleId, change ) {

		var oldPromiseCache = $.extend( true, {}, promiseStore );
		matrix.unload( moduleId, true );
		change && change();
		return matrix( moduleId ).done( function() {
			for (var key in oldPromiseCache) {
				if (promiseStore[key] && oldPromiseCache[key]) {
					promiseStore[key].refCount = oldPromiseCache[key].refCount;
					promiseStore[key].url = oldPromiseCache[key].url;
					promiseStore[key].moduleId = oldPromiseCache[key].moduleId;
				}
			}
		} );
	}

	function getNewStaticDependencies ( moduleId, dependencieToSet ) {
		var rtn,
			loader = findLoader( moduleId ),
			dynamicDependencies = loader && loader.require && loader.require( moduleId );

		if (dynamicDependencies) {
			rtn = [];
			dynamicDependencies = splitByComma( dynamicDependencies );
			dependencieToSet = splitByComma( dependencieToSet );
			for (var i = 0; i < dependencieToSet.length; i++) {
				if (!dynamicDependencies.contains( dependencieToSet[i] )) {
					rtn.push( dependencieToSet[i] );
				}
			}
			return rtn.length ? rtn.join() : null;
		} else {
			return dependencieToSet;
		}
	}

	function isDependencisDifferent ( dependencies1, dependencies2 ) {
		if ((dependencies1 && !dependencies2) ||
		    dependencies2 && !dependencies1) {
			return true;
		} else if (!dependencies1 && !dependencies2) {
			return false;
		}

		dependencies1 = splitByComma( dependencies1 ).sort();
		dependencies2 = splitByComma( dependencies2 ).sort();
		if (dependencies1.length != dependencies2.length) {
			return true;
		}

		for (var i = 0; i < dependencies1.length; i++) {
			if (dependencies1[i] != dependencies2[i]) {
				return true;
			}
		}

		return false;
	}

	function findLoader ( moduleId ) {
		var loaderName, i;
		for (i = loaderFinders.length - 1; i >= 0; i--) {
			loaderName = loaderFinders[i]( moduleId );
			if (loaderName) {
				break;
			}
		}
		loaderName = loaderName || matrix.defaultLoader;
		return loaderStore[loaderName];
	}

	//unload is optional
	//you can specify unload method in the code function
	//like matrix.unload(moduleId, fn);
	function defineModule ( moduleId, load, unload ) {
		var promise = accessPromise( moduleId ),
			defer = promise.defer;
		delete promise.defer;
		promise.unload = unload;
		defer && defer.resolve( moduleId, load() );
	}

	function attachCommand ( loader, commandName ) {
		var value;
		if (typeof loader[commandName] == "string" &&
		    (value = loaderCommands[commandName][loader[commandName]])) {
			loader[commandName] = value;
		}
	}

	function attachFilter ( filters, filterName ) {
		if (typeof filters[filterName] == "string") {
			filters[filterName] = loadFilters[filterName][filters[filterName]];
		}
	}

//	(function() {
//
//		//by convention when we embed matrix.js, we can add additional attribute
//		//to assist matrix.js to do initialization
//		//<script src="/matrix.js" data-main="main.js" data-hash="1234" data-baseUrl="/matrix/"></script>
//		var mainjsUrl,
//			baseUrl,
//			parts,
//			hash,
//			$script = $( "script[data-main],script[data-hash],script[data-baseUrl]" ).first();
//
//		if ($script.length) {
//			hash = $script.attr( "data-hash" );
//
//			if (hash) {
//				parts = hash.split( "," );
//				matrix.hash( parts[0] == "true" ? true : parts[0], parts[1] );
//			}
//
//			baseUrl = $script.attr( "data-baseUrl" );
//
//			if (baseUrl) {
//				matrix.baseUrl = baseUrl;
//			}
//
//			mainjsUrl = $script.attr( "data-main" );
//			if (mainjsUrl) {
//				setTimeout( function() {
//					matrix( true, mainjsUrl );
//				}, 0 );
//			}
//		}
//	})();

	//#debug
	matrix.debug = {
		fullUrl: fullUrl,
		urlStore: urlStore,
		promiseStore: promiseStore,
		loaderStore: loaderStore,
		findLoader: findLoader,
		addHash: addHash,
		removeHash: removeHash,
		log: function( msg ) {
			var console = window.console;
			console && console.log && console.log( msg );
		},

		//this is for debugging purpose only
		moduleCounters: accessPromise,

		getLoaderByName: function( loaderName ) {
			return loaderName ? loaderStore[loaderName] : loaderStore;
		}
	};
	//#end_debug

	//#debug
})( jQuery );
//#end_debug
//the following defined four built-in adapters( js0, js, cs0, css, module, adapter )
//
//#debug
(function( $ ) {
	//#end_debug

	//#debug
	var loaderCommands = matrix.loader.commands;
	var loadFilters = matrix.loader.loadFilters;
	var findLoader = matrix.debug.findLoader;
	var fullUrl = matrix.debug.fullUrl;
	var removeHash = matrix.debug.removeHash;
	//#end_debug

	var addLoader = matrix.loader.set,

		//if yo have code like the following in javascript,
		//the part delete window.depend2 will be extracted
		/* <@unload>
		 delete window.depend2;
		 </@unload>
		 */
		runloadStatement = /<@unload>([\w\W]+?)<\/@unload>/i,

		//match string "ref2, ref1" in
		/* <@require>
		 ref2, ref1
		 <@require>
		 */
		rDependHeader = /<@require>([\w\W]+?)<\/@require>/i;

	$.extend( true, loaderCommands, {
		load: {
			cacheImage: function( moduleId ) {
				var defer = $.Deferred(),
					promise = defer.promise(),
					url = matrix.url( moduleId );

				var img = new Image();
				img = new Image();
				img.onload = function() {
					defer.resolve( moduleId, url );
				};
				img.onerror = function() {
					defer.reject( moduleId, url );
				};
				img.src = url;
				return promise;
			}

		},
		unload: {
			removeCssLinkTag: function( moduleId ) {
				var url = fullUrl( matrix.url( moduleId ) );
				$( "link" ).filter(
					function() {
						return this.href === url && $( this ).attr( 'loadedByMatrix' );
					} ).remove();
			}
		},
		url: {
			moduleId: function( moduleId ) {
				return moduleId;
			},
			//this url expect module is put into its folder under baseUrl
			//for example, your module is view.loader, tmpl.loader, you expect
			//this module is under baseUrl/loader folder, with the file name
			//view.js and tmpl.js, as the fileExt of the loader is "js"
			folder: function( moduleId ) {
				var fileExt = findLoader( moduleId ).fileExt;

				var fileName = fileExt ? matrix.fileName( moduleId ) + "." + fileExt :
					moduleId;

				return matrix.fileExt( moduleId ) + "/" + fileName;
			}
		}
	} );

	function linkCss ( moduleId ) {
		$( "<link href='" + matrix.url( moduleId ) + "' " + "rel='stylesheet' type='text/css' loadedByMatrix='1' />" ).appendTo( "head" );
	}

	$.extend( true, loadFilters, {

		staticLoaded: {
			returnFalse: function() {
				return false;
			},

			hasScriptTag: function( moduleId ) {
				return !!($( "script" ).filter(
					function() {
						return removeHash( this.src ) === removeHash( matrix.url( moduleId ) );
					} ).length);
			},

			hasCssLinkTag: function( moduleId ) {
				return !!($( "link" ).filter(
					function() {
						return removeHash( this.href ) === removeHash( matrix.url( moduleId ) ) &&
						       !$( this ).attr( 'loadedByMatrix' );
					} ).length);
			}
		},

		getSource: {
			//this is default getSource method
			getTextByAjax: function( moduleId ) {
				return $.ajax( {
					url: matrix.url( moduleId ),
					dataType: "text",
					cache: true
				} );
			}
		},

		compile: {
			globalEval: function( moduleId, sourceCode ) {
				return $.globalEval( sourceCode );
			},
			localEval: function( moduleId, sourceCode ) {
				return eval( sourceCode );
			},
			linkCss: linkCss
		},

		crossSiteLoad: {
			//can not use $.getScript directly, as matrix.resolve
			getScript: function( moduleId ) {
				var defer = $.Deferred(),
					promise = defer.promise();

				promise.defer = defer;

				$.getScript( matrix.url( moduleId ) ).then(
					function() {
						setTimeout( function() {
							if (!defer.dontResolve) {
								defer.resolve( moduleId );
								delete promise.defer;
							}
						}, 5 );
					},
					function() {
						defer.reject( moduleId );
						delete promise.defer;
					} );

				return promise;
			},

			linkCss: linkCss
		},
		buildUnload: {
			parseUnloadTag: function( sourceCode ) {
				var unloadStatements = runloadStatement.exec( sourceCode );
				return unloadStatements &&
				       unloadStatements[1] &&
				       new Function( unloadStatements[1] );
			}
		},
		buildDependencies: {
			parseRequireTag: function( moduleId, sourceCode ) {
				var require = rDependHeader.exec( sourceCode );
				return (require && require[1] ) || null;
			}
		}
	} );

	//a special module which is a package of modules, like a container
	addLoader( "pack", {
		load: matrix.loader.resolveDependencies( $.noop ),
		url: "moduleId"
	} );

	//js adapter try to parse the content of js file
	addLoader( "js", {
		load: {
			//the following are by default
			staticLoaded: "hasScriptTag"
			//crossSiteLoad: "getScript",
			//getSource: "getTextByAjax",
			//compile: "globalEval",
			//buildDependencies: "parseRequireTag",
			//buildUnload: "parseUnloadTag"
		},
		//this is necessary because if you have a sub loader inherite from
		//from this, and you don't want to inherited sub loader to specify this again
		fileExt: "js"
	} );

	addLoader( "loader", "js", {
		url: "folder"
	} );

	//css adapter tries to parse the content of css file
	addLoader( "css", {
		load: {
			staticLoaded: "hasCssLinkTag",
			crossSiteLoad: "linkCss",
			compile: "linkCss",
			buildDependencies: "parseRequireTag"
		},
		unload: "removeCssLinkTag",
		fileExt: "css"
	} );

	addLoader( "image", {
		load: "cacheImage",
		noRefCount: true
	} );

	//make img linker can handle module with these file extension
	matrix.loader.mapFileExtsToLoader( "jpg,png,bmp,gif", "image" );
	//fred test

})( jQuery );
