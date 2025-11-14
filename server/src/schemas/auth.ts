import * as z from 'zod';

export const LoginRequest = z.object({
  email: z.email('Invalid email address'),
  password: z.string(),
});

export type LoginResponse = {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};
