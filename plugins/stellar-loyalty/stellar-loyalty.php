<?php
/**
 * @package Stellar_Loyalty
 * @version 1.0.0
 */
/*
Plugin Name: Stellar Elements Shortcodes
Plugin URI: https://wordpress.org/plugins/stellar-loyalty
Description: Stellar Loyalty Shortcode Elements for Wordpress
Author: Stellar
Version: 1.0.0
Author URI: http://stellarloyalty.com
*/

// Constants
define( 'STELLAR__PLUGIN_DIR', plugin_dir_path( __FILE__ ) );

// For Admin Settings
require_once( STELLAR__PLUGIN_DIR . 'admin/stellar-admin-config.php' );

// Stellar Elements Shortcodes
require_once( STELLAR__PLUGIN_DIR . 'stellar-elements/stellar-shortcodes.php' );

$stellar_loyalty_settings = get_option( 'stellar_settings' );
// $stellar_init_js = $stellar_loyalty_settings['stellar_init_path'];
$stellar_init_js = plugins_url( 'stellar-init.js', __FILE__ );

 
// wordpress register function for styles and scripts
wp_register_style( 'get-stellar-loyalty-style', plugins_url( '/css/stellar-loyalty.css', __FILE__ ), array(), '1.0.2', 'all' );
wp_register_style( 'get-stellar-circle-style', plugins_url( '/css/circle.css', __FILE__ ), array(), '1.0.2', 'all' );

// wp_register_script( 'get-stellar-jquery', plugins_url( 'js/jquery.min.js', __FILE__ ), array(), '1.0.2', true );
wp_register_script( 'get-stellar-js', plugins_url( 'js/stellar-loyalty.js', __FILE__ ), array(), '1.0.2', true );
wp_register_script( 'get-stellar-circle', plugins_url( 'js/circle.js', __FILE__ ), array(), '1.0.2', true );

// Stellar Init
wp_register_script( 'get-stellar-init', $stellar_init_js , array(), '1.0.2', true );

// Enqueue stellar styles and scripts 
function load_stellar_assets() {
	wp_enqueue_style( 'get-stellar-loyalty-style' );
	wp_enqueue_style( 'get-stellar-circle-style' );

	// wp_enqueue_script( 'get-stellar-jquery' );
	wp_enqueue_script( 'get-stellar-js' );
	wp_enqueue_script( 'get-stellar-circle' );

	wp_enqueue_script( 'get-stellar-init' );

	wp_localize_script('get-stellar-init', 'wordpress_settings', array(
			'settings' => get_option( 'stellar_settings' )
		)
	);
}

// if stellar element shortcode was used only in the page enqueu stellar-init.js
function check_stellar_loyalty_shortcodes() {
	global $post;

	$shortcodes_to_find = array(
		'stellar_login',
		'stellar_challenges',
		'stellar_profile',
		'stellar_preferences',
		'stellar_activities',
		'stellar_offers',
		'stellar_offers_responses',
		'stellar_punchcards'
	);

	foreach ($shortcodes_to_find as $shortcode) {
		$new_shortcode = str_replace('_', '-', $shortcode);
		if( is_a( $post, 'WP_Post' ) && has_shortcode( $post->post_content, $new_shortcode) ) {
			
			// Stellar init
			wp_enqueue_script( 'get-stellar-init' );
			wp_localize_script('get-stellar-init', 'wordpress_settings', array(
					'settings' => get_option( 'stellar_settings' )
				)
			);
		}
	}
	return false;
}
add_action( 'wp_enqueue_scripts', 'check_stellar_loyalty_shortcodes');

// Shortcode for PlumMarket theme
function stellar_shortcode_attributes($page, $attr) {
	if ($page === 'signup' || $page === 'forgot_password' ) {
		$atts =	shortcode_atts( array(
					'top-image-src' => 'images/login_bg_top.png',
					'bottom-image-src' => 'images/login_bg_bot.png',
					'heading' => 'Member Login',
					'path' => plugin_dir_url( __FILE__ ),
					'class' => ''
				), $attr );
	}
	return $atts;
}


// Signup Page
function rewards_signup_page($attr, $content) {
	load_stellar_assets();
	$attr = stellar_shortcode_attributes('signup', $attr);
	$content = preg_replace('/<br class="nc".\/>/', '', $content);
	return '<div class="stellar-wrapper stellar-signup-page">
        <div class="top-image">
            <img src="' . $attr['path'] . $attr['top-image-src'] .'" alt="">
        </div>
        <h1 class="stellar-login-header sl-brandon sl-white sl-xxlarge">'. $attr['heading'].'</h1>
        <div class="login-wrapper">
            '. do_shortcode($content) .'
        </div>
        <div class="bottom-image">
            <img src="'. $attr['path'] . $attr['bottom-image-src'] .'" alt="">
        </div>
        </div>';

}
add_shortcode('rewards-signup-page', 'rewards_signup_page');


function stellar_login($attr, $content) {
	$atts = shortcode_atts( array (
			'forgot_password_url' => ''
		), $attr);

	return '<div class="stellar-login col-lg-12" data-forgot-password-url="'.$atts['forgot_password_url'].'" style="display: none;">
        <form id="stellar-register-form">
            <div class="notifications">
                <div class="stellar-signup-notification"></div>
            </div>
            <div>
                <input class="form-field" type="text" name="first_name" title="First Name" sl-message-required="Please enter First Name!" sl-validation="required" placeholder="First Name" />
            </div>
            <div>
                <input class="form-field" type="text" name="last_name" title="Last Name" sl-message-required="Please enter Last Name!"sl-validation="required" placeholder="Last Name"/>
            </div>
            <div>
                <input class="form-field" type="text" name="email" title="Email"sl-message-required="Please enter Email!"sl-message-email="Please enter valid Email!"sl-validation="required,email" placeholder="Email"/>
            </div> 
            <div>
                <input type="text" name="mobile_phone" class="form-field mobile_phone" title="Phone Number" sl-message-required="Please enter Phone Number!" sl-validation="required" placeholder="Phone Number">
            </div> 
            <div>
                <input class="form-field" type="password" name="password" title="Password" sl-message-required="Please enter Password!"sl-validation="required" placeholder="Password"/>
            </div>
            <div>
                <input class="form-field" type="password" name="password_confirmation"title="Confirm Password"sl-message-required="Please enter Confirm Password!"sl-message-equalTo="Confirm Password doesn\'t match Password."sl-validation="required,equalTo[password]" placeholder="Confirm Password"/>
            </div>
            <button class="stellar-register-button">SIGN UP</button>
            <p>Already Have an account?</p>
            <button class="stellar-signin-button">SIGN IN</button>
        </form>
    </div>';
}
add_shortcode('stellar-login', 'stellar_login');


// Home Page
function rewards_homepage($attr, $content) {
	load_stellar_assets();
	return '<div class="stellar-wrapper stellar-home-page stellar-connected">
	<div class="stellar-challenges" data-layout="medium_rectangle" data-category="alert" data-widget="alert" data-respondable="yes"></div>
		'. do_shortcode($content) .' 
	</div>';
}
add_shortcode('rewards-home-page', 'rewards_homepage');


// Profile Page
function rewards_profile_page($attr, $content) {
	load_stellar_assets();
	return '<div class="stellar-wrapper stellar-profile-page stellar-connected">'. do_shortcode($content) .'</div>';
}
add_shortcode('rewards-profile-page', 'rewards_profile_page');

// Program Page
function rewards_program_page($attr, $content) {
	load_stellar_assets();
	return '<div class="stellar-wrapper stellar-program-page stellar-connected">' .do_shortcode($content) .'</div>';
}
add_shortcode('rewards-program-page', 'rewards_program_page');


function rewards_forgot_password_page( $attr, $content ) {
	load_stellar_assets();
	$attr = stellar_shortcode_attributes('forgot_password', $attr);

	return '<div class="stellar-wrapper stellar-forgot-password-page">
    <div class="top-image">
        <img src="' . $attr['path'] . $attr['top-image-src'] .'" alt="">
    </div>
    <div class="stellar-wrapper">
        <h1 class="stellar-login-header sl-brandon sl-white sl-xxlarge">Forgot Password</h1>
        <div class="login-wrapper row">
            <form id="forgot-password-form" method="post" novalidate>
                <div class="notification">
                    <p class="error-message" style="display: none;"></p>
                    <p class="success-message" style="display: none;"></p>
                </div>
                <div class="form-group">
                    <input type="email" required name="email" id="email" sl-validation="required,email" title="email" placeholder="Enter your email here">
                    <button type="submit" disabled class="btn btn-primary" title="Send Me Reset Password Instructions">
                    	Send Me Reset Password Instructions
                    </button>
                </div>
            </form>
        </div>
    </div>
    <div class="bottom-image">
        <img src="'. $attr['path'] . $attr['bottom-image-src'] .'" alt="">
    </div>';
}
add_shortcode('rewards-forgot-password-page', 'rewards_forgot_password_page');


function rewards_reset_password_page($attr, $content) {
	load_stellar_assets();

	$attr = stellar_shortcode_attributes('forgot_password', $attr);

	$stellar_loyalty_settings = get_option( 'stellar_settings' );

	return '<div class="stellar-wrapper stellar-reset-password-page">
            <div class="top-image">
                <img src="' . $attr['path'] . $attr['top-image-src'] .'" alt="">
            </div>
            <h1 class="stellar-login-header sl-brandon sl-white sl-xxlarge">Reset Password</h1>
            <div class="login-wrapper">
                <form id="reset-password-form" method="post" novalidate>
                    <div class="notification">
                        <p class="error-message" style="display: none;"></p>
                    </div>
                    <div class="success-message" style="display: none;">
                        <p>
                            <img src="'.$stellar_loyalty_settings['static_page_path'].'images/check.png" width="30" height="30" alt="">
                            <span> You have successfully verified your email address. </span> <br>
                            <a href="'.$stellar_loyalty_settings['signup_page'].'" class="btn btn-primary">Return to Login</a>
                        </p>
                    </div>
                    <div class="form-group password">
                        <input id="password" class="form-field text-center" type="password" name="password" title="New Password" placeholder="New Password" sl-validation="required">
                        <input id="password_confirmation" class="form-field text-center" type="password" name="password_confirmation" title="Confirm Password" placeholder="Confirm Password" sl-validation="required, equalTo[#password]">
                        <button type="submit" disabled class="btn btn-primary" title="Reset Password"> Reset Password </button>
                    </div>
                </form>
            </div>
            <div class="bottom-image">
                <img src="'. $attr['path'] . $attr['bottom-image-src'] .'" alt="">
            </div>
            </div>';
}
add_shortcode('rewards-reset-password-page', 'rewards_reset_password_page');


// Resusable shortcodes
function rewards_top_banner($attr, $content) {
	 $atts = shortcode_atts(
		array(
			'src' => 'https://s3.amazonaws.com/stellar-plum-staging-1be6mv2w1afxt33srboh/static_files/banner.png'
		), $attr);
	return '<img src="'. $atts['src'] .'" alt="">';
}
add_shortcode('rewards-banner-header', 'rewards_top_banner');


function rewards_welcome_section($attr, $content) {
	return '<div class="sl-welcome-bar">
	            <h1 style="padding-top: 30px;" class="sl-xxlarge sl-dark-blue sl-brandon sl-welcome">HELLO, 
	            <span class="stl_token_first_name"></span>!</h1>
	            <button class="stl-logout sl-brandon" onclick="Stellar.logout()">LOG OUT</button>
	        </div>';
}
add_shortcode('rewards-welcome-section', 'rewards_welcome_section');


function rewards_header_navigation($attr, $content) {
	$atts = shortcode_atts( array(
		'active' => '',
		'home-src' => '/rewards-dashboard',
		'profile-src' => '/rewards-profile',
		'program-src' => '/rewards-program'
		), $attr );

	$class['home'] = $atts['active'] == 'home' ? 'active' : '';
	$class['profile'] = $atts['active'] == 'profile' ? 'active' : '';
	$class['program'] = $atts['active'] == 'program' ? 'active' : '';

	return '<div class="slnav">
        <ul>
            <li class="home"><a class="'.$class['home'].' sl-brandon sl-large sl-dark-gray" href="'. $atts['home-src'] .'">Home</a></li>
            <li class="profile"><a class="'.$class['profile'].' sl-brandon sl-large sl-dark-gray" href="'. $atts['profile-src'] .'">Profile</a></li>
            <li class="program"><a class="'.$class['program'].' sl-brandon sl-large sl-dark-gray" href="'. $atts['program-src'] .'">Program</a></li>
            <li><button class="stl-help sl-chalet" onclick="parent.location=\'mailto:guest.relations@plummarket.com\'">Help <span class="sl-help-icon">?</span></button></li>
        </ul>
    </div>';
}
add_shortcode('rewards-header-navigation', 'rewards_header_navigation');

function rewards_member_summary($attr, $content) {

	return '<div class="progress-bar-wrapper row">
            <div class="col-lg-4 col-md-5 col-sm-4">
                    <div class="second circle">
                        <strong><span class="stl_token_points sl-brandon sl-xxxxlarge sl-white"></span> <span class="pts-label sl-brandon sl-xlarge sl-white" style="padding-left: 13px;">POINTS</span></strong>
                    </div>
            </div>
            <div class="col-lg-8 col-md-7 col-sm-8 rewards-details-wrapper">
                <h1 style="padding-top: 40px;" class="sl-brandon sl-white sl-xlarge sl-brandon hidden-xs sl-rewards-points-label">Rewards Points</h1>
                <div class="sl-white sl-brandon-black sl-small reward-body"> </div>
                <h1 style="padding-top: 20px;" class="sl-gold sl-xlarge sl-brandon hidden-xs">You’ve activated <span class="rewards-count rewards-count-circle rewards-count-circle-main sl-black">0</span>                                    rewards</h1>
                <a href="#" class="sl-white sl-brandon-black sl-small sl-underline rewards-information">CLICK FOR MORE INFORMATION.</a>
                <div class="stellar-rewards" data-name="plum_main_reward"></div>
                <div class="stellar-rewards-responses" data-datakey="stellar_rewards_responses" data-template="rewardResponseTemplate" limit="1000"></div>
            </div>
        </div>';
}
add_shortcode('rewards-member-summary', 'rewards_member_summary');


function rewards_offer_section($attr, $content) {
	return '<div class="row" style="margin-top: 60px;">
	    <div class="col-lg-6 circles-container">
	        <h1 class="sl-xlarge sl-dark-blue circles-label sl-brandon">REWARDS circles</h1>
	        <p class="sl-dark-gray sl-small sl-brandon-black sl-circles-text">ADD TO YOUR CIRCLES TO ACTIVATE REWARDS</p>
	        <p class="sl-center sl-italic sl-xxsmall sl-circles-info">Completed Rewards Circles will be automatically added to your Earned Rewards.</p>
	        <div class="punchcards-wrapper">
	        	'. do_shortcode('[stellar-punchcards template="punchcardsTemplate" sort_by="expiration_date" custom_handler="punchcardsHandler" ]') .'
	        </div>
	    </div>
	    <div class="col-lg-6 coupons-container">
	        <h1 class="sl-xlarge sl-dark-blue coupons-label sl-brandon">rewards coupons</h1>
	        <ul class="tabs sl-chalet">
	            <li><a href="#tab1">EARNED</a></li>
	            <li><a href="#tab2">COUPONS</a></li>
	            <li><a href="#tab3">CLIPPED</a></li>
	        </ul>
	        <p class="sl-center sl-italic sl-xxsmall">Scan your barcode at checkout to apply Clipped Rewards and Coupons.</p>
	        <div class="coupons-wrapper-scroll">
	            <div class="coupons-wrapper">
	                <div id="tab1">
	                	'. do_shortcode('[stellar-offers-responses sort_dir="asc" placement="web_reward" template="activatedTemplate" custom_handler="couponsEarnedCustomHandler" ]<span class="sl-empty-activated">No item to display.</span>[/stellar-offers-responses]') .'
	                </div>
	                <div id="tab2">
	                    '. do_shortcode('[stellar-offers placement="web_coupon" limit="50" template="couponsTemplate" custom_handler="couponsCustomHandler" ]') .'
	                </div>
	                <div id="tab3">
	                	'. do_shortcode('[stellar-offers-responses sort_dir="asc" processing_status="clipped" template="clippedTemplate" custom_handler="couponsClipCustomHandler" ]<span class="sl-empty-clipped">No item to display.</span>[/stellar-offers-responses]') .'
	                </div>
	            </div>
	        </div>
	    </div>
	</div>';
}
add_shortcode('rewards-offers-section', 'rewards_offer_section');

function rewards_activities($attr, $content) {
	return '<h1 class="sl-black sl-brandon sl-xxlarge profile-header">Activities</h1>
            <div class="activities-wrapper">
            	'. do_shortcode('[stellar-activities template="activitiesTemplate"]') .'
            </div>';
}
add_shortcode('rewards-activities', 'rewards_activities');

function profile_profile($attr, $content) {
	return '<h1 class="sl-black sl-brandon sl-xxlarge profile-header">Member Profile</h1>
			'. do_shortcode('[stellar-profile fields="memberProfileFields"]');
            
}
add_shortcode('rewards-profile', 'profile_profile');

function profile_preferences($attr, $content) {
	return do_shortcode('[stellar-preferences]');
}
add_shortcode('rewards-preferences', 'profile_preferences');


