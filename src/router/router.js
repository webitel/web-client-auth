import Vue from 'vue';
import Router from 'vue-router';
import auth from '../components/auth/the-auth';

Vue.use(Router);

const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    scrollBehavior(to, from, savedPosition) {
        return {x: 0, y: 0}
    },
    routes: [
        {
            path: '/auth',
            name: 'auth',
            component: auth,
        },
    ],
});

export default router;
