import { Router, Request, Response, NextFunction } from "express";
import Controller from "@/utils/interfaces/controller.interface";
import authenticated from "@/middleware/authenticated.middleware";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import ChatRoomManager from "../chat/ChatRoomManager";
import ChatRoom from "../chat/ChatRoom";
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
    this.router.post(`${this.path}/join/:id`, authenticated, this.joinRoom); // Tentativa de entrar na sala
    this.router.get(`${this.path}/room/:id`, authenticated, this.getRoom); // Add the authenticated middleware here
    this.router.post(`${this.path}/create`, authenticated, this.createRoom);
  }

  private getRooms = (req: Request, res: Response): void => {

    // Pega a lista de salas
    var chatrooms = this.chatRoomManager.getAllRooms()

    // Transforma a lista de salas em um formato compatível para o envio
    const roomsData = chatrooms.map(room => ({
      id: room.getId(),
      name: room.getName(),
      numberOfUsers: room.getUsers().length
    }));

    // Retorna os dados transformados para o front-end
    res.status(200).json({ rooms: roomsData });
  };

  private joinRoom = (req: Request, res: Response): void => {
    const { userId, roomId } = req.body

    // Tenta adicionar o usuário na sala
    var success = this.chatRoomManager.addUserToRoom(userId, roomId);

    // Retorna ao front-end se o usuário conseguiu entrar na sala
    if (success) {
      res.status(200).json({ success: true });
    }
  };

  private getRoom = (req: Request, res: Response): void => {
    const { roomId } = req.body

    // Pega a sala de chat usando o id
    var chatroom: ChatRoom | undefined = this.chatRoomManager.getChatRoomById(roomId);

    // Pega a lista de mensagens da sala de chat
    var messages = chatroom?.getMessages()

    // Pega a lista de usuários da sala de chat
    var users = chatroom?.getUsers()

    // Retorna a resposta ao front-end com as mensagens e os usuários da sala
    res.status(200).json({ messages, users })
  };

  private createRoom = (req: Request, res: Response): void => {
    const { roomName } = req.body

    // Checa se o usuário conseguiu entrar na sala
    var success = this.chatRoomManager.addChatRoom(new ChatRoom(roomName))

    // Retorna a resposta ao front-end de que a sala foi criada
    if (success) {
      res.status(200).json({ success: true })
    }
  };
}

export default ChatController;
