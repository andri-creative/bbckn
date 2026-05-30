import Experience, { IExperience } from '../models/experience.model';
import { uploadToBox, getBoxFileUrl, getOrCreateBoxFolder } from '../helpers/boxUploader';

export class ExperienceService {
    static async create(data: any, file?: Express.Multer.File): Promise<IExperience> {
        let companyLogoUrl = '';

        if (file) {
            const folderId = await getOrCreateBoxFolder('experiences');
            const uploadedFile = await uploadToBox(file.buffer, file.originalname, folderId);
            companyLogoUrl = uploadedFile;
        }

        const newExp = new Experience({
            ...data,
            companyLogo: companyLogoUrl,
        });

        return await newExp.save();
    }

    static async getAll(): Promise<any[]> {
        const experiences = await Experience.find().sort({ startDate: -1 });
        return Promise.all(experiences.map(async (exp) => {
            const data: any = exp.toObject();
            if (data.companyLogo) {
                try {
                    data.companyLogoUrl = await getBoxFileUrl(data.companyLogo);
                } catch (e) {
                    data.companyLogoUrl = null;
                }
            }
            return data;
        }));
    }

    static async getById(id: string): Promise<any | null> {
        const exp = await Experience.findById(id);
        if (!exp) return null;

        const data: any = exp.toObject();
        if (data.companyLogo) {
            try {
                data.companyLogoUrl = await getBoxFileUrl(data.companyLogo);
            } catch (e) {
                data.companyLogoUrl = null;
            }
        }
        return data;
    }

    static async update(id: string, data: any, file?: Express.Multer.File): Promise<IExperience | null> {
        const experience = await Experience.findById(id);
        if (!experience) return null;

        if (file) {
            const folderId = await getOrCreateBoxFolder('experiences');
            const uploadedFile = await uploadToBox(file.buffer, file.originalname, folderId);
            data.companyLogo = uploadedFile;
        }

        return await Experience.findByIdAndUpdate(id, data, { new: true });
    }

    static async delete(id: string): Promise<IExperience | null> {
        return await Experience.findByIdAndDelete(id);
    }
}
