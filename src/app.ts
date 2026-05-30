import express from 'express';
import cors from 'cors';
import path from 'path';

import routes from './routes';

const version = '/v1/api'

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

import socketRoutes from './routes/socket.routes';

app.use(version, routes);
app.use('/api/socket', socketRoutes);

app.use(express.static(path.join(process.cwd(), 'public')));

app.get('/v1/api', (req, res) => {
    res.status(200).json({
        message: 'Hello World from Express API',
    })
});

app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: 'Path tidak ditemukan'
    });
});

export default app;