import mongoose, { Document, Schema } from 'mongoose';

// Interface untuk tipe data TypeScript
export interface IImage extends Document {
  title: string;
  description?: string;
  filename: string;
  dropboxPath: string;
  createdAt: Date;
  updatedAt: Date;
}

// Schema Mongoose
const ImageSchema = new Schema<IImage>(
  {
    title: {
      type: String,
      required: [true, 'Judul gambar wajib diisi'],
      trim: true,
    },
    filename: {
      type: String,
      required: [true, 'Nama file wajib ada'],
      unique: true
    },
    dropboxPath: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },

  },
  {
    timestamps: true,
  },
);

// Export model
const Image = mongoose.model<IImage>('Image', ImageSchema);
export default Image;
