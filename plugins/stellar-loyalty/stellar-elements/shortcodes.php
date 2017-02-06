<?php




/*
 Shortcode attributes for Stellar Elements
 */
function stellar_attributes($attr) {
	/* Default html attribute */
	$html_attributes = [
		'class' => '',
		'style' => '',
	];

	/* Data attribute configuration for stellar widget element */
	$stellar_attributes = [
		"data-forgot-password-url" => "",
		"data-layout" => "",
		"data-limit" => "",
		"data-template" => "",
		"data-widget" => "",
		"data-sort_by" => "",
		"data-sort_dir" => "",
		"data-category" => "",
		"data-processing-status" => "",
		"data-placement" => "",
		"data-fields" => "",
		"data-respondable" => "",
		"data-mode" => "" 
	];

	/* Get shortcode attribute then merge html and stellar attribute */
	$shortcode_att = shortcode_atts( array_merge( $html_attributes, $stellar_attributes ), $attr );

	/* Create string of stellar attributes to be appended in stellar element */
	$shortcode_att['stellar-data-attribute'] = '';
	foreach ($shortcode_att as $key => $value) {
		if (array_key_exists($key, $stellar_attributes)) {
			if ( !empty($value) ) {
				$shortcode_att['stellar-data-attribute'] .=   $key .'="' . $value . '" ';
			}
		}
	}
	return $shortcode_att;
}

// $stellar_shortcode_elements = [
// 	'stellar-login',
// 	'stellar-challenges',
// 	'stellar-profile',
// 	'stellar-preferences',
// 	'stellar-activities',
// 	'stellar-offers',
// 	'stellar-offers-responses',
// 	'stellar-punchcards'
// ];


function stellar_check_auth_element($attr, $content) {
	$atts = stellar_attributes($attr);
	return '<div class="stellar-connected '. $atts['class'] .'" '. $atts['stellar-data-attribute'] .'></div>';	
}

/* Stellar Login Element */
function stellar_login_element($attr, $content) {
	$atts = stellar_attributes($attr);
	return '<div class="stellar-login '. $atts['class'] .'" '. $atts['stellar-data-attribute'] .'></div>';	
}

/* Stellar Challenges Element */
function stellar_challenges_element($attr, $content) {
	$atts = stellar_attributes($attr);
	return '<div class="stellar-challenges '. $atts['class'] .'" '. $atts['stellar-data-attribute'] .'></div>';	
}

/* Stellar Profile Element */
function stellar_profile_element($attr, $content) {
	$atts = stellar_attributes($attr);
	return '<div class="stellar-profile '. $atts['class'] .'" '. $atts['stellar-data-attribute'] .'></div>';	
}

/* Stellar Preferences Element */
function stellar_preferences_element($attr, $content) {
	$atts = stellar_attributes($attr);
	return '<div class="stellar-preferences '. $atts['class'] .'" '. $atts['stellar-data-attribute'] .'></div>';	
}

/* Stellar Activities Element */
function stellar_activities_element($attr, $content) {
	$atts = stellar_attributes($attr);
	return '<div class="stellar-activities '. $atts['class'] .'" '. $atts['stellar-data-attribute'] .'></div>';	
}

/* Stellar Offer Responses Element */
function stellar_offers_responses_element($attr, $content) {
	$atts = stellar_attributes($attr);
	return '<div class="stellar-offers-responses '. $atts['class'] .'" '. $atts['stellar-data-attribute'] .'></div>';	
}

/* Stellar Offers Element */
function stellar_offers_element($attr, $content) {
	$atts = stellar_attributes($attr);
	return '<div class="stellar-offers '. $atts['class'] .'" '. $atts['stellar-data-attribute'] .'></div>';	
}
/* Stellar Punchcards Element */
function stellar_punchcards_element($attr, $content) {
	$atts = stellar_attributes($attr);
	return '<div class="stellar-punchcards '. $atts['class'] .'" '. $atts['stellar-data-attribute'] .'></div>';	
}


add_shortcode('stellar-check-auth', 'stellar_check_auth_element');

add_shortcode('stellar-login', 'stellar_login_element');
add_shortcode('stellar-challenges', 'stellar_challenges_element');
add_shortcode('stellar-profile', 'stellar_profile_element');
add_shortcode('stellar-preferences', 'stellar_preferences_element');
add_shortcode('stellar-activities', 'stellar_activities_element');

add_shortcode('stellar-offers-responses', 'stellar_offers_responses_element');
add_shortcode('stellar-offers', 'stellar_offers_element');
add_shortcode('stellar-punchcards', 'stellar_punchcards_element');









