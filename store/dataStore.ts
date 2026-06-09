import { User } from "../models/User";
import { Locker } from "../models/Locker";

export class Store {
  private users: Map<string, User> = new Map();
  private lockers: Map<string, Locker> = new Map();
  private currentUser: string | null = null;

  // Session

  getCurrentUser(): string | null {
    return this.currentUser;
  }

  setCurrentUser(username: string | null): void {
    this.currentUser = username;
  }

  // User

  getUser(username: string): User | undefined {
    return this.users.get(username);
  }

  createUser(username: string): User {
    const user: User = { username, pendingNotifications: [] };
    this.users.set(username, user);
    return user;
  }

  getOrCreateUser(username: string): User | undefined {
    return this.getUser(username) ?? this.createUser(username);
  }

  addNotification(username: string, message: string): void {
    const user = this.getUser(username);
    if (user) {
      user.pendingNotifications.push(message);
    }
  }

  flushNotification(username: string): string[] {
    const user = this.getUser(username);
    if (!user) return [];
    const notifications = [...user.pendingNotifications];
    user.pendingNotifications = [];
    return notifications;
  }

  // Locker
  getLocker(lockerId: string): Locker | undefined {
    return this.lockers.get(lockerId);
  }

  getAllLockers(): Locker[] {
    return Array.from(this.lockers.values());
  }

  addLocker(lockerId: string): Locker {
    const locker: Locker = {
      id: lockerId,
      status: "TERSEDIA",
      reservedBy: null,
      waitingQueue: [],
    };

    this.lockers.set(lockerId, locker);
    return locker;
  }

  hasLocker(lockerId: string): boolean {
    return this.lockers.has(lockerId);
  }
}
