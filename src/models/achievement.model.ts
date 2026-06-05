import mongoose, { Document, Schema } from 'mongoose';

// Interface untuk tipe data TypeScript
export interface IAchievement extends Document {
    slug: string;
    title: string;
    description: string;
    image: string;
    issuer: string
    issueDate: string
    label: string
    tags: string[]
    status: boolean
    pinned: boolean

    value: number
    sort: number

    category: 'Sertifikat' | 'Penghargaan' | 'Lainnya';
    level: 'Nasional' | 'Internasional' | 'Regional';
}

// Schema Mongoose
const AchievementSchema = new Schema<IAchievement>(
    {
        slug: {
            type: String,
            required: [true, 'Slug wajib diisi'],
            trim: true,
        },
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
            default: 'https://images.unsplash.com/photo-1523289217630-0dd16184af8e?auto=format&fit=crop&q=80&w=1000',
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
        value: {
            type: Number,
            unique: true,
        },
        sort: {
            type: Number,
            default: 0,
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