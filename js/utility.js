// Root API URL
ROOT_URL = "https://scrumserver.tenobe.org/scrum/api";

// Navigation
var NAVIGATION = [
    {Naam: "Zoeken", Pagina: "paginas/zoeken.html"},
    {Naam: "Profiel", Pagina: "paginas/profiel.html"},
    {Naam: "Berichten", Pagina: "paginas/berichten.html"},
    {Naam: "Logout", Pagina: "index.html"}
]

function GetBasePath() {
    return window.location.href.substr(0, window.location.href.lastIndexOf('/')) + "/"
}

// Maak de navigatie als je ingelogd bent
$('navigationElements').ready(function() {
    var isRoot = window.location.href.endsWith('index.html');

    if (IsIngelogd()) {
        for (let i in NAVIGATION) {
            var url = NAVIGATION[i].Pagina

            if (!isRoot) {
                if (NAVIGATION[i].Naam != "Logout") {
                    url = url.substring(url.lastIndexOf('/') + 1, url.length)
                } else {
                    url = "../" + url
                }
            } 
            var btn = $('<li class="nav-item"><a class="nav-link" href="'  + url + '">' + NAVIGATION[i].Naam + '</a></li>').appendTo('#navigationElements')

            if (NAVIGATION[i].Naam == "Logout") {
                btn.click(function() {
                    Logout()
                    Redirect('index.html')
                })
            }
        }
    }
})

// Kijken of een gebruiker is ingelogd
function IsIngelogd() {
    return (localStorage.getItem('user_id') !== null);
}

// Geeft de user ID van een gebruiker weer als die ingelogd is
function GeefGebruikerID() {
    return localStorage.getItem('user_id');
}

// Logt een gebruiker uit
function Logout() {
    localStorage.removeItem('user_id')
}

// Forceer een gebruiker naar een andere pagina
function Redirect(url) {
    window.location.replace(url)
}
