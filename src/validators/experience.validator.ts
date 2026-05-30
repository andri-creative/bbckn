import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const experienceSchema = z.object({
    companyName: z.string().min(1, 'Company Name wajib diisi'),
    position: z.string().min(1, 'Position wajib diisi'),
    startDate: z.string().min(1, 'Start Date wajib diisi'),
    endDate: z.string().optional(),
    description: z.string().min(1, 'Description wajib diisi'),
    responsibilities: z.preprocess((val) => {
        if (typeof val === 'string') {
            try { return JSON.parse(val); } catch { return [val]; }
        }
        return val;
    }, z.array(z.string()).min(1, 'Responsibilities minimal 1')),
    status: z.enum(['active', 'inactive']).optional().default('active'),
    type: z.enum(['Magang', 'Penuh Waktu', 'Kontrak', 'Freelance', 'Wirausaha', 'Lainnya']).optional().default('Penuh Waktu'),
    mode: z.enum(['WFH', 'WFA', 'WFO', 'Hybrid', 'Lainnya']).optional().default('WFH'),
    location: z.string().optional(),
});

export const validateExperience = (req: Request, res: Response, next: NextFunction): void => {
    const result = experienceSchema.safeParse(req.body);

    if (!result.success) {
        const errors: Record<string, string[]> = {};

        result.error.issues.forEach((err) => {
            const path = err.path.join('.');
            if (!errors[path]) {
                errors[path] = [];
            }
            errors[path].push(err.message);
        });

        res.status(400).json({ success: false, errors });
        return;
    }

    next();
};
