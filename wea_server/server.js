

const express = require("express");
const expressAsyncHandler = require("express-async-handler");
const app = express()
const { Client, LocalAuth } = require('whatsapp-web.js')
const qrTerminal = require('qrcode-terminal')
const axios = require('axios')
const cors = require("cors")
const qrCodeTerminal = require('qrcode-terminal')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const port = process.env.URL_HOST || 3004
require('colors')


const client = new Client({
    authStrategy: new LocalAuth({ clientId: "makuro_fren" }),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox'],
    },
    takeoverOnConflict: true,
    takeoverTimeoutMs: 0
})

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
let isRunning = false

async function connectWpp() {

    try {
        await client.isRegisteredUser('6289697338821')

        console.log("ready top")
        if (!isRunning) {
            proccess()
        }

        return {
            title: "ready",
            message: "ready",
            isRunning: isRunning
        }


    } catch (error) {

        const message = await new Promise(async (resolve, reject) => {
            client.on('qr', (qr) => {
                console.log("require qr")
                qrCodeTerminal.generate(qr, { small: true })

                resolve({
                    title: "qr",
                    message: qr
                })
            });

            client.on('ready', async () => {
                console.log("ready")
                resolve({
                    title: "ready",
                    message: "ready",
                    isRunning: isRunning
                })
            });

            client.on("disconnected", (reaseon) => {
                try {
                    client.destroy()
                    setTimeout(() => {
                        connectWpp()
                    }, 3000)
                } catch (error) {
                    console.log(reaseon)
                }

            })

            console.log("init wea")
            await client.initialize()
        })

        if (!isRunning) {
            proccess()
        }

        return message
    }
}

app.get('/status', expressAsyncHandler(async (req, res) => {
    const con = await connectWpp()
    console.log("message", con)
    res.status(200).json(con)
}))

app.get('/proses', expressAsyncHandler(async (req, res) => {
    if (!isRunning) {
        proccess()
    }
    res.status(200).json({
        title: "ready",
        message: "ready",
        isRunning: isRunning
    })
}))

async function proccess() {
    let nom = 89697338821
    for (let i = 0; i < (nom * nom); i++) {
        console.log(i, nom)
        const val = await client.isRegisteredUser("62" + nom)
        if (val) {
            console.log(nom.toString().green)
            await prisma.numberBank.upsert({
                create: {
                    number: nom.toString()
                },
                update: {
                    number: nom.toString()
                },
                where: {
                    number: nom.toString()
                }
            })
        }
        isRunning = true
        nom++
    }
}

app.listen(port, () => console.log(`Server is running on port ${port}`))