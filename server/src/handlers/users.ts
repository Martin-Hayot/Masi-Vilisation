import { Request, Response, NextFunction } from 'express';
import { userService } from '../services/users';
import { UserCreateRequest, UserCreateResponse } from '../schemas/user';
import logger from '../utils/logger';

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const users = await userService.getAllUsers();
    logger.info(`Successfully retrieved ${users.length} users`);
    res.json(
      users.map((user) => ({
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })),
    );
  } catch (err) {
    logger.error(`Error fetching users: ${err}`);
    next(err);
  }
};

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const parseResult = UserCreateRequest.safeParse(req.body);

  if (!parseResult.success) {
    return res.status(400).json({ error: parseResult.error });
  }

  const { username, email, password } = parseResult.data;

  try {
    const user = await userService.createUser(username, email, password);

    if (!user) {
      return res.status(500).json({ error: 'Failed to create user' });
    }
    res.status(201).json({
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    } as UserCreateResponse);
  } catch (err) {
    logger.error(`Error creating user: ${err}`);
    next(err);
  }
};
