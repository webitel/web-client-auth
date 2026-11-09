import { createTestingPinia } from '@pinia/testing';
import { generatePassword } from '@webitel/ui-sdk/scripts';
import { setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mountWithWebitelUi } from '../../../../tests/utils/mount-with-webitel-ui';
import { WtPasswordStub } from '../../../../tests/utils/wt-password-stub';
import { useAuthStore } from '../../../stores/auth';
import TheRegister from '../the-register.vue';

// [Claude] [https://webitel.atlassian.net/browse/WTEL-10807]
// TODO: remove after the ui-sdk release with PasswordAction (the installed version doesn't have it yet)
vi.mock('@webitel/ui-sdk/enums', async (importOriginal) => {
	const original = await importOriginal<Record<string, unknown>>();
	return {
		...original,
		PasswordAction: original.PasswordAction ?? {
			Copy: 'copy',
			Generate: 'generate',
			Toggle: 'toggle',
		},
	};
});

// [Claude] [https://webitel.atlassian.net/browse/WTEL-10807]
vi.mock('@webitel/ui-sdk/scripts', async (importOriginal) => ({
	...(await importOriginal<Record<string, unknown>>()),
	generatePassword: vi.fn(() => 'Generated1!'),
}));

vi.mock('../../../api/auth/auth', () => ({
	default: {
		register: vi.fn(),
	},
}));

const mountComponent = () => mountWithWebitelUi(TheRegister);

describe('TheRegister', () => {
	beforeEach(() => {
		setActivePinia(
			createTestingPinia({
				stubActions: false,
			}),
		);
	});

	it('disables the submit button while the form is invalid', () => {
		const wrapper = mountComponent();

		const submitButton = wrapper.findAll('button').at(-1);
		expect(submitButton?.attributes('disabled')).toBeDefined();
	});

	it('enables the submit button once all fields are valid', async () => {
		const authStore = useAuthStore();
		authStore.domain = 'example.com';
		authStore.username = 'user';
		authStore.password = 'secret';
		authStore.confirmPassword = 'secret';
		authStore.certificate = 'cert';

		const wrapper = mountComponent();
		await wrapper.vm.$nextTick();

		const submitButton = wrapper.findAll('button').at(-1);
		expect(submitButton?.attributes('disabled')).toBeUndefined();
	});

	it('emits submit when the submit button is clicked', async () => {
		const authStore = useAuthStore();
		authStore.domain = 'example.com';
		authStore.username = 'user';
		authStore.password = 'secret';
		authStore.confirmPassword = 'secret';
		authStore.certificate = 'cert';

		const wrapper = mountComponent();
		await wrapper.vm.$nextTick();
		await wrapper.findAll('button').at(-1)?.trigger('click');

		expect(wrapper.emitted('submit')).toHaveLength(1);
	});

	it('emits change-tab with login when the sign-in link is clicked', async () => {
		const wrapper = mountComponent();

		await wrapper.find('.the-register__link').trigger('click');

		expect(wrapper.emitted('change-tab')).toEqual([
			[
				{
					value: 'login',
				},
			],
		]);
	});

	it('resets the auth store fields when unmounted', () => {
		const authStore = useAuthStore();
		authStore.username = 'user';
		authStore.password = 'secret';

		const wrapper = mountComponent();
		wrapper.unmount();

		expect(authStore.username).toBe('');
		expect(authStore.password).toBe('');
	});

	// [Claude] [https://webitel.atlassian.net/browse/WTEL-10807]
	describe('password generation', () => {
		const mountWithPasswordStub = () =>
			mountWithWebitelUi(TheRegister, {
				global: {
					stubs: {
						WtPassword: WtPasswordStub,
					},
				},
			});

		it('enables copy and generate only on the password field', () => {
			const wrapper = mountWithPasswordStub();

			const [passwordField, confirmField] =
				wrapper.findAllComponents(WtPasswordStub);
			expect(passwordField.props('actions')).toEqual([
				'copy',
				'generate',
				'toggle',
			]);
			expect(confirmField.props('actions')).toEqual([]);
		});

		// [Claude] wt-password itself sets the generator result to v-model
		it('passes a local generator that excludes the login', () => {
			const authStore = useAuthStore();
			authStore.username = 'user';

			const wrapper = mountWithPasswordStub();
			const generator = wrapper
				.findAllComponents(WtPasswordStub)[0]
				.props('generator');

			expect(generator()).toBe('Generated1!');
			expect(generatePassword).toHaveBeenCalledWith({
				exclude: [
					'user',
				],
			});
		});
	});
});
