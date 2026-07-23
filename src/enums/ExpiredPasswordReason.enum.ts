export const ExpiredPasswordReason = {
	Expired: 'expired',
	Temporary: 'temporary',
} as const;

export type ExpiredPasswordReason =
	(typeof ExpiredPasswordReason)[keyof typeof ExpiredPasswordReason];
