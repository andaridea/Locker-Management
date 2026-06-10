import { Store } from "../store/dataStore";
import { ServiceResult } from "./LockerService";

const ADMIN_USER = "admin";

export class SessionService {
  constructor(private store: Store) {}

  login(username: string): { result: ServiceResult; notifications: string[] } {
    if (this.store.getCurrentUser()) {
      return {
        result: {
          success: false,
          error: "Sudah ada sesi aktif. Silakan logout terlebih dahulu.",
        },
        notifications: [],
      };
    }

    this.store.getOrCreateUser(username);
    this.store.setCurrentUser(username);

    const notifications = this.store.flushNotification(username);
    let welcomeMessage = `Hallo, ${username} !`;
    if (username === ADMIN_USER) {
      welcomeMessage += "\nAnda memiliki akses ke manajemen loker.";
    } else {
      const { assignedLockers } = this.getLockerSummaryForUser(username);
      if (assignedLockers.length === 0) {
        welcomeMessage += "\nAnda tidak memiliki loker yang ditugaskan.";
      }
    }

    return {
      result: { success: true, message: welcomeMessage },
      notifications,
    };
  }

  logout(): ServiceResult {
    const username = this.store.getCurrentUser();
    if (!username) {
      return { success: false, error: "Tidak ada sesi aktif." };
    }
    this.store.setCurrentUser(null);
    return { success: true, message: `Selamat tinggal, ${username}` };
  }

  getCurrentUser(): string | null {
    return this.store.getCurrentUser();
  }

  isAdmin(): boolean {
    return this.store.getCurrentUser() === ADMIN_USER;
  }

  private getLockerSummaryForUser(username: string) {
    const assignedLockers = this.store
      .getAllLockers()
      .filter((l) => l.reservedBy === username)
      .map((l) => l.id);
    return { assignedLockers };
  }
}
