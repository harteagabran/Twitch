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
  tier: 2,
  viewers: 100,
  bits: 69
}
//AddEventListener
followbtn.addEventListener('click', function() {
  layoutAlert('follower', testData);
});
subbtn.addEventListener('click', function() {
  layoutAlert('subscriber', testData);
});
messbtn.addEventListener('click', function() {
  messageData = { ...testData };
  messageData.message = { text: "A smaple message" };
  layoutAlert('subscriber', messageData);
});
raidbtn.addEventListener('click', function() {
  layoutAlert('raider', testData);
});
cheerbtn.addEventListener('click', function() {
  layoutAlert('cheerer', testData);
});