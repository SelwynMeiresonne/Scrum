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
    let id = GeefGebruikerID()
    let messages = []
    let users = {}
    var selectedTarget = isNaN($_GET('id')) ? -1 : $_GET('id')

    console.log(selectedTarget)


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

            // Only create if its not already cached
            if (typeof users[to_user] === 'undefined') {
                // Store
                users[to_user] = true

                messages[to_user] = {}
                messages[to_user][0] = element

                // Create
                PopulateUserList(to_user)
            } else {
                // Insert message
                messages[to_user][i] = element
            }

            // Increase
            i++;
        })
    }

    // Called when profiles are in
    function PopulateUserList(a) {
        GeefProfielVanID(a).then(function (data) {
            // Create button
            var btn = $('#contacten').append("<li class='list-group-item chatitem'><p><button class='btn btn-primary' id='chatuser-" + data.id + "'>" + data.nickname + ' - ' + data.id + "</button></li>")
            // DoClick
            $('#chatuser-' + data.id).click(function () {
                // Clear
                $('#berichten').empty()

                // Update
                selectedTarget = parseInt(a);

                UpdateChatFromServer();

                // Insert them
                for (let b in messages[a]) {
                    $('#berichten').append('<div class="container mb-4 ' + (GeefGebruikerID() == messages[a][b].vanId ? 'bericht-from text-left' : 'bericht-to text-right') + '">' + messages[a][b].bericht + '</div>')
                }
            })
        })
    }

    function UpdateChatFromServer() {
        if (selectedTarget > 0) {
            // Clear
            $('#berichten').empty()

            fetch(url + "?profielId=" + GeefGebruikerID())
                .then(function (response) { return response.json(); })
                .then(function (data) {
                    console.log(data)
                })

                /*
            // Insert them
            for (let b in messages[a]) {
                $('#berichten').append('<div class="container mb-4 ' + (GeefGebruikerID() == messages[a][b].vanId ? 'bericht-from text-left' : 'bericht-to text-right') + '">' + messages[a][b].bericht + '</div>')
            }*/
        }
    }

    // Get the count van alle messages van 1 user, id => profielId
    function GetMessagesCount(id) {
        let count = 0
        if (typeof messages[id] !== 'undefined') {
            for (let b in messages[id]) {
                count++;
            }
        }

        return count;
    }

    // Send button
    $('#sendmessage').click(function () {
        console.log('CCCCCCCCCC')
        let text = $('input[name="bericht"]').val();

        // Meh
        if (selectedTarget <= 0) { return; }

        // Send
        SendMessage(selectedTarget, text)
    })


    // Stuur een bericht
    function SendMessage(to, message) {
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

                    if (typeof users[to] === 'undefined') {
                        // Store
                        users[to] = true
                        messages[to] = {}

                        PopulateUserList(to)
                    }

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