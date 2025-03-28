import { mount, shallowMount } from '@vue/test-utils';
import { createStore } from 'vuex';

import TheRegisterFirstStep from '../the-register-first-step.vue';

const v$ = {
  value: {
    $touch: vi.fn(),
  },
};

describe('TheRegisterFirstStep', () => {
  let store;

  beforeEach(() => {
    store = createStore({
      modules: {
        auth: {
          namespaced: true,
        },
      },
    });
  });

  it('should render', () => {
    const wrapper = shallowMount(TheRegisterFirstStep, {
      global: {
        plugins: [store],
      },
      data: () => ({ v$ }),
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('emits "next" event on "next" btn click', () => {
    const wrapper = mount(TheRegisterFirstStep, {
      shallow: true,
      global: {
        plugins: [store],
        stubs: {
          WtButton: false,
        },
      },
      data: () => ({ v$ }),
    });
    wrapper
      .findAllComponents({ name: 'WtButton' })
      .find((btn) => {
        return btn.html().toLocaleLowerCase().includes('next');
      })
      .vm.$emit('click');
    expect(wrapper.emitted('next')).toBeTruthy();
  });

  it('emits "login" event on register link click', () => {
    const wrapper = mount(TheRegisterFirstStep, {
      shallow: true,
      global: {
        plugins: [store],
      },
      data: () => ({ v$ }),
    });
    wrapper.find('.auth-form-actions--link').trigger('click');
    expect(wrapper.emitted('login')).toBeTruthy();
  });
});
