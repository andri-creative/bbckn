import Bio, { IBio } from '../models/bio.model';

export class BioService {
    // Logika Create sekarang akan menambahkan (APPEND) item baru ke array
    static async create(data: any): Promise<IBio> {
        const existingBios = await Bio.find();
        
        if (existingBios.length > 0) {
            const mainBio = existingBios[0];
            
            // CLEANUP dokumen duplikat
            if (existingBios.length > 1) {
                const idsToDelete = existingBios.slice(1).map(b => b._id);
                await Bio.deleteMany({ _id: { $in: idsToDelete } });
            }

            // Buat query untuk menambahkan (PUSH) data ke array tanpa menghapus yang lama
            const updateQuery: any = { $push: {} };

            if (data.stats && Array.isArray(data.stats)) {
                updateQuery.$push.stats = { $each: data.stats };
            }
            if (data.educations && Array.isArray(data.educations)) {
                updateQuery.$push.educations = { $each: data.educations };
            }
            if (data.publications && Array.isArray(data.publications)) {
                updateQuery.$push.publications = { $each: data.publications };
            }

            // Lakukan update (jika ada data array, gunakan $push, jika tidak, gunakan $set biasa)
            if (Object.keys(updateQuery.$push).length > 0) {
                return await Bio.findByIdAndUpdate(mainBio._id, updateQuery, { new: true }) as IBio;
            } else {
                return await Bio.findByIdAndUpdate(mainBio._id, data, { new: true }) as IBio;
            }
        }

        // Jika belum ada sama sekali, buat baru
        const newBio = new Bio(data);
        return await newBio.save();
    }

    static async getAll(): Promise<IBio[]> {
        return await Bio.find().sort({ createdAt: -1 });
    }

    static async getById(id: string): Promise<IBio | null> {
        return await Bio.findById(id);
    }

    // PUT diubah menjadi "Smart Update": hanya mengupdate field yang dikirim berdasarkan _id
    static async update(id: string, data: any): Promise<IBio | null> {
        const bio = await Bio.findById(id) as any;
        if (!bio) return null;

        const mergeArray = (arrayName: string, newDataArray: any[]) => {
            if (!newDataArray || !Array.isArray(newDataArray)) return;
            newDataArray.forEach((item: any) => {
                if (item._id) {
                    // Cari item lama berdasarkan _id
                    const subDoc = bio[arrayName].id(item._id);
                    if (subDoc) {
                        // .set() HANYA mengubah field yang dikirim, tidak menghapus field lain
                        subDoc.set(item);
                    }
                } else {
                    // Jika tidak ada _id, tambahkan sebagai item baru
                    bio[arrayName].push(item);
                }
            });
        };

        if (data.stats) mergeArray('stats', data.stats);
        if (data.educations) mergeArray('educations', data.educations);
        if (data.publications) mergeArray('publications', data.publications);

        return await bio.save();
    }

    static async delete(id: string): Promise<IBio | null> {
        return await Bio.findByIdAndDelete(id);
    }
}
