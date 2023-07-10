import AuthAPI from "../../../api/auth/auth";
import ServiceProvider from "../../../enums/ServiceProvider.enum";

const defaultState = () => ({
    username: '',
    password: '',
    domain: '',
    certificate: '',
});

const state = {
    ...defaultState(),
    loginProviders: {},
};

const getters = {};

const actions = {
    SET_PROPERTY: (context, { prop, value }) => {
        context.commit('SET_PROPERTY', { prop, value });
    },

    LOGIN: () => {
        return AuthAPI.login({
            username: state.username,
            password: state.password,
            domain: state.domain,
        });
    },

    REGISTER: () => {
        return AuthAPI.register({
            username: state.username,
            password: state.password,
            domain: state.domain,
            certificate: state.certificate,
        });
    },

    LOAD_SERVICE_PROVIDERS: async (context) => {
        ///const domain = context.state.username.split('@').pop();
        const domain = context.state.domain;
        const response = await AuthAPI.loadServiceProviders({ domain });
        const { federation = {} } = response;
        context.commit('SET_SERVICE_PROVIDERS', federation);
    },

    CHECK_CURRENT_SESSION: () => {
        return AuthAPI.checkCurrentSession();
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
        state.loginProviders = { ...state.loginProviders, ...providers };
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
