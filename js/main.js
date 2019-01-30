//-----------------------------------------------------------------------------------
var contentJsonFile      = 'json/content.json';

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
    // set footer
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
                targetElement.innerHTML = getHtmlSnippet(sectionId, sectionContent);            
            }
            catch (err) {
                throw "Could not set HTML snippet for section-" + sectionId;
            }
        }
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
        // render page content
        renderPage(jsonPageData);
    };
    request.send();

});