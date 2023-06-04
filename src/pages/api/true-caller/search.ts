import truecallerjs from "truecallerjs";

export default async function handler(req: any, res: any) {


    if (req.method != "POST") {
        res.status(405).send("Method not allowed")
    }

    const body = req.body
    var response = await truecallerjs.search(body);

    console.log(JSON.stringify(response.json(), null, 2))

    res.status(200).json(response.json())
}