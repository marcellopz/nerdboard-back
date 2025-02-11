class ChatUser {
    id: string;
    username: string;

    constructor(id: string, username: string) {
        this.id = id;
        this.username = username;
    }

    public getName():string{
        return this.username;
    }

    public getId():string{
        return this.id;
    }
}

export default ChatUser;
