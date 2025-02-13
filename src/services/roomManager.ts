import { Database } from "firebase-admin/lib/database/database";

class RoomManager {
  private db: Database
  private roomsRef

  constructor(db: Database) {
    this.db = db
    this.roomsRef = this.db.ref("rooms");
  }

  async createRoom(roomName: string, userId: string, userName: string) {
    // Check if the room already exists
    const exists = (await this.roomsRef.child(roomName).once("value")).exists();

    if (!exists) {
      // Log the success of room creation
      console.log("Sala criada com sucesso!", roomName);

      // Set the room data and add the user who created the room
      await this.roomsRef.child(roomName).set({
        users: {
          [userId]: { name: userName, createdBy: true } // Adding the user as the creator
        },
        messages: []
      });
    }
  }

  async addUserToRoom(roomName: string, userId: string) {
    await this.roomsRef.child(`${roomName}/users/${userId}`).set(true);
  }

  async removeUserFromRoom(roomName: string, userId: string) {
    await this.roomsRef.child(`${roomName}/users/${userId}`).remove();
  }

  async getUsersInRoom(roomName: string): Promise<string[]> {
    const snapshot = await this.roomsRef.child(`${roomName}/users`).once("value");
    return snapshot.exists() ? Object.keys(snapshot.val()) : [];
  }

  async addMessageToRoom(roomName: string, user: string, text: string) {
    const message = { user, text, timestamp: Date.now() };
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
