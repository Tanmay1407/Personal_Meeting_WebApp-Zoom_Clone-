
const socket = io('/');

let userName = prompt("Enter Name", "User");
const videoGrid = document.getElementById('video_grid');
console.log(videoGrid);

const myVideo = document.createElement('video');
myVideo.muted = true;

var peer = new Peer(undefined); 



let myVideoStream;
peer.on('open',id =>{
    socket.emit("join-room",ROOM_ID, id);
    
})
const peers = {}
navigator.mediaDevices.getUserMedia({
    video: true,
    audio : true
}).then(stream =>{
    myVideoStream = stream;
    addVideoStream(myVideo,stream);
    
    peer.on('call',call => {
        call.answer(stream)
        const video = document.createElement('video');
        call.on('stream',userVideoStream =>{
            addVideoStream(video,userVideoStream);
        })
    })
    socket.on('user-connected',(userId)=>{
        console.log("FE User ID : "+userId);
        connectToNewUser(userId,stream);

    })
    
    
    let text = $('input');


$('html').keydown((e)=>{
    if(e.which == 13 && text.val().length !==0){
      //  console.log(text.val());
        socket.emit('message',text.val());
        text.val('');
    }
})

socket.on('createMessage', message=>{
   console.log("From Server : "+message)
    $('.messages').append(`<li class="message"><b>${userName}</b><br/>${message} </li>`);
    scrollToBottom();
});

})
const connectToNewUser = (userId,stream) =>{
   console.log("FE con User ID : "+userId);
    const  call = peer.call(userId,stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream =>{
        addVideoStream(video,userVideoStream)
    })
    peers[userId] = call
}


const addVideoStream = (video,stream) =>{
    video.srcObject = stream;
    video.addEventListener('loadedmetadata',()=>{
        video.play();
    })
    videoGrid.append(video)
    
}


const scrollToBottom = () =>{
    var d = $('.main_chat_window');
    d.scrollTop(d.prop('scrollHeight'));
}

const muteUnmute = () =>{
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if(enabled){
        myVideoStream.getAudioTracks()[0].enabled = false;
        setUnmuteButton();
    }else{
        setMuteButton();
        myVideoStream.getAudioTracks()[0].enabled = true;
    }
}

const setMuteButton =()=>{
    const html = `<i class="fas fa-microphone"></i>
    <span>Mute</span>
    `
    document.querySelector(".main_mute_button").innerHTML = html;
}

const setUnmuteButton =()=>{
    const html = `<i class="unmute fas fa-microphone-slash"></i>
    <span>Unmute</span>
    `
    document.querySelector(".main_mute_button").innerHTML = html;
}

const playStop = () =>{
    let enabled = myVideoStream.getVideoTracks()[0].enabled;
    if(enabled){
        myVideoStream.getVideoTracks()[0].enabled = false;
        setPlayVideo();
    }else{
        setStopVideo();
        myVideoStream.getVideoTracks()[0].enabled = true;
    }
}

const setPlayVideo =()=>{
    const html = `<i class="play fas fa-video-slash"></i>
    <span>Play Video</span>
    `
    document.querySelector(".main_video_button").innerHTML = html;
}

const setStopVideo =()=>{
    const html = `<i class="fas fa-video"></i>
    <span>Stop Video</span>
    `
    document.querySelector(".main_video_button").innerHTML = html;
}
