import Ranting, { IRanting } from '../models/ranting.model';

export class RantingService {
    static async submitVote(ratingValue: number): Promise<IRanting> {
        let ranting = await Ranting.findOne(); // Hanya ada satu global rating
        
        if (!ranting) {
            ranting = new Ranting({ star1: 0, star2: 0, star3: 0, star4: 0, star5: 0, totalVoters: 0 });
        }

        // Akumulasi jumlah orang berdasarkan bintang yang dipilih
        if (ratingValue === 1) ranting.star1 += 1;
        else if (ratingValue === 2) ranting.star2 += 1;
        else if (ratingValue === 3) ranting.star3 += 1;
        else if (ratingValue === 4) ranting.star4 += 1;
        else if (ratingValue === 5) ranting.star5 += 1;

        ranting.totalVoters += 1;

        return await ranting.save();
    }

    static async getAll(): Promise<any[]> {
        return await Ranting.find().sort({ createdAt: -1 });
    }

    static async getById(id: string): Promise<any | null> {
        return await Ranting.findById(id);
    }

    static async delete(id: string): Promise<IRanting | null> {
        return await Ranting.findByIdAndDelete(id);
    }
}
