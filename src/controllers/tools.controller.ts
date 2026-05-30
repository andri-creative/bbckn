import { Request, Response } from 'express';
import { ToolsService } from '../services/tools.service';

export const createTools = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.file) {
            res.status(400).json({ success: false, message: 'Icon wajib diupload' });
            return;
        }
        const tool = await ToolsService.create(req.body, req.file);
        res.status(201).json({ success: true, message: 'Tools berhasil ditambahkan', data: tool });
    } catch (error: any) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

export const getTools = async (req: Request, res: Response): Promise<void> => {
    try {
        const tools = await ToolsService.getAll();
        res.status(200).json({ success: 'ok', data: tools });
    } catch (error: any) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

export const getToolById = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
        const tool = await ToolsService.getById(req.params.id as string);
        if (!tool) {
            res.status(404).json({ success: false, message: 'Tools tidak ditemukan' });
            return;
        }
        res.status(200).json({ success: true, data: tool });
    } catch (error: any) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

export const updateTools = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
        const tool = await ToolsService.update(req.params.id as string, req.body, req.file);
        if (!tool) {
            res.status(404).json({ success: false, message: 'Tools tidak ditemukan' });
            return;
        }
        res.status(200).json({ success: true, message: 'Tools berhasil diupdate', data: tool });
    } catch (error: any) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

export const deleteTools = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
        const tool = await ToolsService.delete(req.params.id as string);
        if (!tool) {
            res.status(404).json({ success: false, message: 'Tools tidak ditemukan' });
            return;
        }
        res.status(200).json({ success: true, message: 'Tools berhasil dihapus' });
    } catch (error: any) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};
