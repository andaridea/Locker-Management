import { Locker } from "../models/Locker";
import { Store } from "../store/dataStore";

export type ServiceResult =
  | { success: true; message: string }
  | { success: false; error: string };

export class LockerService {
  constructor(private store: Store) {}

  addLocker(lockerId: string): ServiceResult {
    if (this.store.hasLocker(lockerId)) {
      return { success: false, error: `Loker ${lockerId} sudah terdaftar.` };
    }
    this.store.addLocker(lockerId);
    return { success: true, message: `Loker ${lockerId} telah didaftarkan.` };
  }

  listLocker(): Locker[] {
    return this.store.getAllLockers();
  }

  reserveLocker(lockerId: string, username: string): ServiceResult {
    const locker = this.store.getLocker(lockerId);
    if (!locker) {
      return { success: false, error: `Loker ${lockerId} tidak ditemukan.` };
    }
    if (locker.status === "DIPESAN") {
      return { success: false, error: `Loker ${lockerId} sudah dipesan.` };
    }
    locker.status = "DIPESAN";
    locker.reservedBy = username;
    return {
      success: true,
      message: `Loker ${lockerId} telah dipesan untuk Anda.`,
    };
  }

  releaseLocker(lockerId: string, username: string): ServiceResult {
    const locker = this.store.getLocker(lockerId);
    if (!locker) {
      return { success: false, error: `Loker ${lockerId} tidak ditemukan.` };
    }
    if (locker.reservedBy !== username) {
      return {
        success: false,
        error: `Anda tidak memiliki loker ${lockerId}.`,
      };
    }

    // Cek apakah ada antrian
    if (locker.waitingQueue.length > 0) {
      const nextUser = locker.waitingQueue.shift()!;
      locker.reservedBy = nextUser;
      // Kirim notifikasi ke user berikutnya
      this.store.addNotification(
        nextUser,
        `Loker ${lockerId} telah otomatis ditugaskan kepada Anda.`,
      );
      return {
        success: true,
        message: `Loker ${lockerId} dilepas. ${nextUser} dari antrian telah ditugaskan otomatis.`,
      };
    }

    locker.status = "TERSEDIA";
    locker.reservedBy = null;
    return { success: true, message: `Loker ${lockerId} berhasil dilepas.` };
  }

  joinQueue(lockerId: string, username: string): ServiceResult {
    const locker = this.store.getLocker(lockerId);
    if (!locker) {
      return { success: false, error: `Loker ${lockerId} tidak ditemukan.` };
    }
    if (locker.status === "TERSEDIA") {
      return {
        success: false,
        error: `Loker ${lockerId} tersedia, silakan langsung pesan.`,
      };
    }
    if (locker.reservedBy === username) {
      return { success: false, error: `Anda sudah memesan loker ${lockerId}.` };
    }
    if (locker.waitingQueue.includes(username)) {
      return {
        success: false,
        error: `Anda sudah ada dalam antrian loker ${lockerId}.`,
      };
    }
    locker.waitingQueue.push(username);
    const position = locker.waitingQueue.length;
    return {
      success: true,
      message: `Anda bergabung ke antrian loker ${lockerId} di posisi ${position}.`,
    };
  }

  getUserStatus(username: string): {
    assignedLockers: string[];
    queuePositions: { lockerId: string; position: number }[];
  } {
    const assignedLockers: string[] = [];
    const queuePositions: { lockerId: string; position: number }[] = [];

    for (const locker of this.store.getAllLockers()) {
      if (locker.reservedBy === username) {
        assignedLockers.push(locker.id);
      }
      const pos = locker.waitingQueue.indexOf(username);
      if (pos !== -1) {
        queuePositions.push({ lockerId: locker.id, position: pos + 1 });
      }
    }

    return { assignedLockers, queuePositions };
  }
}
