import HashTile from './hashTile';

class Hash {
    private _hash: HashTile[][] = [];

    constructor() {
        this.buildHash();
    }

    private buildHash() {
        for (var i: number = 0; i < 3; i++) {
            this._hash[i] = [];
            for (var j: number = 0; j < 3; j++) {
                this._hash[i][j] = new HashTile(i, j);
            }
        }
        console.log(`Final hash`, this._hash);
    }

    public getTile(coordinates: number[]) {
        return this._hash[coordinates[0]][coordinates[1]];
    }

    public getGrid(): HashTile[][] {
        return this._hash;
    }
}

export default Hash;
