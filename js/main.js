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
    var ourRequest = new XMLHttpRequest();
    ourRequest.open('GET', contentJsonFile);
    ourRequest.setRequestHeader('Cache-Control', 'no-cache');
    ourRequest.onload = function() {
        var contentData = JSON.parse(ourRequest.responseText);
        var pageData    = contentData[requestedPage];
        // render page content
        renderHTML(pageData);
    };
    ourRequest.send();

});

//-----------------------------------------------------------------------------------
// render page content
function renderHTML(data){
    console.log(data);

    for (var element_id in data) {
        console.log('--------------------');
        console.log(element_id);

        // get parent block or section by id
        var parent_element_by_id = document.getElementById(element_id);
        if (parent_element_by_id != null) {
            console.log(parent_element_by_id);

            for (var sub_element_name in data[element_id]){
                console.log(sub_element_name);
            }

        }

        // get target element to change its content
        //var child_element_by_name = parent_element_by_id.getElementsByTagName('h1');
        //console.log(child_element_by_name);

        //child_element_by_name.insertAdjacentHTML('beforeend', htmlString);        

    }

}

//-----------------------------------------------------------------------------------