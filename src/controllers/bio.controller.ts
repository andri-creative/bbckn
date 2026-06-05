import { Request, Response } from 'express';
import { BioService } from '../services/bio.service';
import { pusher } from '../config/pusher.config';

export const createBio = async (req: Request, res: Response): Promise<void> => {
    try {
        const bio = await BioService.create(req.body);

        try {
            await pusher.trigger('bio-channel', 'bio-updated', { action: 'create', data: bio });
        } catch (err) {}

        res.status(201).json({
            success: true,
            message: 'Bio berhasil ditambahkan',
            data: bio
        });
    } catch (error: any) {
        console.error('Error createBio:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

export const getBios = async (req: Request, res: Response): Promise<void> => {
    try {
        const bios = await BioService.getAll();
        res.status(200).json({ success: true, data: bios });
    } catch (error: any) {
        console.error('Error getBios:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

export const getBioById = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
        const bio = await BioService.getById(req.params.id as string);
        if (!bio) {
            res.status(404).json({ success: false, message: 'Bio tidak ditemukan' });
            return;
        }
        res.status(200).json({ success: true, data: bio });
    } catch (error: any) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

export const updateBio = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
        const bio = await BioService.update(req.params.id as string, req.body);
        if (!bio) {
            res.status(404).json({ success: false, message: 'Bio tidak ditemukan' });
            return;
        }

        try {
            await pusher.trigger('bio-channel', 'bio-updated', { action: 'update', data: bio });
        } catch (err) {}

        res.status(200).json({ success: true, message: 'Bio berhasil diupdate', data: bio });
    } catch (error: any) {
        console.error('Error updateBio:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

export const deleteBio = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
        const bio = await BioService.delete(req.params.id as string);
        if (!bio) {
            res.status(404).json({ success: false, message: 'Bio tidak ditemukan' });
            return;
        }

        try {
            await pusher.trigger('bio-channel', 'bio-updated', { action: 'delete', id: req.params.id });
        } catch (err) {}

        res.status(200).json({ success: true, message: 'Bio berhasil dihapus' });
    } catch (error: any) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};
