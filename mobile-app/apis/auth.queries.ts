import { useMutation, useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { ApiResponse } from '@/types';
import {
  ProfileResponse,
  RefreshTokenResponse,
  RequestCodePayload,
  UpdateProfilePayload,
  VerifyCodePayload,
  VerifyCodeResponse,
} from '@/types/api-hooks';

const AUTH_ROUTE = '/auth';

export const AUTH_QUERY_KEY = ['auth'];

export const useRequestCodeMutation = () => {
  return useMutation<ApiResponse<void>, Error, RequestCodePayload>({
    mutationFn: async (payload) => {
      const { data } = await axiosInstance.post<ApiResponse<void>>(
        `${AUTH_ROUTE}/request-otp`,
        payload,
      );
      return data;
    },
  });
};

export const useVerifyCodeMutation = () => {
  return useMutation<ApiResponse<VerifyCodeResponse>, Error, VerifyCodePayload>({
    mutationFn: async (payload) => {
      const { data } = await axiosInstance.post<ApiResponse<VerifyCodeResponse>>(
        `${AUTH_ROUTE}/verify-otp`,
        payload,
      );
      return data;
    },
  });
};

export const useRefreshTokenMutation = () => {
  return useMutation<ApiResponse<RefreshTokenResponse>, Error, void>({
    mutationFn: async () => {
      const { data } = await axiosInstance.post<ApiResponse<RefreshTokenResponse>>(
        `${AUTH_ROUTE}/new-token`,
      );
      return data;
    },
  });
};

export const useGetProfileQuery = () => {
  return useQuery<ApiResponse<ProfileResponse>, Error>({
    queryKey: [...AUTH_QUERY_KEY, 'profile'],
    queryFn: async () => {
      const { data } = await axiosInstance.get<ApiResponse<ProfileResponse>>(
        `${AUTH_ROUTE}/profile`,
      );
      return data;
    },
  });
};

export const useUpdateProfileMutation = () => {
  return useMutation<ApiResponse<ProfileResponse>, Error, UpdateProfilePayload>({
    mutationFn: async (payload) => {
      const { data } = await axiosInstance.patch<ApiResponse<ProfileResponse>>(
        `${AUTH_ROUTE}/profile`,
        payload,
      );
      return data;
    },
  });
};
