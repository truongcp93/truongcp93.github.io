const socket = io('https://stream141292.herokuapp.com');

$("#div-content").hide();

socket.on('ERROR_CREATE', () => alert('isset user name'));

socket.on('LIST_USER_LOGIN', arrUserInfo => {
    $("#div-content").show();
    $("#div-signin").hide();

    arrUserInfo.forEach(user => {
        const { userName, idUser } = user;
        $('#ulUser').append('<li id="'+ user.idUser +'">'+ user.userName +'</li>');
    });

    socket.on('NEW_USER_CREATE', user => {
        const { userName, idUser } = user;
    $('#ulUser').append('<li id="'+ user.idUser +'">'+ user.userName +'</li>');
    });

    socket.on('disconnected', peerId => {
        $('#'+peerId).remove();
    });
});



function openStream() {
    const config = { audio: false, video: true };
    return navigator.mediaDevices.getUserMedia(config);
}

function playStream(idVideoTag, stream) {
    const video         = document.getElementById(idVideoTag);
    video.srcObject     =   stream;
    video.play();
}


// const peer = new Peer({key: 'ttpzgooaiubd42t9'});

const peer = new Peer({
    key: 'peerjs',
    host: 'stream141292.herokuapp.com',
    secure: true,
    port: 443,
    // config: customConfig
});

peer.on('open', id => {
    $('#my-peer').append(id);

    $("#btnSignUp").click(function () {
        const userName  =   $("#txtUserName").val();
        socket.emit('USER_GET', {userName: userName, idUser: id });
    });
});


// my Caller
$("#btnCall").click(function () {
    const id = $('#remoteId').val();

    openStream()
        .then(stream => {
               playStream('localStream', stream);
               const call = peer.call(id, stream);
               call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
             });
});

// that Caller
peer.on('call', call => {
    openStream()
        .then(stream => {
            call.answer(stream);
            playStream('localStream', stream);
            call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
        });
});

