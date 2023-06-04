import { prisma } from "@/util/prisma/db";

export default async function dataGet(req: any, res: any){
    const data = await prisma.trueCaller.findUnique({
        where: {
            id: 1
        }
    })

    res.status(200).json(data)
}