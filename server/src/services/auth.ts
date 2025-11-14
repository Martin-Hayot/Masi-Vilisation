import jwt from 'jsonwebtoken';
import { userRepository } from '../repositories/user';
import { verifyPassword } from '../utils/auth';
import { User } from '@prisma/client';

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
  async login(email: string, password: string) {
    const user = await userRepository.getUserByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      throw new Error('Invalid email or password');
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
        throw new Error('Invalid refresh token payload');
      }

      if (
        !payload ||
        (payload as any).type !== 'refresh' ||
        !(payload as any).sub
      ) {
        throw new Error('Invalid refresh token');
      }

      const userId = (payload as any).sub as string;
      const user = await userRepository.getUserById(userId);
      if (!user) {
        throw new Error('User not found for refresh token');
      }

      const accessToken = this.generateAccessToken(user);

      const newRefreshToken = this.generateRefreshToken(user);

      return { accessToken, refreshToken: newRefreshToken };
    } catch (err: any) {
      // Normalize errors so handlers can decide proper HTTP responses
      if (err.name === 'TokenExpiredError') {
        throw new Error('Refresh token expired');
      }
      if (err.name === 'JsonWebTokenError') {
        throw new Error('Invalid refresh token');
      }
      throw new Error(err.message || 'Failed to refresh access token');
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
      throw new Error('Failed to generate access token');
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
      throw new Error('Failed to generate refresh token');
    }
  },
};
