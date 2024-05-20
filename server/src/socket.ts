import { Server, Socket } from 'socket.io';
import { Lobby } from './index';
import type http from 'http';
import type { Move } from 'chess.js';
import type { User } from './game';
import type { Chat } from './lobby';

export type MoveType = Move;

export type ServerToClientSocketEventTypes = {
    'no-game-found': () => void;
    'game-recieved': (opponent: User, side: 'white' | 'black') => void;
    'opponent-resigned': () => void;
    'opponent-flagged': () => void;
    'game-found': (players: { white: User, black: User }) => void;
    'update-board': (fen: string, turn: 'black' | 'white') => void;
    'find-game-pending': () => void;
    'find-game-cancelled': () => void;
    'global-chat': (chat: Chat) => void;
    'opponent-sent-chat': (chat: Chat) => void;
}

export type ClientToServerSocketEventTypes = {
    'game-requested': () => void;
    'flagged': () => void;
    'move': (move: Move) => void;
    'resign': () => void;
    'game-chat': (chat: Chat) => void;
    'leave': () => void;
    'find-game': (user: User) => void;
    'global-chat': (chat: Chat) => void;
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
            socket.broadcast.emit('global-chat', chat);
        })
        socket.on('find-game', (user: User) => {
            const status = lobby.queueUser(user, socket.id);
            if (status === 'found') {
                const game = lobby.games[socket.id];
                if (!game) return;
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
        socket.on('game-requested', () => {
            const game = lobby.games[socket.id];
            if (game) {
                const side = game.white.id === socket.id ? 'white' : 'black';
                const opponent = side === 'white' ? game.black : game.white;
                socket.emit('game-recieved', opponent, side);
            } else {
                socket.emit('no-game-found');
            }
        });
        socket.on('move', (move: MoveType) => {
            const game = lobby.games[socket.id];
            if (game) {
                game.move(socket.id, move);
                const otherId = game.getOtherId(socket.id);
                io.to(socket.id).to(otherId).emit('update-board', game.chess.fen(), game.turn);
            }
        });
        socket.on('resign', () => {
            const game = lobby.games[socket.id];
            if (game) {
                const otherId = game.getOtherId(socket.id);
                io.to(otherId).emit('opponent-resigned');
                lobby.deleteGame(socket.id, otherId);
            }
        });
        socket.on('game-chat', (chat: Chat) => {
            const game = lobby.games[socket.id];
            if (game) {
                const otherId = game.getOtherId(socket.id);
                io.to(otherId).emit('opponent-sent-chat', chat);
            }
        });
        socket.on('leave', () => {
            const game = lobby.games[socket.id];
            if (!game) return;
            const otherId = game.getOtherId(socket.id);
            io.to(otherId).emit('opponent-resigned');
            lobby.deleteGame(socket.id, otherId);
        });
    })
}

export default setupSocket;