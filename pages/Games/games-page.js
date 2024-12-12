
// Set user balance
document.querySelector("#coin_balance")
    .innerHTML = JSON.parse(localStorage.getItem("user_info")).coins;

