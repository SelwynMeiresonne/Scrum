ROOT_URL = "https://scrumserver.tenobe.org/scrum/api";

// Kijken of een gebruiker is ingelogd
function IsIngelogd() {
    return (localStorage.getItem('user_id') !== null);
}

// Logt een gebruiker uit
function Logout() {
    localStorage.removeItem('user_id')
}

