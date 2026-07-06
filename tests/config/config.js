import axiosMock from '@webitel/ui-sdk/src/tests/mocks/axiosMock.js';

vi.doMock('axios', axiosMock());

vi.mock('../../src/router/router', () => ({
	default: {
		currentRoute: {
			value: {
				query: {},
			},
		},
	},
}));
