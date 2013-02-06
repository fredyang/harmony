/**
 * ajaxMock v0.1 - A mock for jQuery AJAX
 *
 * http://semanticsworks.com
 *
 * Copyright (c) 2011 Fred Yang
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * or GPL (GPL-LICENSE.txt) licenses.
 */
(function( $ ) {

	var enableMock = true,
		mockValueMappers = [],

		tryGetMockValue = function( url, params, ajaxOriginalOptions ) {
			for (var i = 0; i < mockValueMappers.length; i++) {
				var r = mockValueMappers[i]( url, params, ajaxOriginalOptions );
				if (r) {
					return r;
				}
			}
		};

	$.ajaxMock = {

		mockValueMappers: mockValueMappers,

		on: function() {
			enableMock = true;
		},

		off: function() {
			enableMock = false;
		},

		//support setup(predicateFunction, resultFunction)
		//predicateFunction is function (url, params) { }
		//resultFunction is function (params) { }
		setup: function( predicate, morkValue ) {

			var mapper;

			if (arguments.length === 1) {
				mapper = predicate
			} else {
				mapper = function( url, params, ajaxOriginalOptions ) {

					if (predicate( url, params, ajaxOriginalOptions )) {

						return {
							value: $.isFunction( morkValue ) ?
								morkValue( params, ajaxOriginalOptions ) :
								morkValue
						};
					}
				};
			}

			mockValueMappers.push( mapper );
			return this;
		},

		returnValueForAjaxCall: function( result ) {

			//put it the head, so that it will always evaluate first
			mockValueMappers.unshift( function( url, params ) {
				//remove itself immediately,
				// so that it will not be evaluated again
				mockValueMappers.shift();
				return $.isFunction( result ) ?
					result( params ) :
					result;
			} );
		},

		reset: function() {
			mockValueMappers = [];
		},

		//url can be regular expression or static string
		//result can be a fix object value or a function like function (params) {}
		url: function( predefinedUrl, morkValue ) {

			var predicate;

			if (predefinedUrl instanceof RegExp) {

				predicate = function( userUrl ) {
					return predefinedUrl.test( userUrl );
				};

			} else {
				predicate = function( url ) {
					return predefinedUrl === url;
				};
			}

			return this.setup( predicate, morkValue );
		}

		//expose it for testing the setup mock, otherwise it can be closured
		//tryGetMockValue: tryGetMockValue
	};

	function pass (data) { return data;}

	$.ajaxSetup( {
		//extract responses.mock
		converters: {
			"mock json": pass,
			"mock html": pass,
			"mock xml": $.parseXML,
			"mock text" : pass
		}
	} )

	//prefilter is used modified ajaxMergedOptions
	$.ajaxPrefilter( function /*applyMockToAjax*/ ( ajaxMergedOptions, ajaxOriginalOptions, jqXhr ) {
		if (enableMock) {
			//debugger;
			if (ajaxOriginalOptions.dataType == "json" && typeof ajaxOriginalOptions.data == "string") {
				try {
					ajaxOriginalOptions.data = JSON.parse( ajaxOriginalOptions.data );
				}
				catch (e) {}
			}

			var r = tryGetMockValue( ajaxOriginalOptions.url, ajaxOriginalOptions.data, ajaxOriginalOptions );
			if (r) {
				ajaxMergedOptions.mockValue = r;
			}
		}
	} );

	//put it to the head of transport builder list for data type "*" using "+" sign
	//otherwise it will not be evaluated
	$.ajaxTransport( "+*", function /*createMockTransport*/ ( mergedOptions, originalOptions, jqXhr ) {
			if (enableMock && mergedOptions.mockValue !== undefined) {
				//if mark value is defined, hi-jack the ajax call to return a
				//fake transport
				//debugger;
				return {
					send: function( headers, transportDone ) {
						//instead of sending a request to xhr
						//shortcut to return the result immediately

						transportDone( "200", "OK",
							//fake a responses object
							{
								//mock is the data type, which will be used in converters
								mock: mergedOptions.mockValue.value
							} )
						;
					},
					abort: function() {}
				};
			}
		}
	);

}( jQuery ));
