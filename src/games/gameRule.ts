import Player from "./tictactoe/ticTacToePlayer";

export class GameRule{
    private _ended: boolean = false;
    private _conditionMet: ((player: Player) => void)[] = [];

    get Ended():boolean{
        return this._ended;
    }

    public win(player:Player){
        if (!this._ended){
            this._conditionMet.forEach(callback => callback(player));
            this._ended = true;
        }
    }

    public addConditionMetListener(callback: (player: Player) => void) {
        this._conditionMet.push(callback);
    }

    public callEvent(player:Player){
        this._conditionMet.forEach(callback => callback(player));
    }
}