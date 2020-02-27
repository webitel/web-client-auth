import instance from '../instance';

export const login = async (credentials) => {
    const url = '/login';

    try {
        const response = await instance.post(url, credentials);
        // localStorage.setItem('access-token', response.authorization.accessToken);
        const messageData = { accessToken: response.accessToken };
        parent.postMessage(messageData); // targetOrigin default: '/'
    } catch (error) {
        throw error;
    }
};

export const register = async (credentials) => {
    const url = '/signup';

    try {
        await instance.post(url, credentials);
        await login({username: credentials.username, password: credentials.password});
    } catch (error) {
        throw error;
    }
};
