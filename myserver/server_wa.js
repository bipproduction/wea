const qrCodeTerminal = require('qrcode-terminal')
const { PrismaClient } = require('@prisma/client')
const { Client, LocalAuth, } = require('whatsapp-web.js')
const { execSync } = require('child_process')
require('colors')
const _ = require('lodash')
const prisma = new PrismaClient()
const ip = require('ip')
const addr = _.kebabCase(ip.address())
const fs = require('fs')



// init client whatsappjs
const client = new Client({
    authStrategy: new LocalAuth({ clientId: "makuro_wa" }),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox'],
    },
    takeoverOnConflict: true,
    takeoverTimeoutMs: 0
})

let isRunning = false

/**
 * 
 * @param {*} socket 
 * @param {(val: Client) => void} onReady 
 */
async function start(socket) {
    console.log("WA SERVER START".cyan)

    const message = await new Promise(async (resolve, reject) => {
        console.log("wait ...".gray)
        client.on('qr', (qr) => {
            console.log("require qr")
            qrCodeTerminal.generate(qr, { small: true })
            socket.emit("info", {
                title: "qr",
                data: qr
            })
        });

        client.on('ready', async () => {
            console.log("ready".green)
            resolve({
                title: "ready",
                message: "ready",
                isRunning: isRunning
            })
        });

        client.on("auth_failure", () => {
            console.log("auth_failure".red)

        })

        client.on("authenticated", () => {
            console.log("authenticated".green)
            socket.emit("info", {
                title: "qr",
                data: ""
            })
        })

        client.on("disconnected", () => {
            console.log("disconnected".red)
        })

        client.on("message", (message) => {
            console.log("message".green)
        })

        client.on("loading_screen", () => {
            console.log("loading_screen".yellow)
        })

        client.on("remote_session_saved", () => {
            console.log("remote_session_saved".green)
        })

        console.log("init wea")
        await client.initialize()
    })

}

// deklarasi nomer urutan
let nom = 811100000
async function proccess(socket) {

    // cari nomer pointer saat pertama dihidupkan
    const nomerUrutan = await prisma.numberPointer.findUnique({
        where: {
            id: 1
        }
    })

    // jika ada nomer urutan
    if (nomerUrutan) {

        // replace nomer dengan nomer pointer yang ada di database
        nom = +nomerUrutan.number
    }

    nom++;

    try {

        socket.emit("info", {
            title: "cek",
            data: nomerUrutan.number
        })
        // cek jika nomer mengandung akun wa
        const val = await client.isRegisteredUser("62" + nom)

        // jika ada 
        if (val) {
            const numberId = "62" + nom + "@c.us"

            try {
                const privateContact = await client.getContactById(numberId)
                socket.emit("info", {
                    title: "contact",
                    data: privateContact
                })
            } catch (error) {
                console.log(error)
            }

            const total = await prisma.numberBank.count()

            socket.emit("info", {
                title: "total",
                data: total
            })

            // kirim nomer yang ada ke client
            socket.emit("info", {
                title: "true",
                data: nom
            })
            console.log("find number".green, nom)

            // cek nomer ditabase nomer sudah ada atau belum
            const ada = await prisma.numberBank.findFirst({
                where: {
                    number: nom.toString()
                }
            })

            // jika gk ada maka nomer akan disimpan
            if (!ada) {
                await prisma.numberBank.create({
                    data: {
                        number: nom.toString()
                    }
                })
            }
        }

        // simpan pointer
        await prisma.numberPointer.upsert({
            create: {
                id: 1,
                number: nom.toString(),
                urutan: nom.toString(),
                total: "0"
            },
            update: {
                number: nom.toString(),
                urutan: nom.toString(),
            },
            where: {
                id: 1
            }
        })

    } catch (error) {
        console.log(`${error}`.red)
        socket.emit("info", {
            title: "error",
            data: error
        })
    }

    // console.log(i)

    // update urutan ke socket
    socket.emit("urutan", nomerUrutan.number)
    console.log(nomerUrutan.number.gray)

    // rubah status ke true
    isRunning = true
    socket.emit("status", {

    })

    return await proccess(socket)
}

const waServer = {
    isRunning,
    client,
    start,
    proccess
}

module.exports = waServer