import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

const getNumberCount = async (userId: string) => {
    const data = await prisma.numberBank.count({
        where: {
            userId: {
                equals: userId
            }
        }
    })

    return data
}

export default getNumberCount