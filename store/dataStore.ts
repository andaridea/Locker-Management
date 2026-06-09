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
}
