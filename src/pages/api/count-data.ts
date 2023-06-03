import { prisma } from "@/util/prisma/db";

export default async function handler(req: any, res: any) {
    const data = await prisma.numberBank.count()
    res.status(200).send(data)
}