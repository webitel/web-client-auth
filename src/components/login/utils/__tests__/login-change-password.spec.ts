import { createTestingPinia } from '@pinia/testing';
import { setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mountWithWebitelUi } from '../../../../../tests/utils/mount-with-webitel-ui';
import { WtPasswordStub } from '../../../../../tests/utils/wt-password-stub';
import AuthAPI from '../../../../api/auth/auth';
import { ExpiredPasswordReason } from '../../../../enums/ExpiredPasswordReason.enum';
import { useAuthStore } from '../../../../stores/auth';
import { useExpiredPasswordStore } from '../../../../stores/expiredPassword';
import { useTfaStore } from '../../../../stores/tfa';
import LoginChangePassword from '../login-change-password.vue';

vi.mock('../../../../api/auth/auth', () => ({
	default: {
		getPasswordSettings: vi.fn(),
		generatePassword: vi.fn(),
	},
}));

const mountComponent = () => mountWithWebitelUi(LoginChangePassword);

describe('LoginChangePassword', () => {
	beforeEach(() => {
		setActivePinia(
			createTestingPinia({
				stubActions: false,
			}),
		);
		vi.mocked(AuthAPI.getPasswordSettings).mockResolvedValue({
			settings: {},
		});
	});

	it('shows the temporary password message when the reason is temporary', async () => {
		const expiredPasswordStore = useExpiredPasswordStore();
		expiredPasswordStore.reasonExpiredPassword =
			ExpiredPasswordReason.Temporary;

		const wrapper = mountComponent();
		await wrapper.vm.$nextTick();

		expect(wrapper.text()).toContain('auth.temporaryPasswordMessage');
	});

	it('shows the expired password message when the reason is expired', async () => {
		const expiredPasswordStore = useExpiredPasswordStore();
		expiredPasswordStore.reasonExpiredPassword = ExpiredPasswordReason.Expired;

		const wrapper = mountComponent();
		await wrapper.vm.$nextTick();

		expect(wrapper.text()).toContain('auth.expiredPasswordMessage');
	});

	it('goes back to login when the back button is clicked', async () => {
		const expiredPasswordStore = useExpiredPasswordStore();
		expiredPasswordStore.isExpiredPassword = true;
		const wrapper = mountComponent();
		await wrapper.vm.$nextTick();

		const backButton = wrapper
			.findAll('button')
			.find((button) => button.text().includes('reusable.back'));
		await backButton?.trigger('click');

		expect(expiredPasswordStore.isExpiredPassword).toBe(false);
	});

	it('saves the new password and emits submit when 2FA is not enabled', async () => {
		const authStore = useAuthStore();
		const changePasswordSpy = vi
			.spyOn(authStore, 'changePassword')
			.mockResolvedValue(undefined);

		const wrapper = mountComponent();
		await wrapper.vm.$nextTick();

		const passwordInputs = wrapper.findAll('input[type="password"]');
		await passwordInputs[0].setValue('new-secret');
		await passwordInputs[1].setValue('new-secret');

		await wrapper.findAll('button').at(-1)?.trigger('click');
		await wrapper.vm.$nextTick();

		expect(changePasswordSpy).toHaveBeenCalled();
		expect(wrapper.emitted('submit')).toHaveLength(1);
	});

	it('requests a 2FA session instead of emitting submit when 2FA is enabled', async () => {
		const authStore = useAuthStore();
		vi.spyOn(authStore, 'changePassword').mockResolvedValue(undefined);
		const tfaStore = useTfaStore();
		tfaStore.enabledTfa = true;
		const get2faSessionIdSpy = vi
			.spyOn(tfaStore, 'get2faSessionId')
			.mockResolvedValue(undefined);

		const wrapper = mountComponent();
		await wrapper.vm.$nextTick();

		const passwordInputs = wrapper.findAll('input[type="password"]');
		await passwordInputs[0].setValue('new-secret');
		await passwordInputs[1].setValue('new-secret');

		await wrapper.findAll('button').at(-1)?.trigger('click');
		await wrapper.vm.$nextTick();

		expect(get2faSessionIdSpy).toHaveBeenCalled();
		expect(wrapper.emitted('submit')).toBeUndefined();
	});

	// [Claude] [https://webitel.atlassian.net/browse/WTEL-10807]
	describe('password generation', () => {
		const mountWithPasswordStub = () =>
			mountWithWebitelUi(LoginChangePassword, {
				global: {
					stubs: {
						WtPassword: WtPasswordStub,
					},
				},
			});

		const findPasswordFields = (wrapper) =>
			wrapper.findAllComponents(WtPasswordStub);

		it('enables copy and generate only on the new password field', async () => {
			const wrapper = mountWithPasswordStub();
			await wrapper.vm.$nextTick();

			const [newPasswordField, confirmField] = findPasswordFields(wrapper);
			expect(newPasswordField.props('actions')).toEqual([
				'copy',
				'generate',
				'toggle',
			]);
			expect(confirmField.props('actions')).toEqual([]);
		});

		// [Claude] wt-password itself sets the generator result to v-model
		it('passes a generator that returns the password by the domain policies via api', async () => {
			const authStore = useAuthStore();
			authStore.domain = 'example.com';
			authStore.username = 'user@example.com';
			authStore.password = 'temporary';
			vi.mocked(AuthAPI.generatePassword).mockResolvedValue({
				password: 'Generated1!',
			});

			const wrapper = mountWithPasswordStub();
			await wrapper.vm.$nextTick();

			const generator = findPasswordFields(wrapper)[0].props('generator');
			await expect(generator()).resolves.toBe('Generated1!');

			expect(AuthAPI.generatePassword).toHaveBeenCalledWith({
				domain: 'example.com',
				username: 'user@example.com',
				password: 'temporary',
			});
		});

		// [Claude] wt-password keeps the value when the generator rejects
		it('rejects the generator when the api fails', async () => {
			vi.mocked(AuthAPI.generatePassword).mockRejectedValue(new Error('fail'));

			const wrapper = mountWithPasswordStub();
			await wrapper.vm.$nextTick();

			const generator = findPasswordFields(wrapper)[0].props('generator');
			await expect(generator()).rejects.toThrow('fail');
		});

		it('keeps the current value when the api returns no password', async () => {
			const authStore = useAuthStore();
			vi.mocked(AuthAPI.generatePassword).mockResolvedValue({});

			const wrapper = mountWithPasswordStub();
			await wrapper.vm.$nextTick();
			authStore.newPassword = 'typed';

			const generator = findPasswordFields(wrapper)[0].props('generator');
			await expect(generator()).resolves.toBe('typed');
		});
	});
});
