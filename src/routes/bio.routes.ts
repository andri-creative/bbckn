import { Router } from 'express';
import {
    createBio,
    getBios,
    getBioById,
    updateBio,
    deleteBio
} from '../controllers/bio.controller';

const router = Router();

router.post('/', createBio);
router.get('/', getBios);
router.get('/:id', getBioById);
router.put('/:id', updateBio);
router.delete('/:id', deleteBio);

export default router;
