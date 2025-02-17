import Hash from './hash';
import HashTile from './hashTile';
import TicTacToeLogic from './ticTacToeLogic';
import Player from './ticTacToePlayer';
import TicTacToeRule from './ticTacToeRule';
import TurnManager from './turnManager';

export type TicTacToeState = {
    playerTurn?: string;
    grid: HashTile[][];
    playerWin: Player | null;
    draw: boolean;
    players: Player[];
};

class TicTacToe {
    private _gameLogic: TicTacToeLogic;
    private _players: Player[];
    private _hash: Hash = new Hash();

    private _playerPlay: ((gameState: TicTacToeState) => void)[] = [];

    private _winner: Player | null = null;

    constructor(players: Player[], gameLogic: TicTacToeLogic) {
        this._players = players;
        this._gameLogic = gameLogic;

        this.addListener(this.onPlayerPlay.bind(this));

        this._players[0].set_symbol("x");
        this._players[1].set_symbol("o");
    }

    public onPlayerPlay(gameState: TicTacToeState) {
        // this._gameNetwork.sendGameState(gameState);
    }

    public playReceived(userId: string, coordinate: [number, number]) {
        let actualPlayer = this
            .getPlayers()
            .find((player) => player.getId() === userId);

        if (!actualPlayer) return;

        if (this.isPlayerTurn(actualPlayer) && !this._gameLogic.hasEnded()) {
            this._gameLogic.play(this._players, this._hash, coordinate);
        }
    }

    public isPlayerTurn(player: Player): boolean {
        return player === this._gameLogic.getActualPlayer();
    }

    public getHash(): Hash{
        return this._hash;
    }

    public addListener(callback: (gameState: TicTacToeState) => void) {
        this._playerPlay.push(callback);
    }

    public callEvent(gameState: TicTacToeState) {
        this._playerPlay.forEach((callback) => callback(gameState));
    }

    public getGameState(): TicTacToeState {
        return {
            playerTurn: this._gameLogic.getActualPlayer()?.getId(),
            grid: this._hash.getGrid(),
            playerWin: this._winner,
            draw: this._gameLogic.isTie(this._hash.getGrid(), this._winner),
            players: this.getPlayers(),
        };
    }

    getPlayers(){
        return this._players;
    }

}

export default TicTacToe;
