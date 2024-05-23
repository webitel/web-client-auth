import { shallowMount } from '@vue/test-utils';
import { info } from 'sass';
import { createStore } from 'vuex';
import ServiceProvider from '../../../../../enums/ServiceProvider.enum.js';
import TheLoginProviders from '../the-login-providers.vue';

describe('TheLoginProviders', () => {
  let store;

  beforeEach(() => {
    store = createStore({
      modules: {
        auth: {
          namespaced: true,
          actions: {
            LOAD_SERVICE_PROVIDERS: vi.fn(),
          },
        },
      },
    });
  });

  it('should render', () => {
    const wrapper = shallowMount(TheLoginProviders, {
      global: {
        plugins: [store],
      },
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('should render service providers', () => {
    const loginProviders = {
      [ServiceProvider.ADFS]: {},
      [ServiceProvider.GOOGLE]: {},
      [ServiceProvider.FACEBOOK]: {},
      [ServiceProvider.AZURE]: {},
    };

    store.state.auth = {
      loginProviders,
    };

    const wrapper = shallowMount(TheLoginProviders, {
      global: {
        plugins: [store],
      },
    });

    const btns = wrapper.findAllComponents({ name: 'WtButton' });
    expect(btns.length).toBe(Object.keys(loginProviders).length);
  });

  it('calls open provider action at provider btn click', () => {
    const loginProviders = {
      [ServiceProvider.ADFS]: 'vi',
    };

    store.state.auth = {
      loginProviders,
    };

    const wrapper = shallowMount(TheLoginProviders, {
      global: {
        plugins: [store],
      },
    });

    const btn = wrapper.findComponent({ name: 'WtButton' });
    const mock = vi.spyOn(store, 'dispatch').mockImplementationOnce(vi.fn());
    btn.vm.$emit('click');
    expect(mock).toHaveBeenCalledWith('auth/EXECUTE_PROVIDER', { ticket: 'vi' });
  });
});
