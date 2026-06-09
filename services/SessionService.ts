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
    return { success: true, message: `Logout` };
  }
}
