import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mountWithWebitelUi } from '../../../../../tests/utils/mount-with-webitel-ui';
import { useAuthStore } from '../../../../stores/auth';
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
		setActivePinia(createPinia());
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

	it('does not emit change-login when the domain stays the same', async () => {
		const authStore = useAuthStore();
		authStore.username = 'user@example.com';
		const wrapper = mountComponent(1);

		await wrapper.find('input').setValue('user2@example.com');

		expect(authStore.domain).toBe('example.com');
		expect(wrapper.emitted('change-login')).toBeUndefined();
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
