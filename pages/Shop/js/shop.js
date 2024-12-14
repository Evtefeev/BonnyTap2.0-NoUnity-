import { data } from './data.js';
import { getInvoiceLink, tg, getUserInfo, checkInvoice } from '/JS/API.js';

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

Array.from(document.getElementsByClassName("buy-coins-button")).forEach((el) => {
  el.addEventListener('click', async function (event) {
    let product = this.parentElement.querySelector(".coins-amount").innerHTML;
    const imageUrl = this.parentElement.querySelector("img").src
    const res = await getInvoiceLink(product, imageUrl);
    const link = res.result;
    const invoiceId = res.id;
    if (link) {
      await tg.openInvoice(link);

      while (true) {
        let check = await checkInvoice(invoiceId);
        if (check["message"] === "ok") {
          await getUserInfo();
          updateBalance()
          alert("Purchase completed!!!")
          break;
        }

        await new Promise(resolve => setTimeout(resolve, 1000)); // 1-second delay
      }
    }
  });
});

