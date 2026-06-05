import { Request, Response } from 'express';
import { ToolsIconService } from '../services/toolsIcon.service';
import { pusher } from '../config/pusher.config';

export const createToolsIcon = async (req: Request, res: Response): Promise<void> => {
    try {
        const icon = await ToolsIconService.create(req.body);

        try {
            await pusher.trigger('tools-icon-channel', 'tools-icon-updated', { action: 'create', data: icon });
        } catch (err) {}

        res.status(201).json({ success: true, message: 'Tools Icon berhasil ditambahkan', data: icon });
    } catch (error: any) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

export const getToolsIcons = async (req: Request, res: Response): Promise<void> => {
    try {
        const icons = await ToolsIconService.getAll();
        res.status(200).json({ success: 'ok', data: icons });
    } catch (error: any) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

export const getToolsIconById = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
        const icon = await ToolsIconService.getById(req.params.id as string);
        if (!icon) {
            res.status(404).json({ success: false, message: 'Tools Icon tidak ditemukan' });
            return;
        }
        res.status(200).json({ success: true, data: icon });
    } catch (error: any) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

export const updateToolsIcon = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
        const icon = await ToolsIconService.update(req.params.id as string, req.body);
        if (!icon) {
            res.status(404).json({ success: false, message: 'Tools Icon tidak ditemukan' });
            return;
        }

        try {
            await pusher.trigger('tools-icon-channel', 'tools-icon-updated', { action: 'update', data: icon });
        } catch (err) {}

        res.status(200).json({ success: true, message: 'Tools Icon berhasil diupdate', data: icon });
    } catch (error: any) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

export const deleteToolsIcon = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
        const icon = await ToolsIconService.delete(req.params.id as string);
        if (!icon) {
            res.status(404).json({ success: false, message: 'Tools Icon tidak ditemukan' });
            return;
        }

        try {
            await pusher.trigger('tools-icon-channel', 'tools-icon-updated', { action: 'delete', id: req.params.id });
        } catch (err) {}

        res.status(200).json({ success: true, message: 'Tools Icon berhasil dihapus' });
    } catch (error: any) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};
