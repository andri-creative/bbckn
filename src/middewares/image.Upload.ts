import multer from 'multer';
import path from 'path';
import { Request } from 'express';

// Gunakan memory storage agar file tidak disimpan di hardisk lokal
const storage = multer.memoryStorage();

// Filter hanya untuk file gambar
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        cb(null, true);
    } else {
        cb(new Error('Hanya file gambar yang diperbolehkan (JPG, PNG, GIF, WEBP)'));
    }
};

// Factory function untuk uploader, nama folder bisa diabaikan karena disimpan di memori
export const createUploader = (folderName?: string) => multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB batas ukuran file
    fileFilter: fileFilter
});