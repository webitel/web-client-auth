import { createStore } from 'vuex';

import appearance from './modules/appearance/appearance';
import auth from './modules/auth/auth';

export default createStore({
	strict: true,
	modules: {
		auth,
		appearance,
	},
});
