import { Server, Socket } from 'socket.io';
import { Lobby } from './index';
import type http from 'http';
import type { Move } from 'chess.js';
import type { User } from './game';
import type { Chat } from './lobby';

export type MoveType = Move;

export type ServerToClientSocketEventTypes = {
    'game-recieved': (opponent: User, side: 'white' | 'black') => void;
    'opponent-resigned': () => void;
    'opponent-flagged': () => void;
    'game-found': (players: { white: User, black: User }) => void;
    'update-board': (fen: string, turn: 'black' | 'white') => void;
    'find-game-pending': () => void;
    'find-game-cancelled': () => void;
    'global-chat': (chat: Chat) => void;
    'opponent-sent-chat': (chat: Chat) => void;
    'opponent-requested-draw': () => void;
    'opponent-requested-takeback': () => void;
    'opponent-requested-rematch': () => void;
    'opponent-accepted-draw': () => void;
    'opponent-accepted-takeback': () => void;
    'opponent-accepted-rematch': () => void;
    'opponent-declined-draw': () => void;
    'opponent-declined-takeback': () => void;
    'opponent-declined-rematch': () => void;
}

export type ClientToServerSocketEventTypes = {
    'game-requested': (id: string) => void;
    'flagged': () => void;
    'move': (move: Move, id: string) => void;
    'resign': (id: string) => void;
    'game-chat': (chat: Chat, id: string) => void;
    'leave': (id: string) => void;
    'find-game': (user: User, id: string) => void;
    'global-chat': (chat: Chat) => void;
    'request-draw': (id: string) => void;
    'request-takeback': (id: string) => void;
    'request-rematch': (id: string) => void;
    'accept-draw': (id: string) => void;
    'accept-takeback': (id: string) => void;
    'accept-rematch': (id: string) => void;
    'decline-draw': (id: string) => void;
    'decline-takeback': (id: string) => void;
    'decline-rematch': (id: string) => void;
}

const lobby = new Lobby();
import('node-schedule').then(schedule => {
    schedule.scheduleJob('0 2 * * *', () => {
        lobby.games = {};
    })
});

function setupSocket(server: http.Server) {
    const io = new Server<ClientToServerSocketEventTypes, ServerToClientSocketEventTypes>(server, { cors: { origin: '*' } });

    io.on('connection', (socket: Socket) => {
        socket.on('flagged', () => {
            const game = lobby.games[socket.id];
            if (game) {
                const otherId = game.getOtherId(socket.id);
                io.to(otherId).emit('opponent-flagged');
            }
        })
        socket.on('disconnect', () => {
            const game = lobby.games[socket.id];
            if (game) {
                const otherId = game.getOtherId(socket.id);
                io.to(otherId).emit("opponent-resigned");
                lobby.deleteGame(socket.id, otherId);
                return;
            }
            const queueIndex = lobby.queue.findIndex(user => user.id === socket.id);
            if (queueIndex !== -1) {
                lobby.queue.splice(queueIndex, 1);
            }
        })

        // LOBBY
        socket.on('global-chat', (chat: Chat) => {
            lobby.addChat(chat);
            socket.emit('global-chat', chat);
        })
        socket.on('find-game', (user: User, id: string) => {
            const status = lobby.queueUser(user, id);
            if (status === 'found') {
                const game = lobby.games[id];
                const whiteId = game.white.id;
                const blackId = game.black.id;
                io.to(whiteId).to(blackId).emit('game-found', { white: game.white, black: game.black });
            }
            if (status === 'cancelled') {
                socket.emit('find-game-cancelled');
            }
            if (status === 'pending') {
                socket.emit('find-game-pending');
            }
        });


        // GAME
        // Main events
        socket.on('game-requested', (id: string) => {
            const game = lobby.games[id];
            const side = game.white.id === id ? 'white' : 'black';
            const opponent = side === 'white' ? game.black : game.white;
            socket.emit('game-recieved', opponent, side);
        });
        socket.on('move', (move: MoveType, id: string) => {
            const game = lobby.games[id];
            game.move(id, move);
            const otherId = game.getOtherId(id);
            io.to(id).to(otherId).emit('update-board', game.chess.fen(), game.turn);
        });
        socket.on('resign', (id: string) => {
            const game = lobby.games[id];
            const otherId = game.getOtherId(id);
            io.to(otherId).emit('opponent-resigned');
            lobby.deleteGame(id, otherId);
        });
        socket.on('game-chat', (chat: Chat, id: string) => {
            const game = lobby.games[id];
            const otherId = game.getOtherId(id);
            io.to(id).to(otherId).emit('opponent-sent-chat', chat);
        });
        socket.on('leave', (id: string) => {
            const game = lobby.games[id];
            const otherId = game.getOtherId(id);
            io.to(otherId).emit('opponent-resigned');
            lobby.deleteGame(id, otherId);
        });

        // Request events
        socket.on('request-draw', (id: string) => {
            const game = lobby.games[id];
            const otherId = game.getOtherId(id);
            io.to(otherId).emit('opponent-requested-draw');
        });
        socket.on('request-takeback', (id: string) => {
            const game = lobby.games[id];
            const otherId = game.getOtherId(id);
            io.to(otherId).emit('opponent-requested-takeback');
        });
        socket.on('request-rematch', (id: string) => {
            const game = lobby.games[id];
            const otherId = game.getOtherId(id);
            io.to(otherId).emit('opponent-requested-rematch');
        });

        // Accept events
        socket.on('accept-takeback', (id: string) => {
            const game = lobby.games[id];
            const otherId = game.getOtherId(id);
            io.to(otherId).emit('opponent-accepted-takeback');
        });
        socket.on('accept-draw', (id: string) => {
            const game = lobby.games[id];
            const otherId = game.getOtherId(id);
            io.to(otherId).emit('opponent-accepted-draw');
        });
        socket.on('accept-rematch', (id: string) => {
            const game = lobby.games[id];
            const otherId = game.getOtherId(id);
            io.to(otherId).emit('opponent-accepted-rematch');
        })

        // Decline events
        socket.on('decline-takeback', (id: string) => {
            const game = lobby.games[id];
            const otherId = game.getOtherId(id);
            io.to(otherId).emit('opponent-declined-takeback');
        });
        socket.on('decline-draw', (id: string) => {
            const game = lobby.games[id];
            const otherId = game.getOtherId(id);
            io.to(otherId).emit('opponent-declined-draw');
        });
        socket.on('decline-rematch', (id: string) => {
            const game = lobby.games[id];
            const otherId = game.getOtherId(id);
            io.to(otherId).emit('opponent-declined-rematch');
        })
    })
}

export default setupSocket;