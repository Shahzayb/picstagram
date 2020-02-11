import { serverBaseUrl } from '../config/env';

export const getMyProfile = async jwtToken => {
  const url = serverBaseUrl + '/api/user';
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwtToken}`
    }
  });
  if (response.ok) {
    return await response.json();
  } else {
    Promise.reject(response);
  }
};

export const loginUser = async credentials => {
  const url = serverBaseUrl + '/api/user/login';

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  });
  if (response.ok) {
    return response.json();
  } else {
    return Promise.reject(response);
  }
};

export const postUser = async user => {
  const url = serverBaseUrl + '/api/user';

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  });
  if (response.ok) {
    return response.json();
  } else {
    return Promise.reject(response);
  }
};
