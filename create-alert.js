const AlertsAPI = require('alerts-api')
const {Monobank} = require('monobankua');

const monoApi = new Monobank(process.env.MONO_TOKEN);
let ALERTS_API_TOKEN = process.env.ALERTS_TOKEN

/**
 * @typedef {Object} StatementItem
 * @property {string} id - Transaction identifier
 * @property {number} time - Unix time in seconds
 * @property {string} description - Transaction description
 * @property {number} mcc - Transaction Merchant Category Code (ISO 18245)
 * @property {number} originalMcc = Original Merchant Category Code (ISO 18245)
 * @property {boolean} hold - Authorization hold status
 * @property {number} amount - Transaction amount in the original currency in the minimal currency amount
 * @property {number} operationAmount - Transaction amount in the bank's currency (UAH) in the minimal currency amount
 * @property {number} currencyCode - Currency code (ISO 4217)
 * @property {number} commissionRate - Commision rate in the minimal currency amount
 * @property {number} cashbackAmount - Cashback amount in the minimal currency amount
 * @property {number} balance - Account balance in the minimal currency amount
 * @property {(string | undefined)} comment - Transaction comment
 * @property {(string | undefined)} receiptId - Receipt id for the check.gov.ua
 * @property {(stirng | undefined)} invoiceId - Invoide id (only on money transfer)
 * @property {string} counterEdrpou - EDRPOU of the counterparty
 * @property {string} counterIban - IBAN of the counterparty
 */


/**
 * @param {StatementItem} data
 */

async function monobankToDonationalerts(data) {
    try {
        if (!data.amount || data.amount < 100){
            return;
        }
        const donationAlerts = new AlertsAPI({access_token: ALERTS_API_TOKEN})

        let header = `${data.description || "Anonymous"} - ${(data.amount / 100).toFixed(2)} UAH`;
        let message = `${data.comment || ""}`;
        let myAlert = new AlertsAPI.CustomAlert({header, message, is_shown: 0});
        console.log(await donationAlerts.sendCustomAlert(myAlert));
    } catch (e) {
        console.log(e);
    }
}


function registerMonoWebhook() {
    monoApi.set_webhook(`${process.env.CYCLIC_URL}/mono`);
}

async function testAlert() {
    const donationAlerts = new AlertsAPI({access_token: ALERTS_API_TOKEN})
    let myAlert = new AlertsAPI.CustomAlert({header: "0.00 UAH", message: "yes 🍕", is_shown: 0});
    console.log(await donationAlerts.sendCustomAlert(myAlert));
}

function daGetRedirectLink() {
    return AlertsAPI.generateOauthLink({
        clientID: Number(process.env.ALERTS_APP_ID),
        redirectURI: `${process.env.CYCLIC_URL}/da`,
        scopes: ['oauth-custom_alert-store'],
    });
}

async function getDaAccessToken({code}) {
    let token = await AlertsAPI.getAccessToken({
        clientID: Number(process.env.ALERTS_APP_ID),
        clientSecret: process.env.ALERTS_API,
        redirectURI: `${process.env.CYCLIC_URL}/da`,
        code: code,
    })

    if (typeof token.access_token !== "undefined") {
        ALERTS_API_TOKEN = token.access_token;
    }

    return token;
}

module.exports = {monobankToDonationalerts, registerMonoWebhook, testAlert, daGetRedirectLink, getDaAccessToken}
        