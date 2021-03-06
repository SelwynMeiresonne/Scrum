// Initialize

   // SendImage('profile_picture', foto)

$(document).ready(function () {
    // Gebruiker is ingelogd, naar profiel
    if (IsIngelogd()) {
        Redirect('paginas/profiel.html')
        return;
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
        Redirect('paginas/profiel.html');
    }

    let current_picture = ""
    let current_picture_id = "no_image.png"
    $('input[name="r-foto"]').on('change', function(){
        var reader = new FileReader();
        var file    = document.querySelector('input[type=file]').files[0];
    
        reader.readAsDataURL(file);
        reader.onload = function(e) {
            current_picture = e.target.result
            SendImage('test_image_woop', current_picture)
        }
    })

    function SendImage(naam, encoded) {
        let url = ROOT_URL + '/image/upload.php';

        let data = {
            naam: naam,
            afbeelding: encoded
        }

        var request = new Request(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        });

        fetch(request)
            .then(function (resp) { return resp.json(); })
            .then(function (data) { current_picture_id = data.fileName })
            .catch(function (error) { console.log(error); });
    }

    function OnRegisterClick(evt) {
        evt.preventDefault();

        // Wachtwoorden
        var wachtwoordA = $('input[name=r-password]').val()
        var wachtwoordB = $('input[name=r-password-2]').val()

        // Lengte
        if (wachtwoordA.length < 10) {
            $('#errormessage').show().text("Het wachtwoord moet groter zijn dan 10 karakters");
            ScrollToErrorMessage('#errormessage')
            return
        }

        // Wachtwoorden zijn gelijk
        if (wachtwoordA !== wachtwoordB) {
            $('#errormessage').show().text("De wachtwoorden komen niet overeen");
            ScrollToErrorMessage('#errormessage')
            return
        }

        console.log("ITS ", $('input[name="r-foto"]').val())

        let url = ROOT_URL + '/profiel/create.php';

        let data = {
            familienaam: $('input[name="r-naam"]').val(),
            voornaam: $('input[name="r-voornaam"]').val(),
            geboortedatum: $('input[name="r-birthday"]').val(),
            email: $('input[name="r-email"]').val(),
            nickname: $('input[name="r-username"]').val(),
            foto: current_picture_id,
            beroep: $('input[name="r-work"]').val(),
            sexe: $('select[name="r-sex"]').children("option:selected").val(),
            haarkleur: $('input[name="r-hair"]').val(),
            oogkleur: $('input[name="r-eye"]').val(),
            grootte: $('input[name="r-height"]').val(),
            gewicht: $('input[name="r-weight"]').val(),
            wachtwoord: $('input[name="r-password"]').val(),

            // Moet > 0 anders fout
            lovecoins: 1
        }

        var request = new Request(url, {
            method: 'POST',                 //request methode
            body: JSON.stringify(data),     //body waar de data aan meegegeven wordt
            headers: new Headers({          //onze API verwacht application/json
                'Content-Type': 'application/json'
            })
        });

        fetch(request)
            .then(function (response) { return response.json(); })
            .then(function (data) {
                if (data.id) {
                    OnRegisterSuccess(data)
                } else {
                    OnRegisterFail()
                }
            })
            .catch(function (error) { console.log(error); });
    }

    // Login niet gelukt
    function OnRegisterFail() {
        $('#errormessage').show().text("Controleer of je alles juist hebt ingevuld en als je niets vergeten bent!")
        ScrollToErrorMessage('#errormessage')
    }

    // Login gelukt
    function OnRegisterSuccess(data) {
        // Local storage
        localStorage.setItem('user_id', data.id)

        // Redirect
        Redirect('paginas/profiel.html');
    }
})
