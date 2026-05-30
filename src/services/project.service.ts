import Project, { IProject } from '../models/project.model';
import { uploadToBox, getBoxFileUrl, getOrCreateBoxFolder } from '../helpers/boxUploader';

export class ProjectService {
    static async create(data: any, file?: Express.Multer.File): Promise<IProject> {
        if (!file) throw new Error('Gambar project wajib diupload');
        const folderId = await getOrCreateBoxFolder('projects');
        const uploadedFile = await uploadToBox(file.buffer, file.originalname, folderId);
        
        const newProject = new Project({ ...data, image: uploadedFile });
        return await newProject.save();
    }

    static async getAll(): Promise<any[]> {
        const projects = await Project.find().populate('tools').populate('techStack').sort({ createdAt: -1 });
        return Promise.all(projects.map(async (project) => {
            const data: any = project.toObject();
            if (data.image) {
                try { data.imageUrl = await getBoxFileUrl(data.image); } catch (e) { data.imageUrl = null; }
            }
            if (data.tools && Array.isArray(data.tools)) {
                data.tools = await Promise.all(data.tools.map(async (tool: any) => {
                    if (tool && tool.icon) {
                        try { tool.iconUrl = await getBoxFileUrl(tool.icon); } catch (e) { tool.iconUrl = null; }
                    }
                    return tool;
                }));
            }
            if (data.techStack && Array.isArray(data.techStack)) {
                data.techStack = await Promise.all(data.techStack.map(async (ts: any) => {
                    if (ts && ts.icon) {
                        try { ts.iconUrl = await getBoxFileUrl(ts.icon); } catch (e) { ts.iconUrl = null; }
                    }
                    return ts;
                }));
            }
            return data;
        }));
    }

    static async getById(id: string): Promise<any | null> {
        const project = await Project.findById(id).populate('tools').populate('techStack');
        if (!project) return null;
        
        const data: any = project.toObject();
        if (data.image) {
            try { data.imageUrl = await getBoxFileUrl(data.image); } catch (e) { data.imageUrl = null; }
        }
        if (data.tools && Array.isArray(data.tools)) {
            data.tools = await Promise.all(data.tools.map(async (tool: any) => {
                if (tool && tool.icon) {
                    try { tool.iconUrl = await getBoxFileUrl(tool.icon); } catch (e) { tool.iconUrl = null; }
                }
                return tool;
            }));
        }
        if (data.techStack && Array.isArray(data.techStack)) {
            data.techStack = await Promise.all(data.techStack.map(async (ts: any) => {
                if (ts && ts.icon) {
                    try { ts.iconUrl = await getBoxFileUrl(ts.icon); } catch (e) { ts.iconUrl = null; }
                }
                return ts;
            }));
        }
        return data;
    }

    static async update(id: string, data: any, file?: Express.Multer.File): Promise<IProject | null> {
        const project = await Project.findById(id);
        if (!project) return null;

        if (file) {
            const folderId = await getOrCreateBoxFolder('projects');
            const uploadedFile = await uploadToBox(file.buffer, file.originalname, folderId);
            data.image = uploadedFile;
        }
        return await Project.findByIdAndUpdate(id, data, { new: true }).populate('tools').populate('techStack');
    }

    static async delete(id: string): Promise<IProject | null> {
        return await Project.findByIdAndDelete(id);
    }
}
