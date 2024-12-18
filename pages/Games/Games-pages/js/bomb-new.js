import { saveGameScore, updateCoins } from "/JS/API.js";


document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.getElementById('menu-btn');
  const cardImages = Array.from(document.getElementsByClassName('card-img'));
  const bombGameContainer = document.getElementById('bomb-game-container');
  const bombSection = document.getElementById('bomb-section');
  const multipliersRow = document.getElementById('multipliers-row');
  const payoffBtn = document.getElementById('payoff-btn');
  const bananaCounterSpan = document.getElementById('banana-counter');

  const modalContainer = document.getElementById('modal-container');
  const modal1 = document.getElementById('modal-1');
  const modal2 = document.getElementById('modal-2');
  const modal3 = document.getElementById('modal-3');
  const rewardText = document.getElementsByClassName('modal-3-reward-text')[0];

  let gameWasLost = false;
  let totalGuesses = 0;
  const bombsAmount = 3;
  let stake = 10_000;
  const multipliers = [
    1, 1.08, 1.23, 1.42, 1.64, 1.92, 2.25, 2.68, 3.21, 3.9, 4.8, 6, 6.9, 7.94,
    9.13, 10.51, 12.08, 13.87, 15.95, 18.33, 21.01, 24.02, 27.47, 31.32, 35.62,
    40.5, 45.6, 50.81, 56.0, 61.26, 66.78, 72.61, 78.67, 84.89, 91.71, 99.01,
  ];

  menuBtn?.addEventListener('click', () => {
    removeMenuAndStart();
  });

  const getBombPositions = () => {
    const arr = [];

    while (arr.length < bombsAmount) {
      const num = Math.floor(Math.random() * 25);

      if (!arr.includes(num)) {
        arr.push(num);
      }
    }

    return arr;
  };

  const giveImageSourcesToCardIcons = () => {
    cardImages.forEach((cardImage, index) => {
      const icon = bombPositions.includes(index) ? 'mini-bomb' : 'banana-icon';
      cardImage.src = `./images/${icon}.svg`;
    });
  };

  const bombPositions = getBombPositions();
  giveImageSourcesToCardIcons();

  const startGame = () => {
    giveImageSourcesToCardIcons();
    getBombPositions();
    // If it was switch to red upon losing before, reset it
    payoffBtn.style.background = 'linear-gradient(45deg, #FF7621, #CE2014)';

    for (const clickCard of Array.from(
      document.getElementsByClassName('clickcard'),
    )) {
      clickCard.classList.remove('flipped');
    }

    totalGuesses = 0;
    bananaCounterSpan.innerText = `${totalGuesses} / 22`;

    // If pointer events were disabled on game cards, after completing game or losing, reactivate
    bombSection.classList.remove('pointer-events-none');

    gameWasLost = false;
  };

  const completeGame = () => {
    bombSection.classList.add('pointer-events-none');
    openModal();
  };

  const handleLose = () => {
    bombSection.classList.add('pointer-events-none');
    modalContainer.classList.remove('hidden');
    modal3.classList.remove('hidden');
    rewardText.innerHTML = 'You lost this time.<br>Play again to win';
  };

  const openModal = async function () {
    await saveGameScore("Bomb game", 5300);
    updateCoins(5.3);
    rewardText.HTML = 'Congratulations!<br>You Already Collect 5 300';
    modalContainer.classList.remove('hidden');
    modal1.classList.remove('hidden');

    // Go to modal 2
    const modal1Btn = document.getElementById('modal-1-btn');
    modal1Btn.addEventListener('click', () => {
      modal1.classList.add('hidden');
      modal2.classList.remove('hidden');
    });

    const goToModalThree = () => {
      modal2.classList.add('hidden');
      modal3.classList.remove('hidden');
    };

    const modal2X2Btn = document.getElementById('modal-2-btn-x2');
    const modal2RewardBtn = document.getElementById('modal-2-btn-reward');

    modal2X2Btn.addEventListener('click', goToModalThree);
    modal2RewardBtn.addEventListener('click', goToModalThree);

    modal3.querySelector('.btn-play-again').addEventListener('click', () => {
      window.location.pathname = '/pages/Games/Games-pages/Bomb-game.html';
    });
  };

  const wait = async (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleCardClick = async (e, index) => {
    // Make all other cards unclickable until animation has finished
    const cardFronts = Array.from(document.getElementsByClassName('front'));
    for (const cardFront of cardFronts) {
      cardFront.classList.remove('pointer');
      cardFront.classList.add('pointer-events-none');
    }

    // Make payoff button be clickable if it is not first try
    payoffBtn.classList.remove('pointer-events-none');
    payoffBtn.classList.add('pointer');
    payoffBtn.classList.remove('brightness-75');

    let currentElement = e.target;
    while (!Array.from(currentElement.classList).includes('clickcard')) {
      currentElement = currentElement.parentNode;
    }

    if (!Array.from(currentElement.classList).includes('flipped')) {
      currentElement.classList.add('flipped');
      // Wait for the animation
      await wait(500);

      for (const cardFront of cardFronts) {
        cardFront.classList.remove('pointer-events-none');
        cardFront.classList.add('pointer');
      }
    } else {
      // Prevent proceeding if already flipped
      return;
    }

    // Lost game
    if (bombPositions.includes(index)) {
      gameWasLost = true;
      multipliersRow.innerHTML = '';
      payoffBtn.style.background = '#EF4444';
      handleLose();
    } else {
      totalGuesses += 1;
      bananaCounterSpan.innerText = `${totalGuesses} / 22`;
      updateMultipliers();
    }

    updatePayoffButton();
  };

  const updateMultipliers = () => {
    multipliersRow.innerHTML = '';

    const multipliersBefore = Array.from({ length: 4 }, (_, index) => {
      const multiplierIndex = totalGuesses - 4 + index;

      if (multiplierIndex >= 0 && multiplierIndex < multipliers.length) {
        return multipliers[multiplierIndex]
          ? multipliers[multiplierIndex].toFixed(2)
          : null;
      }
    }).filter(Boolean);
    multipliersBefore.forEach((multiplier) => {
      multipliersRow.insertAdjacentHTML(
        'beforeend',
        `<div class="py-1.5 px-2 rounded-lg bg-dark">
          ${multiplier}
        </div>`,
      );
    });

    multipliersRow.insertAdjacentHTML(
      'beforeend',
      `<div class="py-1.5 px-2 rounded-lg bg-red-500">
        ${multipliers[totalGuesses].toFixed(2)}
      </div>`,
    );

    const multipliersAfter = Array.from(
      { length: Math.max(6 - totalGuesses - 1, 1) },
      (_, index) => multipliers[totalGuesses + index + 1],
    );

    multipliersAfter.forEach((multiplier) => {
      // Multipliers after will have less opacity
      multipliersRow.insertAdjacentHTML(
        'beforeend',
        `<div class="py-1.5 px-2 rounded-lg bg-dark opacity-50">
          ${multiplier}
        </div>`,
      );
    });
  };

  const updatePayoffButton = () => {
    payoffBtn.innerHTML = !gameWasLost
      ? `
    <div class='row'>
      <span class='mr-2'>ВЫПЛАТА ${stake * multipliers[totalGuesses]}</span>
      <img src='../../../images/diamond.svg' height='25' width='25' alt='Diamond'>
    </div>`
      : '<span>ВЫ ПРОИГРАЛИ</span>';
  };

  /** When `play` button is clicked, remove menu and start the game. */
  const removeMenuAndStart = () => {
    bombGameContainer.classList.remove('hidden');
    updatePayoffButton();
  };

  const cardContainers = Array.from(
    document.getElementsByClassName('card-container'),
  );

  cardContainers.forEach((cardContainer, index) => {
    cardContainer.addEventListener('click', (e) => handleCardClick(e, index));
  });

  payoffBtn.addEventListener('click', () =>
    gameWasLost ? startGame() : completeGame(),
  );
  updateMultipliers();

  // To do: remove
  //removeMenuAndStart();
});
