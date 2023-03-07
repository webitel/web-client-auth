import { createStore } from 'vuex';
import auth from './modules/auth/auth';

export default createStore({
  strict: true,
  modules: {
    auth,
  },
});
