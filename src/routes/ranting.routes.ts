import { Router } from 'express';
import {
    createRanting,
    getRantings,
    getRantingById,
    deleteRanting
} from '../controllers/ranting.controller';
import { validateRanting } from '../validators/ranting.validator';

const router = Router();

// Endpoint untuk ranting (tanpa upload gambar)
router.post(
    '/',
    validateRanting,
    createRanting
);

router.get('/', getRantings);
router.get('/:id', getRantingById);
router.delete('/:id', deleteRanting);

export default router;
