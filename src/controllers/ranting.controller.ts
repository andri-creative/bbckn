import { Request, Response } from 'express';
import { RantingService } from '../services/ranting.service';

export const createRanting = async (req: Request, res: Response): Promise<void> => {
    try {
        const { rating } = req.body;
        const rantingData = await RantingService.submitVote(Number(rating));

        res.status(201).json({
            success: true,
            message: 'Terima kasih atas penilaian Anda!',
            data: rantingData
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

export const getRantings = async (req: Request, res: Response): Promise<void> => {
    try {
        const rantings = await RantingService.getAll();
        res.status(200).json({ success: 'ok', data: rantings });
    } catch (error: any) {
        console.error('Error saat getAll ranting:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

export const getRantingById = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
        const ranting = await RantingService.getById(req.params.id as string);
        if (!ranting) {
            res.status(404).json({ success: false, message: 'Ranting tidak ditemukan' });
            return;
        }
        res.status(200).json({ success: true, data: ranting });
    } catch (error: any) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

export const deleteRanting = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
        const ranting = await RantingService.delete(req.params.id as string);
        if (!ranting) {
            res.status(404).json({ success: false, message: 'Ranting tidak ditemukan' });
            return;
        }
        res.status(200).json({ success: true, message: 'Ranting berhasil dihapus' });
    } catch (error: any) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};
