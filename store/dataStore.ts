import { User } from "../models/User";
import { Locker } from "../models/Locker";

export class Store {
    private users: Map<string, User> = new Map();
    private lockers: Map<string, Locker> = new Map();
    private currentUsser : string | null = null;

    // Session

    getCurrentUser(): string | null {
        return this.currentUsser
    }

    setCurrentUser(username: string | null): void {
        this.currentUsser = username;
    }

    // User

    getUser(username: string): User | undefined {
        return this.users.get(username);
    }
}