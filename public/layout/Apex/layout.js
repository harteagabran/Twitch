//Notifications and Audio
var noti = document.getElementById("notification");
var sound = document.getElementById("alert-sound");
var picture = document.getElementById("alert-img");
var messArea = document.getElementById("alert-message");
var txt;

//Alert call
function layoutAlert( type = "follower", event = {}) {
    //update picture
    picture.src = event.pic;
    //alert messages
    if(type == "follower") {
        txt = '<b class="celebrate">' + event.name + '</b> is following!';
    } else if(type == "subscriber") {
        //check if message
        if(event.message) {
            txt = '<b class="celebrate">' + event.name + '</b> says<p>' + event.message.text + '</p>'; 
         } else {
             txt = '<b class="celebrate">' + event.name + '</b> just became a tier <b class="view">' + event.tier + '</b> subscriber!';
         }
    } else if(type == "raider") {
        txt = '<b class="celebrate">' + event.name + '</b> raids with <b class="view">' + event.viewers + '</b> legends!';
    } else if(type == "cheerer") {
        txt = '<b class="celebrate">' + event.name + '</b> just cheered <b class="view">' + event.bits + '</b>!';
    } else {
        return;
    }

    //update alert message
    messArea.innerHTML = txt;

    //animation
    noti.classList.remove('alert-play');
    noti.offsetWidth;
    noti.classList.add('alert-play');

    //sound
    sound.currentTime = 0;
    sound.play();
}

function init() {
    //alertQueue
    alertQueue = new AlertQueue(4500);
}

window.onload = init();