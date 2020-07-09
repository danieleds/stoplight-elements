import { IHttpOperation } from '@stoplight/types';

import { RequestMakerStore } from '../../stores/request-maker';
import { useRequestMaker } from '../useRequestMaker';

describe('useRequestMaker()', () => {
  it('it should return request maker store given an http operation value', () => {
    const operation = {
      id: 'todo',
      method: 'get',
      path: '/todos',
      request: {
        query: [
          {
            name: 'apikey',
            style: 'form',
          },
        ],
      },
      responses: [
        {
          code: '200',
        },
      ],
    } as IHttpOperation;

    const store = useRequestMaker(operation);

    expect(store).toBeInstanceOf(RequestMakerStore);
    expect(store.operation).toEqual(operation);
  });

  it('it should return request maker store given an http request value', () => {
    const request = {
      method: 'get',
      url: 'http://todos.stoplight.io/todos',
      headers: {
        'content-type': 'application/json',
      },
    };

    const store = useRequestMaker(request);

    expect(store).toBeInstanceOf(RequestMakerStore);
    expect(store.request.toPartialHttpRequest()).toEqual(request);
  });

  it('it should return request maker store given an http request with query strings as an array of strings or just a string', () => {
    const request = {
      method: 'get',
      url: 'http://todos.stoplight.io/todos',
      headers: {
        'content-type': 'application/json',
      },
      query: {
        foo: 'bar',
        bear: ['cave'],
      },
    };

    const store = useRequestMaker(request);

    expect(store).toBeInstanceOf(RequestMakerStore);
    expect(store.request.toPartialHttpRequest()).toEqual({
      method: 'get',
      url: 'http://todos.stoplight.io/todos',
      headers: {
        'content-type': 'application/json',
      },
      query: {
        foo: 'bar',
        bear: 'cave',
      },
    });
  });

  it('it should return request maker store given a string value', () => {
    const store = useRequestMaker('foo' as any);

    expect(store).toBeInstanceOf(RequestMakerStore);
    expect(store.request.toPartialHttpRequest()).toEqual({
      url: '/',
      method: 'get',
    });
  });

  it('it should return request maker store given a null value', () => {
    const store = useRequestMaker(null as any);

    expect(store).toBeInstanceOf(RequestMakerStore);
    expect(store.request.toPartialHttpRequest()).toEqual({
      url: '/',
      method: 'get',
    });
  });

  it('it should return cached request maker store with matching operation', () => {
    const operation = {
      id: 'todo',
      method: 'get',
      path: '/todos',
      request: {
        query: [
          {
            name: 'apikey',
            style: 'form',
          },
        ],
      },
      responses: [
        {
          code: '200',
        },
      ],
    } as IHttpOperation;

    const store1 = useRequestMaker(operation, true);
    store1.request.publicBaseUrl = 'http://todos.stoplight.io';
    const store2 = useRequestMaker(operation, true);

    expect(store1).toEqual(store2);
  });

  it('it should return cached request maker store with matching request', () => {
    const request = {
      method: 'get',
      baseUrl: 'http://todos.stoplight.io',
      url: '/todos',
      headers: {
        'content-type': 'application/json',
      },
    };

    const store1 = useRequestMaker(request, true);
    store1.request.publicBaseUrl = 'http://example.com';
    const store2 = useRequestMaker(request, true);

    expect(store1).toEqual(store2);
  });
});