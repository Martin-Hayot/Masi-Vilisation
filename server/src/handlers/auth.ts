import { Request, Response, NextFunction } from 'express';
import { LoginRequest } from '../schemas/auth';
import logger from '../utils/logger';
import { authService } from '../services/auth';
import { BadRequestError, UnauthorizedError } from '../errors';

/**
 * Get current user from access token
 * Express 5 automatically catches async errors - no try-catch needed!
 */
export const me = async (req: Request, res: Response) => {
  const accessToken = req.cookies?.accessToken;

  if (!accessToken) {
    throw new UnauthorizedError('Access token required');
  }

  const user = await authService.getUserFromToken(accessToken);
  res.status(200).json({ user });
};

/**
 * Login user with email and password
 */
export const login = async (req: Request, res: Response) => {
  const parseResult = LoginRequest.safeParse(req.body);

  if (!parseResult.success) {
    logger.error('Invalid login request:', parseResult.error);
    throw new BadRequestError('Invalid login request data');
  }

  const { email, password } = parseResult.data;

  const { user, accessToken, refreshToken } = await authService.login(
    email,
    password,
  );

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(200).json({ user });
};

/**
 * Logout user by clearing auth cookies
 */
export const logout = (req: Request, res: Response) => {
  res.clearCookie('accessToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });

  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });

  res.status(200).json({ message: 'Logged out' });
};

/**
 * Refresh access token using refresh token
 */
export const refresh = async (req: Request, res: Response) => {
  const refreshToken =
    req.cookies?.refreshToken ||
    req.body?.refreshToken ||
    req.header('x-refresh-token');

  if (!refreshToken) {
    throw new UnauthorizedError('Refresh token required');
  }

  const { accessToken, refreshToken: newRefreshToken } =
    await authService.refresh(refreshToken);

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.cookie('refreshToken', newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(200).json({ accessToken });
};
