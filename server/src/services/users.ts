import logger from '../utils/logger';
import { hashPassword } from '../utils/auth';
import { userRepository } from '../repositories/user';

export const userService = {
  async getAllUsers() {
    return await userRepository.getAllUsers();
  },
  async createUser(username: string, email: string, password: string) {
    const userByUsername = await userRepository.getUserByUsername(username);
    if (userByUsername) {
      throw new Error('username is taken');
    }

    const existingUser = await userRepository.getUserByEmail(email);
    if (existingUser) {
      throw new Error('email is taken');
    }

    const hashedPassword = await hashPassword(password);

    try {
      const newUser = await userRepository.createUser({
        username,
        email,
        password: hashedPassword,
      });

      return newUser;
    } catch (err) {
      throw new Error('internal server error');
    }
  },
};
