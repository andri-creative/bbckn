import mongoose, { Document, Schema } from 'mongoose';

// Interface untuk tipe data TypeScript
export interface ITools extends Document {
    name: string;
    description: string;
    icon: string;
}

// Schema Mongoose
const ToolsSchema = new Schema<ITools>(
    {
        name: {
            type: String,
            required: [true, 'Judul tools wajib diisi'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Deskripsi tools wajib diisi'],
            trim: true,
        },
        icon: {
            type: String,
            required: [true, 'Icon tools wajib diisi'],
        },

    },
    {
        timestamps: true,
    },
);

// Export model
const Tools = mongoose.model<ITools>('Tools', ToolsSchema);
export default Tools;