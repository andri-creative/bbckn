import Album, { IAlbum } from '../models/album.model';
import { uploadToBox, getBoxFileUrl, getOrCreateBoxFolder } from '../helpers/boxUploader';

export class AlbumService {
    static async create(data: any, files?: Express.Multer.File[] | Express.Multer.File): Promise<IAlbum> {
        let boxFileIds: string[] = [];
        
        if (files) {
            const albumFolderId = await getOrCreateBoxFolder('albums');
            const fileArray = Array.isArray(files) ? files : [files];
            boxFileIds = await Promise.all(fileArray.map(file => uploadToBox(file.buffer, file.originalname, albumFolderId)));
        }

        const newAlbum = new Album({
            ...data,
            image: boxFileIds
        });

        return await newAlbum.save();
    }

    static async getAll(): Promise<any[]> {
        const albums = await Album.find().sort({ createdAt: -1 });
        return Promise.all(albums.map(async (alb) => {
            const data: any = alb.toObject();
            let finalImage = data.image;
            let finalImageUrl = undefined;

            if (data.image && Array.isArray(data.image)) {
                const rawUrls = await Promise.all(data.image.map((id: string) => getBoxFileUrl(id)));
                finalImage = rawUrls.map(url => `${url}?width=${data.width}&height=${data.height}`);
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
    }

    static async getById(id: string): Promise<any | null> {
        const album = await Album.findById(id);
        if (!album) return null;
        
        const data: any = album.toObject();
        let finalImage = data.image;
        let finalImageUrl = undefined;

        if (data.image && Array.isArray(data.image)) {
            const rawUrls = await Promise.all(data.image.map((id: string) => getBoxFileUrl(id)));
            finalImage = rawUrls.map(url => `${url}?width=${data.width}&height=${data.height}`);
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

    static async delete(id: string): Promise<IAlbum | null> {
        return await Album.findByIdAndDelete(id);
    }
}
