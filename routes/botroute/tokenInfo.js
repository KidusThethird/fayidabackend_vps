// Use a Map to dynamically store user-specific tokens
const tokenStore = new Map();

module.exports = {
  // Add or update a user's token
  setToken: (userId, token) => {
    tokenStore.set(userId, token);
  },

  // Get a user's token
  getToken: (userId) => {
    return tokenStore.get(userId);
  },

  // Delete a user's token
  deleteToken: (userId) => {
    tokenStore.delete(userId);
  },

  // Check if a token exists for a user
  hasToken: (userId) => {
    return tokenStore.has(userId);
  },

  // Get all tokens (optional, for debugging)
  getAllTokens: () => {
    return Array.from(tokenStore.entries());
  },
};
