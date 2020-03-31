export const getSignature = async title => {
  const jwtToken = localStorage.getItem('token') || '';
  const url = `/api/cloudinary/signature?title=${title}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwtToken}`
    }
  });
  if (response.ok) {
    return response.json();
  } else {
    return Promise.reject(response);
  }
};

export const uploadImage = async (image, sig) => {
  const formData = new FormData();

  formData.append('file', image);
  formData.append('folder', sig.folder);
  formData.append('signature', sig.signature);
  formData.append('timestamp', sig.timestamp);
  formData.append('api_key', sig.api_key);
  formData.append('public_id', sig.public_id);
  formData.append('upload_preset', sig.upload_preset);
  formData.append('context', sig.context);

  const response = await fetch(
    'https://api.cloudinary.com/v1_1/shahzayb/image/upload',
    {
      method: 'POST',
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: formData
    }
  );
  if (response.ok) {
    return response.json();
  } else {
    return Promise.reject(response);
  }
};
