$(document).ready(function(){
    var config = {
        url: '/friends_status',
        method: 'get',
        baseURL: 'http://192.168.1.24:8080',
        headers: {
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.cThIIoDvwdueQB468K5xDc5633seEFoqwxjF_xSJyQQ"
        }
    }

    var socket = io('http://192.168.1.24:8080');
    socket.on('invite-to-join-room', (msg) => {
        console.log(msg);
    });
    listUserOnline(config);
});

function renderItem1(id, name, isOnline) {
    return `<div class="d-flex user-friend justify-content-between pb-2 mt-3">
                <a href="#">
                    <div data-toggle="modal" data-target="#${id}" class="user-id">${name}</div>
                </a>
                <div class="d-flex align-items-center">
                    <div class="user-is-online mr-2">${isOnline ? 'online' : 'offline'}</div>
                    <i class="fa fa-circle ${isOnline ? 'online' : 'offline'}" aria-hidden="true"></i>
                </div>
            </div>`
}

function renderItem2(id ,name, isOnline, lastTime) {
    return `<div class="modal fade" id="${id}" tabindex="-1" role="dialog"
            aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered" role="document">
                    <div class="modal-content">
                        <div class="modal-header list-chatting">
                            <h5 class="modal-title" id="exampleModalCenterTitle">User: ${name.toUpperCase()}</h5>
                            <i class="fa fa-circle ${isOnline ? 'online' : 'offline'}"></i>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <label>Name: </label>
                            <span>${name}</span>
                            <br/>
                            ${lastTime ? `<label>Last time: </label><span>${lastTime.toString()}</span><br/>` : ''}
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>`
}

function listUserOnline(config) {
    axios(config)
    .then(function(res) {
        var data = res.data;
        var concat = [];
        var concat1 = [];
        data.forEach(element => {
            console.log(element);
            concat.push(renderItem1(element.id, element.username, element.isOnline));
            concat1.push(renderItem2(element.id, element.username, element.isOnline, element.latestTime));
        });
        $("#list-friend-online").html(concat);
        $("#user-modal").append(concat1);
    })
}