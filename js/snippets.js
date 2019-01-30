//-----------------------------------------------------------------------------------
// templates
function templateNavbar(dataNavbar) {return`
    <div class="container-fluid">
        <!-- Titel und Schalter werden für eine bessere mobile Ansicht zusammengefasst -->
        <div class="navbar-header">
            <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#VitaNav-navbar-collapse-1" aria-expanded="false">
                <span class="sr-only">Navigation ein-/ausblenden</span>
                <span class="ico-burger"></span>
                <span>MENU</span>
            </button>
            <a class="navbar-brand" href="#Home"><img src="${dataNavbar['logo']}" alt="Logo"></a>
        </div>
      
        <!-- Alle Navigationslinks, Formulare und anderer Inhalt werden hier zusammengefasst und können dann ein- und ausgeblendet werden -->
        <div class="collapse navbar-collapse" id="VitaNav-navbar-collapse-1">
            <ul class="nav navbar-nav">
                ${dataNavbar['menu'].map(function(item){ return `
                <li><a href="${item.href}">${item.title}</a></li>
                `}).join('')}
            </ul>
        </div><!-- /.navbar-collapse -->
      
        <div class="sticky-right">
            <button type="button" class="project-switch" data-toggle="modal" data-target="#ProjectNav">
                <span class="title hidden-sm hidden-xs">PRAXIS SCHÜTZENSTRASSE</span>
                <div class="ico-home"><i class="fa fa-home"></i></div>    
            </button>
        </div>  
    </div><!-- /.container-fluid -->
`};



function templateHeader(dataHeader) {return `
    <div class="banner">
        <ul>
            <li data-transition="slotfade-horizontal">
                <img src="img/bg-slide-1.jpg" alt="Dr. Heck">
                <div class="tp-caption sft title" data-x="center" data-y="200" data-speed="500" data-start="1400" data-easing="easeOutBack">
                    Willkommen in der
                </div>
                <div class="tp-caption sft" data-x="center" data-y="230" data-speed="500" data-start="2000" data-easing="easeOutBack">
                    <img src="img/img_logo-head.png" alt="Dr. Heck Logo">
                </div>
                <div class="tp-caption sfb" data-x="center" data-y="445" data-speed="700" data-start="2500" data-easing="esaseOutBack">
                    <a class="btn btn-banner" href="#oeffnungszeiten">Öffnungszeiten</a>
                </div>

            </li>
        </ul>
    </div>

`};

function templateInfo(dataInfo) { return`
    <div class="container" id="info">
        <div class="row">
            ${dataInfo['info-box'].map(function(infobox){ return `
            <div class="col-sm-12 col-md-6 mb-box">
                <div class="info-box">
                    ${infobox}
                </div>
            </div>
            `}).join('')}
        </div>
    </div>
`};

function templateCallinfo(dataCallinfo) { return`
    <div class="text-center">
        <h1>${dataCallinfo.h1}</h1>
        <h2>${dataCallinfo.h2}</h2>
    </div>

`}

function templateTeam(dataTeam) { return`
    <div class="headline">
        <h1>Unsere Ärzte</h1>
    </div>

    <div class="container doc-container">
        <div class="row">
            ${dataTeam['members'].map(function(member){ return `
            <div class="col-sm-12 col-md-${12 / dataTeam['members'].length}">
                <div class="doc-box">
                    <img src="${member.img}" alt="${member.img}">
                    <div class="overlay">
                        <h5>${member.title}</h5>
                        <h4>${member.name}</h4>
                        <h5>${member.function}</h5>
                    </div>    
                </div>
            </div>
            `}).join('')}
        </div>
    </div>       
`};

function templateFooter(dataFooter) {return `
    <div id="footer">
        <div class="container">
            <div class="row">
                <div class="col-sm-12">
                    <img src="${dataFooter.logo}" alt="Praxis Logo" style="width:48px;height:48px;">
                    <div class="copyright">
                        <p>
                            ${dataFooter['menu'].map(function(item){ return `
                            <a href="${item.href}">${item.title}</a>
                            `}).join(' | ')}    
                            <br/>
                            ${dataFooter['additional-menu'].map(function(item){ return `
                            <a href="${item.href}">${item.title}</a>
                            `}).join(' | ')}    
                        </p>
                        <p class="last">
                            ${dataFooter['last']}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>

`};

//-----------------------------------------------------------------------------------
// collection of snippets
var dictSnippets = {
    "navbar"    : templateNavbar,
    "header"    : templateHeader,
    "info"      : templateInfo,
    "team"      : templateTeam,
    "callinfo"  : templateCallinfo,
    "footer"    : templateFooter
}

//-----------------------------------------------------------------------------------
// return a snippet with replaced content
function getHtmlSnippet(key, content){

    var snippet = dictSnippets[key](content);
    return snippet;
    /*
    try {
        var snippet = dictSnippets[key](content);
        return snippet;
    }
    catch(err) {
        throw "No matching snippet for " + key;
    }*/
    
}