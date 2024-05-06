//alert
var noti = document.getElementById('notification');
var title = document.getElementById('alert-type');
var alertname = document.getElementById('noti-person');
var picture = document.getElementById("alert-img");
var song = document.getElementById('winner-theme');
var sound = document.getElementById('got-sound');
var aBtn = document.getElementById('A-btn');
var firstInfo, alertQueue;
//canvas
var canvas = document.getElementById("pic-reveal");
const TIME = 6000;


//Systems
var sys = new SquareReveal(7, 4);

//Alert
function layoutAlert(type = "follower", event = {}) {
    //populate
    title.textContent = type.toUpperCase();
    picture.src = event.pic;
    alertname.textContent = event.name;

    //make button blink
    aBtn.classList.add('blink');

    //make notification box show
    noti.classList.remove('show');
    noti.offsetWidth;
    noti.classList.add('show');

    //play music theme
    song.currentTime = 0;
    song.volume = 0.4;
    song.play();
    //fade out
    setTimeout(function() {
        songFadeOut();
    }, 7800);

    //start square reveal
    sys.reset();
}

//rotate info
function rotateInfo() {
    var active = document.querySelector('#toggle-list .active');
    var next = active.nextElementSibling;

    //move it to next sibling or start
    if(next == null) {
        firstInfo.classList.remove('list');
        firstInfo.classList.add('active');
    } else {
        next.classList.remove('list');
        next.classList.add('active');
    }

    active.classList.remove('active');
    active.classList.add('list');
}

//play got sound
function playGotSound() {
    sound.currentTime = 0;
    sound.play();
}

//remove blink from btn
function removeBlink() {
    aBtn.classList.remove("blink");
}

//after animation
var songFadeOut = function() {
    var myAudio = song;
    if (myAudio.volume > 0.005) {
        myAudio.volume -= 0.005;
        fadeTimer = setTimeout(songFadeOut,5);
    } else {
        myAudio.volume = 0;
        myAudio.pause();
        myAudio.currentTime = 0;
    }
}

//Initialize
function init() {
    //start queue
    alertQueue = new AlertQueue(9000);

    //first info child
    firstInfo = document.getElementsByClassName('active')[0];

    //animation
    sys.init();
    requestAnimationFrame(animate);

    //start rotation
    var infoRotate = setInterval(rotateInfo, 5000);
}

function update() {
    sys.update(canvas);
}
function animate() {
    update();
    requestAnimationFrame(animate);
}

window.onload = init();