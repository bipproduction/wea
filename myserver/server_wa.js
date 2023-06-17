const qrCodeTerminal = require('qrcode-terminal')
const { PrismaClient } = require('@prisma/client')
const { Client, LocalAuth } = require('whatsapp-web.js')
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


async function start(socket) {
    console.log("WA SERVER START".cyan)

    const message = await new Promise(async (resolve, reject) => {
        console.log("wait ...".gray)
        client.on('qr', (qr) => {
            console.log("require qr")
            qrCodeTerminal.generate(qr, { small: true })

            // resolve({
            //     title: "qr",
            //     message: qr
            // })
        });

        client.on('ready', async () => {
            console.log("ready".green)
            resolve({
                title: "ready",
                message: "ready",
                isRunning: isRunning
            })
        });

        console.log("init wea")
        await client.initialize()
    })

    await proccess(socket)
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
    start
}

module.exports = waServer