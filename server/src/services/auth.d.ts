import { User } from '@prisma/client';
export declare const authService: {
    login(email: string, password: string): Promise<{
        user: {
            id: any;
            username: any;
            email: any;
        };
        accessToken: string;
        refreshToken: string;
    }>;
    /**
     * Refresh an access token using a valid refresh token.
     *
     * Returns an object containing a new access token.
     * Optionally you can rotate refresh tokens by also returning a new refresh token here.
     */
    refresh(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    generateAccessToken(user: User): string;
    generateRefreshToken(user: User): string;
};
//# sourceMappingURL=auth.d.ts.map