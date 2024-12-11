import { loadData } from '../../../JS/loadData.js';
import { getLeaderBoard, formatNumberWithDots } from '../../../JS/API.js';

const selectedLang = localStorage.getItem('selectedLang');
const { leaderboard } = await loadData(selectedLang);

const updateTextContent = (selector, text) => {
  const element = document.querySelector(selector);
  if (element) element.textContent = text;
};


// Update user balance
document.querySelector("body > div > header > div.header__top-bar.top-bar > div > span")
  .innerHTML = JSON.parse(localStorage.getItem("user_info")).coins;


let leaderboard_info = await getLeaderBoard();
let users = leaderboard_info.users;
let my_position = leaderboard_info.my_position;

// Update info
let leaderboard_ul = document.querySelector("body > div > main > ul");

let leaderboard_li = `
<li class="list-item">
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
  let insertElement = leaderboard_li.replace("PLACE", num);
  insertElement = insertElement.replace("NAME", users[num - 1].name);
  insertElement = insertElement.replace("COINS", formatNumberWithDots(users[num - 1].coins));

  leaderboard_ul.innerHTML += insertElement;
}

updateTextContent('.header__title', leaderboard.title);
// updateTextContent('.top-bar__title', leaderboard.position);
updateTextContent('.top-bar__title', "YOUR POSITION " + my_position);
