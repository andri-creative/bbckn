import mongoose, { Document, Schema } from 'mongoose';

export interface IExperience extends Document {
    companyLogo?: string;
    companyName: string;
    position: string;
    startDate: Date;
    endDate?: Date;

    description: string;
    responsibilities: string[];

    status: 'active' | 'inactive';
    type: 'Magang' | 'Penuh Waktu' | 'Kontrak' | 'Freelance' | 'Wirausaha' | 'Lainnya';
    mode: 'WFH' | 'WFA' | 'WFO' | 'Hybrid' | 'Lainnya';
    location?: string;
}

const ExperienceSchema: Schema = new Schema({
    companyLogo: { type: String },
    companyName: { type: String },
    position: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    description: { type: String },
    responsibilities: { type: [String] },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    type: { type: String, enum: ['Magang', 'Penuh Waktu', 'Kontrak', 'Freelance', 'Wirausaha', 'Lainnya'], default: 'Penuh Waktu' },
    mode: { type: String, enum: ['WFH', 'WFA', 'WFO', 'Hybrid', 'Lainnya'], default: 'WFH' },
    location: { type: String },
}, {
    timestamps: true,
});

const Experience = mongoose.model<IExperience>('Experience', ExperienceSchema);
export default Experience;