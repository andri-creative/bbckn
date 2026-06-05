import { Request, Response } from 'express';
import { ProjectService } from '../services/project.service';
import { pusher } from '../config/pusher.config';

export const createProject = async (req: Request, res: Response): Promise<void> => {
    try {
        const project = await ProjectService.create(req.body, req.files as Express.Multer.File[]);

        try {
            await pusher.trigger('project-channel', 'project-updated', { action: 'create', data: project });
        } catch (err) {}

        res.status(201).json({ success: true, message: 'Project berhasil ditambahkan', data: project });
    } catch (error: any) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

export const getProjects = async (req: Request, res: Response): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;

        const result = await ProjectService.getAll(page, limit);
        res.status(200).json({ 
            success: true, 
            data: result.data, 
            pagination: result.pagination 
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

export const getProjectById = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
        const project = await ProjectService.getById(req.params.id as string);
        if (!project) {
            res.status(404).json({ success: false, message: 'Project tidak ditemukan' });
            return;
        }
        res.status(200).json({ success: true, data: project });
    } catch (error: any) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

export const updateProject = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
        const project = await ProjectService.update(req.params.id as string, req.body, req.files as Express.Multer.File[]);
        if (!project) {
            res.status(404).json({ success: false, message: 'Project tidak ditemukan' });
            return;
        }

        try {
            await pusher.trigger('project-channel', 'project-updated', { action: 'update', data: project });
        } catch (err) {}

        res.status(200).json({ success: true, message: 'Project berhasil diupdate', data: project });
    } catch (error: any) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

export const deleteProject = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
        const project = await ProjectService.delete(req.params.id as string);
        if (!project) {
            res.status(404).json({ success: false, message: 'Project tidak ditemukan' });
            return;
        }

        try {
            await pusher.trigger('project-channel', 'project-updated', { action: 'delete', id: req.params.id });
        } catch (err) {}

        res.status(200).json({ success: true, message: 'Project berhasil dihapus' });
    } catch (error: any) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};
