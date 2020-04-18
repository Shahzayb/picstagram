import { pageSize } from '../config/env';

export const getTimeline = async (page) => {
  const jwtToken = localStorage.getItem('token') || '';
  const url = `/api/timeline?page=${page}&size=${pageSize}`;

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
