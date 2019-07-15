var socket = io("http://192.168.11.13:8000");

$(document).ready(function() {
  $("#login-form-test").show();
  $("#room-chat").hide();

  const arrToken = [
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJuYW1lIjoiSm9obiBEb2UiLCJpYXQiOjE1MTYyMzkwMjJ9.rDiipwWjjbCi8_ZJUrtE7KR6Kk_-YKo1eFnpmF0Rjx8",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjIiLCJuYW1lIjoiSm9obiBEb2UiLCJpYXQiOjE1MTYyMzkwMjJ9.nFVVjyH5chB8F_dVhEjVr75Fu1vcY__SXD1JhY3x-OE",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMiLCJuYW1lIjoiSm9obiBEb2UiLCJpYXQiOjE1MTYyMzkwMjJ9.9yVAddKidGWrpTY-8fjnN15k1CXWUCZOiiSsj5od1qk",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQiLCJuYW1lIjoiSm9obiBEb2UiLCJpYXQiOjE1MTYyMzkwMjJ9.W1PWTci5urYrJxJ8IAwJZKNgUQtx5PayCmz4UW18BK8"
  ];

  var data = "";
  $("#form-login").submit(function(e) {
    e.preventDefault();
    data = $("#exampleInputEmail1").val();

    socket.emit("user-connect", {
      user_id: data
    });

    let config = {
      url: "/friends_status",
      method: "get",
      baseURL: "http://192.168.11.13:8000",
      headers: {
        Authorization: "Bearer " + arrToken[parseInt(data) - 1]
      }
    };

    axios(config).then(function(res) {
      $("#list-friend-online").html("");
      $("#login-form-test").hide(1000);
      $("#room-chat").show(1000);
      res.data.forEach(element => {
        $("#list-friend-online").append(
          renderItem1(element.userid, element.isOnline)
        );
      });
    });

    
    let config1 = {
      url: "/user_status",
      method: "post",
      baseURL: "http://192.168.11.13:8000",
      headers: {
        Authorization: "Bearer " + arrToken[parseInt(data) - 1]
      },
      data: {
        user_id: data
      }
    };

    axios(config1)
      .then(function(res) {
        console.log(res);
      })
      .catch(function(err) {
        console.log(err);
      });

    return false;
  });

  $("#btn-logout").click(function() {
    socket.emit("user-logout");
    $("#login-form-test").show(1000);
    $("#room-chat").hide(1000);
  });

  socket.on("user-logout", function(msg) {
    console.log(msg);
    let config = {
      url: "/friends_status",
      method: "get",
      baseURL: "http://192.168.11.13:8000",
      headers: {
        Authorization: "Bearer " + arrToken[parseInt(data) - 1]
      }
    };

    axios(config).then(function(res) {
      $("#list-friend-online").html("");
      res.data.forEach(element => {
        $("#list-friend-online").append(
          renderItem1(element.userid, element.isOnline)
        );
      });
    });
  });

  socket.on("invite-to-join-room", function(msg) {
    console.log(msg);

    socket.emit("accept-to-join-room", {
      room: msg.userSocketRoom
    });

    let config = {
      url: "/friends_status",
      method: "get",
      baseURL: "http://192.168.11.13:8000",
      headers: {
        Authorization: "Bearer " + arrToken[parseInt(data) - 1]
      }
    };

    axios(config).then(function(res) {
      $("#list-friend-online").html("");
      res.data.forEach(element => {
        $("#list-friend-online").append(
          renderItem1(element.userid, element.isOnline)
        );
      });
    });
  });
});

function renderItem1(id, isOnline) {
  return `<div class="d-flex user-friend justify-content-between pb-2 mt-3">
              <a href="#">
                  <div data-toggle="modal" data-target="#${id}" class="user-id">${id}</div>
              </a>
              <div class="d-flex align-items-center">
                  <div class="user-is-online mr-2">${
                    isOnline ? "online" : "offline"
                  }</div>
                  <i class="fa fa-circle ${
                    isOnline ? "online" : "offline"
                  }" aria-hidden="true"></i>
              </div>
          </div>`;
}

function renderItem2(id, name, isOnline, lastTime) {
  return `<div class="modal fade" id="${id}" tabindex="-1" role="dialog"
          aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
              <div class="modal-dialog modal-dialog-centered" role="document">
                  <div class="modal-content">
                      <div class="modal-header list-chatting">
                          <h5 class="modal-title" id="exampleModalCenterTitle">User: ${name.toUpperCase()}</h5>
                          <i class="fa fa-circle ${
                            isOnline ? "online" : "offline"
                          }"></i>
                          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                              <span aria-hidden="true">&times;</span>
                          </button>
                      </div>
                      <div class="modal-body">
                          <label>Name: </label>
                          <span>${name}</span>
                          <br/>
                          ${
                            lastTime
                              ? `<label>Last time: </label><span>${lastTime.toString()}</span><br/>`
                              : ""
                          }
                      </div>
                      <div class="modal-footer">
                          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                      </div>
                  </div>
              </div>
          </div>`;
}
