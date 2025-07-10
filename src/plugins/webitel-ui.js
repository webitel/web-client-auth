//styles
import '@webitel/ui-sdk/dist/ui-sdk.css';

import WebitelUI from '@webitel/ui-sdk/dist/ui-sdk';
// locales
import WebitelUIEn from '@webitel/ui-sdk/src/locale/en/en';
import WebitelUIKz from '@webitel/ui-sdk/src/locale/kz/kz';
import WebitelUIRu from '@webitel/ui-sdk/src/locale/ru/ru';
import WebitelUIUk from '@webitel/ui-sdk/src/locale/uk/uk';
//eventBus
import eventBus from '@webitel/ui-sdk/src/scripts/eventBus';

import i18n from '../locale/i18n';

const globals = {
  $baseURL: import.meta.env.BASE_URL,
};

export default [WebitelUI, { eventBus, globals }];
// add plugin locales to main i18n
i18n.global.mergeLocaleMessage('en', WebitelUIEn);
i18n.global.mergeLocaleMessage('ru', WebitelUIRu);
i18n.global.mergeLocaleMessage('uk', WebitelUIUk);
i18n.global.mergeLocaleMessage('kz', WebitelUIKz);
