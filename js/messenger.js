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

    function GeefGebruikerID() {
        return 10
    }

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
            for (let i = 0; i < data.length; i++) {
                CreateConversations(data[i])
            }
        })

    function CreateConversations(data) {
        data.forEach(element => {
            let from_user = GeefGebruikerID()
            let to_user = GetChatOther(element.vanId, element.naarId)

            // Only create if its not already cached
            if (typeof users[to_user] === 'undefined') {
                // Store
                users[to_user] = true

                // Message
                messages[to_user] = element

                // Create
                PopulateUserList(to_user)
            }
        })
    }

    // Called when profiles are in
    function PopulateUserList(a) {
        GeefProfielVanID(a).then(function (data) {
            // Create button
            var btn = $('#contacten').append("<li class='list-group-item chatitem'><p><button class='btn btn-primary' id='chatuser-" + data.id + "'>" + data.nickname + ' - ' + data.id + "</button></li>")
            // DoClick
            $('#chatuser-' + data.id).click(function () {
                // Get the ID
                var id = data.id;

                for (let i = 0; i < data.length; i++) {
                    console.log(' -> ', data[i])
                }

            })
        })

    }

    function GetChatOther(a, b) {
        if (a == GeefGebruikerID()) { return b }
        return a
    }
})
