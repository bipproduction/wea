import { prisma } from "@/util/prisma/db";
import truecallerjs from "truecallerjs";

export default async function handler(req: any, res: any) {
    if (req.method != "POST") {
        res.status(405).send("Method not allowed")
    }

    const { phoneNumber } = req.body
    var json_data = await truecallerjs.login(phoneNumber);
    if (json_data) {
        await prisma.trueCaller.upsert({
            where: {
                id: 1
            },
            create: {
                otp: json_data
            },
            update: {
                otp: json_data
            }
        })
    }

    res.status(200).send(json_data)
}