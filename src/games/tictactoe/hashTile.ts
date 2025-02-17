class HashTile{
    private _coordinates : number[]
    private _simbol : string

    constructor(i : number, j : number){
        this._coordinates = [i, j]
        this._simbol = "";
    }

    public getCoordinates() : number[]{
        return this._coordinates;
    }

    public getSymbol() : string{
        return this._simbol
    }

    public setSymbol(simbol:string){
        this._simbol = simbol;
    }
}

export default HashTile;