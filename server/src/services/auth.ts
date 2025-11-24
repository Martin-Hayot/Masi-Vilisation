import jwt from 'jsonwebtoken';
import { userRepository } from '../repositories/user';
import { verifyPassword } from '../utils/auth';
import { User } from '@prisma/client';
import {
  UnauthorizedError,
  NotFoundError,
  InternalServerError,
} from '../errors';

if (!process.env.ACCESS_TOKEN_SECRET) {
  throw new Error('ACCESS_TOKEN_SECRET environment variable is required');
}
if (!process.env.REFRESH_TOKEN_SECRET) {
  throw new Error('REFRESH_TOKEN_SECRET environment variable is required');
}

const ACCESS_TOKEN_SECRET: jwt.Secret = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET: jwt.Secret = process.env.REFRESH_TOKEN_SECRET!;
const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN || '15m';
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';

export const authService = {
  async getUserFromToken(token: string) {
    try {
      const payload = jwt.verify(token, ACCESS_TOKEN_SECRET as jwt.Secret);
      if (typeof payload === 'string' || !(payload as any).sub) {
        throw new UnauthorizedError('Invalid token payload');
      }

      const userId = (payload as any).sub as string;
      const user = await userRepository.getUserById(userId);
      if (!user) {
        throw new NotFoundError('User not found');
      }

      return {
        id: user.id,
        username: user.username,
        email: user.email,
      };
    } catch (err: any) {
      // If it's already one of our custom errors, re-throw it
      if (err.statusCode) {
        throw err;
      }

      // Handle JWT-specific errors
      if (err.name === 'TokenExpiredError') {
        throw new UnauthorizedError('Access token expired');
      }
      if (err.name === 'JsonWebTokenError') {
        throw new UnauthorizedError('Invalid access token');
      }

      throw new UnauthorizedError('Invalid or expired access token');
    }
  },
  async login(email: string, password: string) {
    const user = await userRepository.getUserByEmail(email);
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    // return user without password
    const safeUser = {
      id: user.id,
      username: user.username,
      email: user.email,
    };

    return {
      user: safeUser,
      accessToken,
      refreshToken,
    };
  },

  /**
   * Refresh an access token using a valid refresh token.
   *
   * Returns an object containing a new access token.
   * Optionally you can rotate refresh tokens by also returning a new refresh token here.
   */
  async refresh(refreshToken: string) {
    try {
      // Verify the refresh token and ensure it's a refresh token
      const payload = jwt.verify(
        refreshToken,
        REFRESH_TOKEN_SECRET as jwt.Secret,
      ) as jwt.JwtPayload | string;

      if (typeof payload === 'string') {
        throw new UnauthorizedError('Invalid refresh token payload');
      }

      if (
        !payload ||
        (payload as any).type !== 'refresh' ||
        !(payload as any).sub
      ) {
        throw new UnauthorizedError('Invalid refresh token');
      }

      const userId = (payload as any).sub as string;
      const user = await userRepository.getUserById(userId);
      if (!user) {
        throw new NotFoundError('User not found for refresh token');
      }

      const accessToken = this.generateAccessToken(user);

      const newRefreshToken = this.generateRefreshToken(user);

      return { accessToken, refreshToken: newRefreshToken };
    } catch (err: any) {
      // If it's already one of our custom errors, re-throw it
      if (err.statusCode) {
        throw err;
      }

      // Handle JWT-specific errors
      if (err.name === 'TokenExpiredError') {
        throw new UnauthorizedError('Refresh token expired');
      }
      if (err.name === 'JsonWebTokenError') {
        throw new UnauthorizedError('Invalid refresh token');
      }

      throw new UnauthorizedError(
        err.message || 'Failed to refresh access token',
      );
    }
  },

  generateAccessToken(user: User) {
    try {
      const token = jwt.sign(
        {
          sub: user.id,
          username: user.username,
          type: 'access',
        },
        ACCESS_TOKEN_SECRET as jwt.Secret,
        { expiresIn: ACCESS_TOKEN_EXPIRES_IN } as jwt.SignOptions,
      );
      return token;
    } catch (err) {
      throw new InternalServerError('Failed to generate access token');
    }
  },

  generateRefreshToken(user: User) {
    try {
      const token = jwt.sign(
        {
          sub: user.id,
          username: user.username,
          type: 'refresh',
        },
        REFRESH_TOKEN_SECRET as jwt.Secret,
        { expiresIn: REFRESH_TOKEN_EXPIRES_IN } as jwt.SignOptions,
      );
      return token;
    } catch (err) {
      throw new InternalServerError('Failed to generate refresh token');
    }
  },
};
