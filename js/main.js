//-----------------------------------------------------------------------------------
var contentJsonFile      = 'json/content.json';

//-----------------------------------------------------------------------------------
// remove all not mentioned section
function clearPage(jsonPageData) {
    var sections = document.getElementsByTagName("section");
    var amountSections = sections.length;
    
    for (idxSection = 0; idxSection < amountSections; idxSection++) {

        // first hide each section...
        $(sections[idxSection]).addClass("hide");
        
        // figure out if section is mentioned in json file...
        var sectionId = sections[idxSection].id;
        for (var jsonSectionElementId in jsonPageData) {
            try {
                var n = sectionId.indexOf(jsonSectionElementId);
                if (n >= 0) {
                    // revoke hidden section
                    $(sections[idxSection]).removeClass("hide");
                }
            }
            catch (e){
                //console.error(e); // ...too fucking tired!
            }
        }
    }
}

//-----------------------------------------------------------------------------------
// render content of the requested page
function renderPage(jsonPageData, requestedPage) {

    //-----------------------------------------------------------------------------------
    // clear page
    clearPage(jsonPageData);
    
    //-----------------------------------------------------------------------------------
    // change page title
    document.title = requestedPage;
    
    //-----------------------------------------------------------------------------------
    // get content by json file 
    $.each(jsonPageData, function (sectionId, sectionData) {
        var sectionContent = jsonPageData[sectionId]["content"];
        if (sectionContent.length != 0){
            try {
                document.getElementById(sectionId).innerHTML = getTemplate(sectionId, sectionContent);
            }
            catch(err) {
                $("#section-" + sectionId).addClass("hide");
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
        renderPage(jsonPageData, requestedPage);
    };
    request.send();

});