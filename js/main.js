//-----------------------------------------------------------------------------------
var contentJsonFile = 'json/content.json';
var pageContent     = document.getElementById('page-content');
var btn_page_switch = document.getElementsByClassName('btn_page_switch');

//-----------------------------------------------------------------------------------
// event on page switch button
$(".btn_page_switch").on('click', function(event){
    // get page request
    var requestedPage = $(this).val();
    
    // handle AJAX request
    var request = new XMLHttpRequest();
    request.open('GET', contentJsonFile);
    request.setRequestHeader('Cache-Control', 'no-cache');
    request.onload = function() {
        var contentData = JSON.parse(request.responseText);
        var jsonPageData    = contentData[requestedPage];
        // render page content
        renderPage(jsonPageData, requestedPage);
    };
    request.send();

});

//-----------------------------------------------------------------------------------
// render page content
function renderPage(jsonPageData, title){
    
    //-----------------------------------------------------------------------------------
    // remove all not mentioned section
    var sections = document.getElementsByTagName("section");
    var amoungSections = sections.length;
    
    for (idxAmountSection = 0; idxAmountSection < amoungSections; idxAmountSection++) {

        // first hide all sections...
        $(sections[idxAmountSection]).addClass("hide");
        
        // figure out if section is mentioned in json file...
        var sectionId = sections[idxAmountSection].id;
        for (var jsonSectionElementId in jsonPageData) {
            try {
                var n = sectionId.indexOf(jsonSectionElementId);
                if (n >= 0) {
                    // revoke hidden section
                    $(sections[idxAmountSection]).removeClass("hide");
                }
            }
            catch (e){
                //console.error(e); // ...to fucking tired!
            }
        }
    }

    //-----------------------------------------------------------------------------------
    // change page title
    document.title = title;

    //-----------------------------------------------------------------------------------
    // loop page content object
    for (var sectionElementId in jsonPageData) {
        
        // get parent block or section by id
        var jsonSectionData   = jsonPageData[sectionElementId];
        var sectionElement     = document.getElementById(sectionElementId);
        
        if (sectionElement != null) {
            
            // loop jsonSectionData
            for (var elementName in jsonSectionData){
                var jsonElementValue = jsonSectionData[elementName];
                
                // get and set element by tag name 
                // TODO: check if redundancy is really necessary
                var elementsByTag = sectionElement.getElementsByTagName(elementName);
                if (elementsByTag.length != 0) {

                    if (isArray(jsonElementValue)){
                        for (var arrayIdx in jsonElementValue){
                            elementsByTag[arrayIdx].innerHTML = jsonElementValue[arrayIdx];    
                        }
                    }
                    else {
                        elementsByTag[0].innerHTML = jsonElementValue;
                    }
                }

                // get and set element by class name
                // TODO: check if redundancy is really necessary
                var elementsByClass = sectionElement.getElementsByClassName(elementName);
                if (elementsByClass.length != 0) {

                    if (isArray(jsonElementValue)){
                        
                        for (var arrayIdx in jsonElementValue){
                            elementsByClass[arrayIdx].innerHTML = jsonElementValue[arrayIdx];    
                        }
                    }
                    else {
                        elementsByClass[0].innerHTML = jsonElementValue;
                    }
                }
            }
        }
    }
}

//-----------------------------------------------------------------------------------
function isArray(jsonObject) {
    return jsonObject.constructor === Array;
}

//-----------------------------------------------------------------------------------
function getElementsStartsWithId( id ) {
    var children = document.body.getElementsByTagName('*');
    var elements = [], child;
    for (var i = 0, length = children.length; i < length; i++) {
      child = children[i];
      if (child.id.substr(0, id.length) == id)
        elements.push(child);
    }
    return elements;
  }