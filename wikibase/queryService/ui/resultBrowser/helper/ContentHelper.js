var wikibase = wikibase || {};
wikibase.queryService = wikibase.queryService || {};
wikibase.queryService.ui = wikibase.queryService.ui || {};
wikibase.queryService.ui.resultBrowser = wikibase.queryService.ui.resultBrowser || {};
wikibase.queryService.ui.resultBrowser.helper = wikibase.queryService.ui.resultBrowser.helper || {};
window.mediaWiki = window.mediaWiki || {};

wikibase.queryService.ui.resultBrowser.helper.ContentHelper = ( function( $, mw ) {
	"use strict";

	var EXPLORE_URL = 'http://www.wikidata.org/entity/Q';
	var COMMONS_FILE_PATH = "http://commons.wikimedia.org/wiki/special:filepath/";

	/**
	 * Formatting helper provides methods useful for formatting results
	 *
	 * @class wikibase.queryService.ui.resultBrowser.helper.ContentHelper
	 * @license GNU GPL v2+
	 *
	 * @author Jonas Kress
	 * @constructor
	 */
	function SELF() {
	}

	/**
	 * Checks whether given URL is available for explorer
	 * @param {string} url
	 * @returns {boolean}
	 */
	SELF.prototype.isExploreUrl = function ( url ) {
		return url.match( EXPLORE_URL + '(.+)' );
	};

	/**
	 * Creates an explore button
	 * @returns {jQuery}
	 */
	SELF.prototype.createExploreButton = function ( url ) {
		return $( '<a href="' + url + '" title="Explore item" class="explore glyphicon glyphicon-search" aria-hidden="true">' );
	};


	/**
	 * Checks whether given url is commons resource URL
	 * @param {string} url
	 * @returns {boolean}
	 */
	SELF.prototype.isCommonsResource = function ( url ) {
		return url.toLowerCase().startsWith( COMMONS_FILE_PATH.toLowerCase() );
	};

	/**
	 * Returns the file name of a commons resource URL
	 * @param {string} url
	 * @returns {string}
	 */
	SELF.prototype.getCommonsResourceFileName = function ( url ) {
		var regExp = new RegExp( COMMONS_FILE_PATH, 'ig' );

		return url.replace( regExp, '' );
	};

	/**
	 * Creates a thumbnail URL from given commons resource URL
	 * @param {string} url
	 * @param {number} width
	 * @returns
	 */
	SELF.prototype.getCommonsResourceFileNameThumbnail = function( url, width ) {
		if( !this.isCommonsResource( url ) ){
			return url;
		}
		if( !width ){
			width = 400;
		}

		return url + '?width=' + width;
	};

	/**
	 * Creates a gallery button
	 *
	 * @param {string} url
	 * @param {string} galleryId
	 * @returns {jQuery}
	 */
	SELF.prototype.createGalleryButton = function ( url, galleryId ) {
		var fileName = this.getCommonsResourceFileName( url ),
			thumbnail = this.getCommonsResourceFileNameThumbnail( url, 900 );

		return $( '<a title="Show Gallery" class="gallery glyphicon glyphicon-picture" aria-hidden="true">' )
			.attr( 'href', thumbnail )
			.attr( 'data-gallery', 'G_' + galleryId )
			.attr( 'data-title', decodeURIComponent( fileName ) );
	};


	/**
	 * Produce abbreviation of the URI.
	 *
	 * @param {string} uri
	 * @returns {string}
	 */
	SELF.prototype.abbreviateUri = function ( uri ) {
		var nsGroup, ns, NAMESPACE_SHORTCUTS = wikibase.queryService.RdfNamespaces.NAMESPACE_SHORTCUTS;

		for ( nsGroup in NAMESPACE_SHORTCUTS ) {
			for ( ns in NAMESPACE_SHORTCUTS[ nsGroup ] ) {
				if ( uri.indexOf( NAMESPACE_SHORTCUTS[ nsGroup ][ ns ] ) === 0 ) {
					return uri.replace( NAMESPACE_SHORTCUTS[ nsGroup ][ ns ], ns + ':' );
				}
			}
		}
		return '<' + uri + '>';
	};


	/**
	 * Handler for explore links
	 */
	SELF.prototype.handleExploreItem = function ( e ) {
		var id, url = $( e.target ).attr( 'href' ) || '', match;
		e.preventDefault();

		match = url.match( EXPLORE_URL + '(.+)' );
		if ( !match ) {
			return false;
		}

		var $explorer = $( '.explorer' );

		$explorer.empty();
		$( '.explorer-panel' ).show();

		id = match[ 1 ];
		mw.config = {
			get: function () {
				return 'Q' + id;
			}
		};
		EXPLORER( $, mw, $explorer );

		return false;
	};

	/**
	 * Handler for commons resource links
	 */
	SELF.prototype.handleCommonResourceItem = function ( e ) {
		e.preventDefault();
		$( this ).ekkoLightbox( { 'scale_height': true } );
	};


	return SELF;
}( jQuery, mediaWiki ) );