import TicTacToeLogic from './ticTacToeLogic';
import Player from '@/games/tictactoe/ticTacToePlayer';
import Hash from './hash';
import { GameRule } from '../gameRule';

class TicTacToeRule extends GameRule {
    public checkWinner(player: Player, hash: Hash, gameLogic: TicTacToeLogic, coordinates:[number, number]) {
        var game_win: boolean = gameLogic.checkCoordinate(hash,
            coordinates,
            player.get_symbol(),
        );
        if (game_win) {
            this.win(player);
        }
    }
}

export default TicTacToeRule;
