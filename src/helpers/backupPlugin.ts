import mongoose from 'mongoose';
import { backupAllToJson } from './backup';

/**
 * Mendaftarkan hook backup secara dinamis ke semua model Mongoose yang telah terdaftar.
 */
export function registerBackupHooks(): void {
  const names = mongoose.modelNames();
  console.log(`[Backup Plugin] Mendaftarkan hook backup ke ${names.length} model:`, names);

  for (const name of names) {
    const model = mongoose.model(name);

    // Document Hook (save/create)
    model.schema.post('save', () => {
      backupAllToJson();
    });

    // Query Hooks (update/delete)
    model.schema.post('updateOne', () => {
      backupAllToJson();
    });
    model.schema.post('updateMany', () => {
      backupAllToJson();
    });
    model.schema.post('deleteOne', () => {
      backupAllToJson();
    });
    model.schema.post('deleteMany', () => {
      backupAllToJson();
    });
    model.schema.post('findOneAndDelete', () => {
      backupAllToJson();
    });
    model.schema.post('findOneAndUpdate', () => {
      backupAllToJson();
    });
    model.schema.post('findOneAndReplace', () => {
      backupAllToJson();
    });
    model.schema.post('replaceOne', () => {
      backupAllToJson();
    });
  }
}
