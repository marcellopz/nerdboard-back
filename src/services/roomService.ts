import Random from "@/utils/random/random";
import { FieldValue, Firestore, Timestamp } from "firebase-admin/firestore";
import { Database } from "firebase-admin/lib/database/database";
import { v4 as uuidv4 } from 'uuid'

class RoomManager {
  private db: Firestore
  private roomsCollection

  constructor(db: Firestore) {
    this.db = db
    this.roomsCollection = this.db.collection("rooms");
  }

  async createRoom(roomName: string, roomId: string, userId: string, userName: string) {
    // Check if the room already exists
    const roomRef = this.roomsCollection.doc(roomId);
    const roomSnapshot = await roomRef.get();

    if (!roomSnapshot.exists) {
      // Log the success of room creation
      console.log("Sala criada com sucesso!", roomName);

      // Set the room data and add the user who created the room
      await roomRef.set({
        roomName: roomName,
        roomId: roomId,
        createdBy: userName,
        users: {},
        messages: []
      });
    }
  }

  async addUserToRoom(roomId: string, userId: string, userName: string) {
    const roomRef = this.roomsCollection.doc(roomId);
    const roomSnapshot = await roomRef.get();

    if (!roomSnapshot.exists){
      throw new Error("A sala não existe");
    }

    const roomData = roomSnapshot.data();
    if (roomData?.users?.[userId]) {
      throw new Error("O usuário já existe nessa sala.");
    }

    // Adiciona o usuário à sala
    await roomRef.update({
      [`users.${userId}`]: {username: userName, id: userId},
    })
  }

  async removeUserFromRoom(roomId: string, userId: string) {
    const roomRef = this.roomsCollection.doc(roomId);
    await roomRef.update({
      [`users${userId}`]: FieldValue.delete(),
    })
  }

  async getUsersInRoom(roomId: string): Promise<string[]> {
    const roomSnapshot = await this.roomsCollection.doc(roomId).get();
    return roomSnapshot.exists ? Object.keys(roomSnapshot.data()?.users || {}) : [];
  }

  async addMessageToRoom(roomId: string, userName: string, text: string) {
    const roomRef = this.roomsCollection.doc(roomId);
    const message = { sender: userName, text, timeStamp: Date.now() };

    await roomRef.update({
      messages: FieldValue.arrayUnion(message)
    })

    return message
  }

  async getRooms(): Promise<string[]> {
    const snapshot = await this.roomsCollection.get();
    return snapshot.docs.map((doc) => doc.id);
  }
}

export default RoomManager;
