import { data } from './data.js';
import { getInvoiceLink, tg, getUserInfo } from '/JS/API.js';

document.addEventListener('click', (event) => {
  const buttonType = event.target.dataset.type;

  if (!buttonType != '' && data) {
    return;
  }

  const HTMLcontent = data[buttonType];
  document.querySelector('main').innerHTML = HTMLcontent;
});



function updateBalance() {
  document
    .querySelector("body > div > header > div.balance > div.balance-coin > span")
    .innerHTML = JSON.parse(localStorage.getItem("user_info")).coins;
}
updateBalance();

document.querySelector("body > div > main > div.first-block > div:nth-child(2) > button")
addEventListener('click', async function (event) {
  const res = await getInvoiceLink();
  const link = res.result;
  if (link) {
    window.open(link);
    // await tg.openLink(link);
    document.addEventListener("visibilitychange", () => { window.location = "/index.html" });


  }
});