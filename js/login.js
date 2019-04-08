// Initialize
window.addEventListener('load', function() {

    // Gebruiker is ingelogd, naar profiel
    if (IsIngelogd()) {
        //window.location.replace('profiel.html');
        //return;
    }

    var eLogin = document.querySelector('#login')
    eLogin.addEventListener('click', OnLoginClick);

    function OnLoginClick(evt) {
        evt.preventDefault();
        let nickname =  document.getElementById('username').value; 
        let wachtwoord =  document.getElementById('password').value;
            let url = ROOT_URL + '/profiel/authenticate.php';

            let data = {
                nickname: nickname,
                wachtwoord: wachtwoord
            }

            var request = new Request(url, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: new Headers({
                    'Content-Type': 'application/json'
                })
            });
            
            fetch(request)
            .then( function (resp) {return resp.json()})
            .then( function (data) {
                console.log(data) 
                // Geeft ID terug als het iets vind
                if (data.id) {
                    OnLoginSuccess(data)
                } else {
                    OnLoginFail()
                }

            })
    }

    // Login niet gelukt
    function OnLoginFail() {
        console.log("Kan niet inloggen")
    }

    // Login gelukt
    function OnLoginSuccess(data) {
        // Local storage
        localStorage.setItem('user_id', data.id)

        // Redirect
        Redirect('profiel.html');
    }
})
