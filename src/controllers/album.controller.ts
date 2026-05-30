import { Request, Response } from 'express';
import { AlbumService } from '../services/album.service';

export const createAlbum = async (req: Request, res: Response): Promise<void> => {
    try {
        const album = await AlbumService.create(req.body, (req.files || req.file) as any);

        res.status(201).json({
            success: true,
            message: 'Album berhasil ditambahkan',
            data: album
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

export const getAlbums = async (req: Request, res: Response): Promise<void> => {
    try {
        const albums = await AlbumService.getAll();
        res.status(200).json({ success: 'ok', data: albums });
    } catch (error: any) {
        console.error('Error saat getAll album:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

export const getAlbumById = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
        const album = await AlbumService.getById(req.params.id as string);
        if (!album) {
            res.status(404).json({ success: false, message: 'Album tidak ditemukan' });
            return;
        }
        res.status(200).json({ success: true, data: album });
    } catch (error: any) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

export const deleteAlbum = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
        const album = await AlbumService.delete(req.params.id as string);
        if (!album) {
            res.status(404).json({ success: false, message: 'Album tidak ditemukan' });
            return;
        }
        res.status(200).json({ success: true, message: 'Album berhasil dihapus' });
    } catch (error: any) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};
