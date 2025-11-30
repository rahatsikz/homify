import { Owner } from '.';

export interface RequestCodePayload {
  phone: string;
}

export interface VerifyCodePayload {
  phone: string;
  code: string;
}

export interface AuthData {
  user: Owner;
  accessToken: string;
  accessTokenExp: number;
  refreshToken: string;
  refreshTokenExp: number;
}

export type VerifyCodeResponse = AuthData;

export interface RefreshTokenResponse {
  user: Owner;
  accessToken: string;
}

export type ProfileResponse = Owner;

export type UpdateProfilePayload = Partial<Owner>;
