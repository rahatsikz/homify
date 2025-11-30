import axios, { AxiosError, AxiosResponse } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { useAuthStore } from '../hooks/auth-store';
import { Platform } from 'react-native';

const baseURL = (() => {
  // Android emulator needs special host IP
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5000/api/v1';
  }
  // Use env var if provided for other platforms
  const envUrl = process.env.EXPO_PUBLIC_API_ENDPOINT;
  if (envUrl) return envUrl;
  // Fallback to localhost for web or other platforms
  return 'http://127.0.0.1:5000/api/v1';
})();
console.log('Axios baseURL:', baseURL);

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'x-app-type': 'mobile',
  },
});

// request interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    // getting token from Zustand store
    let accessToken = useAuthStore.getState().accessToken;

    // fallback if Zustand is empty
    if (!accessToken) {
      accessToken = await SecureStore.getItemAsync('accessToken');
    }

    if (accessToken) {
      config.headers['X-Access-Token'] = accessToken;
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    config.headers['X-App-Type'] = 'mobile';
    return config;
  },
  (error) => Promise.reject(error instanceof Error ? error : new Error(String(error))),
);

// response interceptor
axiosInstance.interceptors.response.use(
  async (response: AxiosResponse) => {
    // check for new tokens
    const newAccessToken = response.headers['x-new-access-token'];
    const newRefreshToken = response.headers['x-new-refresh-token'];
    const newAccessTokenExp = response.headers['x-new-access-token-exp'];
    const newRefreshTokenExp = response.headers['x-new-refresh-token-exp'];

    if (newAccessToken && newRefreshToken) {
      // Save to Zustand + SecureStore
      if (!newAccessTokenExp || !newRefreshTokenExp) {
        console.warn('Token expiration headers missing');
      }
      await useAuthStore.getState().setTokens({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        accessTokenExp: newAccessTokenExp ? parseInt(newAccessTokenExp) : Date.now(),
        refreshTokenExp: newRefreshTokenExp ? parseInt(newRefreshTokenExp) : Date.now(),
      });
    }

    return response;
  },
  async (error: AxiosError) => {
    const status = error.response?.status;
    // backend error codes
    if ([401, 419, 498].includes(status ?? 0)) {
      const refreshToken =
        useAuthStore.getState().refreshToken ?? (await SecureStore.getItemAsync('refreshToken'));

      if (refreshToken && error.config) {
        try {
          //retry original request with refresh token
          error.config.headers['X-Refresh-Token'] = refreshToken;
          return axiosInstance(error.config);
        } catch {
          // clear auth if refresh fails
          await useAuthStore.getState().clearAuth();
          // optional navigate to login here
        }
      }
    }

    return Promise.reject(error instanceof Error ? error : new Error(String(error)));
  },
);

export default axiosInstance;
