import fs from 'node:fs';
import path from 'node:path';
import mongoose from 'mongoose';

let isBackupInProgress = false;
let backupPending = false;

/**
 * Fungsi untuk melakukan backup semua collection MongoDB ke dalam satu file JSON.
 * Menggunakan queue sederhana agar jika ada beberapa perubahan dalam waktu bersamaan,
 * proses backup tidak bertabrakan (disk I/O bertumpuk).
 */
export async function backupAllToJson(): Promise<void> {
  // Pastikan koneksi Mongoose sedang terhubung (readyState === 1)
  if (mongoose.connection.readyState !== 1) {
    console.warn('[Auto Backup] Tertunda: Database tidak terhubung (readyState !== 1).');
    return;
  }

  if (isBackupInProgress) {
    backupPending = true;
    return;
  }

  isBackupInProgress = true;
  try {
    const db = mongoose.connection.db;
    if (!db) {
      console.warn('[Auto Backup] Gagal: Objek database undefined.');
      return;
    }

    // Ambil daftar semua koleksi yang ada di MongoDB
    const collections = await db.listCollections().toArray();
    const backupData: Record<string, any[]> = {};

    for (const col of collections) {
      const name = col.name;
      // Abaikan koleksi sistem bawaan MongoDB
      if (name.startsWith('system.')) continue;

      const documents = await db.collection(name).find({}).toArray();
      backupData[name] = documents;
    }

    // Buat folder backup jika belum ada
    const backupDir = path.join(process.cwd(), 'backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const backupPath = path.join(backupDir, 'db_backup.json');

    // Simpan semua data ke dalam satu file JSON
    fs.writeFileSync(backupPath, JSON.stringify(backupData, null, 2), 'utf-8');
    console.log(`[Auto Backup Success] Semua data berhasil disimpan ke ${backupPath}`);
  } catch (error) {
    console.error('[Auto Backup Error] Gagal melakukan backup:', error);
  } finally {
    isBackupInProgress = false;
    if (backupPending) {
      backupPending = false;
      // Jalankan ulang backup setelah jeda singkat
      setTimeout(() => {
        backupAllToJson();
      }, 500);
    }
  }
}
