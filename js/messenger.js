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
    var selectedTarget = -1
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

                // Update
                selectedTarget = parseInt(a);

                // Insert them
                for (let b in messages[a]) {
                    $('#berichten').append('<div class="container mb-4 ' + (GeefGebruikerID() == messages[a][b].vanId ? 'bericht-from text-left' : 'bericht-to text-right') + '">' + messages[a][b].bericht + '</div>')
                }
            })
        })
    }

    function GetMessagesCount(id) {
        let count = 0
        for (let b in messages[id]) {
            count++;
        }

        return count;
    }

    // Send button
    $('#sendmessage').click(function () {
        console.log('CCCCCCCCCC')
        let text = $('input[name="bericht"]').val();

        console.log(selectedTarget, selectedTarget >= 0)

        // Meh
        if (selectedTarget <= 0) { return; }

        console.log('ya boi')

        // Send
        SendMessage(selectedTarget, text)
    })

    // Stuur een bericht
    function SendMessage(to, message) {
        console.log('SENDING ', to, ' -> ', message)
        let url = ROOT_URL + '/bericht/post.php';

        let data = {
            vanId: GeefGebruikerID(),
            naarId: to,
            bericht: message,
            status: "verzonden"
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
            .then(function (data) { 
                if (data.message = "Bericht werd aangemaakt.") {
                    // Into the stack
                    var len = GetMessagesCount(selectedTarget)

                    console.log(len)

                    messages[selectedTarget][len] = {
                        vanId: '' + GeefGebruikerID(),
                        naarId: '' + selectedTarget,
                        partnerId: '' + selectedTarget,
                        bericht: message,

                    }

                    console.log(messages[selectedTarget], len)

                    $('#berichten').append('<div class="container mb-4 ' + (GeefGebruikerID() == messages[selectedTarget][len].vanId ? 'bericht-from text-left' : 'bericht-to text-right') + '">' + message + '</div>')

                }
            })
            .catch(function (error) { console.log(error); });

    }

    function GetChatOther(a, b) {
        if (a == GeefGebruikerID()) { return b }
        return a
    }
})
