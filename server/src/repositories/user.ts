import db from './db';

export const userRepository = {
  async getAllUsers() {
    return await db.user.findMany();
  },

  async getUserById(id: string) {
    return await db.user.findUnique({ where: { id } });
  },

  async getUserByUsername(username: string) {
    return await db.user.findUnique({ where: { username } });
  },

  async getUserByEmail(email: string) {
    return await db.user.findUnique({ where: { email } });
  },

  async createUser(data: {
    username: string;
    email: string;
    password: string;
  }) {
    return await db.user.create({ data });
  },
};
