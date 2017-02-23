(function( $ ) {
	'use strict';

	/**
	 * All of the code for your public-facing JavaScript source
	 * should reside in this file.
	 *
	 * Note: If client supports jQuery we will write jQuery code here, so the
	 * $ function reference has been prepared for usage within the scope
	 * of this function.
	 */
	if ( $('.stellar-signup-page').length || $('.stellar-reset-password-page').length || $('.stellar-forgot-password-page').length ) {
		console.debug('wow');
		$('#main').attr('style', 'background-color: #000 !important; padding-top: 0; padding-bottom: 0;');

		// $('#main').css('background-color: #000 !important;');
	}

})( jQuery );


// (function() {

	/**
	 * No Jquery - All of the code for your public-facing JavaScript source
	 * should reside in this file.
	 */

// })();
