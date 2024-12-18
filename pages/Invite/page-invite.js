import { getUserInfo, getRefferalLink, getRefferals } from '../../../JS/API.js';

const userInfo = JSON.parse(localStorage.getItem("user_info"))
const refLink = await getRefferalLink();
const refferals = await getRefferals();
// console.log(refferals);


document
  .querySelector("body > div > header > div.header__top-bar.top-bar > div > span")
  .innerHTML = userInfo.coins;



document.querySelector("body > div > main > h1").innerHTML = refferals.length + ' FRIENDS';




const inviteElement = `

<li class="list-item">
    <div class="user-info">
      <span class="list-item__order">NUMBER</span>
      <span class="list-item__title">NAME</span>
    </div>
    <div class="coins">
      <img src="/images/coin.png" alt="Coin Icon" />
      <span>+ 2 500</span>
    </div>
  </li>

`

for (let num = 1; num <= refferals.length; num++) {
  let insertElement = inviteElement.replace("NUMBER", num);
  insertElement = insertElement.replace("NAME", refferals[num - 1]);

  document.querySelector("body > div > main > div.invited > ul").innerHTML += insertElement;
}





document.querySelector("body > div > main > div.referral > a.copy")
  .addEventListener('click', async function () {
  
    // Copy the text inside the text field
    navigator.clipboard.writeText(refLink);

    // Alert the copied text
    alert("Text copied");
  });


// Function to send a link to a chat
function sendLinkToChat(link) {
  if (link) {
    // Telegram URL scheme for opening links
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(link)}`;

    // Open the link
    window.open(telegramUrl, '_blank');
  } else {
    console.error('No link provided!');
  }
}


// Send ref code
document.querySelector("body > div > main > div.referral > a.btn.referral__btn")
  .addEventListener('click', async function () {
    sendLinkToChat(refLink);
  });