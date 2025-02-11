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


    public addChatRoom(chatRoom: ChatRoom): void {
        if (this.rooms.has(chatRoom.getId())) {
            throw new Error(`Chat room with ID ${chatRoom.getId()} already exists.`);
        }
        this.rooms.set(chatRoom.getId(), chatRoom);
    }


    public removeChatRoomById(roomId: string): void {
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


    public addUserToRoom(chatUser: ChatUser, roomId: string): void {
        const room = this.getChatRoomById(roomId);
        if (!room) {
            throw new Error(`Chat room with ID ${roomId} does not exist.`);
        }
        if (room.getUsers().find((user) => user.id != chatUser.id)){
            throw new Error(`O usuário ${chatUser.id} já está na sala ${roomId}`);
        }
        room.addUser(chatUser);
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
