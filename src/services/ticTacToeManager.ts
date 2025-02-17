import TicTacToe from "@/games/tictactoe/ticTacToe";
import { Socket } from "socket.io";

export default class TicTacToeManager {
    public setupSocket(socket: Socket) {
        socket.on("tictactoe_play", async ({ userId, coordinate }) => this.handlePlay(userId, coordinate));
    }

    handlePlay(userId: string, coordinate: string) {

    }
}