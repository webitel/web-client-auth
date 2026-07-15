import domainValidator from '@webitel/ui-sdk/src/validators/domainValidator';

export const loginValidator = (value) => {
	const splitValues = value.split('@');

	if (splitValues.length !== 2) {
		return false;
	}

	const [login, domain] = splitValues;

	return /^[^@\s]+$/.test(login ?? '') && domainValidator(domain ?? '');
};
