import { NextApiRequest, NextApiResponse } from 'next';
const status = async (req: NextApiRequest, res: NextApiResponse) => {
    console.log(process.env.URL_HOST)
    const data = await fetch(process.env.URL_HOST!+"/status")

    console.log( await data.text())
    res.status(data.status).json(data)
}

export default status