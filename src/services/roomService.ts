import Random from "@/utils/random/random";
import { Database } from "firebase-admin/lib/database/database";
import { v4 as uuidv4 } from 'uuid'

class RoomManager {
  private db: Database
  private roomsRef

  constructor(db: Database) {
    this.db = db
    this.roomsRef = this.db.ref("rooms");
  }

  async createRoom(roomName: string, roomId: string, userId: string, userName: string) {
    // Check if the room already exists
    const exists = (await this.roomsRef.child(roomName).once("value")).exists();

    if (!exists) {
      // Log the success of room creation
      console.log("Sala criada com sucesso!", roomName);

      // Set the room data and add the user who created the room
      await this.roomsRef.child(roomId).set({
        roomName: roomName,
        roomId: roomId,
        createdBy: userName,
        users: {},
        messages: []
      });
    }
  }

  async addUserToRoom(roomId: string, userId: string, userName: string) {
    // Verifica se o usuário já está na sala
    const userExists = (await this.roomsRef.child(`${roomId}/users/${userId}`).once("value")).exists();

    if (userExists) {
      // Lança um erro caso o usuário já esteja na sala
      throw new Error("O usuário já está nesta sala.");
    }

    // Adiciona o usuário à sala
    await this.roomsRef.child(`${roomId}/users/${userId}`).set({ username: userName, id:userId });

  }

  async removeUserFromRoom(roomId: string, userId: string) {
    await this.roomsRef.child(`${roomId}/users/${userId}`).remove();
  }

  async getUsersInRoom(roomName: string): Promise<string[]> {
    const snapshot = await this.roomsRef.child(`${roomName}/users`).once("value");
    return snapshot.exists() ? Object.keys(snapshot.val()) : [];
  }

  async addMessageToRoom(roomName: string, userName: string, text: string) {
    const message = { sender: userName, text, timestamp: Date.now() };
    console.log(message)
    await this.roomsRef.child(`${roomName}/messages`).push(message);
    return message;
  }

  async getRooms(): Promise<string[]> {
    const snapshot = await this.roomsRef.once("value");
    if (snapshot.exists()) {
      return Object.keys(snapshot.val());
    } else {
      return [];
    }
  }
}

export default RoomManager;
