import { sendNotifToClient } from './../../func/send_notif_to_client';

import GStatict from 'gStatict';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest } from "next/server";
import { Client, LocalAuth } from 'whatsapp-web.js'
const client = new Client({
    authStrategy: new LocalAuth({ clientId: "makuro_fren" }),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox'],
    },
    takeoverOnConflict: true,
    takeoverTimeoutMs: 0
})


const wea = async (req: NextApiRequest, res: NextApiResponse) => {
    const { init } = req.query



    try {
        await client.isRegisteredUser('6289697338821')
        sendNotifToClient({
            title: "ready",
            value: "ready"
        })

        sendNotifToClient({
            title: "init",
            value: "false"
        })
        console.log("wea ready")

        if (req.method == "POST") {
            const body = req.body
            await client.isRegisteredUser('6289697338821')

            let hasil = []
            for(let itm of body){
                let data = await client.isRegisteredUser('62'+itm)
                hasil.push({
                    number: itm,
                    status: data
                })
            }
            res.status(200).json(hasil)
        }
        return res.status(200).end()
    } catch (error) {
        console.log("init wea")

        client.on('qr', (qr) => {
            sendNotifToClient({
                title: "qr",
                value: qr
            })
        });

        client.on('ready', async () => {
            sendNotifToClient({
                title: "ready",
                value: "ready"
            })

            sendNotifToClient({
                title: "init",
                value: "false"
            })

            console.log("wea ready")
        });

        client.on('message', async msg => {
            console.log(msg.body)
        });

        client.on("disconnected", (reaseon) => {
            sendNotifToClient({
                title: "dis",
                value: reaseon.toString()
            })

            console.log("wea disconnected")

        })

        client.pupPage?.on("console", (a) => {
            console.log(a.text())
        })

        sendNotifToClient({
            title: "init",
            value: "true"
        })
        client.initialize()
        return res.status(200).json({ message: "init" })
    }

}

export default wea