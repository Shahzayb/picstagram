import { pageSize } from '../config/env';

export const getUserPhoto = async (username, page) => {
  const url = `/api/user/${username}/photo?page=${page}&size=${pageSize}`;

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

export const likePhoto = async (photoId) => {
  const jwtToken = localStorage.getItem('token') || '';
  const url = `/api/photo/${photoId}/like`;

  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
  });
  if (response.ok) {
    return response;
  } else {
    return Promise.reject(response);
  }
};
export const unlikePhoto = async (photoId) => {
  const jwtToken = localStorage.getItem('token') || '';
  const url = `/api/photo/${photoId}/unlike`;

  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
  });
  if (response.ok) {
    return response;
  } else {
    return Promise.reject(response);
  }
};

export const getPhotoById = async (photoId) => {
  const jwtToken = localStorage.getItem('token') || '';
  const url = `/api/photo/${photoId}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${jwtToken}`,
      'Content-Type': 'application/json',
    },
  });
  if (response.ok) {
    return response.json();
  } else {
    return Promise.reject(response);
  }
};

export const deletePhoto = async (photoId) => {
  const jwtToken = localStorage.getItem('token') || '';
  const url = `/api/photo/${photoId}`;

  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${jwtToken}`,
      'Content-Type': 'application/json',
    },
  });
  if (response.ok) {
    return response.json();
  } else {
    return Promise.reject(response);
  }
};
