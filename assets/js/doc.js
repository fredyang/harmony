var _gaq = _gaq || [];
_gaq.push( ['_setAccount', 'UA-38317100-1'] );
_gaq.push( ['_setDomainName', 'semanticsworks.com'] );
_gaq.push( ['_trackPageview'] );

(function() {
	var ga = document.createElement( 'script' );
	ga.type = 'text/javascript';
	ga.async = true;
	ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
	(document.getElementsByTagName( 'head' )[0] || document.getElementsByTagName( 'body' )[0]).appendChild( ga );
})();


if (!matrix.baseUrl) {
	matrix.baseUrl = "../assets/";
}

matrix.hash( 16 );

matrix( true,
	"prettify/prettify.css," +
	"prettify/prettify.js"
);

hm.groups.preview = function( elem, path, elemGroup, options ) {

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

hm.groups.prettyprint = function( elem, path, elemGroup, options ) {
	$( elem ).html( prettyPrintOne( $( elem ).html() ) ).addClass( "code" );
};

hm.groups.linkOut = function( elem, path, elemGroup, options ) {
	$( elem ).find( "a" ).attr( "target", "_blank" );
};


hm.groups.plusone = function( elem, path, elemGroup, options ) {
	gapi.plusone.render(elem, {"size": "standard"});
};
