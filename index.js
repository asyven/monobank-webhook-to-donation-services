const express = require('express')
const app = express()

app.all('/', (req, res) => {
    try {
        console.log(req.body, process.env)
        return res.json().status(200);
    } catch (e) {
        console.log(e)
    }
})

app.listen(process.env.PORT || 3000)