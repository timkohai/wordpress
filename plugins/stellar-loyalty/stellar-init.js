// Stellar Init
// This script detects an environment and loads the appropriate configuration and the Stellar JS SDK.
// To use this script, include it on your web page as follows:
//     <script> window.stellarInitOpts = { context: "main app" }; </script>
//     <script src="stellar-init.js"></script>


// Define your Stellar environments
window.stellarEnvironments = {
    'custom': {
        'domains': ["www.plummarket.com", "plummarket.com", "dev.plummarket.com", "wordpress.dev"],
        'config_url': 'https://s3.amazonaws.com/stellar-plum-et52jbwvll5pdiubfmzk/static_files/config-prod.js?1487222892'
        // 'config_url': 'http://wordpress.dev/wp-content/plugins/stellar-loyalty/config-staging.js'
    },
    'staging': {
        'domains': ["plum-staging-s3.demostellar.com"],
        'config_url': 'https://s3.amazonaws.com/stellar-plum-staging-1be6mv2w1afxt33srboh/static_files/config-staging.js?1487223149'
    },
    'production': {
        'config_url': 'https://s3.amazonaws.com/stellar-plum-et52jbwvll5pdiubfmzk/static_files/config-prod.js?1487222892'
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
            { attrib: "email", source: "profile", label: "Email: {{value}}", type: 'text', format: "email",
                rules: {  name: 'rules', type: 'sl-validation', required: true } },  
            { attrib: "gender", source: "profile", label: "Gender: {{value}}", type: 'dropdown' }, 
            { attrib: "birthdate", source: "profile", label: "Birth Date: {{value}}", type: 'text', format: "localdate" }, 
            { attrib: "mobile_phone", source: "profile", label: "Mobile Number: {{value}}", type: 'text',
                    rules: { name: 'rules', type: 'sl-validation', number: true }
             }]
    });

    fields.push({ attrib: "address", source: "profile", label: "Address", editable: true,
        fields: [{ attrib: "mailing_street", source: "profile", label: "Street: {{value}}", type: 'text' }, 
        { attrib: "mailing_city", source: "profile", label: "City: {{value}}", type: 'text' }, 
        { attrib: "mailing_state", source: "profile", label: "State: {{value}}", type: 'text' }, 
        { attrib: "mailing_postal_code", source: "profile", label: "Zip Code: {{value}}", type: 'text',
            rules: { name: 'rules', type: 'sl-validation', number: true, maxLength: '5', minLength: '5' }
        }, 
        { attrib: "mailing_country", source: "profile", label: "Country: {{value}}", type: 'dropdown', dataSource: 'countries' }]
    });

    fields.push({ attrib: "emailPreferences", source: "profile", label: "Email Preferences", editable: true,
        fields: [{ attrib: "receive_rewards_cash_back_emails", source: "profile", label: "Receive Rewards Cash Back Email: {{value}}", type: 'checkbox' }, 
        { attrib: "receive_event_emails", source: "profile", label: "Receive Event Email: {{value}}", type: 'checkbox' }, 
        { attrib: "receive_promotional_emails", source: "profile", label: "Receive Promotional Email: {{value}}", type: 'dropdown'}]
    });
    return fields;
}

function emailPreferencesFields() {
  var fields = [];

   fields.push({ attrib: "emailPreferences", source: "profile", label: "Email Preferences", editable: true,
        fields: [{ attrib: "receive_rewards_cash_back_emails", source: "profile", label: "Receive Rewards Cash Back Email: {{value}}", type: 'checkbox' }, 
        { attrib: "receive_event_emails", source: "profile", label: "Receive Event Email: {{value}}", type: 'checkbox' }, 
        { attrib: "receive_promotional_emails", source: "profile", label: "Receive Promotional Email: {{value}}", type: 'dropdown'}]
    });
    return fields;
}

function punchcardsTemplate(item) {
    var percent = (item.punches / item.required_punches) * 100,
    desc = (item.heading ? item.heading : item.label);
    var expires = '<p class="item-expiration">Expires ' + Stellar.ui.formatters.USDateFormat(item.punchcard_type.expiration_date) + '</p>';
    expiration = (item.punchcard_type.expiration_type == 'none') ? '' : expires;
    
    return '<div class="stl_content">'+
        '<div class="col-sm-4 col-xs-3 circle-canvas">'+
            '<div class="punchcard-circle-container">'+
                '<canvas class="punchcard-circle-canvas" data-percent="'+ percent +'"></canvas>'+
                '<div class="punchcard-circle-content">'+
                    '<span class="points">'+ item.punches + '/' + item.required_punches +'</span>'+
                '</div>'+
            '</div>'+
        '</div>'+
        '<div class="col-sm-8 col-xs-9 circle-content">'+
            '<div class="punchcard-desc">'+ desc +'</div>'+ expiration +
        '</div>'+
    '<div>';
}

function punchcardsHandler(item) {
    var percent = (item.punches / item.required_punches) * 100,
    desc = (item.description ? item.description : item.label);
    var expires = '<p class="item-expiration">Expires ' + Stellar.ui.formatters.USDateFormat(item.punchcard_type.expiration_date) + '</p>';
    expiration = (item.punchcard_type.expiration_type == 'none') ? '' : expires;
    
    var circle = '<div class="punchcard-circle-container">'+
                '<canvas class="punchcard-circle-canvas" data-percent="'+ percent +'"></canvas>'+
                '<div class="punchcard-circle-content">'+
                    '<span class="points">'+ item.punches + '/' + item.required_punches +'</span>'+
                '</div>'+
            '</div>';    

    var body = '<div class="punchcard-items">' +
        '<div class="punchcard-required">' + circle + '</div>' +
        '<div class="punchcard-content">' +
        '<p class="item-description">' + item.heading + '</p>' + 
        '<p class="item-subheading">'+ item.subheading +'</p>' +
        '<p class="item-body">'+ item.body +'</p>' +
        '<p class="item-details">'+ item.details +'</p>' +
        expiration +
        '</div>' +
        '</div>';

    Stellar.ui.openPopup({
      type: 'punchcard-details',
      title: "<h2>"+(item.description || "Rewards Circle")+"</h2>",
      body: body,
      callbacks: {
        open: function() {
            var elem = $.magnificPopup.instance.content.find('.punchcard-circle-canvas')[0]
            punchcardProgressBar(elem);
        }
      }
    });
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
    jQuery('.sl-empty-coupons').hide();
    var tmpl, expiration = '';

    if( data.end_date ) {
        var date1 = new Date(data.end_date); 
        var date2 = new Date(); 
        var timeDiff = Math.abs(date2.getTime() - date1.getTime());
        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
        if( diffDays <= 3 && diffDays > 1 ) {
                 expiration = '<div class="expiration"> <span class="expiration-circle">'+diffDays+'</span> <span class="coupon-expiration sl-brandon sl-mid-blue">Days Left</span> <div class="coupon-expires-at">Expires '+Stellar.ui.formatters.slashFormat(data.end_date)+'</div></div>';
        } else if(diffDays == 1){
                 expiration = '<div class="expiration"> <span class="expiration-circle">'+diffDays+'</span> <span class="coupon-expiration sl-brandon sl-mid-blue">Day Left</span> <div class="coupon-expires-at">Expires '+Stellar.ui.formatters.slashFormat(data.end_date)+'</div></div>';
        } else {
            expiration = '<div class="expiration"><span class="expiration-text">Expires: '+Stellar.ui.formatters.slashFormat(data.end_date)+'</span></div>';
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

    tmpl = jQuery(tmpl).find('.stl_details').html(Stellar.util.truncateString(data.details, 100)).end().prop('outerHTML');

    tmpl = tmpl.replace('<div class="expiration"></div>', '<div class="expiration">'+expiration+'</div>');
    return tmpl;
}


function activatedTemplate(data) {
    if (data.processing_status == "cancelled") {
        return;
    } else {
        jQuery('.sl-empty-activated').hide();
        var offer = data.offer,
            isClip = (data.processing_status == "pending") ? 'clip' : 'unclip';

        var tmpl = '<div class="row coupon-item stl_content">' +
            '<div class="coupon-image col-lg-3 col-md-3 col-sm-3 col-xs-3">' +
            '<img src="' + offer.image_url + '">' +
            '</div>' +
            '<div class="coupon-content col-lg-7 col-md-7 col-sm-7 col-xs-7">' +
            '<p class="sl-brandon sl-mid-blue sl-medium">' + offer.heading + '</p>' +
            '<p class="item-description sl-chalet sl-dark-blue">' + offer.subheading + '</p>' +
            '<p class="sl-brandon sl-mid-blue sl-medium">' + offer.body + '</p>' +
            '<p class="sl-chalet sl-black">' + offer.details + '</p>' +
            '</div><div class="col-lg-2 col-md-2 col-sm-2  col-xs-2">' +
            '<div class="clip-item '+ isClip +'" onclick="checkClipCoupon(this,event,'+data.id+')"></div>';
            '</div>';
    }

    return tmpl;
}

function couponsCustomHandler(data) {
    var clipIcon = !data.is_clipped ? 'plus' : 'minus';
    var clipClass = !data.is_clipped ? 'clip' : 'unclip';
    var expiration = '';

    if( data.end_date ) {
        expiration = '<div class="expiration"><span class="expiration-text">Expires: '+Stellar.ui.formatters.slashFormat(data.end_date)+'</span></div>';
    }
    var tmpl = '<div class="row">' +
            '<div class="coupon-image col-md-4 col-md-offset-4">' +
            '<img src="' + data.image_url + '">' +
            '</div>' +
            '<div style="clear:both;"></div>' +
            '<div class="coupon-content">' +
            '<p class="item-description sl-chalet sl-dark-blue">' + data.heading + '</p>' +
            '</div class="item-expiration">'+expiration+'<div>' +
            '<p class="sl-brandon sl-mid-blue sl-medium item-body">' + data.body + '</p>' +
            '<p class="sl-chalet sl-black item-details">' + data.details + '</p>' +
            '<div class="clip-item '+ clipClass +'" data-element-type="offer" onclick="checkClipCoupon(this,event,'+data.id+')"><span class="fa fa-'+clipIcon+'"></spa></div>' +
            '</div>';

    Stellar.ui.openPopup({
      type: 'earned-offers-response-details',
      title: "<h2>"+(data.description || "Rewards Coupon")+"</h2>",
      body: tmpl
    });
    return true;
}

function couponsEarnedCustomHandler(data) {
    var offer = data.offer,
        clipIcon = (data.processing_status == "pending") ? 'plus' : 'minus';
        clipClass = (data.processing_status == "pending") ? 'clip' : 'unclip';
    // var clipText = (data.processing_status == "pending") ? '+' : '-';
    var tmpl = '<div class="row">' +
            '<div class="coupon-image col-md-4 col-md-offset-4">' +
            '<img src="' + offer.image_url + '">' +
            '</div>' +
            '<div style="clear:both;"></div>' +
            '<div class="coupon-content">' +
            '<p class="item-description sl-chalet sl-dark-blue">' + offer.heading + '</p>' +
            '<p class="sl-brandon sl-mid-blue sl-medium">' + offer.body + '</p>' +
            '<p class="sl-chalet sl-black">' + offer.details + '</p>' +
            '</div><div>' +
            '<div class="clip-item '+clipClass+'" onclick="checkClipCoupon(this,event,'+data.id+')"><span class="fa fa-'+clipIcon+'"></spa></div>' +
            '</div>';

    Stellar.ui.openPopup({
      type: 'earned-offers-response-details',
      title: "<h2>"+(offer.description || "Rewards Coupon")+"</h2>",
      body: tmpl
    });
}

function couponsClipCustomHandler(data) {
    var offer = data.offer,
        clipICon = (data.processing_status == "pending") ? 'plus' : 'minus',
        clipClass = (data.processing_status == "pending") ? 'clip' : 'unclip';

    if( offer.end_date ) {
        var date1 = new Date(offer.end_date); 
        var date2 = new Date(); 
        var timeDiff = Math.abs(date2.getTime() - date1.getTime());
        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
        if( diffDays <= 3 && diffDays > 1 ) {
                 expiration = '<div class="expiration"> <span class="expiration-circle">'+diffDays+'</span> <span class="coupon-expiration sl-brandon sl-mid-blue">Days Left</span> <div class="coupon-expires-at">Expires '+Stellar.ui.formatters.slashFormat(offer.end_date)+'</div></div>';
        } else if(diffDays == 1){
                 expiration = '<div class="expiration"> <span class="expiration-circle">'+diffDays+'</span> <span class="coupon-expiration sl-brandon sl-mid-blue">Day Left</span> <div class="coupon-expires-at">Expires '+Stellar.ui.formatters.slashFormat(offer.end_date)+'</div></div>';
        } else {
            expiration = '<div class="expiration"><span class="expiration-text">Expires: '+Stellar.ui.formatters.slashFormat(offer.end_date)+'</span></div>';
        }
    }


    var tmpl = '<div class="row">' +
            '<div class="coupon-image col-md-4 col-md-offset-4">' +
            '<img src="' + offer.image_url + '">' +
            '</div>' +
            '<div style="clear:both;"></div>' +
            '<div class="coupon-content">' +
            '<p class="item-description sl-chalet sl-dark-blue">' + offer.heading + '</p>' +
            '<p class="item-subheading">' + offer.subheading + '</p>' +
            '<p class="sl-brandon sl-mid-blue sl-medium">' + offer.body + '</p>' +
            '<p class="sl-chalet sl-black">' + offer.details + '</p>' +
            '<div class="expiration">'+expiration+'</div>'+
            '<div class="clip-item '+clipClass+'" onclick="checkClipCoupon(this,event,'+data.id+')"><span class="fa fa-'+clipICon+'"></spa></div>' +
            '</div>';

    Stellar.ui.openPopup({
      type: 'earned-offers-response-details',
      title: "<h2>"+(offer.description || "Rewards Coupon")+"</h2>",
      body: tmpl
    });
}

function clippedTemplate(data) {
    jQuery('.sl-empty-clipped').hide();
    var offer = data.offer, expiration = '';

        if (offer.end_date) {
            expiration = '<div class="item-expiration"><span class="expiration-text">Expires: '+Stellar.ui.formatters.slashFormat(offer.end_date)+'</span></div>';
        }

        tmpl = '<div class="row coupon-item stl_content">' +
        '<div class="coupon-image col-lg-3 col-md-3 col-sm-3 col-xs-3">' +
        '<img src="' + offer.image_url + '">' +
        '</div>' +
        '<div class="coupon-content col-lg-7 col-md-7 col-sm-7 col-xs-7">' +
        '<p class="sl-brandon sl-mid-blue sl-medium">' + offer.heading + '</p>' +
        '<p>'+expiration+'<p>'+
        '<p class="item-description sl-chalet sl-dark-blue">' + offer.subheading + '</p>' +
        '<p class="sl-brandon sl-mid-blue sl-medium">' + offer.body + '</p>' +
        '<p class="sl-chalet sl-black">' + offer.details + '</p>' +
        '</div><div class="col-lg-2 col-md-2 col-sm-2 col-xs-2">' +
        '<div class="clip-item unclip" onclick="checkClipCoupon(this,event,'+data.id+')"></div>';
        '</div>';

    return tmpl;
}


function activitiesTemplate(data) {
    var reward = "";

    if (data.label) {
        reward = " : " + data.label;
    }
    var date = Stellar.ui.formatters.slashFormat(data.activity_ts);

    var html = '<li class="stl_content">'+
        '<div class="points">'+
            '<div>'+ parseInt(data.metric_amount) +'</div>'+
        '</div>'+
        '<div class="description">'+
            '<div class="heading">' + data.display_activity + reward + '</div>'+
            '<div class="date">' + date +'</div>'+
        '</div>'+
        '<div class="date"><div>' + date + '</div></div>'+
    '</li>';

    return html;
}

function limitResponse(response){
    if(response.success === true){
            Stellar.ui.rebuild(['stellar-offers-responses', 'stellar-offers']);
        } else {
            Stellar.ui.openPopup({
                  type: 'clip-coupon-error',
                  title: "<h2>Error!</h2>",
                  body: response.responseJSON.message,
                });
            Stellar.ui.rebuild(['stellar-offers-responses', 'stellar-offers']);    
        }
}

function clipCoupon(event, id) {
    jQuery('.clip-item' + id).hide().addClass('stellar-loader');
    var btn = "unclipCoupon(event," + id + ")";
    Stellar.api.callClipItem({
        id: id,
        endpoint: 'offers/responses'
    }, function (response) {
        limitResponse(response);
    });
    event.stopPropagation();
}

function unclipCoupon(event, id) {
    jQuery('.clip-item' + id).empty().addClass('stellar-loader');
    var btn = "clipCoupon(event," + id + ")";
    Stellar.api.callClipItem({
        id: id,
        endpoint: 'offers/responses',
        _method: 'DELETE'
    }, function (response) {
        limitResponse(response);
    });
    event.stopPropagation();
}

function clipOffer(event, id) {
    jQuery('.clip-item' + id).empty().addClass('stellar-loader');
    var btn = "unclipCoupon(event," + id + ")";
    Stellar.api.callClipItem({
        id: id,
    }, function (response) {
        limitResponse(response);
    });
    event.stopPropagation();
}

function unclipOffer(event, id) {
    jQuery('.clip-item' + id).empty().addClass('stellar-loader');
    var btn = "clipCoupon(event," + id + ")";
    Stellar.api.callClipItem({
        id: id,
        _method: 'DELETE'
    }, function (response) {
        limitResponse(response)
    });
    event.stopPropagation();
}

var rewardsCount = 0;
function rewardResponseTemplate(item) {
    rewardsCount++;

    var activated = '', expired = '';
    if (item.reward.start_date) {
        activated = '<p class="my-rewards-expiration">Activated '+Stellar.ui.formatters.USDateFormat(item.reward.start_date)+'</p>';
    }
    if (item.reward.end_date) {
        expired = '<p class="my-rewards-expiration">Expires '+Stellar.ui.formatters.USDateFormat(item.reward.end_date)+'</p>'
    }

    var html = '<div class="stl_content row">'+
       '<div class="col-lg-2"><span class="rewards-count-circle sl-white sl-brandon">'+rewardsCount+'</span></div>'+
       '<div class="col-lg-4 sl-brandon sl-mid-blue sl-small sl-left my-rewards-body">'+item.reward.heading+'</div>'+
       '<div class="col-lg-3">'+ activated +'</div>'+
       '<div class="col-lg-3">'+ expired +'</div>'+
    '</div>';
    return html;
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

    $j = jQuery.noConflict(); // fix jquery conflict;

    if (document.querySelector('#redirect_to_forgot_password')) {
        var redirect_path = config.hostname + '/forgot_password.html';
        console.log ("redirecting to:", redirect_path);
        window.location.href = redirect_path;
    }

    $j('.stellar-nav-icon').on('click keypress', function() {
        $j('.sl-navigation').slideToggle();
    });
};

window.stellarReady = function () {
    // jQuery no conflict

    $j('.logout-link').on('click', function(event) {
        event.stopPropagation();
        event.preventDefault();
        Stellar.logout();
    });

     var homePage =  settings.landing_page,
        signupPage = settings.signup_page,
        txt_forgot_password = /[f|F](orgot)/ig,
        txt_reset_password = /[r|R](eset)/ig,
        forgotPasswordPage = document.location.href.search(txt_forgot_password) !== -1 ? true : false,
        resetPasswordPage = document.location.href.search(txt_reset_password) !== -1 ? true : false,
        forgot_btn = $j('.stellar-forgot-password');
        connected = function () {
            return $j('.stellar-connected').length;
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
            return $j('form#'+ str +'-form');
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
                    return $j(".error-message").show().html(self.label.error_password);
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
                value = $j('#email').val(),
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
        if (window.location.pathname.indexOf(signupPage) !== -1) { setPath(homePage); }
    });

    Stellar.events.bind('contentTokens.loaded', function () {
        if ($j('.stellar-home-page').length) {
            var points = parseInt(Stellar.member.summary.metrics.point.balance);
            var percentage = (points / 500) * 100;
            var elem = document.querySelector('.rewards-circle-canvas');
            punchcardProgressBar(elem, {
                percent: percentage,
                innerR: 56,
                colorStart: '#a0dadf',
                colorEnd: '#ebf7f5'
            });
            $j('.stl_token_points').text(points);
        }
    });

    Stellar.events.bind('rewardsResponses.loaded', function(response) {
        $j('.activated-rewards-count').html(response.length || 0);
    });

    Stellar.events.bind('rewards.loaded', function(response) {
        $j('.reward-body').html(response[0].body);
    });

    Stellar.events.bind('punchcards.loaded', function(response) {
        var elem = document.querySelectorAll('.punchcard-circle-canvas');
        for (var i = 0; i < elem.length; i++) {
            punchcardProgressBar(elem[i]);
        }
    });

    // Plum Market Forgot/Reset Password Page
    if (forgotPasswordPage || resetPasswordPage) {
        PlumMarket.init({ isForgot: forgotPasswordPage, isReset: resetPasswordPage });
    }

    $j('ul.tabs').each(function () {
        var $active, $content, $links = $j(this).find('a');
        $active = $j($links.filter('[href="' + location.hash + '"]')[0] || $links[0]);
        $active.addClass('active');
        $content = $j($active[0].hash);
        $links.not($active).each(function () {
            $j(this.hash).hide();
        });
        $j(this).on('click', 'a', function (e) {
            $active.removeClass('active');
            $content.hide();
            $active = $j(this);
            $content = $j(this.hash);
            $active.addClass('active');
            $content.show();
            e.preventDefault();
        });
    });

    $j('.rewards-more-info').on('click', function (e) {
        if (Stellar.member.rewardsResponses === 'undefined') { return }
        var rewardResponses = $j('.stellar-rewards-responses');
        var count = rewardResponses.children().length;

        var body = '<h1 style="padding-top: 20px;" class="reward-info sl-gold sl-brandon sl-center">You’ve activated '+
        '<span class="rewards-count rewards-count-circle rewards-count-circle-title sl-white">' + count + '</span> rewards</h1><div class="rewards-responses-content">' + rewardResponses.html() + '</div>';
        
        opts = {
            title: 'My Rewards',
            type: 'my-rewards large',
            body: body
        }
        Stellar.ui.openPopup(opts);
        e.preventDefault();
    });


    $j('.stellar-wrapper').fadeIn('slow');

}; // end of stellarReady

function punchcardProgressBar(elem, options) {
    options = options || {};
    var percent = options.percent || elem.getAttribute('data-percent');
    new DoughnutProgressBar({
        element: elem,
        innerR: options.innerR || 55,
        outerR: 70,
        colorStart: options.colorStart || '#a0dadf',
        colorEnd: options.colorEnd || '#222944',
        fillColor: '#fff',
        percentage: 0,
        duration: options.duration || 600
    }).setPercentage(percent);
}


function checkClipCoupon(elem, e, id) {
    // check if clipped or not
    var clip = jQuery(elem).hasClass('clip');

    jQuery(elem).removeClass('unclip clip'); 
    jQuery(elem).addClass('stellar-loader');
    jQuery(elem).html('');
    var isCoupon = jQuery(elem).data('element-type') ? true : false;
    if(isCoupon) {
        jQuery(elem).removeClass('stellar-loader');
        jQuery('<span class="fa fa-spin fa-spinner"></span>').appendTo(jQuery(elem));
    }
    Stellar.api.callClipItem({
        id: id,
        _method: clip ? 'POST' : 'DELETE',
        endpoint: isCoupon ? 'offers' : 'offers/responses'
    }, function (response) {
        setTimeout(function() {
            jQuery('.mfp-close.stellar-btn-close').trigger('click');
        }, 1000);
        limitResponse(response);
    });
    e.stopPropagation();
}


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
            js.onreadystatechange = function () {
                if (js.readyState == 'loaded' || js.readyState == 'complete') {
                    js.onreadystatechange = null;
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