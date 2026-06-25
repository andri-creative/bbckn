import { Router } from 'express';
import achievementRoutes from './achievement.routes';
import albumRoutes from './album.routes';
import rantingRoutes from './ranting.routes';
import experienceRoutes from './experience.routes';
import toolsRoutes from './tools.routes';
import projectRoutes from './project.routes';
import { validateTimestamp } from '../middewares/timestamp.Middleware';

import toolsIconRoutes from './toolsIcon.routes';
import bioRoutes from './bio.routes';
import userRoutes from './user.routes';
import { isAdmin } from '../middewares/auth.middleware';

const router = Router();

// Wajib menyertakan header timestamp yang valid untuk semua request API
router.use(validateTimestamp);

// Middleware global: GET hanya butuh timestamp (sudah lewat di atas)
// POST, PUT, PATCH, DELETE wajib menyertakan cookie (isAdmin)
router.use((req, res, next) => {
  // Biarkan method GET lewat
  if (req.method === 'GET') {
    return next();
  }

  // Pengecualian untuk path login, logout, setup (admin pertama), dan voting rating (POST /ranting)
  if (
    req.path === '/user/login' ||
    req.path === '/user/logout' ||
    req.path === '/user/setup' ||
    (req.method === 'POST' && (req.path === '/ranting' || req.path === '/ranting/'))
  ) {
    return next();
  }

  // Method selain GET akan dilempar ke pengecekan Admin (cookie)
  isAdmin(req, res, next);
});

router.use('/achievement', achievementRoutes);
router.use('/album', albumRoutes);
router.use('/ranting', rantingRoutes);
router.use('/experience', experienceRoutes);
router.use('/tools', toolsRoutes);
router.use('/project', projectRoutes);
router.use('/tools-icon', toolsIconRoutes);
router.use('/bio', bioRoutes);
router.use('/user', userRoutes);

export default router;
