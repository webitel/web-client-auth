import { mount, shallowMount } from '@vue/test-utils';
import { createStore } from 'vuex';

import TheRegister from '../the-register.vue';

describe('TheRegister', () => {
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
    const wrapper = shallowMount(TheRegister, {
      global: {
        plugins: [store],
      },
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('"next" from second step increments activeStep', () => {
    const wrapper = mount(TheRegister, {
      shallow: true,
      global: {
        plugins: [store],
        stubs: {
          WtStepper: false,
          TheRegisterSecondStep: false,
        },
      },
      data: () => ({
        activeStep: 2,
      }),
    });
    wrapper.findComponent({ name: 'TheRegisterSecondStep' }).vm.$emit('next');
    expect(wrapper.vm.activeStep).toBe(3);
  });

  it('"next" from third step emits "submit" event', () => {
    const wrapper = mount(TheRegister, {
      shallow: true,
      global: {
        plugins: [store],
        stubs: {
          WtStepper: false,
          TheRegisterThirdStep: false,
        },
      },
      data: () => ({
        activeStep: 3,
      }),
    });
    wrapper.findComponent({ name: 'TheRegisterThirdStep' }).vm.$emit('next');
    expect(wrapper.emitted('submit')).toBeTruthy();
  });
});
