//-----------------------------------------------------------------------------------
var contentJsonFile = 'json/content.json';
var pageContent     = document.getElementById('page-content');
var btn_page_switch = document.getElementsByClassName('btn_page_switch');


$.getJSON(contentJsonFile, function( data ) {
    console.log(data);
    var contentData = data.page01.header.content;
    console.log(contentData);
});

function templater(strings, ...keys) {
    return function(data) {
        let temp = strings.slice();
        keys.forEach((key, i) => {
            temp[i] = temp[i] + data[key];
        });
        return temp.join('');
    }
};

const templateHeader = templater`
    <h1>${'h1'}</h1>
    <h2>${'h2'}</h2>
`;

const templateInfo = templater`
    <div class="row">
        <div class="col-sm-12 col-md-6 mb-box">                
            <div class="info-box">
                This is a dummy info on the left.
            </div>
        </div>
        <div class="col-sm-12 col-md-6 mb-box">
            <div class="info-box">
                This is a dummy info on the right.
            </div>
        </div>
    </div>
`;

const templateFooter = templater`
    <div class="footer-top">
        ${'footer-top'}
    </div>
    <div class="footer-bottom">
    ${'footer-bottom'}
    </div>
`;

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
    console.log('rendering the page ' + requestedPage);

    //-----------------------------------------------------------------------------------
    // clear page
    clearPage(jsonPageData);
    
    //-----------------------------------------------------------------------------------
    // change page title
    document.title = requestedPage;

    //-----------------------------------------------------------------------------------
    // get content by json file 
    $.each(jsonPageData, function (sectionId, sectionData) {
        console.log(sectionId)
        console.log(sectionData)
        
        var sectionContent = jsonPageData[sectionId]["content"];
        if (sectionContent.length != 0){
            console.log('got data for ' + sectionId);
            console.log(sectionContent);
            //document.getElementById("info").innerHTML = templateInfo(contentInfo);
        }
    });        
        
    /*document.getElementById("header").innerHTML = templateHeader(contentHeader);
    document.getElementById("info").innerHTML = templateInfo(contentInfo);
    document.getElementById("footer").innerHTML = templateFooter(contentFooter);*/
    

}




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