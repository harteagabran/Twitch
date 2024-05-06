//Notifications and Audio
var noti = document.getElementById("notification");
var picture = document.getElementById("alert-img");
var phoenix = document.getElementById("phoenix");
var objection = document.getElementById("objection");
var alertPic = document.getElementById("alert-img");
var sound = document.getElementById("alert-sound");
var theme = document.getElementById("alert-theme");
var message = document.getElementById("alert-message");
var txt, alertQueue;

//Alert call
function layoutAlert( type = "follower", event = {}) {
    //update alert picture
    picture.src = event.pic;
    //alert messages
    if(type == "follower") {
        txt = 'Your Honor! <b class="celebrate">' + event.name + '</b> just followed!';
    } else if(type == "subscriber") {
        //check if message
        if(event.message) {
            txt = '<b class="celebrate">' + event.name + '</b>\'s testimony is:<p data-fittext>' + event.message.text + '</p>'; 
         } else {
             txt = 'I have proof that <b class="celebrate">' + event.name + '</b> just became a tier <b class="highlight">' + event.tier + '</b> subscriber!';
         }
    } else if(type == "raider") {
        txt = '<b class="celebrate">' + event.name + '</b> has brought <b class="highlight">' + event.viewers + '</b> witnesses!';
    } else if(type == "cheerer") {
        txt = '<b class="celebrate">' + event.name + '</b> has given me <b class="highlight">' + event.bits + '</b> bits of evidence!!';
    } else {
        return;
    }

    //update alert message
    message.innerHTML = txt;

    //ANIMATE

    //show objection
    objection.classList.remove('hide');
    //play sound and music
    sound.currentTime = 0;
    theme.currentTime = 1;
    theme.volume = 1;
    sound.play();
    theme.play();

    setTimeout(function() {
        //hide objection again
        objection.classList.add('hide');
        //show phoenix and picture and message
        phoenix.classList.remove('hide');
        phoenix.offsetHeight;
        phoenix.src = phoenix.src;
        alertPic.classList.remove('hide');

        //show message after slam
        setTimeout(function() {
            message.classList.remove('hide');
        }, 4000);

        //stop music after 10 seconds
        setTimeout(function() {
            songFadeOut();
            //fade out notification
            noti.classList.add('fadeOut');

            //after 3 seconds reset everything
            setTimeout(function() {
                noti.classList.remove('fadeOut');
                phoenix.classList.add('hide');
                alertPic.classList.add('hide');
                message.classList.add('hide');
            }, 3000);
        }, 11000);
    }, 1600);
}

var songFadeOut = function() {
    var myAudio = theme;
    if (myAudio.volume > 0.005) {
        myAudio.volume -= 0.005;
        fadeTimer = setTimeout(songFadeOut,5);
    } else {
        myAudio.volume = 0;
        myAudio.pause();
        myAudio.currentTime = 0;
    }
}

//initialization
function init() {
    //alertQueue
    alertQueue = new AlertQueue(15300);
}

window.onload = init();