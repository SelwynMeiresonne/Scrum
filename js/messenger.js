// Global functions
TEST = {}
// Called when the document is ready
$('document').ready(function () {
    // Gebruiker is niet ingelogd, naar index
    if (!IsIngelogd()) {
        Redirect('../index.html')
        return;
    }

    // Animations
    $('.inbox_people').width('99%')
    $('.mesgs').hide()

    /*
    $.ajax({
        type: 'GET',
        url: ROOT_URL + '/bericht/read.php',

        dataType: 'json',

        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },

        success: function (data) {
            console.log(data)
        },
    })​*/

    /*
    var ajaxReq = $.ajax(ROOT_URL + '/bericht/read.php', {
        dataType: 'json',
        timeout: 500,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
    });*/

    $.ajax({
        url: ROOT_URL + '/bericht/read.php?profileId=22',
        dataType: 'json',
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
    }).fail(function (data) {
        console.log("FAIL -> ", data);
    }).done(function (data) {
        console.log(data)
    })

    // Basic url
    let url = ROOT_URL + "/bericht/read.php"
    let id = GeefGebruikerID()
    let messages = []
    let users = {}
    var selectedTarget = isNaN($_GET('id')) ? -1 : parseInt($_GET('id'))

    if (selectedTarget > -1) { }
    GeefProfielVanID(selectedTarget).then(function (data) {
        console.log(data)
        if (typeof data.message !== 'undefined') {
            $('.inbox_people').width('39%')
            $('.mesgs').show()
        } else {
            $('.talkingto').text("Bericht aan " + data.nickname)
        }
    })

    // CACHE CACHE CACHE
    let profile_pic = "https://scrumserver.tenobe.org/scrum/img/no_image.png";

    fetch(url + "?profielId=" + id)
        .then(function (response) { return response.json(); })
        .then(function (data) {
            for (let i = 0; i < data.length; i++) {
                CreateConversations(data[i])
            }
        })

    // Scroll
    function Scroll() {
        $(".msg_history").animate({ scrollTop: $('.msg_history').prop("scrollHeight")}, 200);
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

            // DoClick
            $('#chatuser-' + data.id).click(function () {
                $('.inbox_people').width('39%')
                $('.mesgs').show()

                // Clear
                $('#berichten').empty()

                // Set this
                profile_pic = "https://scrumserver.tenobe.org/scrum/img/" + data.foto

                // Update
                selectedTarget = parseInt(a);

                //UpdateChatFromServer();
                $('.talkingto').text("Bericht aan " + data.nickname)

                // Insert them
                for (let b in messages[a]) {
                    if (messages[a][b].vanId == GeefGebruikerID()) {
                        $('#berichten').append(`
                            <div class="outgoing_msg">
                            <div class="sent_msg">
                                <p>${messages[a][b].bericht}</p>
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
                }

                // Scroll
                Scroll()
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

    $('input[name="bericht"]').keypress(function (event) {
        // 13 -> enter
        if (event.keyCode === 13) {
            $('#sendmessage').click()
        }
    })

    // Send button
    $('#sendmessage').click(function () {
        let text = $('input[name="bericht"]').val();

        // Meh
        if (selectedTarget <= 0) { return; }

        // Reset
        $('input[name="bericht"]').val('')

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

                    $('#berichten').append(`
                        <div class="outgoing_msg">
                            <div class="sent_msg">
                                <p>${messages[selectedTarget][len].bericht}</p>
                            </div>
                        </div>
                    `)

                    // Scroll
                    $('.msg_history').scrollTop($('.msg_history')[0].scrollHeight);
                }
            })
            .catch(function (error) { console.log(error); });

    }

    function GetChatOther(a, b) {
        if (a == GeefGebruikerID()) { return b }
        return a
    }
})
