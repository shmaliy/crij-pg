var app = {

    devWidth : 0,
    devHeight: 0,
    debug: false,

    displayAjust: function () {
        app.devHeight = $('html').height();
        app.devWidth = $('html').width();
        var barHeight = $('.bar').height();


        if (app.devWidth > 0 && app.devWidth < 640) {
            $('#loaderContainer').addClass('progressbar320');
        }

        if (app.devWidth > 640 && app.devWidth < 900) {
            $('#loaderContainer').addClass('progressbar640');
        }

        if (app.devWidth > 900) {
            $('#loaderContainer').addClass('progressbar900');
        }


        var iframeHeight = app.devHeight - barHeight;

        $('#webView').css({
                width: app.devWidth + 'px',
                height: iframeHeight + 'px'
        });

        $('#loaderContainer').css({
            width: app.devWidth + 'px',
            height: iframeHeight + 'px'
        }).hide();

        $('.slide-menu').css({
            width: app.devWidth + 'px',
            minHeight: app.devHeight + 'px',
            left: -1 * app.devWidth + 'px',
            top: barHeight + 'px'
        });

        $('#debug').append('slide-menu position ' + -1 * app.devWidth + 'px' + '<br />');

        $('.slide-menu ul li a span').each(function () {
            if ($(this).height() > 18) {
                $(this).closest('a').css({
                    paddingTop: '5px',
                    paddingBottom: '5px'
                });
            }
        });


        $('#search').hide();

        $('#refreshIframe').on('click tap', function(){
            $('#webView').attr('src', $('#webView').attr('src'));
            app.closeMenu();

        });

        $('#closeSearch').hide();

        $('#findToggler').click(function() {
            $('#logo').hide();
            $(this).hide();
            $('#search').show();
            $('#closeSearch').show();
            $('#refreshIframe').hide();
        });

        $('#closeSearch').click(function(){
            $('#logo').show();
            $('#search').hide();
            $('#refreshIframe').show();
            $('#findToggler').show();
            $('#closeSearch').hide();
        });


        $('#submitSearch').click(function(){
            if ($('#searchQuery').val() !== '') {
                $('#webView').attr('src', 'http://crij-haute-normandie.org/search/index/index?search=' + $('#searchQuery').val());
                app.closeMenu();
            }
        });

        $('#Accueil').click(function(){
            $('#webView').attr('src', 'http://crij-haute-normandie.org');
            app.closeMenu();
        });

        $('#swipeCatcher').css({
            position: 'absolute',
            width: '20px',
            height: app.devHeight + 'px',
            top: 0,
            left: 0,
            zIndex: 1000
        });


//        console.log(width);
    },

    menuToggle: function () {
        $('#menuToggler').click(function(e) {
            e.preventDefault();
            var currentPosition = parseInt($('.slide-menu').css("left"));

            if (currentPosition < 0) {

                $('.slide-menu').animate({
                    left: "+=" + app.devWidth + 'px'
                }, 100);
            } else {

                $('.slide-menu').animate({
                    left: "-=" + app.devWidth + 'px'
                }, 100);
            }
        });
    },

    closeMenu: function () {
        var currentPosition = parseInt($('.slide-menu').css("left"));

        if (currentPosition == 0) {
            $('.slide-menu').animate({
                left: "-=" + app.devWidth + 'px'
            }, 100);
        }

    },


    menuController: function () {
        var buttons = $('.slide-menu li a');
        var domain = 'http://crij-haute-normandie.org';

        $(buttons).each(function () {
            $(this).click(function (e) {
                e.preventDefault();

                var src = domain + $(this).attr('rel');

                $('#webView').attr('src', src);
                app.initialize();
                $('#menuToggler').click();


            });
        });
    },


    findByName: function() {
        console.log('findByName');
        this.store.findByName($('.search-key').val(), function(employees) {
            var l = employees.length;
            var e;
            $('.employee-list').empty();
            for (var i=0; i<l; i++) {
                e = employees[i];
                $('.employee-list').append('<li><a href="#employees/' + e.id + '">' + e.firstName + ' ' + e.lastName + '</a></li>');
            }
        });
    },

    observeSwipe: function () {
        $('#swipeCatcher').touchwipe({
            wipeRight: function() {
                $('#menuToggler').click();
            },
            min_move_x: 20,
            min_move_y: 10000,
            preventDefaultEvents: true
        });

        $('.swipe-right').touchwipe({
            wipeLeft: function() {
                $('#menuToggler').click();
            },
            min_move_x: 20,
            min_move_y: 10000,
            preventDefaultEvents: true
        });
    },

    initialize: function() {
        this.store = new MemoryStore();
        $('.search-key').on('keyup', $.proxy(this.findByName, this));
        app.displayAjust();
        app.menuToggle();
        app.menuController();
        app.observeSwipe();
    }

};

function receiveMessage(event)
{

    if (event.data == 'iframe_change') {
//        console.log('start loader');

        if ($('#loaderContainer').css('display') == 'none') {
            $('#loaderContainer').show();
        }


        $('#webView').load(function(){
//            console.log('hide loader');
            $('#loaderContainer').hide();
        });
    }
}

addEventListener("message", receiveMessage, false);


function preload(arrayOfImages) {
    $(arrayOfImages).each(function(){
        $('<img/>')[0].src = this;
        // Alternatively you could use:
        // (new Image()).src = this;
    });
}

preload([
    '../img/progressbar.gif'
]);

$(function(){
    app.initialize();

    if (app.debug == true) {
        $('#debug').show();
    }

    $('a[target="webView"]').click(function(e){
//        console.log(e.target);
    });


//    $('#webView').load(function () {
//        $('#debug').append('change pages finish<br />');
//    });
//
//    $('#webView').on("unload", function () {
//        $('#debug').append('change pages start<br />');
//    });

    receiveMessage({data: 'iframe_change'});
    $('#webView').attr('src', 'http://crij-haute-normandie.org/?tabapp=true');


    setTimeout(function(){

//        navigator.splashscreen.hide();

    }, 1000);


});


