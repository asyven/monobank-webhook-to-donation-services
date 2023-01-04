const AlertsAPI = require('alerts-api')
const {Monobank} = require('monobankua');

const donationAlerts = new AlertsAPI({access_token: process.env.ALERTS_API})
const monoApi = new Monobank(process.env.MONO_TOKEN);

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
        let header = `${data.description} - ${(data.amount / 100).toFixed(2)} UAH`;
        let message = `${data.comment}`;
        let myAlert = new AlertsAPI.CustomAlert({header, message, is_shown: 1});
        console.log(await donationAlerts.sendCustomAlert(myAlert));
        ;
    } catch (e) {
        console.error(e);
    }
}


function registerMonoWebhook() {
    monoApi.set_webhook(process.env.CYCLIC_URL);
}

async function testAlert() {
    let myAlert = new AlertsAPI.CustomAlert({header: "test", message: "alert", is_shown: 1});
    console.log(await donationAlerts.sendCustomAlert(myAlert));
}

module.exports = {monobankToDonationalerts, registerMonoWebhook, testAlert}
        