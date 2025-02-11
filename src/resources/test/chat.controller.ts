import { Router, Request, Response, NextFunction } from "express";
import Controller from "@/utils/interfaces/controller.interface";
import authenticated from "@/middleware/authenticated.middleware";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import ChatRoomManager from "../chat/ChatRoomManager";
import ChatRoom from "../chat/ChatRoom";
import ChatUser from "../chat/ChatUser";
// import { boolean } from "joi";

class ChatController implements Controller {
  public path = "/chat";
  public router = Router();
  private chatRoomManager: ChatRoomManager = new ChatRoomManager();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(`${this.path}`, authenticated, this.getRooms); // Add the authenticated middleware here
    this.router.post(`${this.path}/join`, authenticated, this.joinRoom); // Tentativa de entrar na sala
    this.router.get(`${this.path}/room/:id`, authenticated, this.getRoom); // Add the authenticated middleware here
    this.router.post(`${this.path}/create`, authenticated, this.createRoom);
  }

  private getRooms = (req: Request, res: Response): void => {
    try {
      // Pega a lista de salas
      var chatrooms = this.chatRoomManager.getAllRooms()

      // Transforma a lista de salas em um formato compatível para o envio
      const roomsData = chatrooms.map(room => ({
        id: room.getId(),
        name: room.getName(),
        numberOfUsers: room.getUsers().length
      }));

      // Retorna os dados transformados para o front-end
      res.status(200).json({ success: true, data: roomsData, message: "Rooms listed" });
    }
    catch (e) {
      res.status(400).json({ success: false, data: null, message: e });
    }
  };

  private joinRoom = (req: Request, res: Response): void => {
    try {
      const { roomId } = req.body
      const chatUser: ChatUser = { id: req.user.uid, username: req.user.name }

      // Tenta adicionar o usuário na sala
      this.chatRoomManager.addUserToRoom(chatUser, roomId);

      // Retorna ao front-end se o usuário conseguiu entrar na sala
      res.status(200).json({ success: true, data: null, message: "User join the room" });
    }
    catch (e) {
      let error = e as Error
      res.status(400).json({ success: false, data: null, message: error.message });
    }
  };

  private getRoom = (req: Request, res: Response): void => {
    try {
      const roomId = req.params.id

      // Pega a sala de chat usando o id
      const chatroom: ChatRoom | undefined = this.chatRoomManager.getChatRoomById(roomId);

      const roomName = chatroom?.getName()

      const messages = chatroom?.getMessages()

      const users = chatroom?.getUsers()

      const data = { roomName, messages, users }

      // Retorna a resposta ao front-end com as mensagens e os usuários da sala
      res.status(200).json({ success: true, data: data, message: "Rooms received" })
    }
    catch (e) {
      res.status(400).json({ success: false, data: null, message: e })
    }
  };

  private createRoom = (req: Request, res: Response): void => {
    const { roomName } = req.body

    try {
      this.chatRoomManager.addChatRoom(new ChatRoom(roomName))
      res.status(201).json({ success: true, message: "Room created." })
    }
    catch (e) {
      let error = e as Error
      res.status(400).json({ success: false, message: `Failed to create room: ${error.message}` })
    }
  };
}

export default ChatController;
