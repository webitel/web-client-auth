import { createTestingPinia } from '@pinia/testing';
import { setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mountWithWebitelUi } from '../../../../tests/utils/mount-with-webitel-ui';
import { useAuthStore } from '../../../stores/auth';
import TheRegister from '../the-register.vue';

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
});
