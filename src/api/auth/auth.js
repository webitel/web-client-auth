import instance from '../instance';

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
        await login({username: credentials.username, password: credentials.password});
    } catch (err) {
        throw err;
    }
};

export const checkToken = async () => {
    const url = '/userinfo';

    try {
        await instance.get(url);
        postToken();
    } catch (err) {
        clearToken();
        throw err;
    }
};

const clearToken = () => {
    localStorage.removeItem('access-token');
    localStorage.removeItem('domain');
    instance.defaults.headers['X-Webitel-Access'] = '';
};

const postToken = () => {
    const accessToken = localStorage.getItem('access-token');
    const messageData = {accessToken};
    parent.postMessage(messageData, '*'); // targetOrigin default: '/'
};
