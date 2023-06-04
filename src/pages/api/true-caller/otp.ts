import { prisma } from "@/util/prisma/db";
import truecallerjs from "truecallerjs";

export default async function handler(req: any, res: any) {

    if (req.method != "POST") {
        res.status(405).send("Method not allowed")
    }

    const body: { phonenumber: string, json_data: any, otp: string } = req.body
    body.json_data['status'] = 1
    body.json_data['message'] = "Sent"
    // console.log(body)

    // return res.json({})
    var data = await truecallerjs.verifyOtp(body.phonenumber, body.json_data, body.otp);

    if (data) {
        await prisma.trueCaller.upsert({
            where: {
                id: 1
            },
            create: {
                user: data
            },
            update: {
                user: data
            }
        })
    }

    return res.status(200).json(data)
}