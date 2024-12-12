import { loadData } from './loadData.js';
import { getUserInfo } from './API.js';

function setUserInfo() {
  const userInfo = JSON.parse(localStorage.getItem("user_info"));

  // Set usersame
  document
    .querySelector("body > div > header > div > div.user-info > span")
    .innerHTML = userInfo.first_name;


  // Set coins count
  document
    .querySelector("body > div > main > div.balance.balance_margin > a > span")
    .innerHTML = userInfo.coins;




  // Set avatar
  document.querySelector("body > div > header > div > div.user-info > img")
    .src = userInfo.avatar_url;
}


(async () => {
  const selectedLang = localStorage.getItem('selectedLang') || 'en';
  const { mainPage } = await loadData(selectedLang);


  // Set content
  document
    .querySelectorAll('.list-page .list-item__title')
    .forEach((title, index) => {
      if (mainPage[index]?.namePage) {
        title.textContent = mainPage[index].namePage;
      }
    });


  setUserInfo();
})();

document.addEventListener('DOMContentLoaded', () => {
  const sliderBlock = document.querySelector('.slider-block');
  const slides = document.querySelectorAll('.slider-slide');
  const tabsContainer = document.getElementById('tabs');

  let currentIndex = 0;

  // Создание табов
  slides.forEach((_, index) => {
    const tab = document.createElement('div');
    tab.classList.add('tab');
    if (index === currentIndex) tab.classList.add('active');
    tab.dataset.index = index;
    tabsContainer.appendChild(tab);
  });

  const tabs = tabsContainer.querySelectorAll('.tab');

  function updateSlider(index) {
    currentIndex = index;
    sliderBlock.style.transform = `translateX(-${index * 100}%)`;

    tabs.forEach((tab, idx) => {
      tab.classList.toggle('active', idx === index);
    });
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      updateSlider(parseInt(tab.dataset.index, 10));
    });
  });

  // Добавление функциональности свайпа
  let startX = 0;
  let isSwiping = false;

  sliderBlock.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isSwiping = true;
  });

  sliderBlock.addEventListener('touchmove', (e) => {
    // Блокировка действия браузера при свайпе
    e.preventDefault();
  });

  sliderBlock.addEventListener('touchend', (e) => {
    if (!isSwiping) return;

    const endX = e.changedTouches[0].clientX;
    const swipeDistance = endX - startX;

    if (swipeDistance < 0) {
      // Свайп влево (следующий слайд)
      currentIndex = Math.min(currentIndex + 1, slides.length - 1);
    } else if (swipeDistance > 0) {
      // Свайп вправо (предыдущий слайд)
      currentIndex = Math.max(currentIndex - 1, 0);
    }

    updateSlider(currentIndex);
    isSwiping = false;
  });

  // Инициализация
  updateSlider(currentIndex);
});



// Update balance after stars purchase
document.addEventListener("visibilitychange", async function () {
  await getUserInfo();
  setUserInfo();

});