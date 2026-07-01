export const AuthMode = {
	LOGIN: 'login',
	REGISTER: 'register',
} as const;

export type AuthMode = keyof typeof AuthMode;
