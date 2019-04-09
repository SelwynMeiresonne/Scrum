// Global functions

// Called when the document is ready
$('document').ready(function () {
    // Gebruiker is niet ingelogd, naar index
    if (!IsIngelogd()) {
        Redirect('../index.html')
        return;
    }

    // Basic url
    let url = ROOT_URL + "/bericht/read.php"

    let id = '10'

    let data = {
        profielId: 1,
    }

    let users = {}
    fetch(url + "?profielId=" + id)
        .then(function (response) { return response.json(); })
        .then(function (data) {
            data.forEach(element => {
                console.log(element)
                // Voor ieder bericht
                for (let i = 0; i < element.length; i++) {
                    // Get the profiles
                    GeefProfielVanID(element[i].naarId).then(function (data) {
                        // Store it for later
                        users[element[i].naarId] = data
                    })
                }
            })

            // Call this when done
            PopulateUserList(users)
        })

    // Called when profiles are in
    function PopulateUserList(users) {
        let v = Object.entries(users)
        console.log(v)
    }

})