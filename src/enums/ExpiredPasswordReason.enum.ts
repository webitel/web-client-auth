export const ExpiredPasswordReason = {
	Expired: 'expired',
	Temporary: 'temporary',
} as const;

export type ExpiredPasswordReason = keyof typeof ExpiredPasswordReason;
