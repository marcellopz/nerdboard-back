import { Server, Socket } from "socket.io";
import RoomManager from "../services/roomManager";
import UserManager from "../services/userManager";

export default class SocketController {
  private io: Server;
  private roomManager: RoomManager;
  private userManager: UserManager;

  constructor(io: Server, roomManager: RoomManager, userManager: UserManager) {
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

    socket.on("create_room", async (roomName: string) => {
      await this.roomManager.createRoom(roomName, id, name);
      this.io.emit("room_list", await this.roomManager.getRooms());
    });

    socket.on("join_room", async (roomName: string) => {
      await this.roomManager.addUserToRoom(roomName, id);
      socket.join(roomName);
      this.io.to(roomName).emit("room_users", await this.roomManager.getUsersInRoom(roomName));
    });

    socket.on("send_message", async ({ room, text }: { room: string; text: string }) => {
      const message = await this.roomManager.addMessageToRoom(room, name, text);
      this.io.to(room).emit("message", message);
    });

    socket.on("leave_room", async (roomName: string) => {
      socket.leave(roomName);
      await this.roomManager.removeUserFromRoom(roomName, id);
      this.io.to(roomName).emit("room_users", await this.roomManager.getUsersInRoom(roomName));
    });

    socket.on("disconnect", async () => {
      console.log(`Usuário desconectado: ${name}`);
      await this.userManager.removeUser(id);
      this.io.emit("online_users", await this.userManager.getOnlineUsers());

      (await this.roomManager.getRooms()).forEach(async (room) => {
        await this.roomManager.removeUserFromRoom(room, id);
        this.io.to(room).emit("room_users", await this.roomManager.getUsersInRoom(room));
      });
    });
  }
}
