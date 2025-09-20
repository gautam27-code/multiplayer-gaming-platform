import { API_BASE_URL } from './config';

interface FetchOptions extends RequestInit {
  token?: string;
}

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function fetchApi<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { token, ...fetchOptions } = options;
  
  const headers = new Headers({
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  });

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(response.status, data.message || 'Something went wrong');
  }

  return data;
}

// Auth API calls
export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    fetchApi('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  register: (userData: { username: string; email: string; password: string }) =>
    fetchApi('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  getProfile: (token: string) =>
    fetchApi('/auth/profile', { token }),

  updateStatus: (token: string, isOnline: boolean) =>
    fetchApi('/auth/status', {
      method: 'PUT',
      token,
      body: JSON.stringify({ isOnline }),
    }),
};

// User API calls
export const userApi = {
  getProfile: (token: string, userId: string) =>
    fetchApi(`/users/profile/${userId}`, { token }),

  updateStats: (token: string, result: 'win' | 'loss' | 'tie') =>
    fetchApi('/users/stats', {
      method: 'PUT',
      token,
      body: JSON.stringify({ result }),
    }),

  sendFriendRequest: (token: string, friendId: string) =>
    fetchApi('/users/friends/request', {
      method: 'POST',
      token,
      body: JSON.stringify({ friendId }),
    }),

  handleFriendRequest: (
    token: string,
    requestId: string,
    action: 'accept' | 'reject'
  ) =>
    fetchApi('/users/friends/request', {
      method: 'PUT',
      token,
      body: JSON.stringify({ requestId, action }),
    }),

  getFriends: (token: string) =>
    fetchApi('/users/friends', { token }),

  getLeaderboard: (token: string) =>
    fetchApi('/users/leaderboard', { token }),
};

// Game API calls
export const gameApi = {
  createRoom: (token: string, data: { name: string; type: string }) =>
    fetchApi('/games/rooms', {
      method: 'POST',
      token,
      body: JSON.stringify(data),
    }),

  getAvailableRooms: (token: string) =>
    fetchApi('/games/rooms', { token }),

  joinRoom: (token: string, roomCode: string) =>
    fetchApi(`/games/rooms/${roomCode}/join`, {
      method: 'POST',
      token,
    }),

  getGameState: (token: string, gameId: string) =>
    fetchApi(`/games/${gameId}`, { token }),

  makeMove: (token: string, gameId: string, position: any) =>
    fetchApi(`/games/${gameId}/move`, {
      method: 'POST',
      token,
      body: JSON.stringify({ position }),
    }),

  setPlayerReady: (token: string, gameId: string) =>
    fetchApi(`/games/${gameId}/ready`, {
      method: 'PUT',
      token,
    }),
};