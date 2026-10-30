import { createTestingPinia } from '@pinia/testing';
import { setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mountWithWebitelUi } from '../../../../../tests/utils/mount-with-webitel-ui';
import { useAuthStore } from '../../../../stores/auth';
import { useLoginAttemptsStore } from '../../../../stores/loginAttempts';
import { useSsoStore } from '../../../../stores/sso';
import { useTfaStore } from '../../../../stores/tfa';
import LoginFormFields from '../login-form-fields.vue';

vi.mock('../../../../api/auth/auth', () => ({
	default: {
		checkDomainExistence: vi.fn(),
	},
}));

const mountComponent = (activeStep = 1) =>
	mountWithWebitelUi(LoginFormFields, {
		props: {
			activeStep,
		},
	});

describe('LoginFormFields', () => {
	beforeEach(() => {
		setActivePinia(
			createTestingPinia({
				stubActions: false,
			}),
		);
	});

	it('only shows the username field on step 1', () => {
		const wrapper = mountComponent(1);

		expect(wrapper.findAll('input')).toHaveLength(1);
	});

	it('shows the password field from step 2 onwards', () => {
		const wrapper = mountComponent(2);

		expect(wrapper.find('input[type="password"]').exists()).toBe(true);
	});

	it('shows the totp field only on step 3 with 2FA enabled', () => {
		const tfaStore = useTfaStore();
		tfaStore.enabledTfa = true;

		const wrapper = mountComponent(3);

		expect(wrapper.findAll('input')).toHaveLength(3);
	});

	it('does not show the password field on step 2 when SSO only is enforced', () => {
		const ssoStore = useSsoStore();
		ssoStore.loginOptions = 'sso_only';

		const wrapper = mountComponent(2);

		expect(wrapper.find('input[type="password"]').exists()).toBe(false);
	});

	it('extracts the domain from the username and emits change-login when it changes', async () => {
		const authStore = useAuthStore();
		const wrapper = mountComponent(1);

		await wrapper.find('input').setValue('user@example.com');

		expect(authStore.domain).toBe('example.com');
		expect(wrapper.emitted('change-login')).toHaveLength(1);
	});

	it('clears the password when the login changes', async () => {
		const authStore = useAuthStore();
		authStore.username = 'user@example.com';
		authStore.password = 'secret';
		const wrapper = mountComponent(2);

		await wrapper.find('input').setValue('admin@example.com');

		expect(authStore.password).toBe('');
	});

	it('does not emit change-login when the domain stays the same', async () => {
		const authStore = useAuthStore();
		authStore.username = 'user@example.com';
		const wrapper = mountComponent(1);

		await wrapper.find('input').setValue('user2@example.com');

		expect(authStore.domain).toBe('example.com');
		expect(wrapper.emitted('change-login')).toBeUndefined();
	});

	const blockLogin = () => {
		const authStore = useAuthStore();
		authStore.username = 'user@example.com';
		authStore.password = 'secret';
		useLoginAttemptsStore().handleError(
			{
				code: 429,
				retry_after: 240,
			},
			'user@example.com',
		);
	};

	it('shows the attempts message and stays invalid while the login is blocked', async () => {
		blockLogin();

		const wrapper = mountComponent(2);
		await wrapper.vm.$nextTick();

		expect(wrapper.text()).toContain('auth.maxAttemptsReached');
		expect(wrapper.emitted('invalid-change')?.at(-1)).toEqual([
			true,
		]);
	});

	it('does not block "next" on step 1 for the blocked login', async () => {
		blockLogin();

		const wrapper = mountComponent(1);
		await wrapper.vm.$nextTick();

		expect(wrapper.emitted('invalid-change')?.at(-1)).toEqual([
			false,
		]);
	});

	it('does not block another login', async () => {
		blockLogin();
		const wrapper = mountComponent(2);

		await wrapper.find('input').setValue('other@example.com');
		await wrapper.find('input[type="password"]').setValue('other-secret');

		expect(wrapper.text()).not.toContain('auth.maxAttemptsReached');
		expect(wrapper.emitted('invalid-change')?.at(-1)).toEqual([
			false,
		]);
	});

	it('shows the block again when the same login is typed again', async () => {
		blockLogin();
		const wrapper = mountComponent(2);

		await wrapper.find('input').setValue('user@example.co');
		await wrapper.find('input').setValue('user@example.com');

		expect(wrapper.text()).toContain('auth.maxAttemptsReached');
	});

	it('emits invalid-change with the current validation state', async () => {
		const wrapper = mountComponent(1);
		await wrapper.vm.$nextTick();

		expect(wrapper.emitted('invalid-change')?.at(-1)).toEqual([
			true,
		]);

		await wrapper.find('input').setValue('user@example.com');

		expect(wrapper.emitted('invalid-change')?.at(-1)).toEqual([
			false,
		]);
	});
});
