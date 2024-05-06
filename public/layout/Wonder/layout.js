//alert
var noti = document.getElementById("notification");
var picture = document.getElementById("alert-img");
var txt;
var jingle = document.getElementById("lucky");
var marioSnd = document.getElementById("mario-talk");
var song = document.getElementById("stage-clear");
var alertQueue;
//Canvas
var notiCanvas = document.getElementById("notification-write");

//System
var notiWrite;

//Alert (order is important)
function layoutAlert(type = "follower", event = {}) {
    //populate
    picture.src = event.pic;

    //Class toggle management
    noti.classList.remove("show");
    noti.offsetWidth;
    noti.classList.add("show");

    //sounds
    jingle.currentTime = 0;
    jingle.play();
        //wait a bit then play mario tak
    setTimeout(function() {
        marioSnd.currentTime = 0;
        song.currentTime = 0;
        marioSnd.play();
        song.play();
    }, 500);

    //message
    if(type == "follower") {
        txt = event.name + ' has just followed!';
    } else if(type == "subscriber") {
        //check if message
        if(event.message) {
            txt = 'Superstar ' + event.name + ' says "' + event.message.text + '"'; 
         } else {
             txt = event.name + ' just became a level ' + event.tier + ' Superstar!';
         }
    } else if(type == "cheerer") {
        txt = event.name + ' sends ' + event.bits + ' star bits!';
    } else if(type == "raider") {
        txt = event.name + ' raids in with ' + event.viewers + ' viewers!'
    } else {
        return;
    }

    //write on alert
    notiWrite.reset(txt, "blue");
}

//Initialization
function init() {
    alertQueue = new AlertQueue(10500);

    notiWrite = new HandWrite("Alert is ready!", "blue", 25);
    notiWrite.resize(notiCanvas);
    requestAnimationFrame(animate);
}

//animation
function update() {
    notiWrite.update(notiCanvas);
}
function animate() {
    update();
    requestAnimationFrame(animate);
}

//onload
window.onload = init();