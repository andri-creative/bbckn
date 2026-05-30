import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const rantingSchema = z.object({
    rating: z.coerce.number().min(1, 'Rating minimal 1').max(5, 'Rating maksimal 5'),
    status: z.preprocess((val) => {
        if (val === 'true') return true;
        if (val === 'false') return false;
        return val;
    }, z.boolean().optional()),
});

export const validateRanting = (req: Request, res: Response, next: NextFunction): void => {
    const result = rantingSchema.safeParse(req.body);

    if (!result.success) {
        const errors: Record<string, string[]> = {};

        result.error.issues.forEach((err) => {
            const path = err.path.join('.');
            if (!errors[path]) {
                errors[path] = [];
            }

            if (path === 'rating') {
                errors[path].push('Rating wajib diisi dan harus berupa angka antara 1 sampai 5');
            } else {
                errors[path].push(err.message);
            }
        });

        res.status(400).json({ success: false, errors });
        return;
    }

    next();
};
