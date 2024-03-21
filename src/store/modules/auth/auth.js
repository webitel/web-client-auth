import qs from 'qs';
import router from '../../../router/router';
import AuthAPI from '../../../api/auth/auth';

const defaultState = () => ({
  username: localStorage.getItem('username') || '',
  password: localStorage.getItem('password') || '',
  certificate: '',
  confirmPassword: '',
  domain: localStorage.getItem('domain') || '',
});

const state = {
  ...defaultState(),
  rememberCredentials: localStorage.getItem('rememberCredentials') === 'true',
  loginProviders: {},
};

const getters = {};

const actions = {
  SUBMIT_AUTH: async (context, action) => {
    let accessToken;
    switch (action) {
      case 'login':
        accessToken = await context.dispatch('LOGIN');
        break;
      case 'register':
        accessToken = await context.dispatch('REGISTER');
        break;
      default:
        throw new Error(`Invalid action: ${action}`);
    }

    return context.dispatch('ON_AUTH_SUCCESS', { accessToken });
  },

  LOGIN: (context) => {
    return AuthAPI.login({
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

  LOAD_SERVICE_PROVIDERS: async (context) => {
    const domain = context.state.domain;
    const response = await AuthAPI.loadServiceProviders({ domain });
    const { federation = {} } = response;
    context.commit('SET_SERVICE_PROVIDERS', federation);
  },

  EXECUTE_PROVIDER: (context, { ticket }) => {
    const baseUrl = `${import.meta.env.VITE_API_URL}/login`;
    const query = {
      redirect_uri: window.location.href,
    };
    const url = `${baseUrl}${ticket}?${qs.stringify(query)}`;
    window.location.href = url;
  },

  CHECK_CURRENT_SESSION: async (context) => {
    const accessToken = await AuthAPI.checkCurrentSession();
    return context.dispatch('ON_AUTH_SUCCESS', { accessToken });
  },

  ON_AUTH_SUCCESS: async (context, { accessToken }) => {
    await context.dispatch('CACHE_USER_DATA');

    const redirect = router.currentRoute.query?.redirectTo || import.meta.env.VITE_START_PAGE_URL;
    const url = `${redirect}?accessToken=${accessToken}`;
    window.location.href = url;
  },

  CACHE_USER_DATA: (context) => {
    if (context.state.domain) localStorage.setItem('domain', context.state.domain);
    if (context.state.rememberCredentials) {
      if (context.state.username) localStorage.setItem('username', context.state.username);
      if (context.state.password) localStorage.setItem('password', context.state.password);
      localStorage.setItem('rememberCredentials', 'true');
    }
  },

  CHECK_DOMAIN: (context, domain = context.state.domain) => {
    return AuthAPI.checkDomainExistence(domain);
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
