import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const toolsSchema = z.object({
    name: z.string().min(1, 'Name wajib diisi'),
    description: z.string().min(1, 'Description wajib diisi'),
});

export const validateTools = (req: Request, res: Response, next: NextFunction): void => {
    const result = toolsSchema.safeParse(req.body);
    if (!result.success) {
        const errors: Record<string, string[]> = {};
        result.error.issues.forEach((err) => {
            const path = err.path.join('.');
            if (!errors[path]) errors[path] = [];
            errors[path].push(err.message);
        });
        res.status(400).json({ success: false, errors });
        return;
    }
    next();
};
