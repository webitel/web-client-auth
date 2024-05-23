import querystring from 'querystring';
import router from '../../../router/router';
import AuthAPI from '../../../api/auth/auth';

const defaultState = () => ({
  username: localStorage.getItem('auth/username') || '',
  password: localStorage.getItem('auth/password') || '',
  certificate: '',
  confirmPassword: '',
  domain: localStorage.getItem('auth/domain') || '',
});

const state = {
  ...defaultState(),
  loginProviders: {},
  enabledTfa: false,
  totp: '',
  sessionId: '', // it's necessary for two-factor authentication
};

const getters = {};

const actions = {
  SUBMIT_AUTH: async (context, action) => {
    let accessToken;

    switch (action) {
      case 'login':
        accessToken = await context.dispatch(context.state.sessionId ? 'LOGIN_2FA' : 'LOGIN');
        break;
      case 'register':
        accessToken = await context.dispatch('REGISTER');
        break;
      default:
        throw new Error(`Invalid action: ${action}`);
    }

    return context.dispatch('ON_AUTH_SUCCESS', { accessToken });
  },

  LOGIN: async (context) => {
    return await AuthAPI.login({
      username: context.state.username,
      password: context.state.password,
      domain: context.state.domain,
    });
  },

  REGISTER: (context) => {
    return AuthAPI.register({
      username: context.state.username,
      password: context.state.password,
      certificate: context.state.certificate,
      domain: context.state.domain,
    });
  },

  LOGIN_2FA: (context) => {
    return AuthAPI.login2fa({
      id: context.state.sessionId,
      totp: context.state.totp,
    })
  },

  GET_2FA_SESSION_ID: async (context) => {
    const { id } = await AuthAPI.login({
      username: context.state.username,
      password: context.state.password,
      domain: context.state.domain,
    });

    if(id) {
      await context.dispatch('SET_PROPERTY', { prop: 'sessionId', value: id });
    }
  },

  EXECUTE_PROVIDER: (context, { ticket }) => {
    const baseUrl = `${import.meta.env.VITE_API_URL}/login`;
    const query = {
      redirect_uri: window.location.href,
    };
    const url = `${baseUrl}${ticket}?${querystring.stringify(query)}`;
    window.location.href = url;
  },

  CHECK_CURRENT_SESSION: async (context) => {
    const accessToken = await AuthAPI.checkCurrentSession();
    return context.dispatch('ON_AUTH_SUCCESS', { accessToken });
  },

  ON_AUTH_SUCCESS: async (context, { accessToken }) => {
    await context.dispatch('CACHE_USER_DATA');

    const redirectTo = router.currentRoute.value.query?.redirectTo;
    const redirect = redirectTo
      ? decodeURIComponent(redirectTo)
      : import.meta.env.VITE_START_PAGE_URL;

    if (redirect === 'undefined' || accessToken === 'undefined') {
      throw new Error(`No redirect (${redirect}) or access token (${accessToken}) provided`);
    }

    const url = redirect.includes('?')
      ? `${redirect}&accessToken=${accessToken}`
      : `${redirect}?accessToken=${accessToken}`;
    window.location.href = url;
  },

  CACHE_USER_DATA: (context) => {
    if (context.state.domain) localStorage.setItem('auth/domain', context.state.domain);
  },

  CHECK_DOMAIN: async (context, domain = context.state.domain) => {
    const response = await AuthAPI.checkDomainExistence(domain);
    const { federation = {}, enabledTfa } = response;
    context.commit('SET_SERVICE_PROVIDERS', federation);
    await context.dispatch('SET_PROPERTY', { prop: 'enabledTfa', value: enabledTfa });
  },

  SET_PROPERTY: (context, { prop, value }) => {
    context.commit('SET_PROPERTY', { prop, value });
  },

  RESET_STATE: (context) => {
    context.commit('RESET_STATE');
  },
};

const mutations = {
  SET_PROPERTY: (state, { prop, value }) => {
    state[prop] = value;
  },
  SET_SERVICE_PROVIDERS: (state, providers) => {
    state.loginProviders = providers;
  },
  RESET_STATE: (state) => {
    Object.assign(state, defaultState());
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
