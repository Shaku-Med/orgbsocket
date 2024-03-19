const express = require("express")
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const mysql = require("mysql")
const cors = require("cors")
const bodyParser = require("body-parser")
const multer = require("multer")
const nodemailer = require("nodemailer");
const fs = require("fs")
const store = require('store')
const CryptoJS = require("crypto-js")
const axios = require('axios')

app.use(express(cors({
    origin: ["https://orgainze.vercel.app"],
    methods: ["POST"]
})))

app.use(cors({
    origin: ["https://orgainze.vercel.app"],
    methods: ["POST"]
}))

// Increase payload limit for JSON data
app.use(express.json({ limit: '1000tb' }));

// Increase payload limit for URL-encoded data
app.use(express.urlencoded({ limit: '1000tb', extended: false }));
// 

const io = new Server(server, {
    cors: {
        origin: ["https://orgainze.vercel.app"]
    }
})

let Destroy = (req, res, istext, status) => {
    try {
        if (istext) {
            res.status(status).send(istext)
        } else {
            req.destroy()
            res.destroy()
        }
    } catch {
        Destroy(req, res)
    }
}

app.use(`*`, (req, res, next) => {
    try {
        res.sendFile(__dirname + './index.html')
    } catch {
        Destroy(req, res)
    }
})

io.on("connection", (socket) => {
    socket.on("owner_status", data => {
        io.emit("status", data)
    })

    socket.on("data", data => {
        axios.post("https://apsbackend.vercel.app/message", data).then(res => {
            if (res.data.length >= 1) {
                io.emit("message", res.data)
            }
        }).catch(er => {
            // console.log("unable to send message")
        })
    })

    socket.on("delete", data => {
        axios.post("https://apsbackend.vercel.app/delete/message", data).then(res => {
            if (res.data.length >= 1) {
                io.emit("message", res.data)
            }
        }).catch(er => {
            // 
        })
    })

    socket.on("reload", data => {
        io.emit("load_r", data)
    })
})

server.listen(3001, () => {
    console.log("Api is ready...")
})