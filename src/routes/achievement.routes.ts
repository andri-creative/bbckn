import { Router } from 'express';
import {
    createAchievement,
    getAchievements,
    getAchievementById,
    updateAchievement,
    deleteAchievement
} from '../controllers/achievement.controller';
import { validateAchievement } from '../validators/achievement.validator';
import { createUploader } from '../middewares/image.Upload';
import { convertToWebp } from '../middewares/image.Converter';

const router = Router();

// Endpoint untuk menambahkan achievement baru
// Kita jalankan multer (upload) terlebih dahulu, lalu konversi ke WebP, baru kemudian validasi data body-nya
router.post(
    '/',
    createUploader('achievements').single('image'),
    convertToWebp,
    validateAchievement,
    createAchievement
);

router.get('/', getAchievements);

router.get('/:id', getAchievementById);

// Update achievement tanpa validasi body ketat untuk kemudahan partial update
router.put('/:id', createUploader('achievements').single('image'), convertToWebp, updateAchievement);

router.delete('/:id', deleteAchievement);

export default router;
