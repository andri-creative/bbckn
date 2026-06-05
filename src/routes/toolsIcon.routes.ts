import { Router } from 'express';
import {
    createToolsIcon,
    getToolsIcons,
    getToolsIconById,
    updateToolsIcon,
    deleteToolsIcon
} from '../controllers/toolsIcon.controller';
import { validateToolsIcon, validateUpdateToolsIcon } from '../validators/toolsIcon.validator';

const router = Router();

router.post('/', validateToolsIcon, createToolsIcon);
router.get('/', getToolsIcons);
router.get('/:id', getToolsIconById);
router.put('/:id', validateUpdateToolsIcon, updateToolsIcon);
router.delete('/:id', deleteToolsIcon);

export default router;
