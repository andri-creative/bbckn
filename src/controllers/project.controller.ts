import { Request, Response } from 'express';
import { ProjectService } from '../services/project.service';

export const createProject = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.file) {
            res.status(400).json({ success: false, message: 'Gambar wajib diupload' });
            return;
        }
        const project = await ProjectService.create(req.body, req.file);
        res.status(201).json({ success: true, message: 'Project berhasil ditambahkan', data: project });
    } catch (error: any) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

export const getProjects = async (req: Request, res: Response): Promise<void> => {
    try {
        const projects = await ProjectService.getAll();
        res.status(200).json({ success: 'ok', data: projects });
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
        const project = await ProjectService.update(req.params.id as string, req.body, req.file);
        if (!project) {
            res.status(404).json({ success: false, message: 'Project tidak ditemukan' });
            return;
        }
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
        res.status(200).json({ success: true, message: 'Project berhasil dihapus' });
    } catch (error: any) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};
