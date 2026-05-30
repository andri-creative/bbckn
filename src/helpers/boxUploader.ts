import boxClient from '../config/box.config';
import path from 'path';
import { PassThrough } from 'stream';

/**
 * Helper untuk mendapatkan ID subfolder berdasarkan nama, atau membuatnya jika belum ada.
 */
export const getOrCreateBoxFolder = async (folderName: string, parentFolderId: string = process.env.BOX_FOLDER_ID || '0'): Promise<string> => {
    try {
        // Ambil isi folder parent
        const items = await boxClient.folders.getFolderItems(parentFolderId, {
            queryParams: { fields: ['id', 'name', 'type'] }
        });

        // Cari apakah folder dengan nama tersebut sudah ada
        const existingFolder = items.entries?.find(item => item.type === 'folder' && item.name === folderName);

        if (existingFolder) {
            return existingFolder.id;
        }

        // Jika belum ada, buat folder baru di dalam parent
        const newFolder = await boxClient.folders.createFolder({
            name: folderName,
            parent: { id: parentFolderId }
        });

        return newFolder.id;
    } catch (error: any) {
        console.error(`Gagal mendapatkan/membuat folder '${folderName}':`, error.response?.body || error);
        return parentFolderId; // Fallback ke parent folder jika gagal
    }
};

/**
 * Helper untuk upload file ke Box.com dari memory (Buffer)
 * @param fileBuffer Buffer dari file gambar
 * @param originalName Nama asli file
 * @param folderId ID folder di Box (default '0' adalah root folder)
 * @returns ID dari file yang di-upload
 */
export const uploadToBox = async (fileBuffer: Buffer, originalName: string, folderId: string = process.env.BOX_FOLDER_ID || '0'): Promise<string> => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(originalName);

    try {
        const stream = new PassThrough();
        stream.end(fileBuffer);

        // Upload menggunakan box-typescript-sdk-gen
        const uploadResponse = await boxClient.uploads.uploadFile({
            attributes: {
                name: uniqueName,
                parent: { id: folderId }
            },
            file: stream
        });

        if (!uploadResponse.entries || uploadResponse.entries.length === 0) {
            throw new Error('Upload berhasil tapi tidak mengembalikan data file');
        }

        const fileId = uploadResponse.entries[0].id;

        await boxClient.files.updateFileById(fileId, {
            requestBody: {
                sharedLink: { access: 'open' }
            }
        });

        return fileId;
    } catch (error: any) {
        console.error('Gagal mengupload file ke Box:', error.response?.body || error);
        throw new Error(error.response?.body?.message || error.message || 'Gagal mengupload file ke Box.com');
    }
};

/**
 * Helper untuk mengambil URL gambar dari Box.com secara dinamis berdasarkan fileId
 */
export const getBoxFileUrl = async (fileId: string): Promise<string> => {
    try {
        const fileInfo = await boxClient.files.getFileById(fileId, {
            queryParams: { fields: ['shared_link'] }
        });
        return fileInfo.sharedLink?.downloadUrl || fileInfo.sharedLink?.url || `https://app.box.com/file/${fileId}`;
    } catch (error) {
        console.error(`Gagal mendapatkan URL untuk file ID ${fileId}:`, error);
        return '';
    }
};
