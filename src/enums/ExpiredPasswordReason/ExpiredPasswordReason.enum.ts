export const ExpiredPasswordReason = {
	EXPIRED: 'expired',
	TEMPORARY: 'temporary',
} as const;

export type ExpiredPasswordReason = keyof typeof ExpiredPasswordReason;
