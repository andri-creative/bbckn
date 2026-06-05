import { Request, Response } from 'express';
import { AlbumService } from '../services/album.service';
import { pusher } from '../config/pusher.config';

export const createAlbum = async (req: Request, res: Response): Promise<void> => {
    try {
        const album = await AlbumService.create(req.body, (req.files || req.file) as any);

        try {
            await pusher.trigger('album-channel', 'album-updated', { action: 'create', data: album });
        } catch (err) {
            console.error('Pusher error on createAlbum:', err);
        }

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
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;

        const result = await AlbumService.getAll(page, limit);
        res.status(200).json({ 
            success: true, 
            data: result.data, 
            pagination: result.pagination 
        });
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

        try {
            await pusher.trigger('album-channel', 'album-updated', { action: 'delete', id: req.params.id });
        } catch (err) {
            console.error('Pusher error on deleteAlbum:', err);
        }

        res.status(200).json({ success: true, message: 'Album berhasil dihapus' });
    } catch (error: any) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

export const updateAlbum = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
        const album = await AlbumService.update(req.params.id as string, req.body, (req.files || req.file) as any);
        if (!album) {
            res.status(404).json({ success: false, message: 'Album tidak ditemukan' });
            return;
        }

        try {
            await pusher.trigger('album-channel', 'album-updated', { action: 'update', data: album });
        } catch (err) {
            console.error('Pusher error on updateAlbum:', err);
        }

        res.status(200).json({ success: true, message: 'Album berhasil diupdate', data: album });
    } catch (error: any) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};
