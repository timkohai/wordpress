<?php
/**
 * @internal never define functions inside callbacks.
 * these functions could be run multiple times; this would result in a fatal error.
 */
 
function stellar_loyalty_admin_menu() {
	add_menu_page(
		'Stellar Loyalty Settings', // page title
		'Stellar Settings', // menu title
		'manage_options', // capability
		'stellar_loyalty', // menu slug
		'stellar_loyalty_settings_page' //The function to be called to output the content
	);
}

function stellar_loyalty_settings_init() {
	register_setting( 'stellar_settings_group', 'stellar_settings' );

	add_settings_section( 
		'stellar_loyalty_section',
		__( '', 'stellar_loyalty' ),
		'stellar_loyalty_section_callback',
		'stellar_settings_group'
	);

	add_settings_section( 
		'stellar_loyalty_pages_section',
		__( 'Rewards Pages', 'stellar_loyalty' ),
		'stellar_loyalty_pages_section_callback',
		'stellar_settings_group'
	);

	add_settings_field( 
		'stellar_init_url', 
		__( 'Path to stellar-init.js', 'stellar_loyalty' ), 
		'stellar_field_init_url_cb', 
		'stellar_settings_group', 
		'stellar_loyalty_section'
	);

	add_settings_field( 
		'stellar_static_page_url', 
		__( 'Static Page URL', 'stellar_loyalty' ), 
		'stellar_field_static_url_cb', 
		'stellar_settings_group', 
		'stellar_loyalty_section'
	);

	add_settings_field( 
		'stellar_landing_url', 
		__( 'Home', 'stellar_loyalty' ), 
		'stellar_field_landing_page_cb', 
		'stellar_settings_group', 
		'stellar_loyalty_pages_section'
	);

	add_settings_field( 
		'stellar_signup_url', 
		__( 'Signup', 'stellar_loyalty' ), 
		'stellar_field_signup_page_cb', 
		'stellar_settings_group', 
		'stellar_loyalty_pages_section'
	);

	add_settings_field( 
		'stellar_profile_url', 
		__( 'Profile', 'stellar_loyalty' ), 
		'stellar_field_profile_page_cb', 
		'stellar_settings_group', 
		'stellar_loyalty_pages_section'
	);
	add_settings_field( 
		'stellar_program_url', 
		__( 'Program', 'stellar_loyalty' ), 
		'stellar_field_program_page_cb', 
		'stellar_settings_group', 
		'stellar_loyalty_pages_section'
	);
	add_settings_field( 
		'stellar_forgot_password_url', 
		__( 'Forgot Password', 'stellar_loyalty' ), 
		'stellar_field_forgot_password_page_cb', 
		'stellar_settings_group', 
		'stellar_loyalty_pages_section'
	);
	add_settings_field( 
		'stellar_reset_password_url', 
		__( 'Reset Password', 'stellar_loyalty' ), 
		'stellar_field_reset_password_page_cb', 
		'stellar_settings_group', 
		'stellar_loyalty_pages_section'
	);
	add_settings_field( 
		'stellar_unsubscribe_url', 
		__( 'Unsubscribe', 'stellar_loyalty' ), 
		'stellar_field_unsubscribe_page_cb', 
		'stellar_settings_group', 
		'stellar_loyalty_pages_section'
	);
}
 
/**
 * Register the public hooks
 */
add_action( 'admin_menu', 'stellar_loyalty_admin_menu' );
add_action( 'admin_init', 'stellar_loyalty_settings_init' );


// $args have the following keys defined: title, id, callback.
function stellar_loyalty_section_callback( $args ) {
	// echo __('<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Unde excepturi aliquam natus, hic odit non in mollitia ex pariatur quis delectus ullam ipsum laudantium provident, consectetur labore! Fugiat, dolor, numquam.</p>', 'stellar_loyalty' );
	// echo esc_attr( $args['id'] );
}

function stellar_loyalty_pages_section_callback( $args ) {
	// echo __('<p>Pages</p>', 'stellar_loyalty' );
}
 
function stellar_field_init_url_cb( $args ) {
	// get the value of the setting we've registered with register_setting()
	$options = get_option( 'stellar_settings' );
	?>
	<input type="text" class="regular-text code" name="stellar_settings[stellar_init_path]" 
	value="<?php
	if ( isset( $options['stellar_init_path'] ) ) {
		echo $options['stellar_init_path']; 
	} ?>" style="width: 100%;" />
	<!-- <p class="description">This is located in Stellar admin console under static files</p> -->
 	<?php
}

function stellar_field_static_url_cb( $args ) {
	$options = get_option( 'stellar_settings' );
	?>
	<input type="text" class="regular-text code" name="stellar_settings[static_page_path]" 
	value="<?php
	if ( isset( $options['static_page_path'] ) ) {
		echo $options['static_page_path']; 
	} ?>" />
 	<?php
}

function stellar_field_landing_page_cb( $args ) {
	$options = get_option( 'stellar_settings' );
	?>
	<input type="text" class="regular-text code" name="stellar_settings[landing_page]" 
	value="<?php
	if ( isset( $options['landing_page'] ) ) {
		echo $options['landing_page']; 
	} ?>" />
 	<?php
}

function stellar_field_signup_page_cb( $args ) {
	$options = get_option( 'stellar_settings' );
	?>
	<input type="text" class="regular-text code" name="stellar_settings[signup_page]" 
	value="<?php
	if ( isset( $options['signup_page'] ) ) {
		echo $options['signup_page']; 
	} ?>" />
 	<?php
}

function stellar_field_profile_page_cb( $args ) {
	$options = get_option( 'stellar_settings' );
	?>
	<input type="text" class="regular-text code" name="stellar_settings[profile_page]" 
	value="<?php
	if ( isset( $options['profile_page'] ) ) {
		echo $options['profile_page']; 
	} ?>" />
 	<?php
}

function stellar_field_program_page_cb( $args ) {
	$options = get_option( 'stellar_settings' );
	?>
	<input type="text" class="regular-text code" name="stellar_settings[program_page]" 
	value="<?php
	if ( isset( $options['program_page'] ) ) {
		echo $options['program_page']; 
	} ?>" />
 	<?php
}

function stellar_field_forgot_password_page_cb( $args ) {
	$options = get_option( 'stellar_settings' );
	?>
	<input type="text" class="regular-text code" name="stellar_settings[forgot_password_page]" 
	value="<?php
	if ( isset( $options['forgot_password_page'] ) ) {
		echo $options['forgot_password_page']; 
	} ?>" />
 	<?php
}

function stellar_field_reset_password_page_cb( $args ) {
	$options = get_option( 'stellar_settings' );
	?>
	<input type="text" class="regular-text code" name="stellar_settings[reset_password_page]" 
	value="<?php
	if ( isset( $options['reset_password_page'] ) ) {
		echo $options['reset_password_page']; 
	} ?>" />
 	<?php
}

function stellar_field_unsubscribe_page_cb( $args ) {
	$options = get_option( 'stellar_settings' );
	?>
	<input type="text" class="regular-text code" name="stellar_settings[unsubscribe_page]" 
	value="<?php
	if ( isset( $options['unsubscribe_page'] ) ) {
		echo $options['unsubscribe_page']; 
	} ?>" />
 	<?php
}
 
function stellar_loyalty_settings_page() {
	// check user capabilities
	if ( ! current_user_can( 'manage_options' ) ) { return; }
 
	// check if the user have submitted the settings
	// wordpress will add the "settings-updated" $_GET parameter to the url
	if ( isset( $_GET['settings-updated'] ) ) {
	 	// add settings saved message with the class of "updated"
		add_settings_error( 
			'stellar_messages', 'stellar_message', 
			__( 'Settings Saved', 'stellar_loyalty' ), 
			'updated' 
		);
	}
 	// show error/update messages
 	settings_errors( 'stellar_messages' );
 	?>
	<div class="wrap">
 	<h1>Stellar Loyalty Settings</h1>
 	<form action="options.php" method="post">
 	<?php
	 	settings_fields( 'stellar_settings_group' );
	 	do_settings_sections( 'stellar_settings_group' );
	 	submit_button( 'Save Settings' );
 	?>
 	</form>
 	</div>
 	<?php
}


