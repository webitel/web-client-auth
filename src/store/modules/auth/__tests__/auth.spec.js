import contextMock from '@webitel/ui-sdk/src/tests/mocks/contextMock.js';
import auth from '../auth.js';
import authAPI from '../../../../api/auth/auth.js';
import router from '../../../../router/router.js';

describe('auth store', () => {
  let context;

  beforeEach(() => {
    context = contextMock(vi);
  });

  it('SUBMIT_AUTH action calls LOGIN if "action"="login"', async () => {
    await auth.actions.SUBMIT_AUTH(context, 'login');
    expect(context.dispatch).toHaveBeenCalledWith('LOGIN');
  });

  it('SUBMIT_AUTH action calls REGISTER if "action"="register"', async () => {
    await auth.actions.SUBMIT_AUTH(context, 'register');
    expect(context.dispatch).toHaveBeenCalledWith('REGISTER');
  });

  it('SUBMIT_AUTH action calls ON_AUTH_SUCCESS with token, received from prev action', async () => {
    const accessToken = 'token';
    context.dispatch.mockImplementationOnce(() => accessToken);
    await auth.actions.SUBMIT_AUTH(context, 'login');
    expect(context.dispatch).toHaveBeenCalledWith('ON_AUTH_SUCCESS', { accessToken });
  });

  it('LOGIN action calls AuthAPI.login with username, password and domain from state', async () => {
    const state = {
      username: 'username',
      password: 'password',
      domain: 'domain',
    };

    context.state = state;

    const mock = vi.spyOn(authAPI, 'login').mockImplementationOnce(vi.fn());
    await auth.actions.LOGIN(context);
    expect(mock).toHaveBeenCalledWith(state);
  });

  it('REGISTER action calls AuthAPI.register with data from state', async () => {
    const state = {
      username: 'username',
      password: 'password',
      domain: 'domain',
      certificate: 'certificate',
    };

    context.state = state;

    const mock = vi.spyOn(authAPI, 'register').mockImplementationOnce(vi.fn());
    await auth.actions.REGISTER(context);
    expect(mock).toHaveBeenCalledWith(state);
  });

  it('CHECK_CURRENT_SESSION action calls AuthAPI.checkCurrentSession', async () => {
    const accessToken = 'vi';
    const mock = vi.spyOn(authAPI, 'checkCurrentSession')
    .mockImplementationOnce(() => accessToken);
    await auth.actions.CHECK_CURRENT_SESSION(context);
    expect(mock).toHaveBeenCalled();
    expect(context.dispatch).toHaveBeenCalledWith('ON_AUTH_SUCCESS', { accessToken });
  });

  it('ON_AUTH_SUCCESS action dispatches CACHE_USER_DATA', async () => {
    const redirect = '/redirect';
    router.currentRoute.value.query = { redirectTo: redirect };

    await auth.actions.ON_AUTH_SUCCESS(context, { accessToken: 'token' });
    expect(context.dispatch).toHaveBeenCalledWith('CACHE_USER_DATA');
  });

  it('ON_AUTH_SUCCESS redirects to route redirect with accessToken', async () => {
    window = { location: { href: '' } };
    const accessToken = 'vi';

    const redirect = '/redirect?query=vi';
    router.currentRoute.value.query = { redirectTo: redirect };

    await auth.actions.ON_AUTH_SUCCESS(context, { accessToken });

    expect(window.location.href).toBe(`${redirect}&accessToken=${accessToken}`);
  });

  it('CACHE_USER_DATA caches domain by default', async () => {
    const domain = 'domain';
    context.state.domain = domain;

    const mock = vi.spyOn(localStorage, 'setItem').mockImplementationOnce(vi.fn());

    await auth.actions.CACHE_USER_DATA(context);
    expect(mock).toHaveBeenCalledWith('auth/domain', domain);
  });

  it('CHECK_DOMAIN action calls AuthAPI.checkDomainExistence with domain from state', async () => {
    const state = {
      domain: 'domain',
      federation: {},
    };

    context.state = state;

    const mock = vi.spyOn(authAPI, 'checkDomainExistence').mockImplementationOnce(() => ({ federation: state.federation }));
    await auth.actions.CHECK_DOMAIN(context);
    expect(mock).toHaveBeenCalledWith(state.domain);
    expect(context.commit).toHaveBeenCalledWith('SET_SERVICE_PROVIDERS', state.federation);
  });
});
