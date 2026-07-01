import { eventBus } from '@webitel/ui-sdk/scripts';
import i18n from '../../locale/i18n';

export const handleLicenseExpired = (error) => {
	const match = error.detail?.match(/product:\s*(\w+)/);
	const NOTIFICATION_DURATION_SEC = 20;

	const licenseName = match?.[1];

	eventBus.$emit('notification', {
		type: 'error',
		text: i18n.global.t(
			'systemNotifications.warnings.licenseExpirationMessage',
			{
				name: licenseName,
			},
		),
		timeout: NOTIFICATION_DURATION_SEC,
	});
};

export const handleNoLicense = () => {
	eventBus.$emit('notification', {
		type: 'error',
		text: 'User has no license grants',
	});
};

export const errorHandlersInterceptor = {
	'app.license.product.expired': handleLicenseExpired,
	'app.context.auth.license.err': handleNoLicense,
};
