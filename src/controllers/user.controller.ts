import { Request, Response } from 'express';
import { createUserService, getUsersService, deleteUserService, loginUserService, countUsersService, logoutUserService, checkAuthTokenService } from '../services/user.service';

export const createUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password, username, role } = req.body;

        const newUser = await createUserService({ name, email, password, username, role });

        res.status(201).json({
            success: true,
            message: 'User berhasil dibuat',
            data: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                username: newUser.username,
                role: newUser.role,
                createdAt: (newUser as any).createdAt
            }
        });
    } catch (error: any) {
        if (error.message === 'Email atau username sudah digunakan') {
             res.status(400).json({ 
                success: false, 
                message: error.message 
            });
            return;
        }
        console.error('Error in createUser:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Terjadi kesalahan pada server' 
        });
    }
};

// Endpoint khusus untuk membuat Admin PERTAMA KALI saat database kosong
export const setupInitialAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
        const count = await countUsersService();
        if (count > 0) {
            res.status(403).json({
                success: false,
                message: 'Setup gagal. Database sudah memiliki user.'
            });
            return;
        }

        const { name, email, password, username } = req.body;
        // Paksa role menjadi Admin untuk setup awal
        const newUser = await createUserService({ name, email, password, username, role: 'Admin' });

        res.status(201).json({
            success: true,
            message: 'Admin pertama berhasil dibuat! Silakan login.',
            data: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                username: newUser.username,
                role: newUser.role
            }
        });
    } catch (error: any) {
        console.error('Error in setupInitialAdmin:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message || 'Terjadi kesalahan pada server' 
        });
    }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { emailOrUsername, password } = req.body;

        if (!emailOrUsername || !password) {
            res.status(400).json({
                success: false,
                message: 'Email/Username dan Password wajib diisi'
            });
            return;
        }

        const user = await loginUserService(emailOrUsername, password);

        res.status(200).json({
            success: true,
            message: 'Berhasil login',
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                username: user.username,
                role: user.role,
                'x-cokis': user.sessionToken
            }
        });
    } catch (error: any) {
        if (error.message === 'User tidak ditemukan' || error.message === 'Password salah') {
            res.status(401).json({
                success: false,
                message: 'Kredensial tidak valid'
            });
            return;
        }
        console.error('Error in loginUser:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan pada server'
        });
    }
};

export const logoutUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const token = req.headers['x-cokis'] as string;
        if (token) {
            const user = await checkAuthTokenService(token);
            if (user) {
                await logoutUserService(user._id.toString());
            }
        }
        res.status(200).json({
            success: true,
            message: 'Berhasil logout'
        });
    } catch (error) {
        console.error('Error in logout:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal logout'
        });
    }
};

export const getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await getUsersService();
        res.status(200).json({
            success: true,
            data: users
        });
    } catch (error) {
        console.error('Error in getUsers:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Terjadi kesalahan pada server' 
        });
    }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id as string;
        const deletedUser = await deleteUserService(id);

        if (!deletedUser) {
            res.status(404).json({
                success: false,
                message: 'User tidak ditemukan'
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: 'User berhasil dihapus'
        });
    } catch (error) {
        console.error('Error in deleteUser:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Terjadi kesalahan pada server' 
        });
    }
};

// Check Auth endpoint untuk frontend verifikasi sesi
export const checkAuth = async (req: Request, res: Response): Promise<void> => {
    try {
        const token = req.headers['x-cokis'] as string;
        if (!token) {
            res.status(401).json({
                success: false,
                message: 'Not authenticated'
            });
            return;
        }

        const user = await checkAuthTokenService(token);
        if (user) {
            res.status(200).json({
                success: true,
                message: 'Authenticated',
                data: {
                    userId: user._id,
                    role: user.role
                }
            });
        } else {
            res.status(401).json({
                success: false,
                message: 'Not authenticated'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan'
        });
    }
};
