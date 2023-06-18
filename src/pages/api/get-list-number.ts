import { prisma } from "@/db/prisma";

export default async function handler(req: any, res: any) {
    const { page } = req.query
    const data = await prisma.numberBank.findMany({
        take: 10,
        skip: ((+page) - 1) * 10,
        orderBy: {
            createdAt: "desc"
        },
        select: {
            // id: true,
            number: true
        }
    })

    res.status(200).json(data)
}