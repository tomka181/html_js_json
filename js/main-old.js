
$(document).ready(function() {
    
	var sp_offset = 60, loading ;
    
    var tt = {
        "1": '09:00-12:00 und 15:00-18:00',// Mo
        "2": '09:00-12:00 und 15:00-18:00',// Di
        "3": '09:00-12:00',// Mi
        "4": '09:00-12:00 und 15:00-18:00',// Do
        "5": '09:00-12:00',// Fr
        "6": 'geschlossen',//Sa
        "0": 'geschlossen',//So
    }
    $('#Sprechzeiten').text(tt[new Date().getDay()]);

	$(document).on({
		'scroll': function(e){
			var t = $(this).scrollTop();
			
			if ( t>0 ) $('#navbar-groovy').addClass('sticky');
			else $('.sticky').removeClass('sticky');
			
			if ( t>800 ) $('#Autoscroll').addClass('on');
			else $('#Autoscroll').removeClass('on');
		}
	}).trigger('scroll');
	
	$('body').scrollspy({ target: '#navbar-groovy', offset: sp_offset });
	
	// strict just to keep concept of bootstrap
	+function ($) {
		'use strict';
		
		// spy and scroll menu boogey
		$("a[href^='#']").on('click', function(e) {
			// prevent default anchor click behavior
			e.preventDefault();
			
			// 
			$('.navbar-collapse').collapse('hide');
			
			// store hash
			var hash = this.hash
			
			// animate
			$('html, body').animate({
				scrollTop: $(this.hash).offset().top -sp_offset+10
			}, 1000, function(){
				//window.location.hash = hash
				//if ( window.location.hash != hash ) {
				//	console.log(hash);
				//}
				return window.history.pushState(null, null, hash);
			})
		})
	
	}(jQuery);
	
	
	$.each($('[data-countup]'), function(k,v){
		var n = $(v);
		
		n.one('inview', function(event, isVisible) {
			if (!isVisible) { return; }
			
			var count = n.data('countup');
			
			var div_by = 50,
				speed = Math.floor(count / div_by),
				run_count = 1,
				int_speed = 24,
				val = 0;
			
			var int = setInterval(function() {
				if( run_count <= div_by ){
					val = speed * run_count;
					run_count++;
				} else if( val < count) {
					val++
				} else {
					clearInterval(int);
				}
				
				n.text(NrF(val))
			}, int_speed);
		});
	});
	
	
	
	
	// REVOLUTION SLIDER //
	$(".banner").revolution({
		delay: 9000,
		startwidth: 700,
		startheight: 500,
		startWithSlide: 0,
		
		fullWidth:"off",
		fullScreen:"on",
		fullScreenOffsetContainer: "#header",
		//fullScreenAlignForce: "off",
		//autoHeight: "off",
		//minHeight: "off",
		
	});
	
	
	
	// Contact
	$('#Contact form').on('submit', function(){
		var f = $(this), msg;
		$('.alert',f).remove();
		
        if ( !loading )
        {
            loading = $('<div/>').addClass('ajaxloading').append('<i class="fa fa-spinner fa-spin"/>').appendTo(document.body);
			
			$.ajax({
				type: "POST",
				url: 'send/send.php',
				data: f.serialize()
			})
			.done( function(Data){
				
				msg(Data);
				
				if (Data.type == 'success') {
					$('.form-control',f).val('');
				}
				loading.remove();
				loading = null;
			} )
			.fail( function(){
				loading.remove();
				loading = null;
				
				msg({txt: 'Serververbindung fehlgeschlagen'});
			} );
        }
		
		var msg = function(msg){
			var icon = "exclamation";
			if (!msg.type) msg.type = 'danger';
			
			if ( msg.type == 'success' ) icon = "check";
			
			$('<div/>').addClass('alert alert-'+msg.type).appendTo(f).append('<i class="fa fa-'+icon+'"></i>',msg.txt);
		}
		
		return false;
	});
	
	
	
	new Portfolio();
});








/* ===================================================== */
/* Projects
/* ===================================================== */



var Portfolio = function(options) {

    var portfolio = '.portfolio',
        portItem = '.port-item',
        noItems = ($(portfolio).data('show')) ? $(portfolio).data('show') : $(portItem).length,
        projectBtn = '.port-item .port-overlay',
        scrollOffset = -$('.main_menu').outerHeight() + 10,
        load_more_in_category = true,
        filter = portItem,
        slider_name = '.portfolio-slider-ajax';

    // Show fist choosen number of items
    $(portItem + ':nth-child(-n+' + noItems + ')').addClass('showme');

    $('.portfolio').waitForImages(function() {
        $('.portfolio').isotope({
            itemSelector: '.port-item',
            layoutMode: 'fitRows',
            resizable: false,
            filter: '.showme'
        });
    });

    // Isotope Resizing
    $(window).bind("debouncedresize", function() {
        var num;
        // If in 2 columns, devide by 2
        if ($('.port-item').css('width') == '50%') {
            num = 2;
        } else {
            num = noItems;
        }

        $('.portfolio').isotope({
            masonry: {
                columnWidth: $('.portfolio').width() / num
            }
        });
    });

    // HIDE SHOW BTN
    // If there are no more items to show
    // If the number to show is greater then the number of items available
    var hideShowBtn = function() {
        if (noItems >= $(portfolio).find('.port-item').length) {
            $('.load-more').attr('disabled', true);
        } else if (load_more_in_category) {
            // Whats selected
            selector = $('.filter li.selected').data('cat');
            // If we are not loading from all
            if (selector !== '*') {
                filter = '.port-item[data-cat*=' + selector + ']';
            }

            var num_items_in_cat = $(filter).length;
            if (num_items_in_cat <= noItems) {
                $('.load-more').attr('disabled', true);
            } else {
                $('.load-more').attr('disabled', false);
            }
        }
    }; // END: hideShowBtn
    hideShowBtn();

    // > LOAD MORE ITEMS
    $('#load-more').click(function(e) {
        e.preventDefault();

        $(this).prepend('<i class="loader spin fa fa-spinner"></i>');

        $('#load-more i.spin').css('display', 'none').fadeIn('fast');

        // How many to load
        var numToLoad = ($(this).data('num')) ? $(this).data('num') : 4;
        if (noItems < $('.port-item').length) {
            noItems += parseInt(numToLoad);
        }

        // Create Filter
        selector = $('.filter-menu .selected').data('cat');
        var filter = '.port-item[data-cat*=' + selector + ']';
        if (selector === '*' || !load_more_in_category) {
            filter = '.port-item';
        }

        $('.port-item').removeClass('showme');

        // Load all unloaded images
        $('.portfolio div[data-port-thumb]').each(function() {
            path = $(this).data('port-thumb');
            portItem = $(this).parent();
            alt = $(this).attr('alt');
            $(this).after('<img src="' + path + '" alt="' + alt + '">');
            $(this).remove();
            $(this).addClass('new');
        });

        // Add filter
        $('.portfolio').find(filter + ':lt(' + noItems + ')').addClass('showme');

        // Init isotope
        $('.portfolio').waitForImages(function() {
            $('#load-more i.spin').stop().delay(1000).fadeOut('fast', function() {
                $(this).remove();
            })
            $('.portfolio').isotope({filter: '.showme'});
        });

        // Disable button when no more items
        if (noItems === $('.port-item').length) {
            $(this).attr('disabled', true);
        }
    });


    $('.filter li').trigger('click');
    $('.filter li').click(function() {
        if (!$(this).hasClass('selected')) {
            var bgColor = $(this).css('background');
        }
        $(this).fadeTo('background', 'white');
        $(this).siblings().removeClass('selected');
        $(this).addClass('selected');
        var selector = $(this).attr('data-cat');
        var filter = '.port-item.' + selector + '';
        if (selector === '*') {
            filter = '.port-item';
        }
        $('.showme').removeClass('showme');
        $(filter + ':lt(' + noItems + ')').addClass('showme');
        $('.portfolio').isotope({
            filter: '.showme'
        });
    });

    // SHOW THE PROJECT
    var showProject = function(elem, projectWrapper) {
        var projectWrapperHeight;

        // Append project to wrapper
        var projectHTML = $('<div class="project">' + elem + '</div>').appendTo(projectWrapper);

        projectWrapper = this.projectWrapper = $($(this.portfolioWrapper).find('#project'));

        var project = this.projectWrapper.find('.project');

        closeButton();

        projectHTML.waitForImages(function() {
			project.find('.carousel').carousel();
			
            projectWrapperHeight = project.outerHeight() + 110; // Get height of project
			
            project.css('height', '100%'); // To fix ie visibility bug
			
            // Animate wrapper height, fade in project and remove loader
            projectWrapper.animate({
                height: projectWrapperHeight
            }, 600, function() {
                projectWrapper.css('height', 'auto'); // Remove fixed height
                project.fadeIn('slow');
                hideSpinner();
            });

            projectWrapper.addClass('open');
            $('.port-overlay .project-btn').removeClass('disabled');
        });

    }; // End ShowProject

    // FETCH THE PROJECT
    var getProject = function(elem, scrollDfd, projectDfd) {
        $.get(elem.attr('href'), function(projectHTML) {
            projectDfd.resolve(projectHTML);
        }, 'html');
    }; // End getProject

    // ADD CLOSE BUTTON
    var closeButton = function() {
        // Needs to know not to add to the project-
        // Prepend close button if it doesn't exist
        if (this.projectWrapper.find('.project .close-btn').length === 0 ) {
            this.projectWrapper.find('.project').prepend('<a href="#" class="close-btn"><i class="fa fa-times-circle-o"></i></a>');
        } else {
        }
        projectWrapper = this.projectWrapper;
        this.projectWrapper.find('.close-btn').click(function() {
            // hideLoader();
            projectWrapper.animate({
                height: 0
            });
            projectWrapper.removeClass('open');

            projectWrapper.find('.project').fadeOut('slow', function() {
                projectWrapper.find('.project').remove();
            });
			
			$('html, body').animate({
				scrollTop: $('#Portfolio').offset().top -90
			})
            return false;
        });
    }; // End closeButton


    // SWITCH TO ANOTHER PROJECT
    var changeProject = function(projectHTML, projectWrapper) {
        projectWrapper.css('height', projectWrapper.outerHeight());
        projectWrapper.find('.project').fadeOut('slow', function() {
            projectWrapper.find('.project').remove();
            showProject(projectHTML, projectWrapper);
        });
    }; // changeProject


    // SHOW A SPINNER
    var showLoader = function(projectWrapper) {
        if (typeof(loader) !== "undefined" && loader.hasClass('temp-hide')) {
            showSpinner();
        }

        if (typeof(loader) === "undefined") {
            addLoader();
        }
    }; // End showLoader

    var addLoader = function() {
        var preloadedHTML = '<div class="loader"><i class="fa fa-spinner spin"></i></div>';
        projectWrapper.prepend(preloadedHTML);
        this.loader = projectWrapper.find('.loader');
    };

    var hideSpinner = function() {
        this.loader.addClass('temp-hide').find('i').fadeOut();
    };

    var showSpinner = function() {
        projectWrapper.find('.loader i').fadeIn();
    };

    var projectInit = function(elem) {
        // Vars
        this.portfolioWrapper = elem.closest('#Portfolio');
        var projectWrapper = this.projectWrapper = elem.closest('#Portfolio').find('#project'),
            projectFinishedLoading = $.Deferred();

        scrollFinished = projectScroll();

        getProject(elem, scrollFinished, projectFinishedLoading);

        // When project is loaded and page finished loading
        // Load or change project
        $.when(projectFinishedLoading, scrollFinished).done(function(projectHTML) {
            if (projectWrapper.hasClass('open')) {
                changeProject(projectHTML, projectWrapper);
            } else {
                showProject(projectHTML, projectWrapper);
            }
        });

    }; // End projectInit

    var projectScroll = function() {
        var scrollFinished = $.Deferred();
		var self = this;
		
        showLoader(projectWrapper);
		
		$('html, body').animate({
			scrollTop: self.projectWrapper.offset().top -60
		}, 1000)
    };

    $(projectBtn).on('touchstart', function( e ) {});
    $(projectBtn).on("click", function(event) {
        event.preventDefault();
        $('.loader').stop();
        if (!$('.port-overlay .project-btn').hasClass('disabled')) {
            $('.port-overlay .project-btn').addClass('disabled');
            projectInit($(this));
        }
    });

}









// Zahlen formatieren
var NrF = function (zahl, k, fix) {

    if(!k) k = 0;
    var neu = '';
    var dec_point = ',';
    var thousands_sep = '.';
    // Runden
    var f = Math.pow(10, k);
    zahl = '' + parseInt(zahl * f + (.5 * (zahl > 0 ? 1 : -1)) ) / f ;
    // Komma ermittlen
    var idx = zahl.indexOf('.');
    // fehlende Nullen einfügen
    if(fix)
    {
        zahl += (idx == -1 ? '.' : '' )
        + f.toString().substring(1);
    }
    var sign = zahl < 0;
    if(sign) zahl = zahl.substring(1);
    idx = zahl.indexOf('.');
    // Nachkommastellen ermittlen
    if( idx == -1) idx = zahl.length;
    else neu = dec_point + zahl.substr(idx + 1, k);
    while(idx > 0)
    {
        if(idx - 3 > 0)
        neu = thousands_sep + zahl.substring( idx - 3, idx) + neu;
        else
        neu = zahl.substring(0, idx) + neu;
        idx -= 3;
    }
    return (sign ? '-' : '') + neu;
};



/**
 * author Christopher Blum
 *    - based on the idea of Remy Sharp, http://remysharp.com/2009/01/26/element-in-view-event-plugin/
 *    - forked from http://github.com/zuk/jquery.inview/
 */
(function ($) {
  var inviewObjects = {}, viewportSize, viewportOffset,
      d = document, w = window, documentElement = d.documentElement, expando = $.expando;

  $.event.special.inview = {
    add: function(data) {
      inviewObjects[data.guid + "-" + this[expando]] = { data: data, $element: $(this) };
    },

    remove: function(data) {
      try { delete inviewObjects[data.guid + "-" + this[expando]]; } catch(e) {}
    }
  };

  function getViewportSize() {
    var mode, domObject, size = { height: w.innerHeight, width: w.innerWidth };

    // if this is correct then return it. iPad has compat Mode, so will
    // go into check clientHeight/clientWidth (which has the wrong value).
    if (!size.height) {
      mode = d.compatMode;
      if (mode || !$.support.boxModel) { // IE, Gecko
        domObject = mode === 'CSS1Compat' ?
          documentElement : // Standards
          d.body; // Quirks
        size = {
          height: domObject.clientHeight,
          width:  domObject.clientWidth
        };
      }
    }

    return size;
  }

  function getViewportOffset() {
    return {
      top:  w.pageYOffset || documentElement.scrollTop   || d.body.scrollTop,
      left: w.pageXOffset || documentElement.scrollLeft  || d.body.scrollLeft
    };
  }

  function checkInView() {
    var $elements = $(), elementsLength, i = 0;

    $.each(inviewObjects, function(i, inviewObject) {
      var selector  = inviewObject.data.selector,
          $element  = inviewObject.$element;
      $elements = $elements.add(selector ? $element.find(selector) : $element);
    });

    elementsLength = $elements.length;
    if (elementsLength) {
      viewportSize   = viewportSize   || getViewportSize();
      viewportOffset = viewportOffset || getViewportOffset();

      for (; i<elementsLength; i++) {
        // Ignore elements that are not in the DOM tree
        if (!$.contains(documentElement, $elements[i])) {
          continue;
        }

        var element       = $elements[i],
            $element      = $(element),
            elementSize   = { height: $element.height(), width: $element.width() },
            elementOffset = $element.offset(),
            inView        = $element.data('inview'),
            visiblePartX,
            visiblePartY,
            visiblePartsMerged;
        
        // Don't ask me why because I haven't figured out yet:
        // viewportOffset and viewportSize are sometimes suddenly null in Firefox 5.
        // Even though it sounds weird:
        // It seems that the execution of this function is interferred by the onresize/onscroll event
        // where viewportOffset and viewportSize are unset
        if (!viewportOffset || !viewportSize) {
          return;
        }
        
        if (element.offsetWidth > 0 && element.offsetHeight > 0 && element.style.display != "none" &&
            elementOffset.top + elementSize.height > viewportOffset.top &&
            elementOffset.top < viewportOffset.top + viewportSize.height &&
            elementOffset.left + elementSize.width > viewportOffset.left &&
            elementOffset.left < viewportOffset.left + viewportSize.width) {
          visiblePartX = (viewportOffset.left > elementOffset.left ?
            'right' : (viewportOffset.left + viewportSize.width) < (elementOffset.left + elementSize.width) ?
            'left' : 'both');
          visiblePartY = (viewportOffset.top > elementOffset.top ?
            'bottom' : (viewportOffset.top + viewportSize.height) < (elementOffset.top + elementSize.height) ?
            'top' : 'both');
          visiblePartsMerged = visiblePartX + "-" + visiblePartY;
          if (!inView || inView !== visiblePartsMerged) {
            $element.data('inview', visiblePartsMerged).trigger('inview', [true, visiblePartX, visiblePartY]);
          }
        } else if (inView) {
          $element.data('inview', false).trigger('inview', [false]);
        }
      }
    }
  }

  $(w).bind("scroll resize", function() {
    viewportSize = viewportOffset = null;
  });
  
  // IE < 9 scrolls to focused elements without firing the "scroll" event
  if (!documentElement.addEventListener && documentElement.attachEvent) {
    documentElement.attachEvent("onfocusin", function() {
      viewportOffset = null;
    });
  }

  // Use setInterval in order to also make sure this captures elements within
  // "overflow:scroll" elements or elements that appeared in the dom tree due to
  // dom manipulation and reflow
  // old: $(window).scroll(checkInView);
  //
  // By the way, iOS (iPad, iPhone, ...) seems to not execute, or at least delays
  // intervals while the user scrolls. Therefore the inview event might fire a bit late there
  setInterval(checkInView, 250);
})(jQuery);



!function(a){var b="waitForImages";a.waitForImages={hasImageProperties:["backgroundImage","listStyleImage","borderImage","borderCornerImage","cursor"]},a.expr[":"].uncached=function(b){if(!a(b).is('img[src!=""]'))return!1;var c=new Image;return c.src=b.src,!c.complete},a.fn.waitForImages=function(c,d,e){var f=0,g=0;if(a.isPlainObject(arguments[0])&&(e=arguments[0].waitForAll,d=arguments[0].each,c=arguments[0].finished),c=c||a.noop,d=d||a.noop,e=!!e,!a.isFunction(c)||!a.isFunction(d))throw new TypeError("An invalid callback was supplied.");return this.each(function(){var h=a(this),i=[],j=a.waitForImages.hasImageProperties||[],k=/url\(\s*(['"]?)(.*?)\1\s*\)/g;e?h.find("*").addBack().each(function(){var b=a(this);b.is("img:uncached")&&i.push({src:b.attr("src"),element:b[0]}),a.each(j,function(a,c){var e,d=b.css(c);if(!d)return!0;for(;e=k.exec(d);)i.push({src:e[2],element:b[0]})})}):h.find("img:uncached").each(function(){i.push({src:this.src,element:this})}),f=i.length,g=0,0===f&&c.call(h[0]),a.each(i,function(e,i){var j=new Image;a(j).on("load."+b+" error."+b,function(a){return g++,d.call(i.element,g,f,"load"==a.type),g==f?(c.call(h[0]),!1):void 0}),j.src=i.src})})}}(jQuery);
