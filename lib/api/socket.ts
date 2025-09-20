import { io, Socket as SocketIOClient } from 'socket.io-client';
import { API_BASE_URL } from './config';

interface ServerToClientEvents {
  'game-update': (gameState: any) => void;
  'game-over': (data: { winner: string; game: any }) => void;
  'player-ready-update': (data: { playerId: string; game: any }) => void;
  'game-start': (gameState: any) => void;
  'player-disconnected': (data: { playerId: string; game: any }) => void;
  error: (error: { message: string }) => void;
  connect: () => void;
  disconnect: () => void;
}

interface ClientToServerEvents {
  'join-game': (gameId: string) => void;
  'leave-game': (gameId: string) => void;
  'make-move': (data: { gameId: string; position: any }) => void;
  'player-ready': (gameId: string) => void;
}

type GameSocket = ReturnType<typeof io> & {
  gameId?: string;
};

let socket: GameSocket | null = null;

export const initializeSocket = (token: string): GameSocket => {
  if (!socket) {
    socket = io(API_BASE_URL.replace('/api', ''), {
      auth: { token },
      transports: ['websocket'],
    }) as GameSocket;

    // Socket event listeners
    socket.on('connect', () => {
      console.log('Connected to game server');
    });

    socket.on('error', (error: { message: string }) => {
      console.error('Socket error:', error);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from game server');
    });
  }
  return socket;
};

export const joinGameRoom = (gameId: string) => {
  if (socket) {
    socket.gameId = gameId;
    socket.emit('join-game', gameId);
  }
};

export const leaveGameRoom = () => {
  if (socket && socket.gameId) {
    socket.emit('leave-game', socket.gameId);
    socket.gameId = undefined;
  }
};

export const makeMove = (position: any) => {
  if (socket && socket.gameId) {
    socket.emit('make-move', {
      gameId: socket.gameId,
      position,
    });
  }
};

export const setPlayerReady = () => {
  if (socket && socket.gameId) {
    socket.emit('player-ready', socket.gameId);
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export default {
  initializeSocket,
  joinGameRoom,
  leaveGameRoom,
  makeMove,
  setPlayerReady,
  disconnectSocket,
};