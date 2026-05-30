import app from "./app";
import { connectMongoDb, disconnectMongodb } from "./config/mongo_db";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Pastikan koneksi DB sukses TERLEBIH DAHULU
    await connectMongoDb('development');
    
    // Baru kemudian server boleh menerima request
    app.listen(PORT, () => {
      console.log(`Server berjalan di port http://localhost:${PORT}`);
    });
    
    process.on('SIGINT', disconnectMongodb);
  } catch (error) {
    console.error('Gagal terhubung ke MongoDB saat startup!', error);
  }
}

startServer();
