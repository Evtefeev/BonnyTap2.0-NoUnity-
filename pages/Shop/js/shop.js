import { data } from './data.js';
import { getInvoiceLink, tg, getUserInfo, checkInvoice } from '/JS/API.js';

document.addEventListener('click', (event) => {
  const buttonType = event.target.dataset.type;

  if (!buttonType != '' && data) {
    return;
  }

  const HTMLcontent = data[buttonType];
  console.log(buttonType);

  document.querySelector('main').innerHTML = HTMLcontent;
  if (buttonType == 'avatar')
    enableAvatarsBuy();
  if (buttonType == 'coin')
    enableCoinsBuy();
});



function updateBalance() {
  document
    .querySelector("body > div > header > div.balance > div.balance-coin > span")
    .innerHTML = JSON.parse(localStorage.getItem("user_info")).coins;
}
updateBalance();


async function purchaseItem(product, imageUrl) {
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
        return true;

        break;
      }

      await new Promise(resolve => setTimeout(resolve, 1000)); // 1-second delay
    }
    return false
  }
}

function markAvatar(avatar) {

  // Create the green circle
  const greenCircle = document.createElement('div');
  greenCircle.style.width = '30px';
  greenCircle.style.height = '30px';
  greenCircle.style.backgroundColor = 'green';
  greenCircle.style.borderRadius = '50%';
  greenCircle.style.position = 'static';
  greenCircle.style.top = '5px'; // Small margin from the top
  greenCircle.style.right = '5px'; // Small margin from the right

  // Append the circle to the div
  // avatar.appendChild(greenCircle);
  avatar.insertBefore(greenCircle, avatar.firstChild);
}

// Coins buy
function enableCoinsBuy() {
  Array.from(document.getElementsByClassName("buy-coins-button")).forEach((el) => {
    el.addEventListener('click', async function (event) {
      let product = this.parentElement.querySelector(".coins-amount").innerHTML;
      const imageUrl = this.parentElement.querySelector("img").src
      purchaseItem(product, imageUrl);
    });
  });
}


// Avatars buy
function enableAvatarsBuy() {
  Array.from(document.getElementsByClassName('buy-avatar')).forEach((avatar) => {
    console.log(avatar);

    const button = avatar.querySelector('button');
    const type = avatar.querySelector('.coins-amount').textContent;
    const cost = button.querySelector('span').textContent === 'FREE' ? 0 : parseInt(button.querySelector('span').textContent, 10);

    button.addEventListener('click', async function (event) {
      let product = this.parentElement.querySelector(".coins-amount").innerHTML;
      const imageUrl = this.parentElement.querySelector("img").src
      const res = await purchaseItem(product, imageUrl);
      console.log(res);
      console.log(this.parentElement);
      
      
      if (res) {
        markAvatar(this.parentElement);
      }
    });
  });
}


enableCoinsBuy();