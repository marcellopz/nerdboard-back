import SocketController from "../controllers/socketController";
import { Database } from "firebase-admin/lib/database/database";
import RoomService from "./roomService";
import UserService from "./userService";
import { Server, Socket } from "socket.io";
import { Firestore } from "firebase-admin/firestore";

export default class BackServer{
    private socketController: SocketController
    private roomManager: RoomService
    private userManager: UserService
 
    constructor(io:Server, db: Firestore){
        this.roomManager = new RoomService(db)
        this.userManager = new UserService(db)
        this.socketController = new SocketController(io, this.roomManager, this.userManager)
    }

    setupNewSocket(socket:Socket){
        this.socketController.setupSocket(socket)
    }
}