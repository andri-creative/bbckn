import mongoose, { Document, Schema } from 'mongoose';

// Interface untuk tipe data TypeScript
export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    username: string;
    role: 'Admin' | 'User';
    sessionToken?: string;
}

// Schema Mongoose
const UserSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: [true, 'Nama wajib diisi'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email wajib diisi'],
            unique: true,
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: [true, 'Password wajib diisi'],
        },
        username: {
            type: String,
            required: [true, 'Username wajib diisi'],
            trim: true,
            unique: true,
            lowercase: true,
        },
        role: {
            type: String,
            enum: ['Admin', 'User'],
            default: 'User',
        },
        sessionToken: {
            type: String,
            default: null
        }
    },
    {
        timestamps: true,
    },
);

// Export model
const User = mongoose.model<IUser>('User', UserSchema);
export default User;