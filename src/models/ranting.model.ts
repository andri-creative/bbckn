import mongoose, { Document, Schema } from 'mongoose';

export interface IRanting extends Document {
    star1: number;
    star2: number;
    star3: number;
    star4: number;
    star5: number;
    totalVoters: number;
    status: boolean;
}

const RantingSchema = new Schema<IRanting>({
    star1: { type: Number, default: 0 },
    star2: { type: Number, default: 0 },
    star3: { type: Number, default: 0 },
    star4: { type: Number, default: 0 },
    star5: { type: Number, default: 0 },
    totalVoters: { type: Number, default: 0 },
    status: { type: Boolean, default: true },
}, {
    timestamps: true,
});

const Ranting = mongoose.model<IRanting>('Ranting', RantingSchema);
export default Ranting;