# Stellar Wordpress Plugin
This is  a wordpress plugin that uses shortcodes for Stellar Elements.

======================================================================

## What are "Shortcodes"?

Shortcodes are a common format used to provide macro support in various CMSs, editors, and libraries. Perhaps the most famous example is the [Wordpress Shortcode API](https://codex.wordpress.org/Shortcode_API), which provides developers an avenue by which they can enhance their theme or plugin's ease of use.

The anatomy of a shortcode is as follows:

```
[tag] - No content, no attributes
[tag]Content[/tag] - Tag with content
[tag atribute=value] - Tag with attributes
[tag atribute=value]Content[/tag] - Tag with content and attributes
```

There are many formats that shortcodes can follow, but ultimately the idea is that when a shortcode tag is matched, its contents are replaced by a server-side callback.

======================================================================

## Installation
1. Upload stellar-loyalty folder to the /wp-content/plugins/ directory
2. Activate Column Shortcodes through the 'Plugins' menu in WordPress
3. Use the shortcodes describe below


## Usage
This package comes with everything you need to get started in defining your own custom shortcodes and their respective callbacks.

**Stellar Element Shortcodes**
```
[stellar-login]
[stellar-challenges]
[stellar-profile]
[stellar-preferences]
[stellar-activities]
[stellar-offers-responses]
[stellar-offers]
[stellar-punchcards]
```
**Stellar Shortcodes Attributes**
```
custom_handler
layout
limit
template
widget
sort_by
sort_dir
category
processing_status
placement
fields
respondable
mode
test
id
forgot_password_url
```


# Prepared Shortcodes

======================================================================

## Signup Page shortcodes
```
[rewards-signup-page]
```

## Rewards Dashboard
```
[rewards-home-page]
 [rewards-banner-header] 
 [rewards-welcome-section active="home"]
 [rewards-member-summary]
 [rewards-offers-section]
[/rewards-home-page]
```
## Rewards Profile
```
[rewards-profile-page]
 [rewards-banner-header]
 [rewards-welcome-section active="profile"]
 [rewards-activities]
 [rewards-profile]
 [rewards-preferences]
[/rewards-profile-page]
```
## Rewards Program
```
[rewards-program-page]
 [rewards-banner-header]
 [rewards-welcome-section active="program"]
 [stellar-content-page name="plum_program_benefits" layout="page_body"]
[/rewards-unsubscribe-page]
```
## Rewards Forgot Password
```
[rewards-forgot-password-page]

```
## Rewards Reset Password
```
[rewards-reset-password-page]
```
## Rewards Unsubscribe Page
```
[rewards-unsubscribe-page]
 [rewards-banner-header]
 [rewards-welcome-section]
 [stellar-profile fields="emailPreferencesFields"]
[/rewards-program-page]
```