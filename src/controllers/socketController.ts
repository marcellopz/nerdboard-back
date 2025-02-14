import { Server, Socket } from "socket.io";
import RoomService from "../services/roomService";
import UserService from "../services/userService";
import { nanoid } from "nanoid";
import Random from "@/utils/random/random";

export default class SocketController {
  private io: Server;
  private roomService: RoomService;
  private userService: UserService;

  constructor(io: Server, roomManager: RoomService, userManager: UserService) {
    this.io = io;
    this.roomService = roomManager;
    this.userService = userManager;
  }

  setupSocket(socket: Socket): void {
    const { id, name, email } = socket.data.user;

    console.log(`Usuário conectado: ${name} (${id})`);

    this.userService.addUser(id, name, email);
    this.io.emit("online_users", this.userService.getOnlineUsers());

    socket.emit("room_list", this.roomService.getRooms());

    socket.on("create_room", async (roomName: string, callback: (roomId:string) => void) => this.handleCreateRoom(socket, roomName, callback));
    socket.on("join_room", async (roomId: string) => this.handleJoinRoom(socket, roomId));
    socket.on("send_message", async ({ room, text }) => this.handleMessage(socket, { room, text }));
    socket.on("leave_room", async (roomName: string) => this.handleLeaveRoom(socket, roomName));
    
    socket.on("disconnect", async () => this.handleDisconnect(socket, id, name))
  }

  private async handleCreateRoom(socket: Socket, roomName: string, callback: (roomId:string) => void) {
    try {
      const { id, name } = socket.data.user;
      const roomId = Random.createID();
      await this.roomService.createRoom(roomName, roomId, id, name);
      socket.join(roomId);
      this.io.emit("room_list", await this.roomService.getRooms());
      callback(roomId);
    }
    catch (e){
      const error = e as Error
      console.log(error.message)
    }
  }

  private async handleJoinRoom(socket: Socket, roomId: string) {
    try{
      const { id, name } = socket.data.user
      await this.roomService.addUserToRoom(roomId, id, name);
      socket.join(roomId);
      this.notifyRoomUsers(roomId);
    }
    catch (e){
      const error = e as Error
      console.error(error.message);
    }
  }

  private async handleDisconnect(socket: Socket, id: string, name: string) {
    console.log(`Usuário desconectado: ${name}`);
    await this.userService.removeUser(id);
    this.updateOnlineUsers();

    (await this.roomService.getRooms()).forEach(async (room) => {
      await this.roomService.removeUserFromRoom(room, id);
      this.notifyRoomUsers(room);
    });
  }

  private async handleLeaveRoom(socket: Socket, roomId: string) {
    const { id } = socket.data.user;
    await this.roomService.removeUserFromRoom(roomId, id);
    socket.leave(roomId);
    this.notifyRoomUsers(roomId);
  }

  private async handleMessage(socket: Socket, { room, text }: { room: string, text: string }) {
    const { name } = socket.data.user
    const message = await this.roomService.addMessageToRoom(room, name, text);
    this.io.to(room).emit("message", message);
  }

  private async updateOnlineUsers() {
    this.io.emit("online_users", await this.userService.getOnlineUsers());
  }

  private async notifyRoomUsers(roomName: string) {
    this.io.to(roomName).emit("room_users", await this.roomService.getUsersInRoom(roomName));
  }
}
