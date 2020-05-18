import { pageSize } from '../config/env';

export const getMyProfile = async () => {
  const jwtToken = localStorage.getItem('token') || '';
  if (!jwtToken) {
    return Promise.reject();
  }
  const url = '/api/user';
  return fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwtToken}`,
    },
  }).then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      return Promise.reject(response);
    }
  });
};

export const loginUser = async (credentials) => {
  const url = '/api/user/login';

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  if (response.ok) {
    return response.json();
  } else {
    return Promise.reject(response);
  }
};

export async function forgotPassword(email) {
  const url = '/api/user/forgot-password';

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });
  if (response.ok) {
    return response.json();
  } else {
    return Promise.reject(response);
  }
}

export async function resetPassword(password, userId, query) {
  const url = `/api/user/${userId}/reset-password${query}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ password }),
  });
  if (response.ok) {
    return response.json();
  } else {
    return Promise.reject(response);
  }
}

export const postUser = async (user) => {
  const url = '/api/user';

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });
  if (response.ok) {
    return response.json();
  } else {
    return Promise.reject(response);
  }
};

export const getProfile = async (username) => {
  const url = `/api/user/${username}`;
  const jwtToken = localStorage.getItem('token') || '';

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwtToken}`,
    },
  });
  if (response.ok) {
    return response.json();
  } else {
    return Promise.reject(response);
  }
};

export const getUserFollower = async (username, page) => {
  const url = `/api/user/${username}/follower?page=${page}&size=${pageSize}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (response.ok) {
    return response.json();
  } else {
    return Promise.reject(response);
  }
};

export const getUserFollowing = async (username, page) => {
  const url = `/api/user/${username}/following?page=${page}&size=${pageSize}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (response.ok) {
    return response.json();
  } else {
    return Promise.reject(response);
  }
};

export const followUser = async (username) => {
  const jwtToken = localStorage.getItem('token') || '';
  const url = `/api/user/${username}/follow`;

  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwtToken}`,
    },
  });
  if (response.ok) {
    return Promise.resolve();
  } else {
    return Promise.reject(response);
  }
};

export const unfollowUser = async (username) => {
  const jwtToken = localStorage.getItem('token') || '';
  const url = `/api/user/${username}/unfollow`;

  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwtToken}`,
    },
  });
  if (response.ok) {
    return Promise.resolve();
  } else {
    return Promise.reject(response);
  }
};

export const getUserSuggestions = async (username) => {
  const jwtToken = localStorage.getItem('token') || '';
  const url = `/api/user/${username}/suggestion`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwtToken}`,
    },
  });
  if (response.ok) {
    return response.json();
  } else {
    return Promise.reject(response);
  }
};
