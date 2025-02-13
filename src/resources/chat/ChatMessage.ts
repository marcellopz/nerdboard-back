import ChatUser from "./ChatUser";

export class ChatMessage{
    sender:ChatUser
    text:string
    createdAt:number

    constructor(sender:ChatUser, text:string, createdAt:number){
        this.sender = sender
        this.text = text
        this.createdAt = createdAt
    }
}