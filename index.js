const express = require('express')
const {monobankToDonationalerts, registerMonoWebhook} = require("./create-alert");
const app = express()

app.get('/', async (req, res) => {
    try {
        registerMonoWebhook();
        return res.json().status(200);
    } catch (e) {
        console.log(e)
    }
})

app.post('/', async (req, res) => {
    try {
        await monobankToDonationalerts(req.body.data);
        return res.json().status(200);
    } catch (e) {
        console.log(e)
    }
})

app.listen(process.env.PORT || 3000)