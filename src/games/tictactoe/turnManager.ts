import Random from "@/utils/random/random";
import Player from "@/games/tictactoe/ticTacToePlayer";

class TurnManager{
    private _actual_player : Player | null = null;
    private _actual_index : number;

    constructor(){
        this._actual_index = this.randomizeTurn();
    }

    public randomizeTurn() : number{
        var randNum = Random.getRandomIntInclusive(0, 1);
        return randNum;
    }

    public changeTurn(players: Player[]){
        if (this._actual_index == 0){
            this._actual_index = 1;
        }
        else{
            this._actual_index = 0;
        }
        this._actual_player = players[this._actual_index]
    }

    public getActualPlayer() : Player | null {
        return this._actual_player;
    }
}

export default TurnManager