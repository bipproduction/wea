// import { Client, LocalAuth } from 'whatsapp-web.js'
// import qrCodeTerminal from 'qrcode-terminal'
// import { PrismaClient } from '@prisma/client'
const qrCodeTerminal = require('qrcode-terminal')
const { PrismaClient } = require('@prisma/client')
const { Client, LocalAuth } = require('whatsapp-web.js')
const { execSync } = require('child_process')
require('colors')
const _ = require('lodash')
const prisma = new PrismaClient()
const ip = require('ip')
const addr = _.kebabCase(ip.address())



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

async function main() {

    try {
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
                        main()
                    }, 3000)
                } catch (error) {
                    console.log(reaseon)
                }

            })

            console.log("init wea")
            await client.initialize()
        })

        await proccess()
    } catch (error) {
        console.log(`${error}`.yellow)
    }
}

async function proccess() {
    let nom = 8110000000
    const mulai = await prisma.numberPointer.findUnique({
        where: {
            id: 1
        }
    })

    if (mulai) {
        nom = mulai.number
    }
    const total = (nom * nom)
    for (let i = mulai ? Number(mulai.urutan) : 0; i < total; i++) {
        const val = await client.isRegisteredUser("62" + nom)
        if (val) {
            console.log(nom.toString().green)
            const ada = await prisma.numberBank.findFirst({
                where: {
                    number: nom.toString()
                }
            })

            if (!ada) {
                await prisma.numberBank.create({
                    data: {
                        number: nom.toString()
                    }
                })
            }
        }

        await prisma.numberPointer.upsert({
            create: {
                id: 1,
                number: nom.toString(),
                urutan: i.toString(),
                total: total.toString()
            },
            update: {
                number: nom.toString(),
                urutan: i.toString()
            },
            where: {
                id: 1
            }
        })

        try {
            execSync(`curl -X PUT -d '{"nomer" : ${nom}, "urutan" : ${i}, "total" : ${total}}' \
        https://malikkurosaki1985.firebaseio.com/wa/${addr}.json`, { stdio: "ignore" })
        } catch (error) {
            console.log(`${error}`.red)
        }


        console.log(i)
        isRunning = true
        nom++

        // await new Promise(async (resolve, reject) => {
        //     setTimeout(() => {
        //         resolve()
        //     }, 1000)
        // })
    }

}

main()