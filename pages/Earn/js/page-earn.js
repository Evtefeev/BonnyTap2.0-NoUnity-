import { loadData } from '../../../JS/loadData.js';

import { getUserInfo, checkSubscription, checkSubscriptions, updateCoins } from '../../../JS/API.js';


const userInfo = await getUserInfo();
const container = document.querySelector('.container');
const networkList = document.querySelector('.network-list');
const headerTitle = document.querySelector('.header__title');
const link = document.querySelector('.btn');
const linkUrls = [
  // 'https://t.me/bonny_bot_test_channel',
  'https://t.me/Bonny_App_News',
  'https://t.me/bonny_app_chat',
  'https://discord.gg/rfGvMbFv3D',
  'https://youtube.com/@bonnyapp?si=mNNANuEztkioB5Vb',
  'https://www.tiktok.com/@bonny_app?_t=8sAzd52ExFd&_r=1'
]

const selectedLang = localStorage.getItem('selectedLang');


function updateBalance() {
  document
    .querySelector("body > div > header > div.header__top-bar.top-bar > div > span")
    .innerHTML = userInfo.coins;
}
updateBalance();
const subscribed = JSON.parse(await checkSubscriptions(linkUrls));

// Extract keys and values
const subscribed_keys = [];
const subscribed_values = [];

subscribed.forEach((obj) => {

  const key = Object.keys(obj)[0]; // Extract the key from the object
  const value = Object.values(obj)[0]; // Extract the value from the object
  subscribed_keys.push(key);
  subscribed_values.push(value);
});

console.log(subscribed_values);


// Select all elements with the 'list-item' class
const listItems = document.querySelectorAll('.list-item');

// Iterate over each element
listItems.forEach((item, index) => {
  // Подвечиваем выполненное
  if (subscribed_values[index])
    item.classList.add('joined')
  item.dataset.url = subscribed_keys[index]

  item
    .addEventListener('click', (event) => {
      const currentTarget = event.target.closest('.list-item');
      if (!currentTarget) return;
      localStorage.setItem("joined", currentTarget.dataset.name);
      const title = currentTarget.querySelector('span').innerHTML;
      const popupContent = createPopupContent({
        type: 'subscribe',
        rewardAmount: '5.300',
        linkUrl: currentTarget.dataset.url,
        btnText: 'Subscribe'
      });

      const popup = createPopup(popupContent, 'popup-subscribe');

      container.classList.add('disabled');

      const btnClose = document.querySelector('.btn-close');
      btnClose?.addEventListener('click', () => closePopup(popup));
    });
});

const { earn } = await loadData(selectedLang);

headerTitle.textContent = earn.title;
link.textContent = earn.btnText;

const createPopupContent = (data) => {
  const {
    type,
    rewardAmount = '5.300',
    linkUrl,
    text = '',
    btnText = '',
    title = 'Follow Bonny Tap News in Telegram'
  } = data;

  let additionalContent = '';

  type === 'subscribe'
    ? (additionalContent = `
      <div class="reward">
        <span class="plus-sign">+</span>
        <img src="/images/coin.png" alt="coin icon">
        <span>${rewardAmount}</span>
      </div>
      <h3 class="label">${title}</h3>
      <p class="text">Subscribe and keep following to earn bonus rating every day.</p>
      <div class="btn-actions">
        <a href="${linkUrl}" target="_blank" class="btn btn-subscribe">${btnText}</a>
        <button type="button" class="btn btn-check-subscribe">Check subscribe</button>
      </div>
    `)
    : (additionalContent = `
      <div class="reward">
        <span class="plus-sign">+</span>
        <img src="/images/coin.png" alt="coin icon">
        <span>${rewardAmount}</span>
      </div>
      <p class="text">${text}</p>
      <a href="#" class="btn btn-claim-rewards">${btnText}</a>
    `);

  return `
    <button type="button" class="btn-close"></button>
    ${additionalContent}
  `;
};

const createPopup = (htmlContent, additionalClass = '') => {
  const popupHTML = `
    <div class="popup ${additionalClass}">
      ${htmlContent}
    </div>
  `;
  container.insertAdjacentHTML('afterend', popupHTML);
  const popup = document.querySelector('.popup');
  if (popup) {
    setTimeout(() => popup.classList.add('show'), 10);
  }
  return popup;
};

const closePopup = (popup) => {
  if (popup) popup.style.display = 'none';
  container.classList.remove('disabled');
};

// Обработчик клика по кнопке "Check subscribe"
document.addEventListener('click', async function (event) {
  const btnCheckSubscribe = event.target.closest('.btn-check-subscribe');
  if (!btnCheckSubscribe) return;

  const linkEl = event.target.parentElement.querySelector('a');

  const popupSubscribe = document.querySelector('.popup-subscribe');
  if (popupSubscribe) popupSubscribe.style.display = 'none';

  const rewardContent = createPopupContent({
    type: 'reward',
    rewardAmount: '5.300',
    text: 'Task is Done! Get Your Reward!',
    btnText: 'CLAIM REWARDS',
  });


  const unsubContent = createPopupContent({
    type: 'reward',
    rewardAmount: '0',
    text: 'Subscribtion not found!',
    btnText: 'Close',
  });

  const subscribed = await checkSubscription(linkEl.href);

  if (subscribed == "subscribed") {
    await getUserInfo();
    updateBalance();
    const popup = createPopup(rewardContent);

    const btnClaimRewards = document.querySelector('.btn-claim-rewards');
    btnClaimRewards?.addEventListener('click', () => {
      const joined = localStorage.getItem('joined');
      const currentTarget = document.querySelector(`[data-name="${joined}"]`);

      if (currentTarget) currentTarget.classList.add('joined');
      localStorage.getItem("user_info")
      updateCoins(5.3);
      closePopup(popup);

      localStorage.removeItem('joined');
      localStorage.setItem('taskCompleted', true);
    });
  } else {
    const popup = createPopup(unsubContent);

    const btnClaimRewards = document.querySelector('.btn-claim-rewards');
    btnClaimRewards?.addEventListener('click', () => {
      closePopup(popup);
    })
  }

});
