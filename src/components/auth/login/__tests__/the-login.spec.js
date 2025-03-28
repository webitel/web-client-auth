import { mount, shallowMount } from '@vue/test-utils';
import { createStore } from 'vuex';

import TheLogin from '../the-login.vue';

describe('TheLogin', () => {
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
    const wrapper = shallowMount(TheLogin, {
      global: {
        plugins: [store],
      },
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('"next" from first step calls domain check action', () => {
    const mock = vi
      .spyOn(TheLogin.methods, 'checkDomain')
      .mockImplementationOnce(vi.fn());
    const wrapper = mount(TheLogin, {
      shallow: true,
      global: {
        plugins: [store],
        stubs: {
          WtStepper: false,
          TheLoginFirstStep: false,
        },
      },
    });
    wrapper.findComponent({ name: 'TheLoginFirstStep' }).vm.$emit('next');
    expect(mock).toHaveBeenCalled();
  });

  it('"next" from second step emits "submit" event', () => {
    const wrapper = mount(TheLogin, {
      shallow: true,
      global: {
        plugins: [store],
        stubs: {
          WtStepper: false,
          TheLoginSecondStep: false,
        },
      },
      data: () => ({
        activeStep: 2,
      }),
    });
    wrapper.findComponent({ name: 'TheLoginSecondStep' }).vm.$emit('next');
    expect(wrapper.emitted('submit')).toBeTruthy();
  });
});
