import * as z from 'zod';

export const UserCreateRequest = z.object({
  email: z.email('Invalid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .max(100, 'Password must be at most 100 characters long'),
});

export type UserCreateResponse = {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};
