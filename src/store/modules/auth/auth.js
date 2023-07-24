import AuthAPI from "../../../api/auth/auth";

const defaultState = () => ({
    username: '',
    password: '',
    certificate: '',
    domain: '',
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
