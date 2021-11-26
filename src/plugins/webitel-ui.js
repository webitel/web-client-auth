import Vue from 'vue';
import WebitelUI from '@webitel/ui-sdk/dist/ui-sdk.common';
// locales
import WebitelUIEn from '@webitel/ui-sdk/src/locale/en/en';
import WebitelUIRu from '@webitel/ui-sdk/src/locale/ru/ru';
import WebitelUIUa from '@webitel/ui-sdk/src/locale/ua/ua';
//eventBus
import eventBus from '@webitel/ui-sdk/src/scripts/eventBus';
import i18n from '../locale/i18n';
//styles
import '@webitel/ui-sdk/dist/ui-sdk.css';
// import scss variables and other reusables
import '@webitel/ui-sdk/src/css/main.scss';

import '@webitel/ui-sdk/dist/img/sprite';

const globals = {
    $baseURL: process.env.BASE_URL,
};

Vue.use(WebitelUI, { eventBus, globals });
// add plugin locales to main i18n
i18n.mergeLocaleMessage('en', WebitelUIEn);
i18n.mergeLocaleMessage('ru', WebitelUIRu);
i18n.mergeLocaleMessage('ua', WebitelUIUa);

