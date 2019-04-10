// Root API URL
ROOT_URL = "https://scrumserver.tenobe.org/scrum/api";

// Navigation
var NAVIGATION = [
    {Naam: "Zoeken", Pagina: "paginas/zoeken.html"},
    {Naam: "Profiel", Pagina: "paginas/profiel.html"},
    {Naam: "Berichten", Pagina: "paginas/berichten.html"},
    {Naam: "Love Coins", Pagina: "paginas/lovecoins.html"},
    {Naam: "Delete account", Pagina: "paginas/delete.html"},
    {Naam: "Logout", Pagina: "index.html"},
]

// Niet zichbare elementen
var PRIVATE_ELEMENTS = {}
PRIVATE_ELEMENTS['familienaam'] = true;
PRIVATE_ELEMENTS['id'] = true;
PRIVATE_ELEMENTS['voornaam'] = true;
PRIVATE_ELEMENTS['geboortedatum'] = true;
PRIVATE_ELEMENTS['email'] = true;
PRIVATE_ELEMENTS['wachtwoord'] = true;
PRIVATE_ELEMENTS['lovecoins'] = true;

function GetBasePath() {
    return window.location.href.substr(0, window.location.href.lastIndexOf('/')) + "/"
}

// Maak de navigatie als je ingelogd bent
$('navigationElements').ready(function () {
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

            // Toon amount
            GeefProfielVanID(GeefGebruikerID()).then(function (data) {
                if (NAVIGATION[i].Naam == "Love Coins") {
                    // Modify
                    NAVIGATION[i].Naam += ' (' + data.lovecoins + ')'
                }

                var btn = $('<li class="nav-item pl-3"><a class="nav-link" href="' + url + '">' + NAVIGATION[i].Naam + '</a></li>').appendTo('#navigationElements')

                if (NAVIGATION[i].Naam == "Logout") {
                    btn.click(function () {
                        Logout()
                        Redirect('index.html')
                    })
                }
            })
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

// Animate to a div
function ScrollToErrorMessage(id) {
    $('html, body').animate({ scrollTop: $(id).offset().top }, 'fast');
}

// Geef een sterren beeld op basis van dag & maand
function GeefSterrenBeeld(date, month) {
    if (month == 1 && date >= 20 || month == 2 && date <= 18) { return "Waterman"; }
    if (month == 2 && date >= 19 || month == 3 && date <= 20) { return "Vissen"; }
    if (month == 3 && date >= 21 || month == 4 && date <= 19) { return "Ram"; }
    if (month == 4 && date >= 20 || month == 5 && date <= 20) { return "Stier"; }
    if (month == 5 && date >= 21 || month == 6 && date <= 21) { return "Tweling"; }
    if (month == 6 && date >= 22 || month == 7 && date <= 22) { return "Kreeft"; }
    if (month == 7 && date >= 23 || month == 8 && date <= 22) { return "Leeuw"; }
    if (month == 8 && date >= 23 || month == 9 && date <= 22) { return "Maagd"; }
    if (month == 9 && date >= 23 || month == 10 && date <= 22) { return "Weegschaal"; }
    if (month == 10 && date >= 23 || month == 11 && date <= 21) { return "Schorpioen"; }
    if (month == 11 && date >= 22 || month == 12 && date <= 21) { return "Boogschutter"; }
    if (month == 12 && date >= 22 || month == 1 && date <= 19) { return "Steenbok"; }

    return "What."
}

// Thank you PHP
function $_GET(q) { 
    let url = window.location.href
    return url.substring(url.indexOf('?') + q.length + 2, url.length);
}               

// Geef het profiel van iemand 
// async stuff, whoop
async function GeefProfielVanID(id) {
    let result = []
    fetch(ROOT_URL + '/profiel/read_one.php?id=' + id).then(function (resp) { return resp.json(); }).then(function (data) {
        result = data
    ;})

    await new Promise((resolve, reject) => setTimeout(resolve, 500));

    return result
}

