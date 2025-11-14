import { User } from '@prisma/client';
export declare const authService: {
    login(email: string, password: string): Promise<{
        user: {
            id: any;
            username: any;
            email: any;
        };
        accessToken: any;
        refreshToken: any;
    }>;
    /**
     * Refresh an access token using a valid refresh token.
     *
     * Returns an object containing a new access token.
     * Optionally you can rotate refresh tokens by also returning a new refresh token here.
     */
    refresh(refreshToken: string): Promise<{
        accessToken: any;
        refreshToken: any;
    }>;
    generateAccessToken(user: User): any;
    generateRefreshToken(user: User): any;
};
//# sourceMappingURL=auth.d.ts.map