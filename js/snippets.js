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
    <div class="container" id="header">
        <h1>${dataHeader['h1']}</h1>
        <h2>${dataHeader['h2']}</h2>
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

function templateTeam(dataTeam) { return`
    <div class="container" id="team">
        <div class="row">
        ${dataTeam['members'].map(function(member){ return `
        <div class="col-sm-12 col-md-${12 / dataTeam['members'].length} mb-box">                
            <div class="member">
                <img src="${member.img}" alt="${member.img}">
                <h1>${member.name}</h1>
                <p>${member.function}</p>
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
                            ${dataNavbar['menu'].map(function(item){ return `
                            <a href="${item.href}">${item.title}</a>
                            `}).join(' | ')}    
                            <br/>
                            <a href="privacy.html" class="topnav">DATENSCHUTZ</a> | <a href="imprint.html" class="topnav">IMPRESSUM</a>
                        </p>
                        <p class="last">
                            Copyright © 2018 Diabetologische Schwerpunktpraxis Düren. All rights reserved. Created by <a href="http://www.rescaledesign.de">rescale Design</a>
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
    "footer"    : templateFooter
}

//-----------------------------------------------------------------------------------
// return a snippet with replaced content
function getHtmlSnippet(key, content){

    console.log(key);
    console.log(content);

    try {
        var snippet = dictSnippets[key](content);
        return snippet;
    }
    catch(err) {
        throw "No matching snippet for " + key;
    }
    
}