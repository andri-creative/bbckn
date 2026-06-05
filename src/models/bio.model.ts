import mongoose, { Document, Schema } from 'mongoose';

export interface IBio extends Document {
    stats: {
        value: string;
        label: string;
    }[];
    educations: {
        institution: string;
        degree: string;
        major: string;
        period: string;
        location: string;
        thesis?: {
            label: string;
            title: string;
            tags: string[];
        };
    }[];
    publications: {
        title: string;
        journal: string;
        volume: string;
        date: string;
        doi: string;
        authors: string[];
        link: string;
        status: string;
    }[];
}


const StatsSchema: Schema = new Schema({
    value: { type: String },
    label: { type: String },
})


const ThesisSchema: Schema = new Schema({
    label: { type: String },
    title: { type: String },
    tags: { type: [String] },
})


const EducationSchema: Schema = new Schema({
    institution: { type: String },
    degree: { type: String },
    major: { type: String },
    period: { type: String },
    location: { type: String },
    thesis: { type: ThesisSchema }
})


const PublicationSchema: Schema = new Schema({
    title: { type: String },
    journal: { type: String },
    volume: { type: String },
    date: { type: String },
    doi: { type: String },
    authors: { type: [String] },
    link: { type: String },
    status: { type: String }
})


const BioSchema: Schema = new Schema({
    stats: [StatsSchema],
    educations: [EducationSchema],
    publications: [PublicationSchema],
}, {
    timestamps: true
})

const Bio = mongoose.model<IBio>('Bio', BioSchema);
export default Bio;