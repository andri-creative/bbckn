import mongoose, { Document, Schema } from 'mongoose';

// Interface untuk tipe data TypeScript
export interface IProject extends Document {
    title: string;
    slug: string;
    category: string;
    summary: string;
    content?: string;
    company: string;
    duration: string;
    location: string;
    workType: string;

    icon: string;
    image: string[];
    status: boolean;

    color: string;
    accent: string;
    border: string;

    demoUrl: string;
    githubUrl: string;

    sort: number;

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
        slug: {
            type: String,
            required: [true, 'Slug wajib diisi'],
            trim: true,
        },
        category: {
            type: String,
            trim: true,
        },
        summary: {
            type: String,
            required: [true, 'Summary wajib diisi'],
            trim: true,
        },
        content: {
            type: String,
        },
        company: {
            type: String,
            trim: true,
        },
        duration: {
            type: String,
            trim: true,
        },
        location: {
            type: String,
            trim: true,
        },
        workType: {
            type: String,
            trim: true,
        },
        icon: {
            type: String,
        },
        image: {
            type: [String],
            default: [],
        },
        status: {
            type: Boolean,
            default: true,
        },
        sort: {
            type: Number,
            default: 0,
        },
        color: {
            type: String,
            trim: true,
        },
        accent: {
            type: String,
            trim: true,
        },
        border: {
            type: String,
            trim: true,
        },
        demoUrl: {
            type: String,
            trim: true,
        },
        githubUrl: {
            type: String,
            trim: true,
        },
        techStack: [{
            type: Schema.Types.ObjectId,
            ref: 'ToolsIcon'
        }],
        tools: [{
            type: Schema.Types.ObjectId,
            ref: 'ToolsIcon'
        }]
    },
    {
        timestamps: true,
    }
);

// Export model
const Project = mongoose.model<IProject>('Project', ProjectSchema);
export default Project;