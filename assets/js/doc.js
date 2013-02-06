var _gaq = [
	['_setAccount', 'UA-34311489-2'],
	['_trackPageview']
];
(function( d, t ) {
	var g = d.createElement( t ), s = d.getElementsByTagName( t )[0];
	g.src = ('https:' == location.protocol ? '//ssl' : '//www') + '.google-analytics.com/ga.js';
	s.parentNode.insertBefore( g, s )
}( document, 'script' ));

if (!matrix.baseUrl) {
	matrix.baseUrl = "../assets/";
}

matrix.hash( 1 );

matrix( true,
	"prettify/prettify.css," +
	"prettify/prettify.js"
);

hm.groups.preview = function( elem, path, subscriptions, options ) {

	if (!options) {
		return;
	}

	var urlView = options,
		urlEdit, text;

	if (options.indexOf( "jsbin.com" ) !== -1) {
		urlEdit = urlView + "/edit?live,javascript,html";
		text = "Preview and edit code";
	} else {
		urlEdit = urlView;
		text = "Preview";
	}

	$( elem )
		.wrap( "<div class='preview'></div>" )
		.parent()
		.append( "<a class='preview' title='click to edit code' target='_blank' href='" + urlEdit + "'>" +
	             text +
	             "</a>" +
	             "<iframe class='preview' src='" + urlView +
	             "' />" );
};

$( function() {
	var url = location.href;

	$( ".leftCol nav a" ).each( function() {
		if (this.href == url) {
			$( this ).addClass( "selected" );
			return false;
		}
	} );
} );

hm.groups.prettyprint = function( elem, path, subscriptions, options ) {
	//debugger;
	$( elem ).html( prettyPrintOne( $( elem ).html() ) ).addClass( "code" );
};