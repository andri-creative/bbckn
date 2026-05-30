import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const projectSchema = z.object({
    title: z.string().min(1, 'Title wajib diisi'),
    description: z.string().min(1, 'Description wajib diisi'),
    demoUrl: z.string().optional(),
    githubUrl: z.string().optional(),
    status: z.preprocess((val) => {
        if (val === 'true') return true;
        if (val === 'false') return false;
        return val;
    }, z.boolean().optional().default(true)),
    pinned: z.preprocess((val) => {
        if (val === 'true') return true;
        if (val === 'false') return false;
        return val;
    }, z.boolean().optional().default(false)),
    techStack: z.preprocess((val) => {
        if (typeof val === 'string') { try { return JSON.parse(val); } catch { return [val]; } }
        return val;
    }, z.array(z.string()).min(1, 'Tech stack minimal 1')),
    role: z.preprocess((val) => {
        if (typeof val === 'string') { try { return JSON.parse(val); } catch { return [val]; } }
        return val;
    }, z.array(z.string()).optional().default([])),
    features: z.preprocess((val) => {
        if (typeof val === 'string') { try { return JSON.parse(val); } catch { return [val]; } }
        return val;
    }, z.array(z.string()).optional().default([])),
    tools: z.preprocess((val) => {
        if (typeof val === 'string') { try { return JSON.parse(val); } catch { return [val]; } }
        return val;
    }, z.array(z.string()).optional().default([])),
});

export const validateProject = (req: Request, res: Response, next: NextFunction): void => {
    const result = projectSchema.safeParse(req.body);
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
