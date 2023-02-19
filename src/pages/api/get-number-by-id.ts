import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const getNumberByid = async (req: NextApiRequest, res: NextApiResponse) => {
    const { userId } = req.query
    console.log(userId, "ini user id nya")
    const data = await prisma.numberBank.findMany({
        where: {
            userId: {
                equals: userId?.toString()
            }
        },
        take: 50,
        orderBy: {
            createdAt: "desc"
        }
    })

    res.status(200).json(data)
}

export default getNumberByid