// Global functions


// Called when the document is ready
$('document').ready(function () {
    // Gebruiker is niet ingelogd, naar index
    if (!IsIngelogd()) {
        Redirect('../index.html')
        return;
    }

    // W
    // Animations
    $('.inbox_people').width('99%')
    $('.mesgs').hide()

    // Basic url
    let url = ROOT_URL + "/bericht/read.php"
    let id = GeefGebruikerID()
    var selectedTarget = isNaN($_GET('id')) ? -1 : parseInt($_GET('id'))

    if (selectedTarget > -1) { 
        GeefProfielVanID(selectedTarget).then(function (data) {
            if (typeof data.message === 'undefined') {
                $('.inbox_people').width('39%')
                $('.mesgs').show()
                $('.talkingto').text("Bericht aan " + data.nickname)
            } else {
                // error profiel?
                Redirect('berichten.html')
            }
        })
    }

    // Create a message
    function CreateMessagePacket(target, message) {
        let data = {
            vanId: '' + GeefGebruikerID(),
            naarId: '' + target,
            partnerId: '' + target,
            bericht: message,
            berichtId: "error"
        }

        return data
    }

    // CACHE CACHE CACHE
    let profile_pic = "https://scrumserver.tenobe.org/scrum/img/no_image.png";

    let messages = []
    let users = {}

    // Start point
    function Init() {
        // Fetch
        fetch(url + "?profielId=" + id)
            .then(function (response) { return response.json(); })
            .then(function (data) {
                for (let i = 0; i < data.length; i++) {
                    CreateConversations(data[i])
                }

                CreateMessages(selectedTarget)
            })

            if (selectedTarget != -1) {
                PopulateUserList(selectedTarget)

                let to_user = selectedTarget

                // Default message
                messages[to_user] = {}
                messages[to_user][0] = CreateMessagePacket(to_user, 'Stuur je vriend een bericht!')

                users[to_user] = {}
            }
    }

    // Update
    function Update() {
        // Fetch
        fetch(url + "?profielId=" + id)
            .then(function (response) { return response.json(); })
            .then(function (data) {
                for (let i = 0; i < data.length; i++) {
                    CheckIfShouldAddMessages(data[i])
                }
            })

        // Update, RIP server
        setTimeout(Update, 1000 * .3)
    }

    function CheckIfShouldAddMessages(data) {
        // Easy
        let to_user = parseInt(GetChatOther(data[0].vanId, data[0].naarId))

        // Count
        let len = GetMessagesCount(to_user)

        // UPDATE UPDATE IT HAS AN UPDATE
        // OMG IT HAS AN UPDATE
        // IT WORKS
        if (len != data.length) {
            // New
            if (len < data.length) {

                // Difference
                var diff = data.length - len

                // New user
                if (len == 0) {
                    users[to_user] = true
                    messages[to_user] = {}
                    messages[to_user] = CreateMessagePacket(to_user, "")
                    
                    // Create this
                    PopulateUserList(to_user)

                    return
                }

                // Loop through new messages
                for (let i = 0; i < diff; i++) {
                    // Add them
                    messages[to_user][len + i] = data[data.length - 1]

                    console.log(profile_pic)
                    //20190411121334616600_test_image_woop

                    $('#berichten').append(`
                        <div class="incoming_msg mb-4">
                        <div class="incoming_msg_img"> <img src="https://scrumserver.tenobe.org/scrum/img/${profile_pic}"
                                alt="Profile Picture"> </div>
                        <div class="received_msg">
                            <div class="received_withd_msg">
                                <p class="bericht">${data[data.length - 1].bericht}</p>
                            </div>
                        </div>
                    `)
                }
            } else { // Delete
                // Just reset, too tired to do anything else :/
                $('#berichten').empty()

                messages[to_user] = data
                CreateMessages(selectedTarget)
            }

            Scroll()
        }
    }

    // First init
    Init()

    // Update
    Update()

    // Scroll
    function Scroll() {
        $(".msg_history").animate({ scrollTop: $('.msg_history').prop("scrollHeight") }, 200);
    }

    function DeleteMessage(id) {
        let url = ROOT_URL + '/bericht/delete.php';

        let data = {
            id: id
        }

        var request = new Request(url, {
            method: 'DELETE',
            body: JSON.stringify(data),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        });

        fetch(request)
            .then(function (resp) { return resp.json(); })
            .then(function (data) {
                    console.log(data)
                    $('#bericht-' + data.berichtId).remove()
             })
            .catch(function (error) { console.log(error); });
    }

    // Create conversations
    function CreateConversations(data) {
        let i = 0;
        data.forEach(element => {
            let from_user = GeefGebruikerID()
            let to_user = GetChatOther(element.vanId, element.naarId)

            // Only create if its not already cached
            if (typeof users[to_user] === 'undefined') {
                // Store
                users[to_user] = { foto: "no_image.png" }
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

    function CreateMessages(a) {
        $('.msg_history').empty()

        for (let b in messages[a]) {
            if (messages[a][b].vanId == GeefGebruikerID()) {
                $('#berichten').append(`
                    <div id="bericht-${messages[a][b].berichtId}" class="outgoing_msg">
                    <div class="sent_msg">
                        <p>${messages[a][b].bericht}</p>
                        <small class="form-text text-muted"><a href="#" id="delete-${messages[a][b].berichtId}">Delete</a></small>
                    </div>
                </div>
            `)
            } else {
                $('#berichten').append(`
                <div class="incoming_msg mb-4">
                <div class="incoming_msg_img"> <img src="https://scrumserver.tenobe.org/scrum/img/${profile_pic}"
                        alt="Profile Picture"> </div>
                <div class="received_msg">
                    <div class="received_withd_msg">
                        <p class="bericht">${messages[a][b].bericht}</p>
                    </div>
                </div>
            `)
            }

            AddDeleteButtons(messages[a][b], a, b)
        }

        // Delete the delete lul
        $('#delete-error').remove()

        $('.msg_history').scrollTop($('.msg_history')[0].scrollHeight);;
    }

    // Called when profiles are in
    function PopulateUserList(a) {
        GeefProfielVanID(a).then(function (data) {
            // Create button
            var len = GetMessagesCount(a)

            //vanessa_vaneenoo.png
            var btn = $('#contacten').append(`
                <a id="chatuser-${data.id}">
                    <div class="chat_people mt-3">
                        <div class="chat_img">
                            <img src="${"https://scrumserver.tenobe.org/scrum/img/" + data.foto}" alt="Profile picture">
                        </div>

                        <div class="chat_ib">
                            <h5>${data.nickname}</h5>
                            <p>${messages[a][len - 1].bericht}</p>
                        </div>
                    </div>
                </a>`
            )

            // Delete the delete lul
            $('#delete-error').remove()

            // DoClick
            $('#chatuser-' + data.id).click(function () {
                $('.inbox_people').width('39%')
                $('.mesgs').show()

                profile_pic = data.foto;

                // Clear
                $('#berichten').empty()

                // Update
                selectedTarget = parseInt(a);

                //UpdateChatFromServer();
                $('.talkingto').text("Bericht aan " + data.nickname)

                // Insert them
                for (let b in messages[a]) {
                    if (messages[a][b].vanId == GeefGebruikerID()) {
                        $('#berichten').append(`
                            <div id="bericht-${messages[a][b].berichtId}" class="outgoing_msg">
                            <div class="sent_msg">
                                <p>${messages[a][b].bericht}</p>
                                <small class="form-text text-muted"><a href="#" id="delete-${messages[a][b].berichtId}">Delete</a></small>
                            </div>
                        </div>
                    `)
                    } else {
                        $('#berichten').append(`
                        <div class="incoming_msg mb-4">
                        <div class="incoming_msg_img"> <img src="${"https://scrumserver.tenobe.org/scrum/img/" + data.foto}"
                                alt="Profile Picture"> </div>
                        <div class="received_msg">
                            <div class="received_withd_msg">
                                <p class="bericht">${messages[a][b].bericht}</p>
                            </div>
                        </div>
                    `)
                    }

                    AddDeleteButtons(messages[a][b], a, b)
                }

                // Delete the delete lul
                $('#delete-error').remove()

                // Scroll
                Scroll()
            })
        })
    }

    // Create delete button
    function AddDeleteButtons(data, from_id, convo_id) {
        $('#delete-' + data.berichtId).click(function () {
            DeleteMessage(data.berichtId)
        })
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

    $('input[name="bericht"]').keypress(function (event) {
        // 13 -> enter
        if (event.keyCode === 13) {
            $('#sendmessage').click()
        }
    })

    var canSend = true;

    // Send button
    $('#sendmessage').click(function () {
        let text = $('input[name="bericht"]').val();

        // Meh
        if (selectedTarget <= 0) { return; }
        if (canSend == false) {     
            $('#berichten').append(`
                <div class="outgoing_msg">
                    <div class="sent_msg">
                        <p style="color:red">Gelieve even te wachten voor je een nieuw bericht verzend</p>
                    </div>
                </div>
            `)
            return;
        }

        // Reset
        $('input[name="bericht"]').val('')

        // Anti-spam
        canSend = false;
        setTimeout(function() {
            canSend = true;
        }, 600)

        // Send
        SendMessage(selectedTarget, text)

        // Scroll
        Scroll()
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

                    if (typeof users[to] === 'undefined') {
                        // Store
                        users[to] = true
                        messages[to] = {}

                        PopulateUserList(to)
                    }

                    // Guess I'm lazy
                    messages[selectedTarget][len] = {
                        vanId: '' + GeefGebruikerID(),
                        naarId: '' + selectedTarget,
                        partnerId: '' + selectedTarget,
                        bericht: message,
                        berichtId: data.id
                    }

                    $('#berichten').append(`
                        <div id="bericht-${messages[selectedTarget][len].berichtId}" class="outgoing_msg">
                            <div class="sent_msg">
                                <p>${messages[selectedTarget][len].bericht}</p>
                                <small class="form-text text-muted"><a href="#" id="delete-${messages[selectedTarget][len].berichtId}">Delete</a></small>
                            </div>
                        </div>
                    `)

                    // Create delete buttons
                    AddDeleteButtons(messages[selectedTarget][len], selectedTarget, len)
                } else {

                }
            })
            .catch(function (error) { console.log(error); });
    }
    

    function GetChatOther(a, b) {
        if (a == GeefGebruikerID()) { return b }
        return a
    }
})

