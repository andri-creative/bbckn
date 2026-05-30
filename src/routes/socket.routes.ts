import { Router, Request, Response } from 'express';
import { pusher } from '../config/pusher.config';

const router = Router();

// Cek status socket/Pusher
router.get('/', (req: Request, res: Response): void => {
    res.status(200).json({
        success: true,
        message: 'Socket endpoint aktif',
        pusher: {
            appId: process.env.PUSHER_APP_ID ? 'configured' : 'not configured',
            cluster: process.env.PUSHER_CLUSTER || 'unknown',
        }
    });
});

// Endpoint untuk menerima pesan dari frontend dan meneruskannya ke jaringan Pusher
router.post('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const { message } = req.body;
        
        // Channel: 'chat-channel', Event: 'new-message'
        await pusher.trigger('chat-channel', 'new-message', {
            message: message || 'Halo dari server!'
        });

        res.status(200).json({ success: true, message: 'Pesan berhasil dikirim ke Pusher' });
    } catch (error: any) {
        console.error('Error Pusher:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
