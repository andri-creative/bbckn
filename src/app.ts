import express from 'express';
import cors from 'cors';
import path from 'path';
import mongoose from 'mongoose';
import routes from './routes';
import socketRoutes from './routes/socket.routes';

const version = '/v1/api'

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));
app.use(express.static(path.join(process.cwd(), 'public')));

// Middleware: cek koneksi DB sebelum request masuk ke routes yang butuh DB
app.use((req, res, next) => {
    const skipPaths = ['/health', '/v1/api', '/'];
    if (skipPaths.includes(req.path)) return next();

    if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({
            success: false,
            message: 'Database belum terhubung. Coba lagi sebentar.',
            readyState: mongoose.connection.readyState
        });
    }
    next();
});

// Routes
app.use(version, routes);
app.use('/api/socket', socketRoutes);

// Health check / test route (tidak butuh DB)
app.get('/v1/api', (req, res) => {
    res.status(200).json({
        message: 'Hello World from Express API',
    })
});

app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: 'Path tidak ditemukan'
    });
});

export default app;