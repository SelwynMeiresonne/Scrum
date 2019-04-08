// Initialize
window.addEventListener('load', function () {

    // Gebruiker is ingelogd, naar profiel
    if (IsIngelogd()) {
        //window.location.replace('profiel.html');
        //return;
    }

    // Login
    var eLogin = document.querySelector('#login')
    eLogin.addEventListener('click', OnLoginClick);

    // Registreer
    var eRegister = document.querySelector('#register')
    eRegister.addEventListener('click', OnRegisterClick)

    // Login knop
    function OnLoginClick(evt) {
        evt.preventDefault();
        let nickname = document.getElementsByName('l-username')[0].value;
        let wachtwoord = document.getElementsByName('l-password')[0].value;
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
            .then(function (resp) { return resp.json() })
            .then(function (data) {
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

    function OnRegisterClick(evt) {
        evt.preventDefault();

        console.log("CALLED!!!")

        let data = document.getElementsByName('register')

        data.forEach(element => {
            if (element.name != "" || element.value != "undefined") {
                console.log( element.value == "" ? "" : element.value)
            }
        })

        //console.log(data)


        /*
        let url = ROOT_URL + '/profiel/authenticate.php';

        let data = {
            nickname: nickname,
            email: email,
            wachtwoord: wachtwoord
        }

        var request = new Request(url, {
            method: 'POST',                 //request methode
            body: JSON.stringify(data),     //body waar de data aan meegegeven wordt
            headers: new Headers({          //onze API verwacht application/json
                'Content-Type': 'application/json'
            })
        });

        fetch(request)
            .then(function (response){return response.json();})
            .then(function (data){console.log(data);})
        .catch(function (error){console.log(error);});
        */
    }

})
