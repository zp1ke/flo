export const isAuth = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const token = localStorage.getItem('auth-token');
    resolve(!token);
  });
};
