import { Router } from 'express';
import multer from 'multer';
import { convertToWebp } from '../middewares/image.Converter';
import {
    createTools,
    getTools,
    getToolById,
    updateTools,
    deleteTools
} from '../controllers/tools.controller';
import { validateTools } from '../validators/tools.validator';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('icon'), convertToWebp, validateTools, createTools);
router.get('/', getTools);
router.get('/:id', getToolById);
router.put('/:id', upload.single('icon'), convertToWebp, validateTools, updateTools);
router.delete('/:id', deleteTools);

export default router;
