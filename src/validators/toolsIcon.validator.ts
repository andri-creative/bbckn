import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const toolsIconSchema = z.object({
    label: z.string().min(1, 'Label wajib diisi'),
    icon: z.string().min(1, 'Icon wajib diisi'),
    order: z.coerce.number().optional(),
    status: z.enum(['active', 'inactive']).optional().default('active'),
});

const updateToolsIconSchema = toolsIconSchema.partial();

export const validateToolsIcon = (req: Request, res: Response, next: NextFunction): void => {
    const result = toolsIconSchema.safeParse(req.body);

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

export const validateUpdateToolsIcon = (req: Request, res: Response, next: NextFunction): void => {
    const result = updateToolsIconSchema.safeParse(req.body);

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
