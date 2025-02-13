import SocketController from "../controllers/socketController";
import { Database } from "firebase-admin/lib/database/database";
import RoomManager from "./roomManager";
import UserManager from "./userManager";
import { Server, Socket } from "socket.io";

export default class BackServer{
    private socketController: SocketController
    private roomManager: RoomManager
    private userManager: UserManager
 
    constructor(io:Server, db: Database){
        this.roomManager = new RoomManager(db)
        this.userManager = new UserManager(db)
        this.socketController = new SocketController(io, this.roomManager, this.userManager)
    }

    setupNewSocket(socket:Socket){
        this.socketController.setupSocket(socket)
    }
}