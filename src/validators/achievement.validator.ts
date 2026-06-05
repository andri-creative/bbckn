import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const achievementSchema = z.object({
    slug: z.string().min(1, 'Slug tidak boleh kosong'),
    title: z.string().min(1, 'Judul (title) tidak boleh kosong'),
    description: z.string().min(1, 'Deskripsi (description) tidak boleh kosong'),
    issuer: z.string().min(1, 'Penerbit (issuer) tidak boleh kosong'),
    issueDate: z.string().min(1, 'Tanggal (issueDate) tidak boleh kosong'),
    label: z.string().min(1, 'Label tidak boleh kosong'),
    category: z.enum(['Sertifikat', 'Penghargaan', 'Lainnya']),
    level: z.enum(['Nasional', 'Internasional', 'Regional']),
    tags: z.array(z.string()).min(1, 'Tags minimal 1 item'),
    image: z.string().optional(),
});

export const validateAchievement = (req: Request, res: Response, next: NextFunction): void => {
    const result = achievementSchema.safeParse(req.body);

    if (!result.success) {
        const errors: Record<string, string[]> = {};

        result.error.issues.forEach((err) => {
            const path = err.path.join('.');
            if (!errors[path]) {
                errors[path] = [];
            }

            if (path === 'category') {
                errors[path].push('Kategori tidak valid (harus Sertifikat, Penghargaan, atau Lainnya)');
            } else if (path === 'level') {
                errors[path].push('Level tidak valid (harus Nasional, Internasional, atau Regional)');
            } else {
                errors[path].push(err.message);
            }
        });

        res.status(400).json({ success: false, errors });
        return;
    }

    next();
};