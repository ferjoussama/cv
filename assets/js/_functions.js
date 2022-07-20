/**
 * Certy Functions
 */

/* Lock Window Scroll */
certy.lockScroll = function(){
    var initWidth = certy.vars.html.outerWidth();
    var initHeight = certy.vars.body.outerHeight();

    var scrollPosition = [
        self.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft,
        self.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
    ];

    certy.vars.html.data('scroll-position', scrollPosition);
    certy.vars.html.data('previous-overflow', certy.vars.html.css('overflow'));
    certy.vars.html.css('overflow', 'hidden');
    window.scrollTo(scrollPosition[0], scrollPosition[1]);

    var marginR = certy.vars.body.outerWidth() - initWidth;
    var marginB = certy.vars.body.outerHeight() - initHeight;
    certy.vars.body.css({'margin-right': marginR, 'margin-bottom': marginB});
    certy.vars.html.addClass('lock-scroll');
};

/* Unlock Window Scroll */
certy.unlockScroll = function(){
    certy.vars.html.css('overflow', certy.vars.html.data('previous-overflow'));
    var scrollPosition = certy.vars.html.data('scroll-position');
    window.scrollTo(scrollPosition[0], scrollPosition[1]);

    certy.vars.body.css({'margin-right': 0, 'margin-bottom': 0});
    certy.vars.html.removeClass('lock-scroll');
};

/* Detect Device Type */
function ace_detect_device_type() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        ace.mobile = true;
        ace.html.addClass('crt-mobile');
    } else {
        ace.mobile = false;
        ace.html.addClass('crt-desktop');
    }
}

/* Certy Overlay */
function ace_append_overlay() {
    ace.body.append(ace.overlay.obj);

    // Make the element fully transparent
    ace.overlay.obj[0].style.opacity = 0;

    // Make sure the initial state is applied
    window.getComputedStyle(ace.overlay.obj[0]).opacity;

    // Fade it in
    ace.overlay.obj[0].style.opacity = 1;
}

function ace_remove_overlay() {
    // Fade it out
    ace.overlay.obj[0].style.opacity = 0;

    // Remove overlay
    ace.overlay.obj.remove();
}

/* Certy Lock Scroll */
function ace_lock_scroll() {
    var initWidth = ace.html.outerWidth();
    var initHeight = ace.body.outerHeight();

    var scrollPosition = [
        self.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft,
        self.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
    ];

    ace.html.data('scroll-position', scrollPosition);
    ace.html.data('previous-overflow', ace.html.css('overflow'));
    ace.html.css('overflow', 'hidden');
    window.scrollTo(scrollPosition[0], scrollPosition[1]);

    var marginR = ace.body.outerWidth() - initWidth;
    var marginB = ace.body.outerHeight() - initHeight;
    ace.body.css({'margin-right': marginR, 'margin-bottom': marginB});
    ace.html.addClass('crt-lock-scroll');
}

/* Certy Unlock Scroll */
function ace_unlock_scroll() {
    ace.html.css('overflow', ace.html.data('previous-overflow'));
    var scrollPosition = ace.html.data('scroll-position');
    window.scrollTo(scrollPosition[0], scrollPosition[1]);

    ace.body.css({'margin-right': 0, 'margin-bottom': 0});
    ace.html.removeClass('crt-lock-scroll');
}

/* Certy Close Sidebar */
function ace_open_sidebar() {
    ace.html.addClass('crt-sidebar-opened');
    ace_append_overlay();
    ace_lock_scroll();
}

function ace_close_sidebar() {
    ace.html.removeClass('crt-sidebar-opened');
    ace_remove_overlay();
    ace_unlock_scroll();
}

/* Certy Progress Circle */
function ace_progress_chart(element, text, value, duration) {
    var circle = new ProgressBar.Circle(element, {
        color: certy.vars.themeColor,
        strokeWidth: 5,
        trailWidth: 0,
        text: {
            value: text,
            className: 'progress-text',
            style: {
                top: '50%',
                left: '50%',
                color: certy.progress.textColor,
                position: 'absolute',
                margin: 0,
                padding: 0,
                transform: {
                    prefix: true,
                    value: 'translate(-50%, -50%)'
                }
            },
            autoStyleContainer: true,
            alignToBottom: true
        },
        svgStyle: {
            display: 'block',
            width: '100%'
        },
        duration: duration,
        easing: 'easeOut'
    });

    circle.animate(value); // Number from 0.0 to 1.0
}

/* Certy Progress Line */
function ace_progress_line(element, text, value, duration) {
    var line = new ProgressBar.Line(element, {
        strokeWidth: 4,
        easing: 'easeInOut',
        duration: duration,
        color: certy.vars.themeColor,
        trailColor: certy.progress.trailColor,
        trailWidth: 4,
        svgStyle: {
            width: '100%',
            height: '100%'
        },
        text: {
            value: text,
            className: 'progress-text',
            style: {
                top: '-25px',
                right: '0',
                color: certy.progress.textColor,
                position: 'absolute',
                margin: 0,
                padding: 0,
                transform: {
                    prefix: true,
                    value: 'translate(0, 0)'
                }
            },
            autoStyleContainer: true
        }
    });

    line.animate(value);  // Number from 0.0 to 1.0
}

/* Certy Element In Viewport */
function ace_is_elem_in_viewport(el, vpart) {
    var rect = el[0].getBoundingClientRect();

    return (
    rect.bottom >= 0 &&
    rect.right >= 0 &&
    rect.top + vpart <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.left <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

function ace_is_elems_in_viewport(elems, vpart) {
    for (var i = 0; i < elems.length; i++) {
        var item = $(elems[i]);

        if (item.hasClass('crt-animate') && ace_is_elem_in_viewport(item, vpart)) {
            item.removeClass('crt-animate').addClass('crt-animated');

            // Animate Circle Chart
            if(item.hasClass('progress-chart')){
                var chart = item.find('.progress-bar');
                ace_progress_chart(chart[0], chart.data('text'), chart.data('value'), 1000);
            }

            // Animate Line Chart
            if(item.hasClass('progress-line')){
                var line = item.find('.progress-bar');
                ace_progress_line(line[0], line.data('text'), line.data('value'), 1000);
            }
        }
    }
}

function ace_appear_elems(elems, vpart) {
    ace_is_elems_in_viewport(elems, vpart);

    $(window).scroll(function () {
        ace_is_elems_in_viewport(elems, vpart);
    });

    $(window).resize(function () {
        ace_is_elems_in_viewport(elems, vpart);
    });
}

/* Certy Google Map */
function initialiseGoogleMap() {
    var latlng;
    var lat = 44.5403;
    var lng = -78.5463;
    var map = $('#map');
    var mapCanvas = map.get(0);
    var map_styles = [
        {
            "featureType": "all",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "saturation": 36
                },
                {
                    "color": "#000000"
                },
                {
                    "lightness": 40
                }
            ]
        },
        {
            "featureType": "all",
            "elementType": "labels.text.stroke",
            "stylers": [
                {
                    "visibility": "on"
                },
                {
                    "color": "#000000"
                },
                {
                    "lightness": 16
                }
            ]
        },
        {
            "featureType": "all",
            "elementType": "labels.icon",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "administrative",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#000000"
                },
                {
                    "lightness": 20
                }
            ]
        },
        {
            "featureType": "administrative",
            "elementType": "geometry.stroke",
            "stylers": [
                {
                    "color": "#000000"
                },
                {
                    "lightness": 17
                },
                {
                    "weight": 1.2
                }
            ]
        },
        {
            "featureType": "administrative",
            "elementType": "labels",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "administrative.country",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "simplified"
                }
            ]
        },
        {
            "featureType": "administrative.country",
            "elementType": "geometry",
            "stylers": [
                {
                    "visibility": "simplified"
                }
            ]
        },
        {
            "featureType": "administrative.country",
            "elementType": "labels.text",
            "stylers": [
                {
                    "visibility": "simplified"
                }
            ]
        },
        {
            "featureType": "administrative.province",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "administrative.locality",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "simplified"
                },
                {
                    "saturation": "-100"
                },
                {
                    "lightness": "30"
                }
            ]
        },
        {
            "featureType": "administrative.neighborhood",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "administrative.land_parcel",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "landscape",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "simplified"
                },
                {
                    "gamma": "0.00"
                },
                {
                    "lightness": "74"
                }
            ]
        },
        {
            "featureType": "landscape",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#000000"
                },
                {
                    "lightness": 20
                }
            ]
        },
        {
            "featureType": "landscape.man_made",
            "elementType": "all",
            "stylers": [
                {
                    "lightness": "3"
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#000000"
                },
                {
                    "lightness": 21
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": [
                {
                    "visibility": "simplified"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#000000"
                },
                {
                    "lightness": 17
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry.stroke",
            "stylers": [
                {
                    "color": "#000000"
                },
                {
                    "lightness": 29
                },
                {
                    "weight": 0.2
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#000000"
                },
                {
                    "lightness": 18
                }
            ]
        },
        {
            "featureType": "road.local",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#000000"
                },
                {
                    "lightness": 16
                }
            ]
        },
        {
            "featureType": "transit",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#000000"
                },
                {
                    "lightness": 19
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#000000"
                },
                {
                    "lightness": 17
                }
            ]
        }
    ];

    if (map.data("latitude")) lat = map.data("latitude");
    if (map.data("longitude")) lng = map.data("longitude");

    latlng = new google.maps.LatLng(lat, lng);

    // Map Options
    var mapOptions = {
        zoom: 14,
        center: latlng,
        scrollwheel: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: map_styles
    };

    // Create the Map
    map = new google.maps.Map(mapCanvas, mapOptions);

    /*var marker = new Marker({
     map: map,
     position: latlng,
     icon: {
     path: SQUARE_PIN,
     fillColor: '',
     fillOpacity: 0,
     strokeColor: '',
     strokeWeight: 0
     },
     map_icon_label: '<span class="map-icon map-icon-postal-code"></span>'
     });*/

    // Keep Marker in Center
    google.maps.event.addDomListener(window, 'resize', function () {
        map.setCenter(latlng);
    });
}