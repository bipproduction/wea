import { NextApiRequest, NextApiResponse } from 'next';


const sendData = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "POST") {
        console.log("send data")
        const data = await fetch(`${process.env.URL_HOST}/proses`, {
            method: "POST",
            body:JSON.stringify(req.body),
            headers: {
                "Content-Type": "application/json"
            }
        })

        const d = await data.json()
        return res.status(200).json(d)
    }
}

export default sendData
