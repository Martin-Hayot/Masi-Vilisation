import * as z from 'zod';
export declare const UserCreateRequest: z.ZodObject<{
    username: z.ZodString;
    email: z.ZodEmail;
    password: z.ZodString;
}, z.core.$strip>;
export type UserCreateResponse = {
    id: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
};
//# sourceMappingURL=user.d.ts.map