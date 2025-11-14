import * as z from 'zod';
export declare const LoginRequest: z.ZodObject<{
    email: z.ZodEmail;
    password: z.ZodString;
}, z.core.$strip>;
export type LoginResponse = {
    id: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
};
//# sourceMappingURL=auth.d.ts.map