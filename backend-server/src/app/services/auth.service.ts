import crypto from 'crypto';
import prisma from '../../shared/prisma';
import ApiError from '../../errors/ApiError';
import httpStatus from 'http-status';
import {
  generateJwtToken,
  getJwtExpiryMs,
  getRefreshTokenExpiryMs,
  jwtHelpers,
  verifyRefreshToken,
} from '../../helpers/jwtHelpers';
import config from '../../config';
import { Secret } from 'jsonwebtoken';
import { sendLoginCode } from '../../lib/auth-sms';
import { Owner, Prisma } from '@prisma/client';

const requestCode = async (phone: string) => {
  const code = crypto.randomBytes(3).toString('hex');
  const expires = new Date(Date.now() + 5 * 60_000);

  const result = await prisma.oneTimePasswords.upsert({
    where: { phone },
    update: { otp: code, expires },
    create: { phone, otp: code, expires },
  });

  // sendLoginCode({ to: phone, code });

  return result;
};

const verifyCode = async (phone: string, code: string) => {
  const record = await prisma.oneTimePasswords.findUnique({ where: { phone } });

  if (!record || record.otp !== code || record.expires < new Date()) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid or expired code');
  }

  await prisma.oneTimePasswords.delete({ where: { phone } });

  let owner = await prisma.owner.findUnique({ where: { mobile: phone } });
  if (!owner) {
    owner = await prisma.owner.create({
      data: {
        mobile: phone,
      },
    });
  }

  const { accessToken, refreshToken, tokenAge, refreshTokenAge } = getAllJWT({ owner });

  return {
    accessToken,
    refreshToken,
    tokenAge,
    refreshTokenAge,
    data: owner,
  };
};
const getAccessToken = async (refreshToken: string) => {
  try {
    const decoded = verifyRefreshToken(refreshToken);

    const owner = await prisma.owner.findUnique({ where: { id: decoded.id } });
    if (!owner) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'owner not found');
    }

    const tokenAge = getJwtExpiryMs();
    const accessToken = generateJwtToken({ ...owner }, config.jwt.secret, tokenAge);

    return { accessToken, owner };
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid refresh token');
  }
};

const getProfile = async (userId: string) => {
  return prisma.owner.findUnique({ where: { id: userId } });
};

const updateProfile = async (userId: string, payload: Partial<Prisma.OwnerUpdateInput>) => {
  return prisma.owner.update({
    where: { id: userId },
    data: payload,
  });
};

function getAllJWT({ owner }: { owner: Owner }) {
  const tokenAge = getJwtExpiryMs();

  const accessToken = generateJwtToken(
    { id: owner.id, name: owner.name },
    config.jwt.secret,
    tokenAge,
  );

  if (!accessToken) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to generate access token');
  }

  const refreshTokenAge = getRefreshTokenExpiryMs();
  const refreshToken = generateJwtToken(
    { id: owner.id },
    config.jwt.refresh_secret,
    refreshTokenAge,
  );

  return {
    accessToken,
    refreshToken,
    tokenAge,
    refreshTokenAge,
  };
}

export const AuthService = {
  requestCode,
  verifyCode,
  getAccessToken,
  getProfile,
  updateProfile,
};
