import { eventBus } from '@webitel/ui-sdk/scripts';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
	errorHandlersInterceptor,
	handleLicenseExpired,
	handleNoLicense,
} from '../errorHandlers.interceptor';

vi.mock('@webitel/ui-sdk/scripts', () => ({
	eventBus: {
		$emit: vi.fn(),
	},
}));

vi.mock('../../../locale/i18n', () => ({
	default: {
		global: {
			t: vi.fn((key) => key),
		},
	},
}));

describe('errorHandlersInterceptor', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('maps known error ids to their handlers', () => {
		expect(errorHandlersInterceptor['app.license.product.expired']).toBe(
			handleLicenseExpired,
		);
		expect(errorHandlersInterceptor['app.context.auth.license.err']).toBe(
			handleNoLicense,
		);
	});

	it('handleLicenseExpired emits a notification with the license name from the error detail', () => {
		handleLicenseExpired({
			detail: 'product: contact-center',
		});

		expect(eventBus.$emit).toHaveBeenCalledWith(
			'notification',
			expect.objectContaining({
				type: 'error',
				timeout: 20,
			}),
		);
	});

	it('handleLicenseExpired does not throw when detail is missing', () => {
		expect(() => handleLicenseExpired({})).not.toThrow();
		expect(eventBus.$emit).toHaveBeenCalledTimes(1);
	});

	it('handleNoLicense emits a plain error notification', () => {
		handleNoLicense();

		expect(eventBus.$emit).toHaveBeenCalledWith('notification', {
			type: 'error',
			text: 'User has no license grants',
		});
	});
});
