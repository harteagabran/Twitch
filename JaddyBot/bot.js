const tmi = require('tmi.js');
const express = require('express');
const { WebSocketServer } = require('ws');
const Joke = require('one-liner-joke');

//Express App
const app = express();
const port = 8000;

function sendMessage(name, message, emotes) {
    setTimeout(function() {})
    emotes = emotes ?? null;

    let info = new Object;

    info['name'] = name;
    info['message'] = message;
    if(emotes) {
        info['emotes'] = emotes;
    }
    
    wss.clients.forEach (cl => {
        cl.send(JSON.stringify(info));
    });
}

app.get("/", (req, res) => {
    res.send('Hello I am JadddyBot now go away please!');
});

let listener = app.listen(port, () => {
    console.log("Your app is listening on port " + listener.address().port);
    console.log("You can go to: http://localhost:" + listener.address().port);
});

//WEBSOCKET SERVER
const wss = new WebSocketServer({ server: listener});

wss.on('connection', function connection(ws) {
    console.log('** A page has connected to ws server');
});


//configuration options
const opts = {
    identity: {
        username: 'JaddyDoge',
        password: 'oauth:2huowjpuhxea9cmss62n4jncjpa9sf'
    },
    channels: [
        'KumarNT'
    ]
};

//create a client with options
const client = new tmi.client(opts);

//variables for tricks and stuff
var rolls = 0;
var jumps = 0;

//register event handlers

client.on('message', onMessageHandler);

client.on('connected', onConnectHandler);

client.on('raided', onRaidHandler);



//connect to twitch

client.connect();



//VARIABLES

var state = 'normal';

var queue = new Array()



//EVENT HANDLERS

//called everytime a message comes in

function onMessageHandler (target, context, msg, self) {
    //no matter what emit message to clients
    let emotes = context['emotes'];
    console.log(emotes);
    sendMessage(context['display-name'], msg, emotes);

    if (self) {return;} //ignore bot messages

        //remove white space from chat message

    const commandName = msg.trim();
    let person = context['username'];
    let name = context['display-name'];

    //list of possible commands to run

    if (commandName === '!d20') {
        const num = rollDice();
        var retort;

        if(num == 1) {
            retort = 'Grrr.... You have rolled a Nat 1. RIP.';
        } else if (num == 20) {
            retort = 'WOOF! It\'s a Nat 20!!!';
        } else {
            retort =  `Friend! You have rolled a ${num}!`;
        }

        client.say(target, retort);

        console.log(`* Executed ${commandName} command`);

    } else if (commandName === '!hello') {
        //make different responeses based onwho makes the request
        if (person === "kumarnt" || person === "nightbot") {
            client.say(target, "Wohoo Hello! I am JaddyDoge! I'm a fluffy lad");
        } else if(person === 'smolceci') {
            client.say(target, "Hey Mom, I love you, I wish things had been different but your choice is your choice in the end.");
        } else if(person === 'darkwing1203') {
            client.say(target, "BANG BANG BANG BANG.... that's you in Apex");
        } else if(person === 'bfields19') {
            client.say(target, "Hello Ms. Fields! I am Jaddy, please to make your acquaintence. Still waiting for you to come meet one of my halves, Diddy! :3");
        } else if(person === 'trin657') {
            client.say(target, "Bonjour! Hello! My name is Jaddy and I'm a good boi :3. Do you have snacks for me?");
        } else {
            var greetings = [
                "I am the Jaddiest of Doges!",
                "I am a very good boi!!",
                "I'm a bit bored, let me tell a joke with '!joke'",
                "I am the fluffy boi legend!",
                "my barks can shatter realities",
                "my favorite Spider-man is Tobey Maguire",
                "I need some treats, feed meeeeeee",
                "I shall sniff you!",
                "now please let me continue to sleep zzz",
                "grrrr.. I'm a scary lad.",
                "I am the ultimate life form",
                "fear me... if ya dare mock me",
                "I hold the power to alter reality but I choose not to"
            ];
            var item = greetings[Math.floor(Math.random()*greetings.length)];
            client.say(target, "Hello " + name + "! I am Jaddy, " + item);
        }
        console.log(`* Executed ${commandName} command`);

    } else if (commandName === '!lurk') {
        client.say(target, `Thanks for lurking ${name}, you make me so happy! :3`);
        console.log(`* Executed ${commandName} command`);
    //QUEUE COMMANDS
    } else if(commandName === '!queue') {
        //if not done by Cece or I return
        if(person === 'kumarnt' || person === 'smolceci') {
            if (state === 'queue') {
                return;
            } else {
                state = 'queue';
                client.say(target, "A queue has started, If you would like to join the queue please type !qjoin to add your username to the queue :3");
                console.log('* Started a queue');
            }
        } else {
            client.say(target, "Sorry, Only my Mom or KumarNT can start a queue");
            return;
        }
    } else if(commandName === '!qjoin' && state === 'queue') {
        //make sure user doesn't already exist in queue
        if(queue.includes(name)) {
            client.say(target, `${name}, you are already number ${queue.indexOf(name) + 1} in the queue. Please wait until it is your turn to play with my owner, or if you would like to cancel your queue type !qcancel`);
            return;
            console.log('* User tried to enter queue but was already in it');
        } else {
            //add user to the game queue
            queue.push(name);

            //confirm user was added to queue
            client.say(target, `${name}, You have been added to the queue! You are number ${queue.length}! Woof    **Type !qshow to see the entire queue`);

            console.log('* A player was added to queue');
        }
    } else if (commandName === '!qshow' && state === 'queue') {
        //show the queue
        let txt = 'The order for the queue is as follows: ';
        for(var p = 0; p < queue.length; p++) {
            let place = p+1;
            txt += place + '. ' + queue[p] + ', ';
        };
        txt += '   ** If you wish to join queue, type !qjoin. Otherwise to leave the queue type !qcancel';

        //have Jaddy text
        client.say(target, txt);
        console.log('* User requested queue info');
    } else if (commandName === '!qcancel' && state === 'queue') {
        //make sure it exists in array first
        if(!queue.includes(name)) {
            client.say(target, `Sorry ${name}, You are not part of the queue at all. So you are good! Woof **If you would like to join queue please type !qjoin`);
            console.log(`${name} tried to leave queue but was not in it`);
        } else {
            let index = queue.indexOf(name);
            //shouldn't happen but just in case
            if(index == -1) {
                console.log('* Something is wrong attention is needed');
                client.say(target, 'Aborting Operation, Something went wrong, please inform owner or ERROR fsrii-1a119');
                return;
            } else {
                //remove postion by index
                queue.splice(index, 1);
                
                client.say(target, `${name}, you have been successfully removed from queue, Woof! **If you wish to rejoin type !qjoin`);
            }
            console.log(`* ${name} has left queue`);
        }
    } else if(commandName === '!qstart' && state == 'queue' && (person === 'kumarnt' || person === 'smolceci')) {
        client.say(target, `The current queued human is ${queue[0]}! Good Luck and have fun :3`);
        console.log('* Read off current queue person');
    } else if (commandName === '!qnext' && state == 'queue' && (person === 'kumarnt' || person === 'smolceci')) {
        queue.shift();
	    if(queue.length > 0) {
            client.say(target, `Up next on the queue will be ${queue[0]}! Remember, type !qjoin to join or if you would like to cancel type !qcancel`);
            console.log('* Got the next queue recipient');
        } else {
            console.log('* queue is empty no recipient');
            client.say(target, 'No one is in the queue, don\'t be shy folks! My owner doesn\'t bite! Type !qjoin to be added to queue! Woof');
        }
    } else if(commandName === '!qend' && state == 'queue' && (person === 'kumarnt' || person === 'smolceci')) {
	    state = 'normal';
        queue = [];
	    client.say(target, 'Sorry Everyone, the queue has been terminated, thank you for participating Woof!');
    } else if(state == 'normal' && (commandName ==='!qend' || commandName === '!qstart' || commandName === '!qshow' || commandName === '!qnext' || commandName === '!qjoin' || commandName === '!qcancel')) {
        //no queue yet
        client.say(target, 'Sorry, but I have not been instructed to start a queue yet! If you would like to start one talk to my owner and see if you can play this game with him! Woof');
        console.log('* tried doing queue command when not in right mode');
    //adding commands to jump and roll
    } else if (commandName === '!roll') {
        rolls++;
        let txt = (rolls > 1) ? 'rolls' : 'roll'; 
        client.say(target, 'Let\'s go! 360 roll!! I have now done ' + rolls + ' ' + txt + '. Let\'s keep it going guys!');
        console.log('* Executed roll command');
    } else if (commandName === '!jump') {
        let txt;
        let feet = Math.floor(Math.random() * 10) + 1;
        jumps++;
        
        if(feet <= 1) {
            txt = 'Sorry mate, I was only able to jump 1 foot, I can do better though! Promise!';
        } else if(feet > 1 && feet <= 3) {
            txt = 'Wohoo I jumped ' + feet + ' feet in the air. Did I do a good job? :3';
        } else {
            txt = 'I felt the zoomies inside me and jumped over ' + feet + ' feet in the air!! Fear the ultimate lifeform! ';
        }
        let plural = (jumps > 1) ? 'times' : 'time';
        txt += ' I have now jumped ' + jumps + ' ' + plural + ' but I can always do more!';
        
        client.say(target, txt);
        console.log('* Executed jump command');
    } else if(commandName === '!joke') {
        let line = Joke.getRandomJoke({
            'exclude_tags': ['dirty', 'racist', 'marriage', 'rude', 'sex']
        })

        client.say(target, line.body);
        console.log(`** Executed ${commandName}: joke => ${line.body}`);
    } else if(commandName === '!randjoke') {
        let line = Joke.getRandomJoke();

        client.say(target, line.body);
        console.log(`** Executed ${commandName}`);
    } else if(commandName === '!howl') {
        client.say(target, "AWOOOOO!!!....");
        client.say(target, "I HAVE THE POWER!!!!");
        console.log(`** Executed ${commandName}`);
    }  else if(commandName.toLowerCase() === '!battle jaddydoge' || commandName.toLowerCase() === '!battle @jaddydoge') {
        var retort = [
            "YOU DARE ATTACK THE ULTIMATE LIFEFORM?!",
            "Augh.. You willnot get away with this!!",
            "heh... it's not over yet!!",
            "I am Jaddy! I am unstoppable, I am invincible",
            "Keep coming at me I got Revives for days mwuhaha",
            "I didn't feel it!",
            "Sir,... I feel attacked! Have at thee!!!",
            "I sense danger.. must attack. Fear me!",
            "urk... haha It's my turn now. >:D",
            "Feel the wrath of the Ultimate Life Form",
            "Even if I may faint I'll continue to be the hero",
            "You chose violence, I will not be responsible for the outcome of this attack..",
            "I do not wish to attack you, but you have forced my hand"
        ];
        var item = retort[Math.floor(Math.random()*retort.length)];
        setTimeout(function() {
            client.say(target, `@${name}, ${item}`);
            client.say(target, `!battle ${name}`);
        }, 5000);
        console.log(`** Executed ${commandName}`);
    } else if(commandName === '!command') {
            client.say(target, "Heyo these are my commands :3");
            client.say(target, "    '!battle user' : battle a user in chat")
            client.say(target, "    '!howl' : make me howl");
            client.say(target, "    '!joke' : let me tell you a funny joke");
            client.say(target, "    '!jump' : Let me jump for you! :3");
            client.say(target, "    '!roll' : They see me rollin, they hatin");
            client.say(target, "    '!lurk' : Let us know you are here and listening");
            client.say(target, "    '!hello' : Say hello to me :3 JaddyDoge. Woof");

            console.log(`** Executed ${commandName}`);
    } else {

        console.log(`${name}: ${commandName}`);

    }
}



//On Raid do Shoutout

function onRaidHandler(target, sender, viewers) {

    console.log(`* Raid detected! From user, ${sender} with ${viewers}!`);

    

    //Give a shoutout to person
        client.say(target, `WOOF! WOOF! ${sender} has just raided with ${viewers}. I'm so happy I can't stop wagging my tail! Go check them out at https://www.twitch.tv/${sender}!!`);
        client.say(target, `!so ${sender}`);
}



//The Commands

function rollDice() {

    const sides = 20;

    return Math.floor(Math.random() * sides) + 1;

}



//CONFIRM CONNECTION

//called when bot connects to twitch chat

function onConnectHandler (addr, port) {

    console.log(`* Connected to ${addr}: ${port}`);

}