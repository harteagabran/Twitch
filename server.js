require('dotenv').config();
const express = require('express');
const crypto = require('crypto');
const { WebSocketServer } = require('ws');
const { RefreshingAuthProvider } = require('@twurple/auth');
const { ApiClient } = require('@twurple/api');
const fs = require('fs');
const { func } = require('assert-plus');

//the variable to store all the data from Json
var startData, follower, subscriber, followTotal, subsTotal;
var broadcaster = { displayName: "KumarNT", profilePictureUrl: "https://static-cdn.jtvnw.net/jtv_user_pictures/fc5d349c-b4b0-4c32-83e6-80656a95a8a2-profile_image-300x300.png"};

//TWITCH
//token generation
const clientId = process.env.TWITCH_CLIENT_ID;
const clientSecret = process.env.TWITCH_CLIENT_SECRET;
const tokenData = JSON.parse(fs.readFileSync('./token.json', 'UTF-8'));

const authProvider = new RefreshingAuthProvider(
    {
        clientId,
        clientSecret,
        onRefresh: async function(newTokenData){
            fs.writeFileSync('./token.json', JSON.stringify(newTokenData, null, 4), 'UTF-8');
        }
    },
    tokenData
);

//api client
const apiClient = new ApiClient({ authProvider });

//on startup
(async () => {
    //follower
    let followReq = await apiClient.callApi({
        url: '/channels/followers?broadcaster_id=706306750&first=1'
    });

    follower = followReq.data[0];
    followTotal = followReq.total;

    //subscriber
    let subReq = await apiClient.callApi({
        scope: 'channel:read:subscriptions',
        url: '/subscriptions?broadcaster_id=706306750'
    });

    //get last request as that is most recent
    subscriber = subReq.data[subReq.total - 1];
    subTotal = subReq.total;

    //put channel ids in array if any
    let viewers = new Array();
    if(follower) viewers.push(follower.user_id);
    if(subscriber) viewers.push(subscriber.user_id);

    //fetch channel info of recent sub/follower
    let viewersData = await apiClient.users.getUsersByIds(viewers);

    //split into sections depending on length
    if(viewersData.length == 2) {
        //override with more detailed view
        follower = viewersData[0];
        subscriber = viewersData[1];
    } else {
        //only followers
        follower = viewersData[0];
    }

    //show info
    console.log("*** Follower: " + ((follower) ? follower.name : "None"));
    console.log("*** Subscriber: " + ((subscriber) ? subscriber.name : 'None'));

    //populate start data
    startData = new Array();
    startData.push(makeUser(broadcaster, 'broadcaster'));

    if(follower) startData.push(makeUser(follower, 'follow'));
    if(subscriber) startData.push(makeUser(subscriber, 'subscriber'));

    console.log('*** Finished Requesting Data');
})();

//EXPRESS SERVER
const app = express();
const port = process.env.PORT || 3000;

//verification
const twitchSigningSecret = process.env.TWITCH_SIGNING_SECRET;
const verifyTwitchSignature = (req, res, buf, encoding) => {
    const messageId = req.header("Twitch-Eventsub-Message-Id");
    const timestamp = req.header("Twitch-Eventsub-Message-Timestamp");
    const messageSignature = req.header("Twitch-Eventsub-Message-Signature");
    const time = Math.floor(new Date().getTime() / 1000);
    console.log(`* -Message A${messageId} Signature: `, messageSignature);

    if(Math.abs(time - timestamp) > 600) {
        //less than 10 min
        console.log(`Verification failed: timestamp > 10 min. Message Id: ${messageId}`);
        throw new Error('Ignore this request.');
    }

    if (!twitchSigningSecret) {
        console.log(`Twitch signing secret is empty.`);
        throw new Error('Twitch signing secret is empty.');
    }

    const computedSignature = "sha256=" + 
    crypto
      .createHmac("sha256", twitchSigningSecret)
      .update(messageId + timestamp + buf)
      .digest("hex");
    console.log(`Message ${messageId} Computed Signature: `, computedSignature);

    if (messageSignature !== computedSignature) {
        throw new Error('Invalid Signature!');
    } else {
        console.log('Verification Successful!!:)');
    }
};

//user exress.json to verify Twitch calls
app.use(express.json({
    verify: verifyTwitchSignature
}));

//Paths
//default: send startdata
app.get("/", (req, res) => {
    res.send(startData);
});

//twitch webhook handler
app.post("/twitch/webhook/callback", async (req, res) => {
    const messageType = req.header("Twitch-Eventsub-Message-Type");
    if(messageType === "webhook_callback_verification") {
        console.log('*** Verifying Webhook');
        res.setHeader('Content-Type', 'text/plain');
        return res.status(200).send(req.body.challenge);
    }

    const { type } = req.body.subscription;
    const { event } = req.body;


    console.log(
        `Recieving ${type} request for ${event.broadcaster_user_name}: `, event
    );
    
    //if new follow event
    if(type === "channel.follow") {
        try {
            emitData(event, 'follow');
        } catch (err) {
            console.log(
              `An error occurred sending follow notification for ${event.broadcaster_user_name}:`, err
            );
        }
    //if new subscriber event
    } else if(type === "channel.subscribe") {
        try {
            emitData(event, 'subscriber');
        } catch (err) {
            console.log(
                `An error occurred sending follow notification for ${event.broadcaster_user_name}:`, err
            );
        }        
    //if raid event
    } else if(type === "channel.raid") {
        try {
            emitData(event, 'raid');
        } catch (err) {
            console.log(
                `An error occurred sending follow notification for ${event.broadcaster_user_name}:`, err
            );
        }    
    //if channel subscriber with message
    } else if(type === "channel.subscription.message") {
        try {
            emitData(event, 'sub-message');
        } catch (err) {
            console.log(
                `An error occurred sending follow notification for ${event.broadcaster_user_name}:`, err
            );
        }
    //if someone gifts subs
    } else if(type === "channel.subscription.gift") {
        try {
            emitData(event, 'sub-gift');
        } catch (err) {
            console.log(
                `An error occurred sending follow notification for ${event.broadcaster_user_name}:`, err
            );
        }
    //if someone sends cheers
    } else if(type === "channel.cheer") {
        try {
            emitData(event, 'cheer');
        } catch (err) {
            console.log(
                `An error occurred sending follow notification for ${event.broadcaster_user_name}:`, err
            );
        }
    }

    res.status(200).end();
});

//DEPLOY APP
let listener = app.listen(port, () => {
    console.log("*** Your app is listening on port " + listener.address().port);
    console.log("*** You can go to: http://localhost:" + listener.address().port);
})
//WEBSOCKET
const wss = new WebSocketServer({ server: listener });

//on connection
wss.on('connection', function connection(ws) {
    console.log("*** WS: NEW Client Connected")
    //send starting data
    ws.send(JSON.stringify(startData));
    console.log("*** WS: Sent Starting Data");
});

//FUNCTIONS
//this function creates the Json Data to send to client when event given by Twitch API
async function emitData(e, type) {
    //make event details and channel info
    let event = new Object();
    let channelInfo;

    //subscriber: find what tier and if it is gifted
    if(type == 'subscriber') {
        event.tier = e.tier;
        event.gift = e.is_gift;
    }

    //raid: add raid user count
    if(type == 'raid') {
        event.viewers = e.viewers;
    }

    //sub-message: add how long they've been a subscriber and the message they added
    if(type == 'sub-message') {
        event.month = e.duration_months;
        event.message = e.message;
    }

    //sub-gift: get if anonymous, amount, and what tier sub
    if(type == 'sub-gift') {
        event.discreet = e.is_anonymous;
        event.amnt = e.total;
        event.tier = e.tier;
    }

    //cheer: check if anonymous, amount of bits, and optional message
    if(type == 'cheer') {
        event.discreet = e.is_anonymous;
        event.bits = e.bits;
        event.message = e.message;
    }

    //get account info of channel that triggered event
    let searchId = e.user_id ?? e.from_broadcaster_user_id;
    try{
        channelInfo = await apiClient.users.getUserById(searchId);
        console.log(`*** ${channelInfo.name} triggered event '${type}'`);
    } catch(err) {
        console.log("*** Error getting event user: Likely does not exist");
    }

    //if channel does not exist or anonymous create fallback
    if(!channelInfo || event.discreet) {
        event.name = 'Someone';
        event.pic = 'https://www.palmcityyachts.com/wp/wp-content/uploads/palmcityyachts.com/2015/09/default-profile-480x480.png';
    }

    //emitData to connected sites on websocket
    if(channelInfo || event.name) {
        let pass = channelInfo ?? 'anonymous';
        let emitData = makeUser(pass, type, event);
        
        //update starting data for future connections
        if(type == 'follow') {
            if(startData.length == 1) {
                startData.push(emitData);
            } else {
                startData[1] = emitData;
            }
            //update follower total
            followTotal++;
        } else if(type == 'subscriber') {
            if(startData.length == 2) {
                startData.push(emitData);
            } else {
              startData[2] = emitData;  
            }
            //update subscriber total
            subsTotal++;
        }

        //emit to websocket clients
        wss.clients.forEach(cl => {
            cl.send(JSON.stringify(emitData));
        });
        console.log("*** Sent event to clients\n", emitData);
    }
}


//this function makes a user object to send to the client.
//  returns user object
function makeUser(hlxUser, type, extra = {})  {
    let user = new Object();
    user.type = type;
    user.name = hlxUser.displayName || 'Someone';

    //save total followers/subs
    if(type == 'follow') user.total = followTotal;
    if(type == 'subscriber') user.total = subTotal;

    //save profile pic
    user.pic = hlxUser.profilePictureUrl ?? 'http://pluspng.com/img-png/user-png-icon-png-ico-512.png';

    //extra information
    if(extra.tier) user.tier = extra.tier / 1000;
    if("gift" in extra) user.gift = extra.gift;
    if(extra.viewers) user.viewers = extra.viewers;
    if(extra.message) user.message = extra.message;
    if(extra.amnt) user.total = extra.amnt;
    if(extra.bits) user.bits = extra.bits;

    return user;
}