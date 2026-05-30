import Achievement, { IAchievement } from '../models/achievement.model';
import { uploadToBox, getBoxFileUrl, getOrCreateBoxFolder } from '../helpers/boxUploader';

export class AchievementService {
    static async create(data: any, file?: Express.Multer.File): Promise<IAchievement> {
        if (typeof data.tags === 'string') {
            try {
                data.tags = JSON.parse(data.tags);
            } catch (e) {
                data.tags = [data.tags];
            }
        }

        let boxFileId = undefined;
        if (file) {
            const achievementFolderId = await getOrCreateBoxFolder('achievements');
            // Upload ke Box menggunakan Buffer yang ada di memory
            boxFileId = await uploadToBox(file.buffer, file.originalname, achievementFolderId);
        }

        const newAchievement = new Achievement({
            ...data,
            // Simpan ID dari file Box, bukan nama file lokal
            image: boxFileId
        });

        return await newAchievement.save();
    }

    static async getAll(): Promise<any[]> {
        const achievements = await Achievement.find().sort({ createdAt: -1 });
        // Generate URL secara dinamis saat di-GET
        return Promise.all(achievements.map(async (ach) => {
            const data = ach.toObject();
            if (data.image) {
                data.image = await getBoxFileUrl(data.image);
            }
            return data;
        }));
    }

    static async getById(id: string): Promise<any | null> {
        const achievement = await Achievement.findById(id);
        if (!achievement) return null;
        
        const data = achievement.toObject();
        // Generate URL secara dinamis saat di-GET
        if (data.image) {
            data.image = await getBoxFileUrl(data.image);
        }
        return data;
    }

    static async delete(id: string): Promise<IAchievement | null> {
        return await Achievement.findByIdAndDelete(id);
    }
}
