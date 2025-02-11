import ChatRoom from "./ChatRoom";
import ChatUser from "./ChatUser";

export class ChatMessage{
    sender:ChatUser
    text:string
    room:ChatRoom

    constructor(sender:ChatUser, text:string, room:ChatRoom){
        this.sender = sender;
        this.text = text
        this.room = room
    }
}