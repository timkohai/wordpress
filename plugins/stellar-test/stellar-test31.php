<?php
/*
Plugin Name: Stellar Test 31
Plugin URI: https://stellarloyalty.com
Description: Stellar test plugin
Version: 2.0.2
Author: Timothy Madriaga
Author URI: https://stellarloyalty.com
*/

$stellar_elements = array(
    'stellar_challenges',
    'stellar_profile',
    'stellar_preferences',
    'stellar_activities',
    'stellar_offers',
    'stellar_offers_responses',
    'stellar_punchcards'
);

function stellar_attributes($attr) {
    /* Default html attribute */
    $html_attributes = [
        'class' => '',
        'style' => '',
    ];
    /* Data attribute configuration for stellar widget element */
    $stellar_attributes = [
        'custom_handler' => '',
        'layout' => '',
        'limit' => '',
        'template' => '',
        'widget' => '',
        'sort_by' => '',
        'sort_dir' => '',
        'category' => '',
        'processing_status' => '',
        'placement' => '',
        'fields' => '',
        'respondable' => '',
        'mode' => '',
        'test' => ''
    ];

    /* Get shortcode attribute then merge html and stellar attribute */
    $shortcode_att = shortcode_atts( array_merge( $html_attributes, $stellar_attributes ), $attr );

    /* Create string of stellar attributes to be appended in stellar element */
    // $shortcode_att['data-attribute'] = '';
    foreach ($shortcode_att as $key => $value) {
        if (array_key_exists($key, $stellar_attributes)) {
            if ( !empty($value) ) {
                $attr_name = str_replace('_', '-', $key);
                if ($attr_name == 'custom-handler') { $attr_name = 'customHandler'; }
                $shortcode_att['data-attribute'] .=  " data-{$attr_name}={$value}";
            }
        }
    }
    return $shortcode_att;
}

foreach ($stellar_elements as $key) {
    $stellar_shortcode = str_replace('_', '-', $key);
    add_shortcode($stellar_shortcode, 'stellar_elements_shortcodes');
}

function stellar_elements_shortcodes($params, $content, $tag) {
    $attr = stellar_attributes($params);
    return '<div class="'.$tag.' '. $attr['class'] .'" '. $attr['data-attribute'] .'>'. $content .'</div>';
}