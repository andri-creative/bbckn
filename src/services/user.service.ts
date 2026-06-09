import bcryptjs from 'bcryptjs';
import crypto from 'crypto';
import User, { IUser } from '../models/user.model';

export const countUsersService = async (): Promise<number> => {
    return await User.countDocuments();
};

export const createUserService = async (data: Partial<IUser>): Promise<IUser> => {
    const { email, username, password } = data;

    // Cek apakah email atau username sudah ada
    const existingUser = await User.findOne({ 
        $or: [{ email }, { username }] 
    });

    if (existingUser) {
        throw new Error('Email atau username sudah digunakan');
    }

    // Default role ke User jika tidak ada
    if (!data.role) {
        data.role = 'User';
    }

    // Hash password
    if (password) {
        const salt = await bcryptjs.genSalt(10);
        data.password = await bcryptjs.hash(password, salt);
    }

    const newUser = new User(data);
    await newUser.save();
    
    return newUser;
};

export const loginUserService = async (emailOrUsername: string, password: string):Promise<IUser> => {
    const user = await User.findOne({
        $or: [{ email: emailOrUsername }, { username: emailOrUsername }]
    });

    if (!user) {
        throw new Error('User tidak ditemukan');
    }

    const isMatch = await bcryptjs.compare(password, user.password);
    
    if (!isMatch) {
        throw new Error('Password salah');
    }

    // Generate token custom (bukan JWT, bukan express-session) untuk header x-cokis
    const token = crypto.randomBytes(32).toString('hex');
    user.sessionToken = token;
    await user.save();

    return user;
};

export const checkAuthTokenService = async (token: string): Promise<IUser | null> => {
    return await User.findOne({ sessionToken: token });
};

export const logoutUserService = async (userId: string): Promise<void> => {
    await User.findByIdAndUpdate(userId, { sessionToken: null });
};

export const getUsersService = async (): Promise<IUser[]> => {
    return await User.find().select('-password');
};

export const deleteUserService = async (id: string): Promise<IUser | null> => {
    return await User.findByIdAndDelete(id);
};
