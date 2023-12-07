import { createStore } from 'vuex';
import auth from './modules/auth/auth';
import appearance from './modules/appearance/appearance';

export default createStore({
  strict: true,
  modules: {
    auth,
    appearance,
  },
});
