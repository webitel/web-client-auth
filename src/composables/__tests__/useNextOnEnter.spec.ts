import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, h } from 'vue';

import { useNextOnEnter } from '../useNextOnEnter';

const mountWithComposable = (callback: () => void) =>
	mount(
		defineComponent({
			setup() {
				useNextOnEnter(callback);
				return () => h('div');
			},
		}),
	);

describe('useNextOnEnter', () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('calls the callback when Enter is pressed', () => {
		const callback = vi.fn();
		mountWithComposable(callback);

		window.dispatchEvent(
			new KeyboardEvent('keydown', {
				key: 'Enter',
			}),
		);

		expect(callback).toHaveBeenCalledTimes(1);
	});

	it('does not call the callback for other keys', () => {
		const callback = vi.fn();
		mountWithComposable(callback);

		window.dispatchEvent(
			new KeyboardEvent('keydown', {
				key: 'Escape',
			}),
		);

		expect(callback).not.toHaveBeenCalled();
	});

	it('stops listening after the component is unmounted', () => {
		const callback = vi.fn();
		const wrapper = mountWithComposable(callback);

		wrapper.unmount();
		window.dispatchEvent(
			new KeyboardEvent('keydown', {
				key: 'Enter',
			}),
		);

		expect(callback).not.toHaveBeenCalled();
	});
});
