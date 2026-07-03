export const AuthMode = {
	Login: 'login',
	Register: 'register',
} as const;

export type AuthMode = keyof typeof AuthMode;
