import { Router } from 'express';
import multer from 'multer';
import { convertToWebp } from '../middewares/image.Converter';
import {
    createExperience,
    getExperiences,
    getExperienceById,
    updateExperience,
    deleteExperience
} from '../controllers/experience.controller';
import { validateExperience, validateUpdateExperience } from '../validators/experience.validator';


const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post(
    '/',
    upload.single('companyLogo'),
    convertToWebp,
    validateExperience,
    createExperience
);

router.get('/', getExperiences);
router.get('/:id', getExperienceById);

router.put(
    '/:id',
    upload.single('companyLogo'),
    convertToWebp,
    validateUpdateExperience,
    updateExperience
);

router.delete('/:id', deleteExperience);

export default router;
