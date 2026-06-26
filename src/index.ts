import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './app';
import { connectMongoDb, disconnectMongodb } from './config/mongo_db';

dotenv.config();

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    console.log('🔄 Connecting to MongoDB...');

    // 1. Koneksi ke MongoDB
    await connectMongoDb('development');

    console.log('✅ MongoDB connected successfully');
    console.log('ReadyState:', mongoose.connection.readyState);

    // 2. Test query untuk verifikasi koneksi
    try {
      const db = mongoose.connection.db;
      if (db) {
        const collections = await db.listCollections().toArray();
        console.log(
          '📚 Collections available:',
          collections.map((c: any) => c.name),
        );
      } else {
        console.warn('⚠️  DB is undefined - mungkin belum siap');
      }
    } catch (e) {
      console.error('❌ Test query gagal:', e);
      throw e; // Stop server jika test query gagal
    }

    // 3. Start server
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
      console.log(`📡 Health check: http://localhost:${PORT}/health`);
    });

    // 5. Handle graceful shutdown
    const gracefulShutdown = async () => {
      console.log('\n🛑 Shutting down gracefully...');
      await disconnectMongodb();
      server.close(() => {
        console.log('👋 Server closed');
        process.exit(0);
      });
    };

    process.on('SIGINT', gracefulShutdown);
    process.on('SIGTERM', gracefulShutdown);
  } catch (error) {
    console.error('❌ Gagal start server:', error);
    process.exit(1);
  }
}

startServer();
