//-----------------------------------------------------------------------------------
// templates
function templateHeader(dataHeader) {return `
    <h1>${dataHeader['h1']}</h1>
    <h2>${dataHeader['h2']}</h2>
`};

function templateInfo(dataHeader) { return`
    <div class="row">
    ${dataHeader['info-box'].map(function(infobox){ return `
    <div class="col-sm-12 col-md-6 mb-box">                
        <div class="info-box">
            ${infobox}
        </div>
    </div>
    `}).join('')}
    </div>
`};

function templateTeam(dataTeam) { return`
    <div class="row">
    ${dataTeam['members'].map(function(member){ return `
    <div class="col-sm-12 col-md-${12 / dataTeam['members'].length} mb-box">                
        <div class="info-box">
            <img src="${member.img}" alt="${member.img}">
            <h1>${member.name}</h1>
            <p>${member.function}</p>
        </div>
    </div>
    `}).join('')}
    </div>
`};

function templateFooter(dataFooter) {return `
    <div class="footer-top">
        ${dataFooter['footer-top']}
    </div>
    <div class="footer-bottom">
        ${dataFooter['footer-bottom']}
    </div>
`};

//-----------------------------------------------------------------------------------
// collection of snippets
var dictSnippets = {
    "header"    : templateHeader,
    "info"      : templateInfo,
    "team"      : templateTeam,
    "footer"    : templateFooter
}

//-----------------------------------------------------------------------------------
// return a snippet with replaced content
function getTemplate(key, content){
    try{
        var snippet = dictSnippets[key](content);
        return snippet;
    }
    catch (err) {
        throw false;
    }
}