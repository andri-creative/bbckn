import { Router } from 'express';
import {
    createAlbum,
    getAlbums,
    getAlbumById,
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

router.delete('/:id', deleteAlbum);

export default router;
