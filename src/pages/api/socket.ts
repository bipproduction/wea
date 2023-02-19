
import { Server } from "socket.io";

export default function SocketHandler(req: any, res: any) {

    if (res.socket.server.io) {
        if (req.method === "POST") {
            const body = req.body
            res.socket.server.io.emit("msg", body)
        }
        res.end();
        // console.log("socket connected")
        return;
    }

    console.log("init socket")
    res.socket.server.io = new Server(res.socket.server)
    res.end();
}