import { Chess, Move, Square } from "chess.js";

export type User = {
    id: string;
    username: string;
    pic: string;
}

class Game {
    white: User;
    black: User;
    whiteTimeRemaining: number;
    blackTimeRemaining: number;
    turn: 'white' | 'black';
    chess: Chess;

    constructor(player1: User, player2: User) {
        this.white = player1
        this.black = player2
        this.whiteTimeRemaining = 5 * 60 * 1000;
        this.blackTimeRemaining = 5 * 60 * 1000;
        this.turn = 'white';
        this.chess = new Chess();
    }

    playerCanMove(playerId: string) {
        const whiteMove = playerId === this.white.id && this.turn === 'white'
        const blackMove = playerId === this.black.id && this.turn === 'black'
        return whiteMove || blackMove
    }

    move(id: string, move: Move) {
        if (this.playerCanMove(id)) {
            try {
                this.chess.move(move);
                this.turn = this.turn === 'white' ? 'black' : 'white';
            } catch (err) {
                console.log(err);
            }
        }
    }

    getOtherId(id: string) {
        return id === this.white.id ? this.black.id : this.white.id;
    }
}

export default Game;