import db from './db';

export const userRepository = {
  async getAllUsers() {
    return await db.user.findMany();
  },

  async getUserById(id: string) {
    return await db.user.findUnique({ where: { id } });
  },

  async getUserByEmail(email: string) {
    return await db.user.findUnique({ where: { email } });
  },

  async createUser(data: { email: string; password: string }) {
    return await db.user.create({ data });
  },
};
