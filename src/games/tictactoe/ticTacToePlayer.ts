class Player{
    private _id: string;
    private _name : string;
    private _symbol : string;

    constructor(name:string, id:string){
        this._name = name;
        this._id = id;
        this._symbol = "";
    }

    public set_name(name:string){
        this._name = name;
    }

    public get_name() : string{
        return this._name;
    }

    public set_symbol(symbol:string){
        this._symbol = symbol;
    }

    public get_symbol():string{
        return this._symbol;
    }

    public getId():string{
        return this._id;
    }
}

export default Player