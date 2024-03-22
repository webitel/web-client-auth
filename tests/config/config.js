import axiosMock from '@webitel/ui-sdk/src/tests/mocks/axiosMock.js';
import { config } from '@vue/test-utils';
import WebitelUi from '../../src/plugins/webitel-ui';
import i18n from '../../src/locale/i18n';

config.global.plugins = [WebitelUi, i18n];

vi.doMock('axios', axiosMock);
