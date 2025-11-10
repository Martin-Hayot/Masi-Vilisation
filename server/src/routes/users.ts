import { Router } from 'express';
import { getUsers, createUser } from '../handlers/users';

const router = Router();

router.get('/', getUsers);
router.post('/', createUser);

export default router;
