import { Router } from 'express';
import { createUser, getUsers, deleteUser, loginUser, logoutUser, checkAuth, setupInitialAdmin } from '../controllers/user.controller';
import { validateUser } from '../validators/user.validator';
import { isAuth, isAdmin } from '../middewares/auth.middleware';

const router = Router();

// Route Auth & Session
router.post('/setup', setupInitialAdmin);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/check-auth', checkAuth);

// Route untuk manajemen user
// Tidak ada route register untuk public. Admin yang membuat user.
router.post('/', isAuth, isAdmin, validateUser, createUser);
router.get('/', isAuth, isAdmin, getUsers);
router.delete('/:id', isAuth, isAdmin, deleteUser);

export default router;
