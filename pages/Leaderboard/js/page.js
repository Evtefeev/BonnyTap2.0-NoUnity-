import { loadData } from '../../../JS/loadData.js';
import { getLeaderBoard, formatNumberWithDots } from '../../../JS/API.js';

const selectedLang = localStorage.getItem('selectedLang');
const { leaderboard } = await loadData(selectedLang);

const updateTextContent = (selector, text) => {
  const element = document.querySelector(selector);
  if (element) element.textContent = text;
};



// Add lazy load for all images
document.addEventListener("DOMContentLoaded", () => {
  const images = document.querySelectorAll("img:not([loading])"); // Select images without the 'loading' attribute
  images.forEach(img => {
    img.setAttribute("loading", "lazy");
  });
});

// Load user info
let userInfo = JSON.parse(localStorage.getItem("user_info"))

// Update user balance
document.querySelector("#user_balance")
  .innerHTML = userInfo.coins;


let leaderboard_info = await getLeaderBoard();
let users = leaderboard_info.users;
let my_position = leaderboard_info.my_position;

// Update info
let leaderboard_ul = document.querySelector("#leaderboard");
leaderboard_ul.innerHTML = "";
let leaderboard_li = `
<li class="list-item">
  <div class="rank">
    <img src="/images/Rank-RANK.png" alt="Rank-RANK">
    <img src="PHOTO" alt="photo" class="leaderboard_user_photo" style="top: TOP;">
  </div>
    <div class="user-info">
      <span class="list-item__order">PLACE</span>
      <span class="list-item__title">NAME</span>
    </div>
    <div class="coins">
      <img src="/images/coin.png" alt="Coin Icon">
      <span>COINS</span>
    </div>
</li>
`

for (let num = 1; num <= users.length; num++) {
  let insertElement = leaderboard_li;
  if (num > 5) {
    insertElement = insertElement.replace('<img src="/images/Rank-RANK.png" alt="Rank-RANK">', "")
  }
  if (users[num - 1].avatar_url == null) {
    insertElement = insertElement.replace('<img src="PHOTO" alt="photo" class="leaderboard_user_photo" style="top: TOP;">', "")
  }
  insertElement = insertElement.replace("PLACE", num);
  insertElement = insertElement.replace("PHOTO", users[num - 1].avatar_url);
  insertElement = insertElement.replace("RANK", num);
  insertElement = insertElement.replace("NAME", users[num - 1].name);
  insertElement = insertElement.replace("COINS", formatNumberWithDots(users[num - 1].coins));

  if (num == 1) {
    insertElement = insertElement.replace("TOP", "-28px");
  }

  if (num == 2) {
    insertElement = insertElement.replace("TOP", "-7px");
  }


  leaderboard_ul.innerHTML += insertElement;
}

leaderboard_ul.style.display = "block";

updateTextContent('.header__title', leaderboard.title);
// updateTextContent('.top-bar__title', leaderboard.position);
updateTextContent('.top-bar__title', "YOUR POSITION " + my_position);
