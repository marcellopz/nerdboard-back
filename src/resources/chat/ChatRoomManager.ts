import ChatRoom from './ChatRoom';
import ChatUser from './ChatUser';

class ChatRoomManager {
    private rooms: Map<string, ChatRoom>;

    constructor() {
        this.rooms = new Map();
        this.initializeDefaultRooms(5); // Default to 5 rooms
    }

    
    private initializeDefaultRooms(count: number): void {
        for (let i = 0; i < count; i++) {
            const roomName = `Chat${i + 1}`;
            this.addChatRoom(new ChatRoom(roomName));
        }
    }


    public addChatRoom(chatRoom: ChatRoom): boolean {
        if (this.rooms.has(chatRoom.getId())) {
            console.log(`Chat room with ID ${chatRoom.getId()} already exists.`);
            return false
        }
        this.rooms.set(chatRoom.getId(), chatRoom);
        return true
    }


    public deleteChatRoomById(roomId: string): void {
        if (!this.rooms.has(roomId)) {
            throw new Error(`Chat room with ID ${roomId} does not exist.`);
        }
        this.rooms.delete(roomId);
    }


    public getChatRoomById(roomId: string): ChatRoom | undefined {
        return this.rooms.get(roomId);
    }


    public getAllRooms(): ChatRoom[] {
        return Array.from(this.rooms.values());
    }


    public addUserToRoom(user: ChatUser, roomId: string): boolean {
        const room = this.getChatRoomById(roomId);
        if (!room) {
            console.log(`Chat room with ID ${roomId} does not exist.`);
            return false;
        }
        room.addUser(user);
        return true;
    }


    public removeUserFromRoom(user: ChatUser, roomId: string): void {
        const room = this.getChatRoomById(roomId);
        if (!room) {
            throw new Error(`Chat room with ID ${roomId} does not exist.`);
        }
        room.removeUser(user);
    }
}

export default ChatRoomManager;
