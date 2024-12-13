import { API_URL } from "/JS/API_conf.js";

// Initialize Telegram Web App
export const tg = window.Telegram.WebApp;

// Display user info
const userInfo = tg.initDataUnsafe.user;

console.log(userInfo);


export async function completeLearning() {
    const url = API_URL + '/user/complete_learning';

    const data = {
        token: localStorage.getItem("miniapp_token"),
    };

    let res = await sendPost(url, data);
    return res.json();
}


async function sendPost(url, data) {

    // Options for the fetch request
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', // Adjust headers as needed
            'Authorization': 'Bearer your-token-here' // Include authorization if required
        },
        body: JSON.stringify(data) // Convert the data to JSON
    };

    // Send the POST request
    let result = await fetch(url, options);
    return result;
}

export async function userLogin() {
    let result = await sendInitDataToAPI(tg.initData);
    localStorage.setItem("miniapp_token", result.token)
    let data = await getUserInfo();
    console.log(data);
    if (data['preferred_lang']) {
        localStorage.setItem('selectedLang', data['preferred_lang']);
        if (!data['learning_completed'])
            return false;
        else
            return true;

    }
}

export function formatNumberWithDots(number) {
    return new Intl.NumberFormat('de-DE').format(number);
}


function putUserInfoToLocalStorage(info) {
    info.foreach((key, value) => {
        localStorage.setItem("user_" + key, invalue);
    });
}



export async function getUserInfo() {

    const url = API_URL + "/get_user";

    const data = {
        token: localStorage.getItem("miniapp_token"),
    };

    const response = await sendPost(url, data);
    if (!response.ok) throw new Error('Failed to load user info');

    const info = await response.json();
    info.coins = formatNumberWithDots(info.coins);
    localStorage.setItem("user_info", JSON.stringify(info));
    return info;
}




export async function setUserLang(lang) {
    const url = API_URL + '/user/set_lang';

    const data = {
        lang_name: lang,
        token: localStorage.getItem("miniapp_token"),
        telegram_lang: userInfo.language_code
    };

    sendPost(url, data);
}

async function sendInitDataToAPI(initData) {
    const apiUrl = API_URL + "/validate"; // Replace with your API URL

    try {
        // Prepare the request payload
        const formData = new FormData();
        formData.append("initData", initData);

        // Send POST request to the API
        const response = await fetch(apiUrl, {
            method: "POST",
            body: formData
        });

        // Check if the response is successful
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error: ${response.status} - ${errorText}`);
        }

        // Parse the JSON response
        const result = await response.json();
        console.log("Validation successful:", result);
        return result;
    } catch (error) {
        console.error("Failed to validate initData:", error);
        throw error;
    }
}


export async function saveAnswer(category, question_id, answer) {
    const url = API_URL + '/answer';

    const data = {
        token: localStorage.getItem("miniapp_token"),
        category: category,
        question_id: question_id,
        answer: answer
    };

    return await sendPost(url, data);
}

export async function getAnswers() {
    const url = API_URL + '/get_answers';

    const data = {
        token: localStorage.getItem("miniapp_token"),
    };

    let res = await sendPost(url, data);
    return res.json();
}

export async function getRefferalLink() {
    const url = API_URL + '/get_refferal_link';

    const data = {
        token: localStorage.getItem("miniapp_token"),
    };

    let res = await sendPost(url, data);
    return res.text();
}


export async function getRefferals() {
    const url = API_URL + '/get_refferals';

    const data = {
        token: localStorage.getItem("miniapp_token"),
    };

    let res = await sendPost(url, data);
    return res.json();
}




export async function checkSubscription(channel_id) {
    const url = API_URL + '/check_subscription';

    const data = {
        token: localStorage.getItem("miniapp_token"),
        channel_id: channel_id
    };

    let res = await sendPost(url, data);
    return res.text();
}



export async function checkSubscriptions(channels) {
    const url = API_URL + '/check_subscriptions';

    const data = {
        token: localStorage.getItem("miniapp_token"),
        channels: channels
    };

    let res = await sendPost(url, data);
    return res.text();
}

export async function getLeaderBoard() {
    const url = API_URL + '/get_leader_board';

    const data = {
        token: localStorage.getItem("miniapp_token"),
    };

    let res = await sendPost(url, data);
    return res.json();
}


export async function saveGameScore(game, coins) {
    const url = API_URL + '/save_game_score';

    const data = {
        token: localStorage.getItem("miniapp_token"),
        game: game,
        coins: coins
    };

    let res = await sendPost(url, data);
    return res.json();
}


export async function getInvoiceLink(product, image_url) {
    const url = API_URL + '/create_invoice';

    const data = {
        token: localStorage.getItem("miniapp_token"),
        product: product,
        image_url: image_url
    };

    let res = await sendPost(url, data);
    return res.json();
}


export async function checkInvoice(id) {
    const url = API_URL + '/check_invoice';

    const data = {
        token: localStorage.getItem("miniapp_token"),
        invoice_id: id
    };

    let res = await sendPost(url, data);
    return res.json();
}



export function updateCoins(amount) {
    let user_info = JSON.parse(localStorage.getItem("user_info"));
    let coins = parseFloat(user_info.coins);
    coins += amount;
    coins = parseFloat(coins.toFixed(3));
    user_info.coins = coins;
    localStorage.setItem("user_info", JSON.stringify(user_info));
    const el = document.querySelector('#user_balance');
    if (el)
        el.innerHTML = coins;
}