// Initialize
$(document).ready(function() {

    // Gebruiker is ingelogd, naar profiel
    if (IsIngelogd()) {
       // window.location.replace('profiel.html');

       // return;
    }

    $('#errormessage').hide()

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
        $('#errormessage').show().text("De gegevens die je hebt ingevoert zijn niet juist!")
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

        let url = ROOT_URL + '/profiel/create.php';

        let data = {
            familienaam: $('input[name="r-naam"]').val(),
            voornaam: $('input[name="r-voornaam"]').val(),
            geboortedatum: $('input[name="r-birthday"]').val(),
            email: $('input[name="r-email"]').val(),
            nickname: $('input[name="r-username"]').val(),
            foto: 'no_picture.jpg',
            beroep: $('input[name="r-work"]').val(),
            sexe: $('input[name="r-man"]').checked ? 'm' : 'v',
            haarkleur: $('input[name="r-hair"]').val(),
            oogkleur: $('input[name="r-eye"]').val(),
            grootte: $('input[name="r-height"]').val(),
            gewicht: $('input[name="r-weight"]').val(),
            wachtwoord: $('input[name="r-password"]').val(),

            // Moet > 0 anders fout
            lovecoins: "1"
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
            .then(function (data){
                 if (data.id) {
                    OnRegisterSuccess(data)
                } else {
                    OnRegisterFail()
                }
            })
        .catch(function (error){console.log(error);});
    }

        // Login niet gelukt
        function OnRegisterFail() {
            $('#errormessage').show().text("Controleer of je alles juist hebt ingevuld en als je niets vergeten bent!")
        }
    
        // Login gelukt
        function OnRegisterSuccess(data) {
            // Local storage
            localStorage.setItem('user_id', data.id)
    
            // Redirect
            Redirect('paginas/profiel.html');
        }
})
