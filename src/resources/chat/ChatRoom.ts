import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs
import { ChatMessage } from './ChatMessage';
import ChatUser from './ChatUser';

class ChatRoom {
    private id: string;
    private name: string;
    private users: Map<string, ChatUser>; // Use Map for efficient lookups
    private messages: ChatMessage[];

    constructor(name: string) {
        this.id = uuidv4(); // Generate a unique ID
        this.name = name;
        this.users = new Map();
        this.messages = [];
    }


    public addUser(user: ChatUser): void {
        if (this.users.has(user.getId())) {
            throw new Error(`User ${user.getName()} is already in the chat room.`);
        }
        this.users.set(user.getId(), user);
    }


    public removeUser(user: ChatUser): void {
        if (!this.users.has(user.getId())) {
            throw new Error(`User ${user.getName()} is not in the chat room.`);
        }
        this.users.delete(user.getId());
    }


    public addMessage(message: ChatMessage): void {
        this.messages.push(message);
    }


    public getName(): string {
        return this.name;
    }


    public getUsers(): ChatUser[] {
        return Array.from(this.users.values());
    }


    public getMessages(): ChatMessage[] {
        return [...this.messages];
    }


    public getId(): string {
        return this.id;
    }
}

export default ChatRoom;