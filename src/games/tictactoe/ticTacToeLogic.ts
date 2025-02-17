import Player from '@/games/tictactoe/ticTacToePlayer';
import Hash from './hash';
import TurnManager from './turnManager';
import TicTacToeRule from './ticTacToeRule';
import HashTile from './hashTile';

class TicTacToeLogic {

    private _turn_manager: TurnManager;
    private _rule: TicTacToeRule;

    constructor(rule: TicTacToeRule) {
        this._turn_manager = new TurnManager();
        this._rule = rule;
        this._rule.addConditionMetListener(this.conditionMet.bind(this));
    }

    play(players: Player[], hash: Hash, coordinates: [number, number]) {
        let playerSymbol = this._turn_manager.getActualPlayer()?.get_symbol();
        if (!playerSymbol) return;
        let playTile = hash.getTile(coordinates);

        if (playTile.getSymbol() == '') {
            playTile.setSymbol(playerSymbol);
        }

        let player = this._turn_manager.getActualPlayer();

        player
            ? this._rule.checkWinner(player, hash, this, coordinates)
            : console.error('Player is null or undefined.');

        this._turn_manager.changeTurn(players);
    }

    isTie(grid: HashTile[][], winner: Player | null): boolean {
        return (
            !winner &&
            grid.every((row) => row.every((tile) => tile.getSymbol() !== ''))
        );
    }

    conditionMet(player: Player) {
        // this._winner = player;
    }

    checkCoordinate(hash: Hash, coordinate: number[], symbol: string) {
        if (this.lineCheck(hash, coordinate[0], symbol)) {
            return true;
        }

        if (this.columnCheck(hash, coordinate[1], symbol)) {
            return true;
        }

        if (coordinate[0] === coordinate[1] && this.mainDiagonalCheck(hash, symbol)) {
            return true;
        }

        if (
            coordinate[0] + coordinate[1] === 2 &&
            this.secondaryDiagonalCheck(hash, symbol)
        ) {
            return true;
        }

        return false;
    }

    lineCheck(hash: Hash, line: number, symbol: string): boolean {
        var count: number = 0;
        for (var j: number = 0; j < 3; j++) {
            var actual_symbol: string = hash.getGrid()[line][j].getSymbol();
            if (actual_symbol === symbol) {
                count++;
            } else {
                return false;
            }
        }

        if (count === 3) {
            return true;
        } else {
            return false;
        }
    }

    columnCheck(hash: Hash, column: number, symbol: string): boolean {
        var count: number = 0;
        for (var i: number = 0; i < 3; i++) {
            var actual_symbol: string = hash.getGrid()[i][column].getSymbol();
            if (actual_symbol === symbol) {
                count++;
            } else {
                return false;
            }
        }

        if (count === 3) {
            return true;
        } else {
            return false;
        }
    }

    mainDiagonalCheck(hash: Hash, symbol: string): boolean {
        var count: number = 0;
        for (var i: number = 0; i < 3; i++) {
            for (var j: number = 0; j < 3; j++) {
                if (i === j) {
                    var actual_symbol: string = hash.getGrid()[i][j].getSymbol();

                    if (actual_symbol == symbol) {
                        count++;
                    } else {
                        return false;
                    }
                }
            }
        }

        if (count === 3) {
            return true;
        } else {
            return false;
        }
    }

    secondaryDiagonalCheck(hash: Hash, symbol: string): boolean {
        var count: number = 0;
        for (var i: number = 0; i < 3; i++) {
            for (var j: number = 0; j < 3; j++) {
                if (i + j === 2) {
                    var actual_symbol: string = hash.getGrid()[i][j].getSymbol();

                    if (actual_symbol == symbol) {
                        count++;
                    } else {
                        return false;
                    }
                }
            }
        }

        if (count === 3) {
            return true;
        } else {
            return false;
        }
    }

    hasEnded(): boolean {
        return this._rule.Ended;
    }

    getActualPlayer(){
        return this._turn_manager.getActualPlayer();
    }
}

export default TicTacToeLogic;
