import mongoose, { Document, Schema } from 'mongoose';

export interface IExperience extends Document {
    companyLogo?: string;
    companyName: string;
    position: string;
    location?: string;

    startDate: Date;
    endDate?: Date;

    icon: string;  // icon from box cloud

    summary: string;
    content: string;

    current: boolean;

    responsibilities: string[]; // Tag

    status: 'active' | 'inactive';
    type: 'Magang' | 'Penuh Waktu' | 'Kontrak' | 'Freelance' | 'Wirausaha' | 'Lainnya';
    mode: 'WFH' | 'WFA' | 'WFO' | 'Hybrid' | 'Lainnya';

    sort: number;
}

const ExperienceSchema: Schema = new Schema({
    companyLogo: { type: String },
    companyName: { type: String },
    position: { type: String },
    location: { type: String },

    startDate: { type: Date },
    endDate: { type: Date },

    icon: { type: String }, // icon from box cloud

    summary: { type: String },
    content: { type: String },

    responsibilities: { type: [String] }, // tag

    sort: { type: Number, default: 0, index: true, unique: true },

    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    type: { type: String, enum: ['Magang', 'Penuh Waktu', 'Kontrak', 'Freelance', 'Wirausaha', 'Lainnya'], default: 'Penuh Waktu' },
    mode: { type: String, enum: ['WFH', 'WFA', 'WFO', 'Hybrid', 'Lainnya'], default: 'WFH' },

}, {
    timestamps: true,
});

const Experience = mongoose.model<IExperience>('Experience', ExperienceSchema);
export default Experience;