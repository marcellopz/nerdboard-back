import ChatRoom from "./ChatRoom";
import ChatUser from "./ChatUser";

export class ChatMessage{
    sender:ChatUser
    text:string
    room:ChatRoom
    createdAt:number

    constructor(sender:ChatUser, text:string, room:ChatRoom, createdAt:number){
        this.sender = sender
        this.text = text
        this.room = room
        this.createdAt = createdAt
    }
}