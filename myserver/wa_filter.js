const venom = require('venom-bot');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
require('colors')

/**
 * 
 * @param {Promise<venom.Whatsapp>} venomClient 
 */
async function wa_filter(venomClient, socket) {

    const total = await prisma.numberBank.count()
    socket.emit("info", {
        title: "total",
        data: total
    })

    const number = await prisma.numberPointer.findUnique({
        where: {
            id: 1
        }
    })

    socket.emit("info", {
        title: "cek",
        data: number.number
    })

    try {
        const status = await (await venomClient).checkNumberStatus(`62${number.number}` + "@c.us")

        if (status) {
            const cek = await prisma.numberBank.findFirst({
                where: {
                    number: number.number
                }
            })

            if (!cek) {
                socket.emit("info", {
                    title: "true",
                    data: number.number
                })
                console.log(number.number.green)
                await prisma.numberBank.create({
                    data: {
                        number: number.number
                    }
                })
            }
        }

        await updateNumber(number)
        return await wa_filter(venomClient, socket)
    } catch (error) {
        console.log(number.number.gray)
        await updateNumber(number)
        // console.log("error ".red, error)
        return await wa_filter(venomClient, socket)
    }
}

async function updateNumber(number) {
    number.number++;
    await prisma.numberPointer.update({
        data: {
            number: "" + number.number
        },
        where: {
            id: 1
        }
    })
}

module.exports = { wa_filter }