import mongoose, { Document, Schema } from 'mongoose';

// Interface untuk tipe data TypeScript
export interface IProject extends Document {
    title: string;
    description?: string;
    image: string;
    status: boolean;
    role?: string[];
    demoUrl?: string;
    githubUrl?: string;
    features?: string[];
    pinned: boolean;

    techStack: mongoose.Types.ObjectId[];
    // Referensi ke model Tools
    tools?: mongoose.Types.ObjectId[];
}

// Schema Mongoose
const ProjectSchema = new Schema<IProject>(
    {
        title: {
            type: String,
            required: [true, 'Judul project wajib diisi'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Deskripsi project wajib diisi'],
            trim: true,
        },
        image: {
            type: String,
            required: [true, 'Gambar project wajib diisi'],
        },
        demoUrl: {
            type: String,
            trim: true,
        },
        githubUrl: {
            type: String,
            trim: true,
        },
        role: {
            type: [String],
            default: [],
        },
        features: {
            type: [String],
            default: [],
        },
        status: {
            type: Boolean,
            default: true,
        },
        pinned: {
            type: Boolean,
            default: false,
        },
        techStack: [{
            type: Schema.Types.ObjectId,
            ref: 'Tools'
        }],
        tools: [{
            type: Schema.Types.ObjectId,
            ref: 'Tools'
        }]
    },
    {
        timestamps: true,
    }
);

// Export model
const Project = mongoose.model<IProject>('Project', ProjectSchema);
export default Project;