import Vue from 'vue';
import WebitelUI from '@webitel/ui-sdk/dist/ui-sdk.common'
// locales
import WebitelUIEn from '@webitel/ui-sdk/src/locale/en/en';
import WebitelUIRu from '@webitel/ui-sdk/src/locale/ru/ru/';
import WebitelUIUa from '@webitel/ui-sdk/src/locale/ua/ua';
import i18n from '../locale/i18n';
//eventBus
import eventBus from '../utils/eventBus';
//styles
import '@webitel/ui-sdk/dist/ui-sdk.css';

const globals = {
  $baseURL: process.env.BASE_URL,
};

Vue.use(WebitelUI,{eventBus, globals})
// add plugin locales to main i18n
i18n.mergeLocaleMessage('en', WebitelUIEn);
i18n.mergeLocaleMessage('ru', WebitelUIRu);
i18n.mergeLocaleMessage('ua', WebitelUIUa);

