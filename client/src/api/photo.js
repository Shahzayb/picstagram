import { pageSize } from '../config/env';

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

export const postComment = async (photoId, comment) => {
  const jwtToken = localStorage.getItem('token') || '';
  const url = `/api/photo/${photoId}/comment`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${jwtToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ comment }),
  });
  if (response.ok) {
    return response;
  } else {
    return Promise.reject(response);
  }
};

export const getComments = async (photoId, page) => {
  const url = `/api/photo/${photoId}/comment?page=${page}&size=${pageSize}`;

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
