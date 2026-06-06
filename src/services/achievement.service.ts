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

        let finalImage = data.image; // Bisa dari req.body berupa URL
        if (file) {
            const achievementFolderId = await getOrCreateBoxFolder('achievements');
            // Upload ke Box menggunakan Buffer yang ada di memory
            finalImage = await uploadToBox(file.buffer, file.originalname, achievementFolderId);
        }

        // Auto-increment value
        const lastAchievement = await Achievement.findOne().sort({ value: -1 });
        const nextValue = lastAchievement && lastAchievement.value ? lastAchievement.value + 1 : 1;
        data.value = nextValue;

        const newAchievement = new Achievement({
            ...data,
            // Jika finalImage undefined, Mongoose akan menggunakan default image
            ...(finalImage && { image: finalImage })
        });

        return await newAchievement.save();
    }

    static async getAll(page: number = 1, limit: number = 20): Promise<{ data: any[], pagination: any }> {
        const skip = (page - 1) * limit;
        const total = await Achievement.countDocuments();
        
        const achievements = await Achievement.find()
            .sort({ sort: 1, value: 1, createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // Generate URL secara dinamis saat di-GET
        const mappedData = await Promise.all(achievements.map(async (ach) => {
            const data = ach.toObject();
            if (data.image) {
                if (data.image.startsWith('http')) {
                    // Biarkan, sudah berupa URL (default atau manual link)
                } else {
                    try { data.image = await getBoxFileUrl(data.image); } catch (e) { }
                }
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
        const achievement = await Achievement.findOne(query);
        if (!achievement) return null;
        
        const data = achievement.toObject();
        // Generate URL secara dinamis saat di-GET
        if (data.image) {
            if (data.image.startsWith('http')) {
                // Biarkan
            } else {
                try { data.image = await getBoxFileUrl(data.image); } catch (e) { }
            }
        }
        return data;
    }

    static async update(id: string, data: any, file?: Express.Multer.File): Promise<IAchievement | null> {
        const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
        const query = isObjectId ? { $or: [{ _id: id }, { slug: id }] } : { slug: id };
        const achievement = await Achievement.findOne(query);
        if (!achievement) return null;

        if (file) {
            const achievementFolderId = await getOrCreateBoxFolder('achievements');
            const boxFileId = await uploadToBox(file.buffer, file.originalname, achievementFolderId);
            data.image = boxFileId;
        }

        return await Achievement.findOneAndUpdate(query, data, { new: true });
    }

    static async delete(id: string): Promise<IAchievement | null> {
        const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
        const query = isObjectId ? { $or: [{ _id: id }, { slug: id }] } : { slug: id };
        return await Achievement.findOneAndDelete(query);
    }
}
