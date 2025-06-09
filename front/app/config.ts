export default {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1',
  refreshUserMilliseconds: import.meta.env.VITE_REFRESH_USER_EVERY_MS || 1000 * 60 * 60,
};
