import { Database } from "firebase-admin/lib/database/database";

class UserManager {
  private db: Database
  private usersRef

  constructor(db: Database) {
    this.db = db
    this.usersRef = this.db.ref("users_online");
  }

  async addUser(userId: string, name: string, email: string) {
    await this.usersRef.child(userId).set({ name, "email": email });
  }


  async removeUser(userId: string) {
    await this.usersRef.child(userId).remove();
  }

  async getOnlineUsers(): Promise<any> {
    const snapshot = await this.usersRef.once("value");
    return snapshot.val() || {};
  }
}

export default UserManager;
