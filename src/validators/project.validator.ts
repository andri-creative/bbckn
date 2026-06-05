import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const projectSchema = z.object({
    title: z.string().min(1, 'Title wajib diisi'),
    slug: z.string().min(1, 'Slug wajib diisi'),
    summary: z.string().min(1, 'Summary wajib diisi'),
    category: z.string().optional(),
    content: z.string().optional(),
    company: z.string().optional(),
    duration: z.string().optional(),
    location: z.string().optional(),
    workType: z.string().optional(),
    icon: z.string().optional(),
    status: z.preprocess((val) => {
        if (val === 'true') return true;
        if (val === 'false') return false;
        return val;
    }, z.boolean().optional().default(true)),
    sort: z.preprocess((val) => Number(val), z.number().optional().default(0)),
    color: z.string().optional(),
    accent: z.string().optional(),
    border: z.string().optional(),
    demoUrl: z.string().optional(),
    githubUrl: z.string().optional(),
    techStack: z.preprocess((val) => {
        if (typeof val === 'string') { try { return JSON.parse(val); } catch { return [val]; } }
        return val;
    }, z.array(z.string()).optional().default([])),
    tools: z.preprocess((val) => {
        if (typeof val === 'string') { try { return JSON.parse(val); } catch { return [val]; } }
        return val;
    }, z.array(z.string()).optional().default([])),
    image: z.preprocess((val) => {
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
