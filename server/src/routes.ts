import { Router } from 'express';
import { getUsers, createUser } from './handlers/users';
import { login, logout, refresh } from './handlers/auth';

const router = Router();

const userRouter = Router();
userRouter.get('/', getUsers);
userRouter.post('/', createUser);
router.use('/users', userRouter);

const authRouter = Router();
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.post('/refresh', refresh);
router.use('/auth', authRouter);

export default router;
