import logger from '../utils/logger';
import { hashPassword } from '../utils/auth';
import { userRepository } from '../repositories/user';

export const userService = {
  async getAllUsers() {
    return await userRepository.getAllUsers();
  },
  async createUser(email: string, password: string) {
    const existingUser = await userRepository.getUserByEmail(email);
    if (existingUser) {
      logger.warn(`User with email ${email} already exists`);
      return null;
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await userRepository.createUser({
      email,
      password: hashedPassword,
    });
    return newUser;
  },
};
