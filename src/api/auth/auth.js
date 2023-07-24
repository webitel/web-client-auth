import instance, { config } from '../instance';

export const login = async (credentials) => {
  const url = '/login';

  try {
    const response = await instance.post(url, credentials);
    localStorage.setItem('access-token', response.accessToken);
    postToken();
  } catch (err) {
    throw err;
  }
};

export const register = async (credentials) => {
  const url = '/signup';

  try {
    await instance.post(url, credentials);
    await login({
      username: credentials.username,
      password: credentials.password,
      domain: credentials.domain,
    });
  } catch (err) {
    throw err;
  }
};

const checkSessionByToken = async () => {
  const url = '/userinfo';

  try {
    await instance.get(url);
    postToken();
  } catch (err) {
    clearToken();
    throw err;
  }
};

const checkSessionByCookies = async () => {
  const url = '/login';

  /* OAUTH CHECK, IF THIS USER IS AUTHENTICATED AND HAS COOKIES */
  const accessToken = localStorage.getItem('access-token');
  if (!accessToken) {
    try {
      const response = await instance.get(url, { withCredentials: true });
      localStorage.setItem('access-token', response.accessToken);
      instance.defaults.headers['X-Webitel-Access'] = localStorage.getItem('access-token') ||
        '';
    } catch (err) {
      console.error(err);
    }
  }
};

const checkCurrentSession = async () => {
  try {
    config.silent = true;
    await checkSessionByCookies();
    await checkSessionByToken();
  } catch {} finally {
    config.silent = false;
  }
};

const loadServiceProviders = async ({ domain }) => {
  const baseUrl = '/login';
  const url = `${baseUrl}?domain=${domain}`;
  const response = await instance.get(url);
  return response;
};

const clearToken = () => {
  localStorage.removeItem('access-token');
  localStorage.removeItem('domain');
  instance.defaults.headers['X-Webitel-Access'] = '';
};

const postToken = () => {
  const accessToken = localStorage.getItem('access-token');
  const messageData = { accessToken };
  parent.postMessage(messageData, '*'); // targetOrigin default: '/'
};

const AuthAPI = {
  login,
  register,
  checkCurrentSession,
  loadServiceProviders,
};

export default AuthAPI;
