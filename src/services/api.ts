import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';

import {
  getTokens,
  saveTokens,
  clearTokens,
} from './tokenStorage';

import {navigateToLogin} from '../navigations/navigationRef';

const BASE_URL =
  'http://localhost:8000/api/v1/';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Separate instance for refresh
const refreshApi = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add access token
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const tokens = await getTokens();

    if (tokens?.accessToken) {
      config.headers.Authorization =
        `Bearer ${tokens.accessToken}`;
    }

    return config;
  },
);

// Handle 401
api.interceptors.response.use(
  response => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & {
          _retry?: boolean;
        })
      | undefined;
  console.log(
      'INTERCEPTOR STATUS:',
      error.response?.status,
    );

    console.log(
      'INTERCEPTOR URL:',
      error.config?.url,
    )
    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry
    ) {
      console.log("entry");
      return Promise.reject(error);
    }
console.log('API 401 - attempting token refresh')
    originalRequest._retry = true;

   try {
  const tokens = await getTokens();

  console.log('TOKENS READ');

  if (!tokens?.refreshToken) {
    console.log('NO REFRESH TOKEN');

    await clearTokens();
    navigateToLogin();

    return Promise.reject(error);
  }

  console.log(
    'OLD REFRESH TOKEN EXISTS:',
    !!tokens.refreshToken,
  );

  console.log('CALLING /auth/refresh');

  const response = await refreshApi.post(
    'auth/refresh',
    {
      refreshToken: tokens.refreshToken,
    },
  );

  console.log('REFRESH API RESPONSE:', response.data);

  const newAccessToken = response.data.accessToken;
  const newRefreshToken = response.data.refreshToken;

  if (!newAccessToken || !newRefreshToken) {
    throw new Error('Invalid refresh token response');
  }

  await saveTokens(
    newAccessToken,
    newRefreshToken,
  );

  console.log('NEW TOKENS SAVED');
  console.log('RETRYING ORIGINAL REQUEST');

  originalRequest.headers.Authorization =
    `Bearer ${newAccessToken}`;

  return api(originalRequest);

} catch (refreshError) {

  console.log('🔥 REFRESH CATCH EXECUTED');
  console.log('REFRESH ERROR:', refreshError);

  await clearTokens();

  console.log('TOKENS CLEARED');

  navigateToLogin();

  console.log('NAVIGATED TO LOGIN');

  return Promise.reject(refreshError);
}
  },
);

export default api;