import sharp from 'sharp';
import path from 'path';
import { Request, Response, NextFunction } from 'express';

export const convertToWebp = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file && (!req.files || (Array.isArray(req.files) && req.files.length === 0))) {
        return next();
    }

    try {
        const convert = async (file: Express.Multer.File) => {
            let buffer = file.buffer;
            
            // Dapatkan metadata gambar aslinya
            let metadata = await sharp(file.buffer).metadata();
            
            if (file.mimetype !== 'image/webp') {
                const webpBuffer = await sharp(file.buffer).webp({ quality: 80 }).toBuffer();
                buffer = webpBuffer;
                // Update metadata jika perlu (biasanya dimensi tidak berubah setelah konversi)
                metadata = await sharp(webpBuffer).metadata();
            }
            
            file.buffer = buffer;
            file.originalname = file.originalname.replace(path.extname(file.originalname), '.webp');
            file.mimetype = 'image/webp';

            // Simpan width dan height ke req.body (akan menimpa nilai dari gambar sebelumnya jika multiple)
            if (metadata.width) req.body.width = metadata.width;
            if (metadata.height) req.body.height = metadata.height;
        };

        if (req.file) {
            await convert(req.file);
        } else if (req.files && Array.isArray(req.files)) {
            await Promise.all(req.files.map(convert));
        }

        next();
    } catch (error) {
        console.error('Gagal mengkonversi gambar ke WebP (di memory):', error);
        next(error);
    }
};
