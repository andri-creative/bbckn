import { Request, Response, NextFunction } from 'express';
import User from '../models/user.model';

export const isAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.headers['x-cokis'] as string;
        if (!token) {
            res.status(401).json({ 
                success: false, 
                message: 'Unauthorized. x-cokis tidak ditemukan.' 
            });
            return;
        }

        const user = await User.findOne({ sessionToken: token });
        if (!user) {
            res.status(401).json({ 
                success: false, 
                message: 'Unauthorized. Token x-cokis tidak valid.' 
            });
            return;
        }
        
        (req as any).userId = user._id;
        (req as any).user = { role: user.role };
        
        next();
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const isAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.headers['x-cokis'] as string;
        if (!token) {
            res.status(401).json({ 
                success: false, 
                message: 'Unauthorized. x-cokis tidak ditemukan.' 
            });
            return;
        }

        const user = await User.findOne({ sessionToken: token });
        if (!user) {
            res.status(401).json({ 
                success: false, 
                message: 'Unauthorized. Token x-cokis tidak valid.' 
            });
            return;
        }

        if (user.role !== 'Admin') {
            res.status(403).json({ 
                success: false, 
                message: 'Forbidden. Hanya Admin yang dapat mengakses ini.' 
            });
            return;
        }

        (req as any).userId = user._id;
        (req as any).user = { role: user.role };

        next();
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
