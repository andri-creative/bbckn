import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const userSchema = z.object({
    name: z.string().min(1, 'Name wajib diisi'),
    email: z.string().email('Email tidak valid'),
    password: z.string().min(1, 'Password wajib diisi'),
    username: z.string().min(1, 'Username wajib diisi'),
    role: z.enum(['Admin', 'User']).default('User'),
});

export const validateUser = (req: Request, res: Response, next: NextFunction): void => {
    const result = userSchema.safeParse(req.body);
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