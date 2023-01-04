const express = require('express')
const {monobankToDonationalerts, registerMonoWebhook, testAlert} = require("./create-alert");
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
        console.log(await testAlert());;
        return res.json().status(200);
    } catch (e) {
        console.log(e)
    }
})

app.post('/', async (req, res) => {
    try {
        console.log(req.body);
        await monobankToDonationalerts(req.body.data);
        return res.json().status(200);
    } catch (e) {
        console.log(e)
    }
})

app.listen(process.env.PORT || 3000)