const express = require('express')
const {
    monobankToDonationalerts,
    registerMonoWebhook,
    testAlert,
    daGetRedirectLink,
    getDaAccessToken
} = require("./create-alert");
const app = express()

app.get('/', async (req, res) => {
    try {
        registerMonoWebhook();
        return res.json().status(200);
    } catch (e) {
        console.log(e)
    }
})

app.get('/test-alert', async (req, res) => {
    try {
        console.log(await testAlert());
        return res.json().status(200);
    } catch (e) {
        console.log(e)
    }
})

app.get('/da-login', async (req, res) => {
    try {
        console.log(daGetRedirectLink());
        res.redirect(daGetRedirectLink());
    } catch (e) {
        console.log(e)
    }
})
app.get('/da', async (req, res) => {
    try {
        console.log(await getDaAccessToken(req.query));
        return res.json().status(200);
    } catch (e) {
        console.log(e)
    }
})

app.all('/mono', async (req, res) => {
    try {
        try {
            console.log(req, req.body, req.query)
            await monobankToDonationalerts(req.body.data);
        }catch (e){
        }
        return res.json().status(200);
    } catch (e) {
        console.log(e)
    }
})

app.listen(process.env.PORT || 3000)