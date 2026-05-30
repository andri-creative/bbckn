import mongoose, { Document, Schema } from 'mongoose';

export interface IAlbum extends Document {
    title: string;
    width: number;
    height: number;
    status: boolean;
    image: string[];
}

const AlbumSchema = new Schema<IAlbum>({
    title: {
        type: String,
        trim: true,
    },
    width: {
        type: Number,
        required: [true, 'Width wajib diisi'],
    },
    height: {
        type: Number,
        required: [true, 'Height wajib diisi'],
    },
    status: {
        type: Boolean,
        default: true,
    },
    image: {
        type: [String],
        required: [true, 'Image wajib diisi'],
    }
}, {
    timestamps: true,
});

const Album = mongoose.model<IAlbum>('Album', AlbumSchema);
export default Album;
