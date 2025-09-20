import { io, Socket as SocketIOClient } from 'socket.io-client';
import { API_BASE_URL } from './config';

interface GameState {
  id: string;
  board: Array<string | null>;
  currentTurn: string;
  players: {
    [key: string]: {
      id: string;
      ready: boolean;
      symbol: 'X' | 'O';
    };
  };
  status: 'waiting' | 'ready' | 'in-progress' | 'finished';
  winner?: string;
}

interface GameMove {
  row: number;
  col: number;
}

interface ServerToClientEvents {
  'game-update': (gameState: GameState) => void;
  'game-over': (data: { winner: string; game: GameState }) => void;
  'player-ready-update': (data: { playerId: string; game: GameState }) => void;
  'game-start': (gameState: GameState) => void;
  'player-disconnected': (data: { playerId: string; game: GameState }) => void;
  error: (error: { message: string }) => void;
  connect: () => void;
  disconnect: () => void;
}

interface ClientToServerEvents {
  'join-game': (gameId: string) => void;
  'leave-game': (gameId: string) => void;
  'make-move': (data: { gameId: string; position: GameMove }) => void;
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

export const makeMove = (position: GameMove) => {
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