import instance, { config } from '../instance';
import { ApiLoginResponse } from '@webitel/api-services/gen/models';
export const login = async (credentials) => {
  const url = '/login';

  try {
    const response: AxiosResponse<ApiLoginResponse> = await instance.post(url, credentials)

    // [https://webitel.atlassian.net/browse/WTEL-3405]
    // If two-factor authentication is enabled,
    // API returns the two-factor authentication session ID instead of a token
    // and saving to localStorage is not needed

    if (response.accessToken) {
      localStorage.setItem('access-token', response.accessToken);
      return postToken();
    }
    return response;
  } catch (err) {
    throw err;
  }
};

export const login2fa = async (credentials) => {
  const url = '/login/2fa';
  try {
    const response: AxiosResponse<ApiLoginResponse>  = await instance.post(url, credentials);

    if(response?.accessToken) {
      localStorage.setItem('access-token', response.accessToken);
      return postToken();
    }
  } catch (err) {
    throw err;
  }
};

export const changePassword = async (data) => {
  const url = '/users/password';
  try {
    await instance.put(url, data);
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
    return postToken();
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
      instance.defaults.headers['X-Webitel-Access'] =
        localStorage.getItem('access-token') || '';
    } catch (err) {
      console.error(err);
    }
  }
};

const checkCurrentSession = async () => {
  try {
    config.silent = true;

    const token = localStorage.getItem('access-token');
    if (!token || token === 'undefined') {
      clearToken();
      console.info(
        'No valid access-token in localStorage present at checkCurrentSession',
      );
    }

    await checkSessionByCookies();
    const accessToken = await checkSessionByToken();
    return accessToken;
  } catch (err) {
    throw err;
  } finally {
    config.silent = false;
  }
};

const clearToken = () => {
  localStorage.removeItem('access-token');
  instance.defaults.headers['X-Webitel-Access'] = '';
};

const postToken = () => {
  const accessToken = localStorage.getItem('access-token');
  return accessToken;
};

const checkDomainExistence = async (domain) => {
  const baseUrl = '/login';
  const url = `${baseUrl}?domain=${domain}`;
  try {
    return await instance.get(url);
  } catch (err) {
    throw err;
  }
};

const AuthAPI = {
  login,
  login2fa,
  register,
  changePassword,
  checkCurrentSession,
  checkDomainExistence,
};

export default AuthAPI;
