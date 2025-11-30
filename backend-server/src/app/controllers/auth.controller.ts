import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { AuthService } from '../services/auth.service';

const requestCode = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { phone } = req.body;
    const result = await AuthService.requestCode(phone);

    console.log({ result });

    res.status(httpStatus.OK).json({
      statusCode: httpStatus.OK,
      success: true,
      message: 'Code sent successfully',
      // data: result,
    });
  } catch (error) {
    next(error);
  }
};

const verifyCode = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { phone, code } = req.body;
    const result = await AuthService.verifyCode(phone, code);

    const { accessToken, refreshToken, tokenAge, refreshTokenAge, data } = result;

    console.log({
      accessToken,
      refreshToken,
      tokenAge,
      refreshTokenAge,
      data,
    });

    req.session.userId = data.id;

    req.session.save((err) => {
      if (err) {
        next(err);
        return;
      }
      res.cookie('accessToken', result.accessToken, {
        httpOnly: true,
        secure: true,
      });
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: true,
      });
      res.status(httpStatus.OK).json({
        statusCode: httpStatus.OK,
        success: true,
        message: 'Welcome to Homify App',
        data: {
          user: data,
          accessToken: accessToken,
          accessTokenExp: Date.now() + tokenAge,
          refreshToken: refreshToken,
          refreshTokenExp: Date.now() + refreshTokenAge,
        },
      });
    });
  } catch (error) {
    next(error);
  }
};

const getAccessToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      res.status(httpStatus.UNAUTHORIZED).json({
        success: false,
        message: 'Refresh token required',
      });
      return;
    }
    const result = await AuthService.getAccessToken(refreshToken);
    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: true,
    });
    res.status(httpStatus.OK).json({
      statusCode: httpStatus.OK,
      success: true,
      message: 'Access token refreshed',
      accessToken: result.accessToken,
      data: {
        user: result.owner,
        accessToken: result.accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.session.userId;
    if (!userId) {
      res.status(httpStatus.UNAUTHORIZED).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }
    const user = await AuthService.getProfile(userId);
    if (!user) {
      res.status(httpStatus.NOT_FOUND).json({
        success: false,
        message: 'User not found',
      });
      return;
    }
    res.status(httpStatus.OK).json({
      statusCode: httpStatus.OK,
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.session.userId;
    if (!userId) {
      res.status(httpStatus.UNAUTHORIZED).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }
    const updatedUser = await AuthService.updateProfile(userId, req.body);
    res.status(httpStatus.OK).json({
      statusCode: httpStatus.OK,
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

export const AuthController = {
  requestCode,
  verifyCode,
  getAccessToken,
  getProfile,
  updateProfile,
};
