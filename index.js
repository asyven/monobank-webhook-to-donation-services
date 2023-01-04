const express = require('express')
const app = express()

app.post('/', (req, res) => {
    try {
        console.log(req.body)
        return res.json().status(200);
    } catch (e) {
        console.log(e)
    }
})

app.listen(process.env.PORT || 3000)