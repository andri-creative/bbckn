import Project, { IProject } from '../models/project.model';
import { uploadToBox, getBoxFileUrl, getOrCreateBoxFolder } from '../helpers/boxUploader';

export class ProjectService {
    static async create(data: any, files?: Express.Multer.File[]): Promise<IProject> {
        if (files && files.length > 0) {
            const folderId = await getOrCreateBoxFolder('projects');
            if (!data.image) data.image = [];
            if (!Array.isArray(data.image)) data.image = [data.image];

            for (const file of files) {
                const uploadedFile = await uploadToBox(file.buffer, file.originalname, folderId);
                data.image.push(uploadedFile);
            }
        }
        
        const newProject = new Project(data);
        return await newProject.save();
    }

    static async getAll(page: number = 1, limit: number = 20): Promise<{ data: any[], pagination: any }> {
        const skip = (page - 1) * limit;
        const total = await Project.countDocuments();
        
        const projects = await Project.find()
            .populate('tools')
            .populate('techStack')
            .sort({ sort: 1, createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const mappedData = await Promise.all(projects.map(async (project) => {
            const data: any = project.toObject();
            if (data.image && Array.isArray(data.image)) {
                data.imageUrls = await Promise.all(data.image.map(async (img: string) => {
                    if (img.startsWith('http')) return img;
                    try { return await getBoxFileUrl(img); } catch { return img; }
                }));
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

        return {
            data: mappedData,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };
    }

    static async getById(id: string): Promise<any | null> {
        const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
        const query = isObjectId ? { $or: [{ _id: id }, { slug: id }] } : { slug: id };
        const project = await Project.findOne(query).populate('tools').populate('techStack');
        if (!project) return null;
        
        const data: any = project.toObject();
        if (data.image && Array.isArray(data.image)) {
            data.imageUrls = await Promise.all(data.image.map(async (img: string) => {
                if (img.startsWith('http')) return img;
                try { return await getBoxFileUrl(img); } catch { return img; }
            }));
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

    static async update(id: string, data: any, files?: Express.Multer.File[]): Promise<IProject | null> {
        const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
        const query = isObjectId ? { $or: [{ _id: id }, { slug: id }] } : { slug: id };
        const project = await Project.findOne(query);
        if (!project) return null;

        if (files && files.length > 0) {
            const folderId = await getOrCreateBoxFolder('projects');
            if (!data.image) data.image = [];
            if (!Array.isArray(data.image)) data.image = [data.image];

            for (const file of files) {
                const uploadedFile = await uploadToBox(file.buffer, file.originalname, folderId);
                data.image.push(uploadedFile);
            }
        }
        return await Project.findOneAndUpdate(query, data, { new: true }).populate('tools').populate('techStack');
    }

    static async delete(id: string): Promise<IProject | null> {
        const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
        const query = isObjectId ? { $or: [{ _id: id }, { slug: id }] } : { slug: id };
        return await Project.findOneAndDelete(query);
    }
}
