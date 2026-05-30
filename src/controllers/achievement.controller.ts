import { Request, Response } from 'express';
import { AchievementService } from '../services/achievement.service';

export const createAchievement = async (req: Request, res: Response): Promise<void> => {
    try {
        const achievement = await AchievementService.create(req.body, req.file);

        res.status(201).json({
            success: true,
            message: 'Achievement berhasil ditambahkan',
            data: achievement
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};


export const getAchievements = async (req: Request, res: Response): Promise<void> => {
    try {
        const achievements = await AchievementService.getAll();
        res.status(200).json({ success: 'ok', data: achievements });
    } catch (error: any) {
        console.error('Error saat getAll:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};



export const getAchievementById = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
        const achievement = await AchievementService.getById(req.params.id as string);
        if (!achievement) {
            res.status(404).json({ success: false, message: 'Achievement tidak ditemukan' });
            return;
        }
        res.status(200).json({ success: true, data: achievement });
    } catch (error: any) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

export const deleteAchievement = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
        const achievement = await AchievementService.delete(req.params.id as string);
        if (!achievement) {
            res.status(404).json({ success: false, message: 'Achievement tidak ditemukan' });
            return;
        }
        res.status(200).json({ success: true, message: 'Achievement berhasil dihapus' });
    } catch (error: any) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};
