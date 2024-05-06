// Create the layout tester HTML
var layoutTesterHTML = `
<div id="layout-tester" style="background-color: grey; padding: 5px; width: 1280px; display: flex; justify-content: space-around;">
    <button style="width: 300px;padding: 2px;" id="alert-follower" type="button">Follower</button>
    <button style="width: 300px;padding: 2px;" id="alert-subscriber" type="button">Subscriber</button>
    <button style="width: 300px; padding: 2px;" id="alert-mess" type="button">Message</button>
    <button style="width: 300px;padding: 2px;" id="alert-raid" type="button">Raid</button>
    <button style="width: 300px;padding: 2px;" id="alert-cheer" type="button">Cheer</button>
</div>
`;

// Insert the layout tester HTML after the main element
document.querySelector("main").insertAdjacentHTML('afterend', layoutTesterHTML);


//tester buttons
const followbtn = document.getElementById("alert-follower");
const subbtn = document.getElementById("alert-subscriber");
const messbtn = document.getElementById("alert-mess");
const raidbtn = document.getElementById("alert-raid");
const cheerbtn = document.getElementById("alert-cheer");
testData = {
  name: 'TestUser',
  pic: 'https://3.bp.blogspot.com/_vBCSLbKJ7nI/TOHHto6tFhI/AAAAAAAAF78/3qWGXEa6BLg/w1200-h630-p-k-no-nu/mmbn2.jpg',
  tier: 2,
  viewers: 100,
  bits: 69
}
//AddEventListener
followbtn.addEventListener('click', function() {
  alertQueue.enqueue('follower', testData);
});
subbtn.addEventListener('click', function() {
  alertQueue.enqueue('subscriber', testData);
});
messbtn.addEventListener('click', function() {
  messageData = { ...testData };
  messageData.message = { text: "A sample message" };
  alertQueue.enqueue('subscriber', messageData);
});
raidbtn.addEventListener('click', function() {
  alertQueue.enqueue('raider', testData);
});
cheerbtn.addEventListener('click', function() {
  alertQueue.enqueue('cheerer', testData);
});