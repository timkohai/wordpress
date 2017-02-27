<?php
/**
 * @package Stellar_Loyalty
 * @version 1.0.15
 */
/*
Plugin Name: Stellar Elements Shortcodes 15
Plugin URI: https://wordpress.org/plugins/stellar-loyalty
Description: Stellar Loyalty Shortcode Elements for Wordpress
Author: Stellar
Version: 1.0.15
Author URI: http://stellarloyalty.com
*/
// Constants
define( 'STELLAR__PLUGIN_DIR', plugin_dir_path( __FILE__ ) );

require_once( STELLAR__PLUGIN_DIR . 'admin/stellar-admin-config.php' );
require_once( STELLAR__PLUGIN_DIR . 'stellar-elements/stellar-shortcodes.php' );

function stellar_loyalty_enqueue_scripts() {
	$settings = get_option( 'stellar_settings' );
	$stellar_init_js = plugins_url( 'stellar-init.js', __FILE__ );
	wp_register_style( 'stellar-plum-style', $settings['static_page_path'] . 'css/custom.css', array() );
	// wp_register_script( 'stellar-plum-script', plugins_url( 'js/stellar-loyalty.js', __FILE__ ), array() );
	wp_register_script( 'stellar-progressbar-js', $settings['static_page_path'] . 'js/doughnutprogressbar.min.js', array());

	wp_register_script( 'stellar-init', $settings['stellar_init_path'] , array());	
	// wp_register_script( 'stellar-init', $stellar_init_js , array());	
}
add_action( 'init', 'stellar_loyalty_enqueue_scripts' );

// Enqueue stellar styles and scripts 
function load_stellar_assets() {
	wp_enqueue_style( 'stellar-plum-style' );
	wp_enqueue_script( 'stellar-plum-script' );
	wp_enqueue_script( 'stellar-progressbar-js' );
	wp_enqueue_script( 'stellar-init' );
	
	wp_localize_script('stellar-init', 'wordpress_settings', array(
			'settings' => get_option( 'stellar_settings' )
		)
	);
}

// if stellar element shortcode was used only in the page enqueu stellar-init.js
function check_stellar_loyalty_shortcodes() {
	global $wp_query;
	$post = $wp_query->get_queried_object();

	$shortcodes_to_find = array(
		'stellar_login',
		'stellar_challenges',
		'stellar_profile',
		'stellar_preferences',
		'stellar_activities',
		'stellar_offers',
		'stellar_offers_responses',
		'stellar_punchcards',
		'stellar_content_page'
	);

	$counter = 0;
	foreach ($shortcodes_to_find as $shortcode) {
		$new_shortcode = str_replace('_', '-', $shortcode);
		if( is_a( $post, 'WP_Post' ) && has_shortcode( $post->post_content, $new_shortcode) ) {
			$counter++;
		}
	}
	if ($counter > 0) {
		// Stellar init
		wp_enqueue_script( 'stellar-init' );
		wp_localize_script('stellar-init', 'wordpress_settings', array(
				'settings' => get_option( 'stellar_settings' )
			)
		);
	}
	return false;
}
add_action( 'wp', 'check_stellar_loyalty_shortcodes');

// Shortcode for PlumMarket theme
function stellar_shortcode_attributes($page, $attr) {
	if ($page === 'signup' || $page === 'forgot_password' ) {
		$settings = get_option( 'stellar_settings' );

		$topImg = $settings['static_page_path'] . 'images/login_bg_top.png';
		$botImg = $settings['static_page_path'] . 'images/login_bg_bot.png';

		$atts =	shortcode_atts( array(
					'top-image-src' => $topImg,
					'bottom-image-src' => $botImg,
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
	$settings = get_option( 'stellar_settings' );
	
	return '<div class="stellar-wrapper stellar-signup-page" style="display: none">
        <div class="top-image">
            <img src="' . $attr['top-image-src'] .'" alt="">
        </div>
        <h1 class="stellar-login-header sl-brandon sl-white sl-xxlarge">'. $attr['heading'].'</h1>
        <div class="login-wrapper">
			<div class="stellar-login col-lg-12" data-forgot-password-url="'.$settings['forgot_password_page'].'" style="display: none;">
	            <form id="stellar-register-form">
	                <div class="notifications">
	                    <div class="stellar-signup-notification"></div>
	                </div>
	                <div class="form-group">
	                    <input class="form-field" type="text"  name="first_name" title="First Name" sl-message-required="Please enter First Name!" sl-validation="required"  placeholder="First Name" />
	                </div>
	                <div class="form-group">
	                    <input class="form-field" type="text" name="last_name" title="Last Name" sl-message-required="Please enter Last Name!"sl-validation="required" placeholder="Last Name"/>
	                </div>
	                <div class="form-group">
	                    <input class="form-field" type="text" name="email" title="Email"sl-message-required="Please enter Email!"sl-message-email="Please enter valid Email!"sl-validation="required,email" placeholder="Email"/>
	                </div> 
	                <div class="form-group">
	                    <input type="text" name="mobile_phone" class="form-field mobile_phone" title="Phone Number" sl-message-required="Please enter Phone Number!" sl-validation="required" placeholder="Phone Number">
	                </div> 
	                <div class="form-group">
	                    <input class="form-field" type="password" name="password" title="Password" sl-message-required="Please enter Password!" sl-validation="required" placeholder="Password"/>
	                </div>
	                <div class="form-group">
	                    <input class="form-field" type="password" name="password_confirmation" title="Confirm Password" sl-message-required="Please enter Confirm Password!" sl-message-equalTo="Confirm Password doesn\'t match Password." sl-validation="required,equalTo[password]" placeholder="Confirm Password"/>
	                </div>
	                <button class="stellar-register-button">SIGN UP</button>
	                <p>Already Have an account?</p>
	                <button class="stellar-signin-button">SIGN IN</button>
	            </form> 
	        </div>
        </div>
        <div class="bottom-image">
            <img src="'. $attr['bottom-image-src'] .'" alt="">
        </div>
        </div>';

}
add_shortcode('rewards-signup-page', 'rewards_signup_page');

// Home Page
function rewards_homepage($attr, $content) {
	load_stellar_assets();
	return '<div class="stellar-wrapper stellar-home-page stellar-connected" style="display: none;">
	<div class="stellar-challenges" data-layout="medium_rectangle" data-category="alert" data-widget="alert" data-respondable="yes"></div>
		'. do_shortcode($content) .'
	</div>';
}
add_shortcode('rewards-home-page', 'rewards_homepage');


// Profile Page
function rewards_profile_page($attr, $content) {
	load_stellar_assets();
	return '<div class="stellar-wrapper stellar-profile-page stellar-connected" style="display: none;">'. do_shortcode($content) .'</div>';
}
add_shortcode('rewards-profile-page', 'rewards_profile_page');

// Program Page
function rewards_program_page($attr, $content) {
	load_stellar_assets();
	return '<div class="stellar-wrapper stellar-program-page stellar-connected" style="display: none;">' .do_shortcode($content) .'</div>';
}
add_shortcode('rewards-program-page', 'rewards_program_page');

function rewards_forgot_password_page( $attr, $content ) {
	load_stellar_assets();
	$attr = stellar_shortcode_attributes('forgot_password', $attr);

	return '<div class="stellar-wrapper stellar-forgot-password-page" style="display:none">
    <div class="top-image">
        <img src="' . $attr['top-image-src'] .'" alt="">
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
	                <button type="submit" disabled class="btn btn-primary" title="Send Me Reset Password Instructions"> Send Me Reset Password Instructions </button>
	            </div>
	        </form>
	    </div>
	</div>
    <div class="bottom-image">
        <img src="'. $attr['bottom-image-src'] .'" alt="">
    </div>';
}
add_shortcode('rewards-forgot-password-page', 'rewards_forgot_password_page');


function rewards_reset_password_page($attr, $content) {
	load_stellar_assets();

	$attr = stellar_shortcode_attributes('forgot_password', $attr);

	$settings = get_option( 'stellar_settings' );

	return '<div class="stellar-wrapper stellar-reset-password-page" style="display:none">
            <div class="top-image">
                <img src="' . $attr['top-image-src'] .'" alt="">
            </div>
            <h1 class="stellar-login-header sl-brandon sl-white sl-xxlarge">Reset Password</h1>
			<div class="login-wrapper">
				<div class="col-md-4 col-md-offset-4">
			    <form id="reset-password-form" method="post" novalidate>
			        <div class="notification">
			            <p class="error-message" style="display: none;"></p>
			        </div>
			        <div class="success-message" style="display: none;">
			            <p>
			                <img src="' . $settings['static_page_path'] . 'images/check.png" width="30" height="30" alt="">
                            <span> You have successfully verified your email address. </span> <br>
                            <a href="' . $settings['signup_page'] . '" class="btn btn-primary">Return to Login</a>
			            </p>
			        </div>
			        <div class="form-group password">
			        	<div class="form-group">
			            <input id="password" class="form-field text-center" type="password" name="password" title="New Password" placeholder="New Password" sl-validation="required">
			            </div>
			            <div class="form-group">
			            <input id="password_confirmation" class="form-field text-center" type="password" name="password_confirmation" title="Confirm Password" placeholder="Confirm Password" sl-validation="required, equalTo[#password]">
			            </div>
			            <div class="form-group">
			            <button type="submit" disabled class="btn btn-primary" title="Reset Password"> Reset Password </button>
			            </div>
			        </div>
			    </form>
			    </div>
			</div>
            <div class="bottom-image">
                <img src="'. $attr['bottom-image-src'] .'" alt="">
            </div>
            </div>';
}
add_shortcode('rewards-reset-password-page', 'rewards_reset_password_page');

function rewards_unsubscribe_page($attr, $content) {
	load_stellar_assets();
	return '<div class="stellar-wrapper stellar-unsubscribe-page stellar-connected" style="display: none;">' .do_shortcode($content) .'</div>';
}
add_shortcode('rewards-unsubscribe-page', 'rewards_unsubscribe_page');


// Resusable shortcodes
function rewards_top_banner($attr, $content) {
	 $atts = shortcode_atts(
		array(
			'src' => 'https://s3.amazonaws.com/stellar-plum-staging-1be6mv2w1afxt33srboh/static_files/banner.png'
		), $attr);
	return '<img src="'. $atts['src'] .'" alt="">';
}
add_shortcode('rewards-banner-header', 'rewards_top_banner');


function rewards_welcome_sections($attr, $content) {
	$atts = shortcode_atts( array( 'active' => '' ), $attr );
	$settings = get_option( 'stellar_settings' );

	$class['home'] = $atts['active'] == 'home' ? 'active' : '';
	$class['profile'] = $atts['active'] == 'profile' ? 'active' : '';
	$class['program'] = $atts['active'] == 'program' ? 'active' : '';

	return '<div class="member-welcome-section">
		        <h1 class="sl-xxlarge sl-dark-blue sl-brandon">Hello, <span class="stl_token_first_name"></span>!</h1>
		        <div class="stellar-nav-icon" tabindex="1">
		            <div class="fa fa-align-justify"></div>
		         </div>
		        <div class="sl-navigation">
		            <ul class="stellar-menu">
		                <li class="home-link main-link"><a class="'.$class['home'].'" href="'. $settings['landing_page'] .'">Home</a></li>
		                <li class="profile-link main-link"><a class="'.$class['profile'].'" href="'. $settings['profile_page'] .'">Profile</a></li>
		                <li class="program-link main-link"><a class="'.$class['program'].'" href="'. $settings['program_page'] .'">Program</a></li>
		                <li class="help-link"><a href="mailto:guest.relations@plummarket.com">Help <i class="fa fa-question-circle"></i></a></li>
		                <li class="logout-link"><a href="#">Logout</a></li>
		            </ul>
		        </div>
		    </div>';
}
add_shortcode('rewards-welcome-section', 'rewards_welcome_sections');


function rewards_member_summary($attr, $content) {

	return '<div class="member-rewards-summary">
        <div class="rewards-circle-container">
            <canvas class="rewards-circle-canvas"></canvas>
            <div class="rewards-circle-content">
                <div class="reward-points">
                    <div class="stl_token_points"></div>
                    <div class="metric-label">points</div>
                </div>
            </div>
        </div>
        <div class="progress-rewards-content">
            <div class="reward-header">Rewards Points</div>
            <div class="reward-body"></div>
            <div class="rewards-activated-count">You’ve activated <span class="activated-rewards-count">0</span> rewards</div>
            <a href="#" class="rewards-more-info">CLICK FOR MORE INFORMATION.</a>
            <div class="stellar-rewards" data-name="plum_main_reward"></div>
            <div class="stellar-rewards-responses" data-datakey="sample" data-template="rewardResponseTemplate" limit="1000"></div>
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
            	'. do_shortcode('[stellar-punchcards template="punchcardsTemplate" sort_by="expiration_date" custom_handler="punchcardsHandler" limit="100"]') .'
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
                    	'. do_shortcode('[stellar-offers-responses sort_by="effectivity_end" sort_dir="asc" placement="web_reward" template="activatedTemplate" custom_handler="couponsEarnedCustomHandler" limit="100" ]<span class="sl-empty-activated">No item to display.</span>[/stellar-offers-responses]') .'
                    </div>
                    <div id="tab2">
                    	'. do_shortcode('[stellar-offers placement="web_coupon" limit="100" template="couponsTemplate" custom_handler="couponsCustomHandler" ]') .'
                    </div>
                    <div id="tab3">
                    '. do_shortcode('[stellar-offers-responses sort_by="effectivity_end" sort_dir="asc" processing_status="clipped" template="clippedTemplate" limit="100" custom_handler="couponsClipCustomHandler" ]<span class="sl-empty-clipped">No item to display.</span>[/stellar-offers-responses]') .'
                    </div>
                </div>
            </div>
        </div>
    </div>';
}
add_shortcode('rewards-offers-section', 'rewards_offer_section');

function rewards_activities($attr, $content) {
	return '<h1 class="sl-black sl-brandon sl-xxlarge profile-header">Activities</h1>
		    <div class="stellar-activities-wrapper">
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
