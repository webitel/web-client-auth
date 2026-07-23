import domainValidator from '@webitel/ui-sdk/validators/domainValidator';

export const loginValidator = (value) => {
	const credentials = value.split('@');

	if (credentials.length !== 2) {
		return false;
	}

	const [login, domain] = credentials;

	return /^[^@\s]+$/.test(login ?? '') && domainValidator(domain ?? '');
};
