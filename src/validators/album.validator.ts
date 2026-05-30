import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const albumSchema = z.object({
    width: z.coerce.number(),
    height: z.coerce.number(),
    status: z.preprocess((val) => {
        if (val === 'true' || val === true) return true;
        if (val === 'false' || val === false) return false;
        return val;
    }, z.boolean().optional().default(true))
});

export const validateAlbum = (req: Request, res: Response, next: NextFunction): void => {
    const result = albumSchema.safeParse(req.body);

    if (!result.success) {
        const errors: Record<string, string[]> = {};

        result.error.issues.forEach((err) => {
            const path = err.path.join('.');
            if (!errors[path]) {
                errors[path] = [];
            }

            if (path === 'width') {
                errors[path].push('Width wajib diisi dan harus berupa angka');
            } else if (path === 'height') {
                errors[path].push('Height wajib diisi dan harus berupa angka');
            } else {
                errors[path].push(err.message);
            }
        });

        res.status(400).json({ success: false, errors });
        return;
    }

    next();
};
