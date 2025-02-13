import { Server, Socket } from "socket.io";
import RoomService from "../services/roomService";
import UserService from "../services/userService";

export default class SocketController {
  private io: Server;
  private roomManager: RoomService;
  private userManager: UserService;

  constructor(io: Server, roomManager: RoomService, userManager: UserService) {
    this.io = io;
    this.roomManager = roomManager;
    this.userManager = userManager;
  }


  setupSocket(socket: Socket): void {
    const { id, name, email } = socket.data.user;

    console.log(`Usuário conectado: ${name} (${id})`);

    this.userManager.addUser(id, name, email);
    this.io.emit("online_users", this.userManager.getOnlineUsers());

    socket.emit("room_list", this.roomManager.getRooms());

    socket.on("create_room", async (roomName: string) => this.handleCreateRoom(socket, roomName))
    socket.on("join_room", async (roomName: string) => this.handleJoinRoom(socket, roomName))
    socket.on("send_message", async ({ room, text }) => this.handleMessage(socket, { room, text }))
    socket.on("leave_room", async (roomName: string) => this.handleLeaveRoom(socket, roomName))
    socket.on("disconnect", async () => this.handleDisconnect(socket, id, name))
  }

  private async handleDisconnect(socket: Socket, id: string, name: string) {
    console.log(`Usuário desconectado: ${name}`);
    await this.userManager.removeUser(id);
    this.updateOnlineUsers();

    (await this.roomManager.getRooms()).forEach(async (room) => {
      await this.roomManager.removeUserFromRoom(room, id);
      this.notifyRoomUsers(room);
    });
  }

  private async handleLeaveRoom(socket: Socket, roomName: string) {
    const { id } = socket.data.user;
    socket.leave(roomName);
    await this.roomManager.removeUserFromRoom(roomName, id);
    this.notifyRoomUsers(roomName);
  }

  private async handleMessage(socket: Socket, { room, text }: { room: string, text: string }) {
    const { name } = socket.data.user
    const message = await this.roomManager.addMessageToRoom(room, name, text);
    this.io.to(room).emit("message", message);
  }

  private async handleCreateRoom(socket: Socket, roomName: string) {
    const { id, name } = socket.data.user;
    await this.roomManager.createRoom(roomName, id, name);
    this.io.emit("room_list", await this.roomManager.getRooms());
  }

  private async handleJoinRoom(socket: Socket, roomName: string) {
    const { id } = socket.data.id
    await this.roomManager.addUserToRoom(roomName, id);
    socket.join(roomName);
    this.notifyRoomUsers(roomName);
  }

  private async updateOnlineUsers() {
    this.io.emit("online_users", await this.userManager.getOnlineUsers());
  }

  private async notifyRoomUsers(roomName: string) {
    this.io.to(roomName).emit("room_users", await this.roomManager.getUsersInRoom(roomName));
  }
}
