// Stellar Init
// This script detects an environment and loads the appropriate configuration and the Stellar JS SDK.
// To use this script, include it on your web page as follows:
//     <script> window.stellarInitOpts = { context: "main app" }; </script>
//     <script src="stellar-init.js"></script>


// Define your Stellar environments
window.stellarEnvironments = {
    'custom': {
        'domains': ["www.plummarket.com", "plummarket.com"],
        'config_url': '//config-custom.js'
    },
    'staging': { 
        'domains': ["wordpress.com"],
        'config_url': 'config-dev.js'
    }, 
    'production': {
        // 'config_url': 'https://s3.amazonaws.com/stellar-plum-staging-1be6mv2w1afxt33srboh/static_files/config-staging.js?1486106114'
        'config_url': 'http://wordpress.dev/wp-content/plugins/stellar-loyalty/config.js'
    },
    'development': {
        'config_url': 'config-dev.js'
    },
    'qa': {
        'config_url': 'config-qa.js'
    }
};

var stellar_default_settings = {
    static_page_path: '',
    landing_page: 'home.html', // s3 static home page
    signup_page: 'index.html' // s3 static signup page
};
var settings = typeof wordpress_settings !== 'undefined' ? wordpress_settings.settings : stellar_default_settings;

function memberProfileFields() {
    var fields = [];
    fields.push({
        attrib: "information", source: "identity", label: "Your Information", editable: true,
        fields: [{ attrib: "first_name", source: "profile", label: "First Name: {{value}}", type: 'text',
                rules: { name: 'rules', type: 'sl-validation', required: true } }, 
            { attrib: "last_name", source: "profile", label: "Last Name: {{value}}", type: 'text', 
                rules: {  name: 'rules', type: 'sl-validation', required: true } }, 
            { attrib: "email", source: "profile", label: "Email: {{value}}", type: 'text', format: "email" }, 
            { attrib: "gender", source: "profile", label: "Gender: {{value}}", type: 'dropdown' }, 
            { attrib: "birthdate", source: "profile", label: "Birth Date: {{value}}", type: 'text', format: "localdate" }, 
            { attrib: "mobile_phone", source: "profile", label: "Mobile Number: {{value}}", type: 'text' }]
    });

    fields.push({ attrib: "address", source: "profile", label: "Address", editable: true,
        fields: [{ attrib: "mailing_street", source: "profile", label: "Street: {{value}}", type: 'text' }, 
        { attrib: "mailing_city", source: "profile", label: "City: {{value}}", type: 'text' }, 
        { attrib: "mailing_state", source: "profile", label: "State: {{value}}", type: 'text' }, 
        { attrib: "mailing_postal_code", source: "profile", label: "Zip Code: {{value}}", type: 'text' }, 
        { attrib: "mailing_country", source: "profile", label: "Country: {{value}}", type: 'dropdown', dataSource: 'countries' }]
    });

    fields.push({ attrib: "emailPreferences", source: "profile", label: "Email Preferences", editable: true,
        fields: [{ attrib: "receive_rewards_cash_back_emails", source: "profile", label: "Receive Rewards Cash Back Email {{value}}", type: 'checkbox' }, 
        { attrib: "receive_event_emails", source: "profile", label: "Receive Event Email {{value}}", type: 'checkbox' }, 
        { attrib: "receive_promotional_emails", source: "profile", label: "Receive Promotional Email {{value}}", type: 'dropdown'}]
    });
    return fields;
}

function punchcardsTemplate(item) {
    var percent = (item.punches / item.required_punches) * 100,
    desc = (item.description ? item.description : item.label);
    var circle = '<div class="c100 p' + parseInt(percent) + '"><span class="sl-brandon sl-dark-gray">' + item.punches + '/' + item.required_punches + '</span><div class="slice"><div class="bar"></div><div class="fill"></div></div></div>';
    var expires = '<p class="item-expiration">Expires ' + Stellar.ui.formatters.USDateFormat(item.punchcard_type.expiration_date) + '</p>';
    expiration = (item.punchcard_type.expiration_type == 'none') ? '' : expires;
    return '<div class="stl_content row punchcard-items">' +
        '<div class="col-lg-4 col-xs-4 punchcard-required">' + circle + '</div>' +
        '<div class="col-lg-8 col-xs-8 punchcard-content">' +
        '<p class="item-description">' + desc + '</p>' + expiration +
        '</div>' +
        '</div>';
}


function newsfeedTemplate(item) {
    var static_avatar = "./static/images/default_avatar.jpg",
        default_avatar = "//s3.amazonaws.com/stellar-dragons-o4dqcoswg6zk205ss2td/static_files/default_avatar.jpg",
        avatar_url = (item.avatar_url === static_avatar) ? default_avatar : item.avatar_url,
        target_url = "",
        attachment = "",
        tmpl;
    if (item.attachment_urls.length) {
        var regex = Stellar.util.regex.files;
        var videos = item.attachment_urls[0].match(regex.videos.url);
        var images = item.attachment_urls[0].match(regex.images.url);

        if (videos) {
            var vidType = videos[0].split(regex.videos.type);
            attachment = '<video width="auto" height="auto" controls name="media">' +
                '<source src="' + videos[0] + '" type="video/' + vidType[1].toLowerCase() + '">' +
                '</video>';
        }

        if (images) {
            attachment = '<div class="img-placeholder">' +
                '<img src="' + images[0] + '">' +
                '</div>';
        }
    }

    if (item.target_url !== null && item.target_url !== "") {
        target_url = '<br><a href="' + item.target_url + '" target="_blank">&nbsp;Click Here </a><br>';
    }

    template = '<div class="stl_content newsfeed">' +
        '<div class="user col-lg-3"><img src="' + avatar_url + '"></div>' +
        '<div class="col-lg-9">' +
        '<div class="username">ADMIN</div>' +
        '<div class="date">' + item.sl_date_label + '</div>' +
        '<p>' + item.body + target_url + '</p>' +
        '<div class="img-placeholder">' +
        attachment + '</div></div></div>';
    if (images || !videos) {
        return template;
    }

}

function couponsTemplate(data) {
    var tmpl, expiration = '';

    if( data.end_date ) {
        var date1 = new Date(data.end_date); 
        var date2 = new Date();
        var timeDiff = Math.abs(date2.getTime() - date1.getTime());
        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
        if( diffDays <= 3 && diffDays > 1 ) {
            expiration = '<div class="expiration"> <span class="expiration-circle">'+diffDays+'</span> <span class="expiration-text">Days Left</span></div>';
        } else if(diffDays == 1){
            expiration = '<div class="expiration"> <span class="expiration-circle">'+diffDays+'</span> <span class="expiration-text">Day Left</span></div>';
        } else {
            expiration = '<div class="expiration"><span class="expiration-text">Expires: '+Stellar.ui.formatters.USDateFormat(data.end_date)+'</span></div>';
        }
    }

    if (!data.is_clipped) {
        tmpl = data.html.replace('clipCoupon()', 'clipOffer(event,' + data.id + ')')
            .replace('images/clip.png', settings.static_page_path + 'images/clip.png')
            .replace('clip-item', 'clip-item' + data.id);
    } else {
        tmpl = data.html.replace('clipCoupon()', 'unclipOffer(event,' + data.id + ')')
            .replace('images/clip.png', settings.static_page_path + 'images/unclip.png')
            .replace('clip-item', 'clip-item' + data.id);
    }

    tmpl = tmpl.replace('<div class="expiration"></div>', '<div class="expiration">'+expiration+'</div>');
    return tmpl;
}


function activatedTemplate(data) {
    if (data.processing_status == "cancelled") {
        return;
    } else {
        $('.sl-empty-activated').hide();
        var offer = data.offer,
            clip = (data.processing_status == "pending") ? 'clip' : 'unclip';
        tmpl = '<div class="row coupon-item stl_content">' +
            '<div class="coupon-image col-lg-3 col-md-3 col-sm-3 col-xs-3">' +
            '<img src="' + offer.image_url + '">' +
            '</div>' +
            '<div class="coupon-content col-lg-7 col-md-7 col-sm-7 col-xs-7">' +
            '<p class="sl-brandon sl-mid-blue sl-medium">rewards ' + offer.type + '</p>' +
            '<p class="item-description sl-chalet sl-dark-blue">' + offer.heading + '</p>' +
            '<p class="sl-brandon sl-mid-blue sl-medium">' + offer.body + '</p>' +
            '<p class="sl-chalet sl-black">' + offer.details + '</p>' +
            '</div><div class="col-lg-2 col-md-2 col-sm-2  col-xs-2">' +
            '<div class="clip-item' + data.id + '"><button class="sl-clipbtn" onclick="' + clip + 'Coupon(event,' + data.id + ');"><img class="slclip' + data.id + '" src="'+settings.static_page_path+'images/' + clip + '.png"></button></div>' +
            '</div>';
    }

    return tmpl;
}

function clippedTemplate(data) {
    $('.sl-empty-clipped').hide();
    var offer = data.offer,
        tmpl = '<div class="row coupon-item stl_content">' +
        '<div class="coupon-image col-lg-3 col-md-3 col-sm-3 col-xs-3">' +
        '<img src="' + offer.image_url + '">' +
        '</div>' +
        '<div class="coupon-content col-lg-7 col-md-7 col-sm-7 col-xs-7">' +
        '<p class="sl-brandon sl-mid-blue sl-medium">rewards ' + offer.type + '</p>' +
        '<p class="item-description sl-chalet sl-dark-blue">' + offer.heading + '</p>' +
        '<p class="sl-brandon sl-mid-blue sl-medium">' + offer.body + '</p>' +
        '<p class="sl-chalet sl-black">' + offer.details + '</p>' +
        '</div><div class="col-lg-2 col-md-2 col-sm-2 col-xs-2">' +
        '<div class="clip-item' + data.id + '"><button class="sl-clipbtn" onclick="unclipCoupon(event,' + data.id + ');"><img class="slclip' + data.id + '" src="'+settings.static_page_path+'images/unclip.png"></button></div>' +
        '</div>';

    return tmpl;
}


function activitiesTemplate(data) {
    var reward = "";

    if (data.label) {
        reward = " : " + data.label;
    }
    return '<div class="row stl_content sl-activity">' +
        '<div class="col-lg-1 col-md-1 col-sm-1 col-xs-2 sl-brandon sl-white sl-left"><span class="black-circle">' + parseInt(data.metric_amount) + '</span></div>' +
        '<div class="col-lg-8 col-md-8 col-sm-8 sl-brandon-black col-xs-7 sl-mid-blue sl-small sl-left activity-details" style="padding-top: 10px">' + data.display_activity + reward + ' </div>' +
        '<div class="col-lg-3 col-md-3 col-sm-3 sl-left sl-black col-xs-3 activity-date" style="padding-top: 10px">' + Stellar.ui.formatters.USDateFormat(data.activity_ts) + '</div>' +
        '</div>';
}

function clipCoupon(event, id) {
    $('.clip-item' + id).empty().addClass('stellar-loader');
    var btn = "unclipCoupon(event," + id + ")";
    Stellar.api.callClipItem({
        id: id,
        endpoint: 'offers/responses'
    }, function (response) {
        Stellar.ui.rebuild(['stellar-offers-responses', 'stellar-offers']);
    });
    event.stopPropagation();
}

function unclipCoupon(event, id) {
    $('.clip-item' + id).empty().addClass('stellar-loader');
    var btn = "clipCoupon(event," + id + ")";
    Stellar.api.callClipItem({
        id: id,
        endpoint: 'offers/responses',
        _method: 'DELETE'
    }, function (response) {
        Stellar.ui.rebuild(['stellar-offers-responses', 'stellar-offers']);
    });
    event.stopPropagation();
}

function clipOffer(event, id) {
    $('.clip-item' + id).empty().addClass('stellar-loader');
    var btn = "unclipCoupon(event," + id + ")";
    Stellar.api.callClipItem({
        id: id,
    }, function (response) {
        Stellar.ui.rebuild(['stellar-offers-responses', 'stellar-offers']);
    });
    event.stopPropagation();
}

function unclipOffer(event, id) {
    $('.clip-item' + id).empty().addClass('stellar-loader');
    var btn = "clipCoupon(event," + id + ")";
    Stellar.api.callClipItem({
        id: id,
        _method: 'DELETE'
    }, function (response) {
        Stellar.ui.rebuild(['stellar-offers-responses', 'stellar-offers']);
    });
    event.stopPropagation();
}


// Run Stellar
// This function is called when your environment and the Stellar JS SDK are loaded and ready to run.
//
// The JS SDK will be available in the "Stellar" namespace, and you can run custom code here as needed.
// If you want to abort the standard loading then *return true* from this function .
//
// If you do not need custom code, just leave the function empty or comment it out. The default is:
//     window.runStellar = function () { return false };

window.runStellar = function() {
    window.stellarConfig.allowCrossDomain = true;
};

window.stellarReady = function () {
     var homePage =  settings.landing_page,
        signupPage = settings.signup_page,
        txt_forgot_password = /[f|F](orgot)/ig,
        txt_reset_password = /[r|R](eset)/ig,
        forgotPasswordPage = document.location.href.search(txt_forgot_password) !== -1 ? true : false,
        resetPasswordPage = document.location.href.search(txt_reset_password) !== -1 ? true : false,
        forgot_btn = $('.stellar-forgot-password');
        connected = function () {
            return $('.stellar-connected').length;
        };

    var login = Stellar.getLoginStatus();

    var PlumMarket = {};
    PlumMarket = {
        label: {
            txt_forgot_password: "forgot_password",
            txt_reset_password: "reset_password",
            error: "An error occurred. Please try again",
            error_password: "Invalid. Confirmed Password does not match."
        },
        form: function(txt) { 
            var str = PlumMarket.regexTransform(txt);
            return $('form#'+ str +'-form');
        },
        regexTransform: function(v) {
            var regexp = /[_]/ig;
            return v.replace(regexp, "-");
        },
        emailValidate: function(d) {
            if (d !== '') {
                return {
                    email: d
                }
            } else { return {} }
        },
        passwordValidate: function(d) {
            var self = this;
            var isValidPassword = (d.password === d.password_confirmation) ? true : false ;
            if (d.password !== '' && d.password_confirmation !== '') {
                if (!isValidPassword) {
                    return $(".error-message").show().html(self.label.error_password);
                }
                return {
                    reset_password_token: d.reset_password_token,
                    password: d.password,
                    password_confirmation: d.password_confirmation
                }
            } else { return {} }
        },
        forgotPasswordHandler: function(form, e) {
            e.preventDefault();
            var self = this,
                f = form,
                value = $('#email').val(),
                email_value = PlumMarket.emailValidate(value);

            f.find('.error-message').html('').fadeOut();

            Stellar.api.callForgotPassword( email_value, function(response) {
                var r = response;
                if (response.success === true) {
                    f.find('.success-message').html(r.data.message).fadeIn();
                    f.find(".form-group").fadeOut();
                    f.find('.btn').attr('disabled');
                }
                else {
                    f.find('.error-message').html(r.responseJSON.message);
                }
            });
        },
        resetPasswordHandler: function(form, e) {
            e.preventDefault();
            var f = form,
                self = this,
                password = form.find('input#password').val(),
                passwordConfirmation = form.find('input#password_confirmation').val(),
                reset_value = PlumMarket.passwordValidate({
                    reset_password_token: Stellar.util.getUrlParam('reset_password_token'),
                    password: password,
                    password_confirmation: passwordConfirmation 
                });

            if (reset_value.length) return;

            Stellar.api.callResetPassword(reset_value, function(response){
                var r = response;
                if (r.success === true) {
                    f.find('input#password').val('');
                    f.find('input#password').attr('disabled');

                    f.find('input#password_confirmation').val('');
                    f.find('input#password_confirmation').attr('disabled');

                    f.find('.form-group.password').fadeOut();
                    // Hide Error Message
                    f.find('.error-message').html('').fadeOut();
                    // Show success message
                    f.find('.success-message').fadeIn();
                }
                else {
                    f.find('.error-message').show().html(r.responseJSON.message);
                }
            });
        },
        init: function(pageDetect) {
            var self = this,
                p = pageDetect || {},
                d = p.isForgot ? self.label.txt_forgot_password : self.label.txt_reset_password,
                _f = self.form, f;

            // Remove disable attribute from button
            _f(d).find('.btn').removeAttr('disabled');

            // Stellar.validate
            Stellar.validate(_f(d)[0], { 
                realTime: true,
                onValid: function(e) {
                    e.preventDefault();
                    // Event Listener
                    f = _f(d);
                    if (p.isForgot) {
                        return PlumMarket.forgotPasswordHandler(f, e);
                    } 
                    else if (p.isReset) {
                        return PlumMarket.resetPasswordHandler(f, e);
                    }
                }
            });
            
        }
    };

    function setPath(path) {
        if (location.pathname.indexOf(path) < 0) {
            window.location = path;
        }
    }

    if (!login && !forgotPasswordPage && !resetPasswordPage) {
        setPath(signupPage);
    } else if (login && !connected()) {
        setPath(homePage);
    } else {
        // Customize and remove target attribute
        forgot_btn.removeAttr('target');
    }

    Stellar.events.bind('auth.login', function () { setPath(homePage); });

    Stellar.events.bind('auth.logout', function () { setPath(signupPage); });

    Stellar.events.bind('auth.signup', function () { setPath(homePage); });

    Stellar.events.bind('member.connected', function () {
        if (window.location.pathname === signupPage) { setPath(homePage); }
    });

    Stellar.events.bind('contentTokens.loaded', function () {
        if ($('.stellar-home').length) {
            var points = parseInt(Stellar.member.summary.metrics.point.balance);
            var len = (points.toString().length);

            if( len == 1 ){
                $('.stl_token_points').css("padding-left","55px");
            } else if (len==2){
                $('.stl_token_points').css("padding-left","25px");
            }
            var percentage = (points / 500);
            $("#slbar").attr("data-percent", parseInt(percentage));
            $('.second.circle').circleProgress({
                value: percentage,
                size: 350,
                fill: {
                    gradient: ["#3B4C61", "#A0DADF"]
                },
                startAngle: 4.8,
                thickness: 30,
                emptyFill: "#ffffff"
            });
            $('.stl_token_points').text(points);
        }
    });

    if (Stellar.member.isKnown) {
        Stellar.api.callRewardsResponses({}, function (data) {
            $('.rewards-count').text(Stellar.member.rewardsResponses.default.length);
            $('.rewards-information').text('CLICK FOR MORE INFORMATION.');
        });

        Stellar.api.callRewards({}, function (data) {
            var reward = Stellar.member.rewards.default, body;
            for (var i in reward) {
                body = reward[i].body;
                $('.reward-body').text(body.toUpperCase());
            }
        });
    }

    // Plum Market Forgot/Reset Password Page
    if (forgotPasswordPage || resetPasswordPage) {
        PlumMarket.init({ isForgot: forgotPasswordPage, isReset: resetPasswordPage });
    }

    if ($('.stellar-signup-page, .stellar-forgot-password-page, .stellar-reset-password-page').length) {
        $('.stellar-signup-page, .stellar-forgot-password-page, .stellar-reset-password-page').closest('.container-main').css('background-color', '#000').css('padding', '0px');    
    }

    $('ul.tabs').each(function () {
        var $active, $content, $links = $(this).find('a');
        $active = $($links.filter('[href="' + location.hash + '"]')[0] || $links[0]);
        $active.addClass('active');
        $content = $($active[0].hash);
        $links.not($active).each(function () {
            $(this.hash).hide();
        });
        $(this).on('click', 'a', function (e) {
            $active.removeClass('active');
            $content.hide();
            $active = $(this);
            $content = $(this.hash);
            $active.addClass('active');
            $content.show();
            e.preventDefault();
        });
    });

    $('.rewards-information').on('click', function (e) {
        var rewardText = "",
            rewards = Stellar.member.rewardsResponses.default;
        for (var i in rewards) {
            var count = parseInt(i) + 1;
            rewardText += '<div class="row"><div class="col-lg-2"><span class="rewards-count-circle sl-white sl-brandon">' + count 
            + '</span></div><div class="col-lg-4 sl-brandon sl-mid-blue sl-small sl-left my-rewards-body">' + rewards[i].reward.heading + 
            ' </div><div class="col-lg-3"><p class="my-rewards-expiration">Activated '+Stellar.ui.formatters.USDateFormat(rewards[i].reward.start_date)+'</p></div><div class="col-lg-3"><p class="my-rewards-expiration">Expires '+Stellar.ui.formatters.USDateFormat(rewards[i].reward.end_date)+'</p></div></div>';
        }
        opts = {
            title: 'My Rewards',
            type: 'my-rewards large',
            body: '<h1 style="padding-top: 20px;" class="reward-info sl-gold sl-brandon sl-center">You’ve activated <span class="rewards-count rewards-count-circle rewards-count-circle-title sl-white">' + Stellar.member.rewardsResponses.default.length + '</span> rewards</h1>' + rewardText
        }
        Stellar.ui.openPopup(opts);
        e.preventDefault();
    });

};



//////////////////////////////////////////
// DO NOT EDIT ANY CODE BELOW THIS LINE //
//////////////////////////////////////////
//
// Stellar Init
// Copyright (c) 2016 Stellar Loyalty, Inc. All Rights Reserved
//
// This script bootstraps the Stellar JS SDK
// 1. detect environment
// 2. load environment-specific config.js
// 3. config.js calls window.stellarLoadApp to load JS SDK
// 4. window.stellarLoadApp calls window.stellarAsyncInit to load web app
//

(function () {
    if (typeof window.stellarInitOpts == "undefined") { window.stellarInitOpts = { context: "", isDefault: true } }

    var host = location.hostname,
        env;
    if (host.indexOf("local.") === 0 || host.indexOf("sdk.") === 0) { env = 'development' } 
    else if (window.stellarEnvironments.custom.domains.indexOf(host) !== -1) { env = 'custom' } 
    else if (host.indexOf("demostellar.com") !== -1 || window.stellarEnvironments.staging.domains.indexOf(host) !== -1) { env = 'staging' } 
    else { env = 'production' }
    window.stellarInitOpts.environment = env;

    window.stellarScriptLoader = function (d, s, id, src, dm, successCallback) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) { return; }
        js = d.createElement(s); js.id = id; js.src = src;
        if (dm) { js.setAttribute('data-main', dm) }

        successCallback = successCallback || function () {};
        if (js.readyState) {
            el.onreadystatechange = function () {
                if (el.readyState == 'loaded' || el.readyState == 'complete') {
                    el.onreadystatechange = null;
                    successCallback();
                }
            }
        } else { js.onload = successCallback; }
        fjs.parentNode.insertBefore(js, fjs);
    };

    console.log("loading stellar-config:", window.stellarEnvironments[window.stellarInitOpts.environment].config_url);
    window.stellarScriptLoader(document, 'script', 'stellar-config', window.stellarEnvironments[window.stellarInitOpts.environment].config_url); // calls window.stellarLoadApp

    window.stellarLoadApp = function (config) {
        window.stellarConfig = config;

        if ((config.environment == 'staging' || config.environment == 'production') && config.sentry && config.sentry.dsn) {
            window.stellarScriptLoader(document, 'script', 'stellar-sentry', '//cdn.ravenjs.com/3.0.4/raven.min.js', null, function () {
                Raven.config(config.sentry.dsn).install();
            });
        }

        if (window.stellarInitOpts.environment == 'development') { config.client.sdk = '../dev/sdk.js'; }
        config.environment = config.environment || window.stellarInitOpts.environment;
        if (config.environment !== window.stellarInitOpts.environment) {
            console.log('WARNING - detected environment does not match configuration');
        }
        window.stellarScriptLoader(document, 'script', 'stellar-sdk', config.client.sdk); // calls window.stellarAsyncInit
    }

    window.stellarAsyncInit = function () {
        if (typeof window.runStellar === "undefined") { window.runStellar = function () {} }
        if (typeof window.stellarReady === "undefined") { window.stellarReady = function () {} }
        Stellar.initOpts(window.stellarConfig);
        if (!window.runStellar(window.stellarConfig)) {
            //Stellar.init(window.stellarConfig, Stellar.ui.refresh, window.stellarReady);
            Stellar.init(window.stellarConfig, function () { window.stellarReady(); Stellar.ui.refresh(); });
            if (window.stellarConfig.themeUrl) { stellarScriptLoader(document, 'script', 'stellar-theme', window.stellarConfig.themeUrl) }
        }
    };

})();