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
}
