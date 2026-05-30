import mongoose, { Document, Schema } from 'mongoose';

// Interface untuk tipe data TypeScript
export interface IAchievement extends Document {
    title: string;
    description: string;
    image: string;
    issuer: string
    issueDate: string
    label: string
    tags: string[]
    status: boolean
    pinned: boolean

    category: 'Sertifikat' | 'Penghargaan' | 'Lainnya';
    level: 'Nasional' | 'Internasional' | 'Regional';
}

// Schema Mongoose
const AchievementSchema = new Schema<IAchievement>(
    {
        title: {
            type: String,
            required: [true, 'Judul achievement wajib diisi'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Deskripsi achievement wajib diisi'],
            trim: true,
        },
        image: {
            type: String,
            required: [true, 'Gambar achievement wajib diisi'],
        },
        issuer: {
            type: String,
            required: [true, 'Issuer achievement wajib diisi'],
            trim: true,
        },
        issueDate: {
            type: String,
            required: [true, 'Tanggal issue achievement wajib diisi'],
            trim: true,
        },
        label: {
            type: String,
            required: [true, 'Label achievement wajib diisi'],
            trim: true,
        },
        tags: {
            type: [String],
            required: [true, 'Tags achievement wajib diisi'],
        },
        status: {
            type: Boolean,
            default: true,
        },
        pinned: {
            type: Boolean,
            default: false,
        },
        category: {
            type: String,
            enum: ['Sertifikat', 'Penghargaan', 'Lainnya'],
            required: [true, 'Kategori wajib diisi']
        },
        level: {
            type: String,
            enum: ['Nasional', 'Internasional', 'Regional'],
            required: [true, 'Level wajib diisi']
        }
    },
    {
        timestamps: true,
    },
);

// Export model
const Achievement = mongoose.model<IAchievement>('Achievement', AchievementSchema);
export default Achievement;