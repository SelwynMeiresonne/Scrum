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
        
        let i = 0;
        data.forEach(element => {
            console.log(element)
            let from_user = GeefGebruikerID()
            let to_user = GetChatOther(element.vanId, element.naarId)

            console.log(' => ', to_user)

            // Only create if its not already cached
            if (typeof users[to_user] === 'undefined') {
                // Store
                users[to_user] = true

                messages[to_user] = {}
                messages[to_user][0] = element

                //console.log('Created object for ', to_user)

                // Create
                PopulateUserList(to_user)
            } else {
                // Insert message
                messages[to_user][i] = element

               // console.log('Inserting for ', to_user, ' ', i, ' ', element)
            }

            // Increase
             i++;
        })
    }

    // Called when profiles are in
    function PopulateUserList(a) {
        //console.log(messages)
        GeefProfielVanID(a).then(function (data) {
           // console.log(a)
            // Create button
            var btn = $('#contacten').append("<li class='list-group-item chatitem'><p><button class='btn btn-primary' id='chatuser-" + data.id + "'>" + data.nickname + ' - ' + data.id + "</button></li>")
            // DoClick
            $('#chatuser-' + data.id).click(function () {
                // Clear
                $('#berichten').empty()

                // Insert them
                for (let b in messages[a]) {
                    $('#berichten').append('<div class="container mb-4 ' + (GeefGebruikerID() == messages[a][b].vanId ? 'bericht-from text-left' : 'bericht-to text-right') + '">' + messages[a][b].bericht + '</div>') 
                }
            })
        })
    }

    // Stuur een bericht
    function SendMessage(to, message) {

    }

    function GetChatOther(a, b) {
        if (a == GeefGebruikerID()) { return b }
        return a
    }
})
