import * as z from 'zod';

export const UserCreateRequest = z.object({
  username: z
    .string('Username is required')
    .min(2, 'Username must be at least 2 characters long')
    .max(50, 'Username must be at most 15 characters long'),
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
