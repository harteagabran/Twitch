//alert
var noti = document.getElementById("notification");
var title = document.getElementById("noti-title");
var picture = document.getElementById("alert-image");
var song = document.getElementById("alert-theme");
var ember = document.getElementById("ember");
var txt, alertQueue;
//Canvases
var FireCanvases = document.getElementsByClassName("fire");
var notiCanvas = document.getElementById("notification-write");

//Systems
var Systems = {
    "fire": []
}
var notiWrite;

//alert
function layoutAlert(type = "follower", event = {}) {
    //populate
    title.textContent = type.toUpperCase();
    picture.src = event.pic;

    //toggle classes
    noti.classList.remove("show");
    ember.classList.remove("show");
    noti.offsetWidth;
    ember.offsetWidth;
    noti.classList.add("show");
    ember.classList.add("show");

    //message
    if(type == "follower") {
        txt = event.name + ' has joined the battle!';
    } else if(type == "subscriber") {
        //check if message
        if(event.message) {
            txt = 'General' + event.name + ' says "' + event.message.text + '"'; 
         } else {
             txt = event.name + ' became a level ' + event.tier + ' General!';
         }
    } else if(type == "cheerer") {
        txt = event.name + ' sends ' + event.bits + ' bits from the sidelines!';
    } else if(type == "raider") {
        txt = event.name + ' has brought us ' + event.viewers + ' soldiers!'
    } else {
        return;
    }

    //write on alert
    notiWrite.reset(txt, "orange");

    //music player
    song.currentTime = 0;
    song.play();
}

//Initialization
function init() {
    alertQueue  = new AlertQueue(10500);

    //call Particles and resize
    for(let make = 0; make < FireCanvases.length; make++) {
        var system = new FireSystem(20, 3, 15, 20);
        system.resize(FireCanvases[make], 70, 100);
        Systems.fire.push(system);
    }
    notiWrite = new HandWrite("", "white", 25);
    notiWrite.resize(notiCanvas, 0, 0);

    requestAnimationFrame(animate);
}

//animation
function update() {
    for(let ani = 0; ani < FireCanvases.length; ani++) {
        var canvas = FireCanvases[ani];
        Systems.fire[ani].update(canvas);
    }
    notiWrite.update(notiCanvas);
}
function animate() {
    update();
    requestAnimationFrame(animate);
}

//onload
window.onload = init();