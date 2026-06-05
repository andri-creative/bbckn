import Album, { IAlbum } from '../models/album.model';
import { uploadToBox, getBoxFileUrl, getOrCreateBoxFolder } from '../helpers/boxUploader';

export class AlbumService {
    static async create(data: any, files?: Express.Multer.File[] | Express.Multer.File): Promise<IAlbum> {
        if (!data.image) data.image = [];
        if (!Array.isArray(data.image)) data.image = [data.image];

        if (files) {
            const albumFolderId = await getOrCreateBoxFolder('albums');
            const fileArray = Array.isArray(files) ? files : [files];
            const uploadedIds = await Promise.all(fileArray.map(file => uploadToBox(file.buffer, file.originalname, albumFolderId)));
            data.image.push(...uploadedIds);

            if (!data.title && fileArray.length > 0) {
                data.title = fileArray[0].originalname.replace(/\.[^/.]+$/, "");
            }
        }

        const newAlbum = new Album({
            ...data
        });

        return await newAlbum.save();
    }

    static async getAll(page: number = 1, limit: number = 20): Promise<{ data: any[], pagination: any }> {
        const skip = (page - 1) * limit;
        const total = await Album.countDocuments();
        
        const albums = await Album.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
            
        const mappedData = await Promise.all(albums.map(async (alb) => {
            const data: any = alb.toObject();
            let finalImage = data.image;
            let finalImageUrl = undefined;

            if (data.image && Array.isArray(data.image)) {
                const rawUrls = await Promise.all(data.image.map(async (id: string) => {
                    if (id.startsWith('http')) return id;
                    try { return await getBoxFileUrl(id); } catch (e) { return id; }
                }));
                
                finalImage = rawUrls.map(url => {
                    if (url.startsWith('http') && !url.includes('box.com')) return url;
                    return `${url}${url.includes('?') ? '&' : '?'}width=${data.width}&height=${data.height}`;
                });
                finalImageUrl = rawUrls; // URL aslinya
            }
            
            const { image, createdAt, updatedAt, __v, ...rest } = data;
            return {
                ...rest,
                image: finalImage,
                imageUrl: finalImageUrl,
                createdAt,
                updatedAt,
                __v
            };
        }));

        return {
            data: mappedData,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };
    }

    static async getById(id: string): Promise<any | null> {
        const album = await Album.findById(id);
        if (!album) return null;
        
        const data: any = album.toObject();
        let finalImage = data.image;
        let finalImageUrl = undefined;

        if (data.image && Array.isArray(data.image)) {
            const rawUrls = await Promise.all(data.image.map(async (id: string) => {
                if (id.startsWith('http')) return id;
                try { return await getBoxFileUrl(id); } catch (e) { return id; }
            }));
            
            finalImage = rawUrls.map(url => {
                if (url.startsWith('http') && !url.includes('box.com')) return url;
                return `${url}${url.includes('?') ? '&' : '?'}width=${data.width}&height=${data.height}`;
            });
            finalImageUrl = rawUrls; // URL aslinya
        }
        
        const { image, createdAt, updatedAt, __v, ...rest } = data;
        return {
            ...rest,
            image: finalImage,
            imageUrl: finalImageUrl,
            createdAt,
            updatedAt,
            __v
        };
    }

    static async update(id: string, data: any, files?: Express.Multer.File[] | Express.Multer.File): Promise<IAlbum | null> {
        const album = await Album.findById(id);
        if (!album) return null;

        if (files) {
            const albumFolderId = await getOrCreateBoxFolder('albums');
            const fileArray = Array.isArray(files) ? files : [files];
            const uploadedIds = await Promise.all(fileArray.map(file => uploadToBox(file.buffer, file.originalname, albumFolderId)));
            
            if (!data.image) data.image = [];
            if (!Array.isArray(data.image)) data.image = [data.image];
            data.image.push(...uploadedIds);
        }

        return await Album.findByIdAndUpdate(id, data, { new: true });
    }

    static async delete(id: string): Promise<IAlbum | null> {
        return await Album.findByIdAndDelete(id);
    }
}
