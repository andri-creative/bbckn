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

const router = Router();

// Wajib menyertakan header timestamp yang valid untuk semua request API
router.use(validateTimestamp);

router.use('/achievement', achievementRoutes);
router.use('/album', albumRoutes);
router.use('/ranting', rantingRoutes);
router.use('/experience', experienceRoutes);
router.use('/tools', toolsRoutes);
router.use('/project', projectRoutes);
router.use('/tools-icon', toolsIconRoutes);
router.use('/bio', bioRoutes);

export default router;
