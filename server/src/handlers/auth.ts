import { Request, Response, NextFunction } from 'express';
import { LoginRequest } from '../schemas/auth';
import logger from '../utils/logger';
import { authService } from '../services/auth';

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const parseResult = LoginRequest.safeParse(req.body);

  if (!parseResult.success) {
    logger.error(`Invalid login request: ${parseResult.error}`);
    return res.status(400).json({ error: parseResult.error });
  }

  const { email, password } = parseResult.data;

  try {
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
  } catch (err) {
    logger.error(`Error during login: ${err}`);
    next(err);
  }
};

export const logout = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Clear auth cookies on logout. Use the same cookie options shape as when setting them.
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
  } catch (err) {
    logger.error(`Error during logout: ${err}`);
    next(err);
  }
};

export const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Try multiple places for the refresh token:
    // 1) cookie (common with browsers)
    // 2) request body (for clients that send it explicitly)
    // 3) custom header `x-refresh-token` (optional)
    const refreshToken =
      (req as any).cookies?.refreshToken ||
      req.body?.refreshToken ||
      req.header('x-refresh-token');

    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token required' });
    }

    const { accessToken } = await authService.refresh(refreshToken);

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

    // Return the new access token in the response body as well
    res.status(200).json({ accessToken });
  } catch (err: any) {
    logger.error(`Error during token refresh: ${err}`);

    // Map common token errors to 401 so clients can react (e.g. prompt login)
    const msg = err?.message?.toLowerCase?.() || '';
    if (
      msg.includes('expired') ||
      msg.includes('invalid') ||
      msg.includes('refresh token')
    ) {
      return res
        .status(401)
        .json({ error: err.message || 'Invalid or expired refresh token' });
    }

    next(err);
  }
};
