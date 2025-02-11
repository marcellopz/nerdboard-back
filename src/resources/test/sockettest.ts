import { Server as HTTPServer } from "http";
import { Server } from "socket.io";

class SocketTest{
    public io : Server
    constructor(httpServer : HTTPServer) {
        this.io = new Server(httpServer);
        
        this.io.on("connection", (socket) => {
            console.log("Um socket conectou!")

            socket.on("msg_from_client", function (msg){
                console.log('Message is ' + msg)
            })
        });

        let count = 0
         setInterval(() => {
            this.io.emit("msg_to_client", 'test msg' + count)
            count++;
        }, 2000);

        console.log("Socket teste iniciado")
    }
} export default SocketTest




