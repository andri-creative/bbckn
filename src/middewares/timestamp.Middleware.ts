import { Request, Response, NextFunction } from 'express';
import { isTimestampValid } from '../validators/timestamp.Validator';

export const validateTimestamp = (req: Request, res: Response, next: NextFunction) => {
    // Mengambil timestamp dari header request
    const clientTimestampHeader = req.headers['x-timestamp'] || req.headers['timestamp'];

    // Menjalankan fungsi validasi dari folder validators
    const validation = isTimestampValid(clientTimestampHeader);

    if (!validation.isValid) {
        // Bedakan status HTTP berdasarkan isi error (400 untuk format salah, 403 untuk kedaluwarsa)
        const statusCode = validation.message?.includes('kedaluwarsa') ? 403 : 400;
        
        return res.status(statusCode).json({
            success: false,
            message: validation.message
        });
    }

    // Jika sesuai, lanjutkan ke route/controller
    next();
};
