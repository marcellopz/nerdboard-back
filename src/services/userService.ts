import { Firestore } from "firebase-admin/firestore";

class UserService {
  private db: Firestore;
  private usersRef;

  constructor(db: Firestore) {
    this.db = db;
    this.usersRef = this.db.collection("users_online");
  }

  async addUser(userId: string, name: string, email: string) {
    await this.usersRef.doc(userId).set({ name, email });
  }

  async removeUser(userId: string) {
    await this.usersRef.doc(userId).delete();
  }

  async getOnlineUsers(): Promise<any> {
    const snapshot = await this.usersRef.get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }
}

export default UserService;
