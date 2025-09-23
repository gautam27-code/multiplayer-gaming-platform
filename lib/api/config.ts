export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const API_ROUTES = {
  // Auth routes
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  PROFILE: '/auth/profile',
  UPDATE_STATUS: '/auth/status',

  // User routes
  USER_PROFILE: (id: string) => `/users/profile/${id}`,
  USER_STATS: '/users/stats',
  FRIENDS_REQUEST: '/users/friends/request',
  FRIENDS_LIST: '/users/friends',
  LEADERBOARD: '/users/leaderboard',

  // Game routes
  CREATE_ROOM: '/games/rooms',
  GET_ROOMS: '/games/rooms',
  JOIN_ROOM: (roomCode: string) => `/games/rooms/${roomCode}/join`,
  GAME_STATE: (gameId: string) => `/games/${gameId}`,
  MAKE_MOVE: (gameId: string) => `/games/${gameId}/move`,
  PLAYER_READY: (gameId: string) => `/games/${gameId}/ready`,
  // Single-player
  CREATE_SINGLE: '/games/single-player',
};
