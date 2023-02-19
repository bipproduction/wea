import getNumberCount from '@/bin/page/get_number_count';
import { NextApiRequest, NextApiResponse } from 'next';
const apiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { pid, userId } = req.query
    if (pid == "get-number-count") {
        const data = await getNumberCount(userId as string)
        return res.status(200).json(data)
    }

    return res.status(404).json({
        message: 'Not found'
    })
}

export default apiHandler