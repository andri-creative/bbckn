import Tools, { ITools } from '../models/tools.model';
import { uploadToBox, getBoxFileUrl, getOrCreateBoxFolder } from '../helpers/boxUploader';

export class ToolsService {
    static async create(data: any, file?: Express.Multer.File): Promise<ITools> {
        if (!file) throw new Error('Icon wajib diupload');
        const folderId = await getOrCreateBoxFolder('tools');
        const uploadedFile = await uploadToBox(file.buffer, file.originalname, folderId);
        
        const newTool = new Tools({ ...data, icon: uploadedFile });
        return await newTool.save();
    }

    static async getAll(): Promise<any[]> {
        const tools = await Tools.find().sort({ createdAt: -1 });
        return Promise.all(tools.map(async (tool) => {
            const data: any = tool.toObject();
            if (data.icon) {
                try {
                    data.iconUrl = await getBoxFileUrl(data.icon);
                } catch (e) { data.iconUrl = null; }
            }
            return data;
        }));
    }

    static async getById(id: string): Promise<any | null> {
        const tool = await Tools.findById(id);
        if (!tool) return null;
        const data: any = tool.toObject();
        if (data.icon) {
            try { data.iconUrl = await getBoxFileUrl(data.icon); } catch (e) { data.iconUrl = null; }
        }
        return data;
    }

    static async update(id: string, data: any, file?: Express.Multer.File): Promise<ITools | null> {
        const tool = await Tools.findById(id);
        if (!tool) return null;

        if (file) {
            const folderId = await getOrCreateBoxFolder('tools');
            const uploadedFile = await uploadToBox(file.buffer, file.originalname, folderId);
            data.icon = uploadedFile;
        }
        return await Tools.findByIdAndUpdate(id, data, { new: true });
    }

    static async delete(id: string): Promise<ITools | null> {
        return await Tools.findByIdAndDelete(id);
    }
}
