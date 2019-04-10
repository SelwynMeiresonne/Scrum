// Global functions
TEST = {}
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
    let current_id = 10

    let data = {
        profielId: 1,
    }

    let users = {}
    let messages = []
    fetch(url + "?profielId=" + id)
        .then(function (response) { return response.json(); })
        .then(function (data) {
            console.log("DATA -> ", data)
            data.forEach(element => {
                messages.push(element)
                // Voor ieder bericht
                for (let i = 0; i < element.length - 1; i++) {
                    // Get the profiles

                    console.log(element[i].naarId == GeefGebruikerID() ?  element[id].vanId : element[id].naarId)
                   //var id = element[i].naarId == GeefGebruikerID() ?  element[id].vanId : element[id].naarId
            
                    if (element[i].naarId != current_id) {
                    GeefProfielVanID(id).then(function (data) {

                        $('#contacten').append('<p>' + data.nickname + ' - ' + data.id + '</p>')
                    })
                }
                }
            })

        })

    // Called when profiles are in
    function PopulateUserList(users) {
    }

})
