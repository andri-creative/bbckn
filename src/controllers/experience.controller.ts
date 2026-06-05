import { Request, Response } from 'express';
import { ExperienceService } from '../services/experience.service';
import { pusher } from '../config/pusher.config';

export const createExperience = async (req: Request, res: Response): Promise<void> => {
    try {
        const experience = await ExperienceService.create(req.body, req.file);

        try {
            await pusher.trigger('experience-channel', 'experience-updated', { action: 'create', data: experience });
        } catch (err) {}

        res.status(201).json({
            success: true,
            message: 'Experience berhasil ditambahkan',
            data: experience
        });
    } catch (error: any) {
        console.error('Error createExperience:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

export const getExperiences = async (req: Request, res: Response): Promise<void> => {
    try {
        const experiences = await ExperienceService.getAll();
        res.status(200).json({ success: 'ok', data: experiences });
    } catch (error: any) {
        console.error('Error saat getAll experience:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

export const getExperienceById = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
        const exp = await ExperienceService.getById(req.params.id as string);
        if (!exp) {
            res.status(404).json({ success: false, message: 'Experience tidak ditemukan' });
            return;
        }
        res.status(200).json({ success: true, data: exp });
    } catch (error: any) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

export const updateExperience = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
        const exp = await ExperienceService.update(req.params.id as string, req.body, req.file);
        if (!exp) {
            res.status(404).json({ success: false, message: 'Experience tidak ditemukan' });
            return;
        }

        try {
            await pusher.trigger('experience-channel', 'experience-updated', { action: 'update', data: exp });
        } catch (err) {}

        res.status(200).json({ success: true, message: 'Experience berhasil diupdate', data: exp });
    } catch (error: any) {
        console.error('Error updateExperience:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

export const deleteExperience = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
        const exp = await ExperienceService.delete(req.params.id as string);
        if (!exp) {
            res.status(404).json({ success: false, message: 'Experience tidak ditemukan' });
            return;
        }

        try {
            await pusher.trigger('experience-channel', 'experience-updated', { action: 'delete', id: req.params.id });
        } catch (err) {}

        res.status(200).json({ success: true, message: 'Experience berhasil dihapus' });
    } catch (error: any) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};
