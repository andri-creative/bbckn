import { Router } from 'express';
import {
    createAlbum,
    getAlbums,
    getAlbumById,
    updateAlbum,
    deleteAlbum
} from '../controllers/album.controller';
import { validateAlbum } from '../validators/album.validator';
import { createUploader } from '../middewares/image.Upload';
import { convertToWebp } from '../middewares/image.Converter';

const router = Router();

// Endpoint untuk menambahkan album baru
router.post(
    '/',
    createUploader('albums').array('image', 5),
    convertToWebp,
    validateAlbum,
    createAlbum
);

router.get('/', getAlbums);

router.get('/:id', getAlbumById);

// Update album tanpa validasi body ketat
router.put('/:id', createUploader('albums').array('image', 5), convertToWebp, updateAlbum);

router.delete('/:id', deleteAlbum);

export default router;
