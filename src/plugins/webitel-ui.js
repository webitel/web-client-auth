//styles
import '@webitel/ui-sdk/dist/ui-sdk.css';

import WebitelUI from '@webitel/ui-sdk/dist/ui-sdk';
// locales
import * as locales from '@webitel/ui-sdk/locale';
//eventBus
import eventBus from '@webitel/ui-sdk/src/scripts/eventBus';

import i18n from '../locale/i18n';

const globals = {
  $baseURL: import.meta.env.BASE_URL,
};
// add plugin locales to main i18n
Object.entries(locales).forEach(([locale, messages]) => {
  i18n.global.mergeLocaleMessage(locale, messages);
});

export default [WebitelUI, { eventBus, globals }];