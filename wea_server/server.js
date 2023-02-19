

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
const port = process.env.URL_HOST || 3003

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


async function connectWpp() {

    try {
        await client.isRegisteredUser('6289697338821')

        console.log("ready top")
        return {
            title: "ready",
            message: "ready"
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
                    message: "ready"
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

        return message
    }
}

app.get('/status', expressAsyncHandler(async (req, res) => {
    const con = await connectWpp()
    console.log("message", con)
    res.status(200).json(con)
}))

app.post('/proses', expressAsyncHandler(async (req, res) => {
    const body = req.body
    console.log("proccess data")
    const hasil = []
    for (let itm of body.data) {
        console.log(itm)
        const val = await client.isRegisteredUser("62" + itm)
        if (val) {
            const data = {
                id: body.id,
                number: itm,
                isTrue: val
            }

            hasil.push(data)
            await prisma.numberBank.upsert({
                create: {
                    userId: body.id,
                    number: itm.toString()
                },
                update: {
                    userId: body.id,
                    number: itm.toString()
                },
                where: {
                    number: itm.toString()
                }
            })

            axios({
                method: "POST",
                url: "http://localhost:3000/api/socket",
                data: {
                    title: "result",
                    value: data
                }
            })
        }
    }

    res.status(200).json(hasil)
}))

app.listen(port, () => console.log(`Server is running on port ${port}`))