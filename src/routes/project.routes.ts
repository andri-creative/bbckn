import { Router } from 'express';
import multer from 'multer';
import { convertToWebp } from '../middewares/image.Converter';
import {
    createProject,
    getProjects,
    getProjectById,
    updateProject,
    deleteProject
} from '../controllers/project.controller';
import { validateProject } from '../validators/project.validator';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.array('image', 6), convertToWebp, validateProject, createProject);
router.get('/', getProjects);
router.get('/:id', getProjectById);
router.put('/:id', upload.array('image', 6), convertToWebp, updateProject);
router.delete('/:id', deleteProject);

export default router;
