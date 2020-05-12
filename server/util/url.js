exports.getPasswordResetURL = (userId, token) => {
  return `${process.env.CLIENT_BASE_URL}/reset-password/${userId}?token=${token}`;
};
