import {checkToken, login, register} from "../../../api/auth/auth";

const defaultState = () => ({
    username: '',
    password: '',
    certificate: '',
});

const state = {
    ...defaultState()
};

const getters = {};

const actions = {
    SET_DOMAIN_ID: (context, domainId) => {
        context.commit('SET_DOMAIN_ID', domainId);
    },

    SET_PROPERTY: (context, {prop, value}) => {
        context.commit('SET_PROPERTY', {prop, value});
    },

    LOGIN: async () => {
        await login({
            username: state.username,
            password: state.password,
        });
    },

    REGISTER: async () => {
        await register({
            username: state.username,
            password: state.password,
            certificate: state.certificate
        });
    },

    CHECK_TOKEN: async () => {
        await checkToken();
    },

    RESET_STATE: (context) => {
        context.commit('RESET_STATE');
    },
};

const mutations = {
    SET_DOMAIN_ID: (state, domainId) => {
        state.domainId = domainId;
    },

    SET_PROPERTY: (state, {prop, value}) => {
        state[prop] = value;
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
