//-----------------------------------------------------------------------------------
var contentJsonFile      = 'json/content.json';

//-----------------------------------------------------------------------------------
// rescale main.js
$(document).ready(function() {

    // WOW Animation
    new WOW().init();

	var sp_offset = 30, loading ;
    var isMobile = navigator.userAgent.match( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/ );

	// Mobile-Switch
    if ( isMobile ) {
        $('body').addClass('is-mobile');
    }

    $('#myCarousel').carousel({
        interval: 5000
    });

    // Menu  
    $(document).on({
        'scroll': function(e){
            var t = $(this).scrollTop();
        
            if ( t>10) $('#VitaNav').addClass('on_scroll');
            else $('#VitaNav').removeClass('on_scroll');

            if ( t>600 ) $('#Autoscroll').addClass('on');
            else $('#Autoscroll').removeClass('on');
        }
    }).trigger('scroll');
  
    $('body').scrollspy({ target: '#VitaNav', offset: sp_offset });
	
	// strict just to keep concept of bootstrap
	+function ($) {
		'use strict';
		
		// spy and scroll menu boogey
		$("a[href^='#']").on('click', function(e) {
            if ( this.hash == '#myCarousel' ) return;
            
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
                return window.history.pushState(null, null, hash);
            })
		})

	    // MAP //
        $('#Map').click(function () {
            $('#Map iframe').css("pointer-events", "auto");
        });

        $("#Map" ).mouseleave(function() {
        $('#Map iframe').css("pointer-events", "none");
        });

	}(jQuery);

	// REVOLUTION SLIDER //
	$(".banner").revolution({
		delay: 5000,
		startwidth: 700,
		startheight: 760,
		startWithSlide: 0,

		fullWidth:"off",
		fullScreen:"off",
		fullScreenOffsetContainer: "#header",
		//fullScreenAlignForce: "off",
		//autoHeight: "off",
		//minHeight: "off",
	});


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
});

//-----------------------------------------------------------------------------------
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
  
  


//-----------------------------------------------------------------------------------
// remove all not mentioned section
function clearPage(jsonPageData) {
    var sectionElements     = document.getElementsByTagName("section");
    var amountSections      = sectionElements.length;
    var sectionContentKeys  = (Object.keys(jsonPageData["sections"]));

    for (idxSection = 0; idxSection < amountSections; idxSection++) {

        // first hide each section...
        $(sectionElements[idxSection]).addClass("hide");
        
        // figure out if section is mentioned in json file...
        var sectionElementId    = sectionElements[idxSection].id;
        var searchStringSection = sectionElementId.split("-")[1];
        
        if (sectionContentKeys.indexOf(searchStringSection) >= 0) {
            // revoke hidden section
            $(sectionElements[idxSection]).removeClass("hide");
        }
    }
}

//-----------------------------------------------------------------------------------
// render content of the requested page
function renderPage(jsonPageData) {

    //-----------------------------------------------------------------------------------
    // clear page
    clearPage(jsonPageData);
    
    //-----------------------------------------------------------------------------------
    // change page title
    document.title = jsonPageData.title;

    //-----------------------------------------------------------------------------------
    // set navbar
    var navbarElement = document.getElementById("VitaNav");
    navbarElement.innerHTML = getHtmlSnippet("navbar", {"menu" : jsonPageData["menu"], "logo": jsonPageData["logo"] });
    
    //-----------------------------------------------------------------------------------
    // get content by json file 
    var pageSections = jsonPageData["sections"];
    $.each(pageSections, function (sectionId, sectionData) {
        var sectionContent = sectionData["content"];
        if (Object.keys(sectionContent).length != 0){
            
            //-----------------------------------------------------------------------------------
            // add page menu top footer content
            if (sectionId == "footer"){
                sectionContent["menu"] = jsonPageData["menu"];
            }
            
            //-----------------------------------------------------------------------------------
            // get and set HTML content 
            try {
                var targetElement = document.getElementById("section-" + sectionId);
                targetElement.innerHTML = getHtmlSnippet(sectionData["snippet"], sectionContent);            
            }
            catch (err) {
                console.log("Could not set HTML snippet for section-" + sectionId);
            }
        }
    });

    // REVOLUTION SLIDER //
	$(".banner").revolution({
		delay: 5000,
		startwidth: 700,
		startheight: 760,
		startWithSlide: 0,

		fullWidth:"off",
		fullScreen:"off",
		fullScreenOffsetContainer: "#header",
		//fullScreenAlignForce: "off",
		//autoHeight: "off",
		//minHeight: "off",
	});

}

//-----------------------------------------------------------------------------------
// switch page content 
$(".btn_page_switch").on('click', function(event){
    // get page request
    var requestedPage = $(this).val();
    
    // handle AJAX request
    var request = new XMLHttpRequest();
    request.open('GET', contentJsonFile);
    request.setRequestHeader('Cache-Control', 'no-cache');
    request.onload = function() {
        var contentData  = JSON.parse(request.responseText);
        var jsonPageData = contentData[requestedPage];

        // prepare page data if keys are missing
        var keysToCheck = ['logo', 'menu', 'meta', 'title'];
        $.each(keysToCheck, function( index, key ) {
            if(!jsonPageData.hasOwnProperty(key)){
                jsonPageData[key] = contentData["website"][key];
            }
        });

        // render page content
        renderPage(jsonPageData);
    };
    request.send();

});