var app = {

    devWidth : 0,
    devHeight: 0,

    displayAjust: function () {
        app.devHeight = $('html').height();
        app.devWidth = $('html').width();
        var barHeight = $('.bar').height();

        var iframeHeight = app.devHeight - barHeight;

        $('#webView').css({
                width: app.devWidth + 'px',
                height: iframeHeight + 'px'
        });

        $('.slide-menu').css({
            width: app.devWidth + 'px',
            minHeight: app.devHeight + 'px',
            left: -1 * app.devWidth + 'px',
            top: barHeight + 'px'
        });

        $('.slide-menu ul li a span').each(function () {
            if ($(this).height() > 14) {
                $(this).closest('a').css({
                    paddingTop: '9px'
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
            zIndex: 1000000000
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

    initialize: function() {
        this.store = new MemoryStore();
        $('.search-key').on('keyup', $.proxy(this.findByName, this));
        app.displayAjust();
        app.menuToggle();
        app.menuController();
    }

};




$(function(){
    app.initialize();
    $('#webView').attr('src', 'about:blank');
    setTimeout(function(){
        $('#webView').attr('src', 'http://crij-haute-normandie.org/?tabapp=true');
    }, 100);

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

});


