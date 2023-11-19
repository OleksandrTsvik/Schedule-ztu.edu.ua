import { Mutex } from 'async-mutex';
import { fetchBaseQuery } from '@reduxjs/toolkit/query';
import { QueryReturnValue } from '@reduxjs/toolkit/dist/query/baseQueryTypes';

import { RootState } from '../store/store';
import { baseUrl } from '../services/api';
import { logout, setAccessToken, setRefreshToken } from './auth.slice';

import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from '@reduxjs/toolkit/query';

export interface RefreshTokens {
  accessToken: string;
  refreshToken?: string;
}

// create a new mutex
const mutex = new Mutex();

export const baseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers, { getState }) => {
    // By default, if we have a token in the store, let's use that for authenticated requests
    const accessToken = (getState() as RootState).auth.accessToken;

    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }

    return headers;
  },
});

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) =>  {
  // wait until the mutex is available without locking it
  await mutex.waitForUnlock();

  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // checking whether the mutex is locked
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();

      const refreshToken = (api.getState() as RootState).auth.refreshToken;

      try {
        const refreshResult = (await baseQuery(
          {
            url: '/auth/refreshToken',
            method: 'PUT',
            body: { refreshToken },
          },
          api,
          extraOptions,
        )) as QueryReturnValue<
          RefreshTokens,
          FetchBaseQueryError,
          FetchBaseQueryMeta
        >;

        if (refreshResult.data) {
          const { accessToken, refreshToken } = refreshResult.data;

          api.dispatch(setAccessToken({ accessToken }));

          if (refreshToken) {
            api.dispatch(setRefreshToken({ refreshToken }));
          }

          // retry the initial query
          result = await baseQuery(args, api, extraOptions);
        } else {
          api.dispatch(logout());
        }
      } finally {
        // release must be called once the mutex should be released again.
        release();
      }
    } else {
      // wait until the mutex is available without locking it
      await mutex.waitForUnlock();

      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
}
