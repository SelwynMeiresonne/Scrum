ROOT_URL = "https://scrumserver.tenobe.org/scrum/api";

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
