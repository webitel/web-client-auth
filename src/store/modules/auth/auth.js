import querystring from 'querystring';
import { StatusCodes } from 'http-status-codes';

import AuthAPI from '../../../api/auth/auth';
import router from '../../../router/router';

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
  newPassword: '',
  sessionId: '', // it's necessary for two-factor authentication
  isExpiredPassword: false,
  reasonExpiredPassword: '', // 'expired' | 'temporary' | ''
};

const getters = {};

const actions = {
  SUBMIT_AUTH: async (context, action) => {
    let accessToken;

    switch (action) {
      case 'login':
        accessToken = await context.dispatch(
          context.state.sessionId ? 'LOGIN_2FA' : 'LOGIN',
        );
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
    try {
      return await AuthAPI.login({
        username:  context.state.username,
        password: context.state.password,
        domain: context.state.domain,
      });
    } catch (error) {
      await context.dispatch('HANDLE_PASSWORD_EXPIRATION_ERROR', { error });
      throw error;
    }
  },

  REGISTER: (context) => {
    return AuthAPI.register({
      username: context.state.username,
      password: context.state.password,
      certificate: context.state.certificate,
      domain: context.state.domain,
    });
  },

  LOGIN_2FA: async (context) => {
    try {
      return await AuthAPI.login2fa({
        id: context.state.sessionId,
        totp: context.state.totp,
      });
    } catch (error) {
      await context.dispatch('HANDLE_PASSWORD_EXPIRATION_ERROR', { error });
    }
  },

  GET_2FA_SESSION_ID: async (context) => {
    try {
      const { id } = await AuthAPI.login({
        username: context.state.username,
        password: context.state.password,
        domain: context.state.domain,
      });

      if (id) {
        await context.dispatch('SET_PROPERTY', { prop: 'sessionId', value: id });
      }
    } finally {
      await context.dispatch('CLEAR_EXPIRED_PASSWORD_FIELDS');
    }
  },

  CHANGE_PASSWORD: async (context) => {
    await AuthAPI.changePassword({
      confirm_password: context.state.confirmPassword,
      domain: context.state.domain,
      old_password: context.state.password,
      user_password: context.state.newPassword,
      username: context.state.username,
    });
    await context.dispatch('SET_PROPERTY', { prop: 'password', value: context.state.newPassword } );
  },

  UPDATE_EXPIRED_PASSWORD_FIELDS: async (context, { id }) => {
    const reason = id.includes('expired') ? 'expired' : 'temporary';
    await context.dispatch('SET_PROPERTY', { prop: 'isExpiredPassword', value: true });
    await context.dispatch('SET_PROPERTY', { prop: 'reasonExpiredPassword', value: reason });
  },

  CLEAR_EXPIRED_PASSWORD_FIELDS: async (context) => {
    if(context.state.isExpiredPassword) {
      await context.dispatch('SET_PROPERTY', { prop: 'isExpiredPassword', value: false });
      await context.dispatch('SET_PROPERTY', { prop: 'reasonExpiredPassword', value: '' });
    }
  },

  HANDLE_PASSWORD_EXPIRATION_ERROR: async (context, { error }) => {
    if (error.code === StatusCodes.PRECONDITION_FAILED // 412 error code
      && (error.id === 'app.password.force_change' ||
        error.id === 'app.password.expired')) {
      await context.dispatch('UPDATE_EXPIRED_PASSWORD_FIELDS', { id: error.id });
    } else {
      await context.dispatch('CLEAR_EXPIRED_PASSWORD_FIELDS');
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
    let url;
    try {
      await context.dispatch('CACHE_USER_DATA');

      const redirectTo = router.currentRoute.value.query?.redirectTo;

      const redirect = redirectTo
        ? decodeURIComponent(redirectTo)
        : import.meta.env.VITE_START_PAGE_URL;

      if (typeof redirect === 'undefined' || typeof accessToken === 'undefined') {
        throw new Error(
          `No redirect (${redirect}) or access token (${accessToken}) provided`
        );
      }

      url = redirect.includes('?')
        ? `${redirect}&accessToken=${accessToken}`
        : `${redirect}?accessToken=${accessToken}`;

    } finally {
      if (!import.meta.env.DEV) window.location.href = url;
    }
  },

  CACHE_USER_DATA: (context) => {
    if (context.state.domain)
      localStorage.setItem('auth/domain', context.state.domain);
  },

  CHECK_DOMAIN: async (context, domain = context.state.domain) => {
    const response = await AuthAPI.checkDomainExistence(domain);
    const { federation = {}, enabledTfa } = response;
    context.commit('SET_SERVICE_PROVIDERS', federation);
    await context.dispatch('SET_PROPERTY', {
      prop: 'enabledTfa',
      value: enabledTfa,
    });
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
