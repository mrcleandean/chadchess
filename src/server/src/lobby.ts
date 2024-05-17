import type { User } from "./game";
import { Game } from "./index";

export type ClientUser = Omit<User, 'id'> & { id: string | undefined };

export type Chat = {
    user: ClientUser;
    message: string;
    time: Date;
}

class Lobby {
    games: { [playerId: string]: Game | undefined };
    queue: (User & { id: string })[];
    chats: Chat[];

    constructor() {
        this.games = {};
        this.queue = [];
        this.chats = [];
    }

    createGame(white: User & { id: string }, black: User & { id: string }) {
        const game = new Game(white, black);
        this.games[white.id] = game;
        this.games[black.id] = game;
    }

    deleteGame(whiteId: string, blackId: string) {
        delete this.games[whiteId];
        delete this.games[blackId];
    }

    queueUser(user: User, id: string) {
        if (this.queue.some(u => u.id === id)) {
            this.queue = this.queue.filter(u => u.id !== id);
            return 'cancelled';
        }
        this.queue.push({ ...user, id });
        if (this.queue.length >= 2) {
            const white = this.queue.shift() as User & { id: string };
            const black = this.queue.shift() as User & { id: string };
            this.createGame(white, black);
            return 'found';
        }
        return 'pending';
    }

    addChat(chat: Chat) {
        if (this.chats.length >= 20) {
            this.chats.shift();
        }
        this.chats.push(chat);
    }
}

export default Lobby;