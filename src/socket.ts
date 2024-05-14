import { Socket, io } from 'socket.io-client';
import { ClientToServerSocketEventTypes, ServerToClientSocketEventTypes } from './server/src/socket';

const URL = process.env.NODE_ENV === 'production' ? window.location.toString() : 'http://localhost:8080';

export const socket: Socket<ServerToClientSocketEventTypes, ClientToServerSocketEventTypes> = io(URL);