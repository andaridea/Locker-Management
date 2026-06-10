import { LockerService } from "../services/LockerService";
import { SessionService } from "../services/SessionService";

export class CommandHandler {
  constructor(
    private sessionService: SessionService,
    private lockerService: LockerService,
  ) {}

  handle(input: string): string {
    const trimmed = input.trim();
    if (!trimmed) return "";

    const [command, ...args] = trimmed.split(/\s+/);

    switch (command) {
      case "login":
        return this.handleLogin(args);
      case "logout":
        return this.handleLogout();
      case "add-locker":
        return this.handleAddLocker(args);
      case "list-locker":
        return this.handleListLockers();
      default:
        return `Perintah tidak dikenal."${command}"`;
    }
  }

  private handleLogin(args: string[]): string {
    if (args.length === 0) return "Penggunaan: login<username>";
    const username = args[0];
    const { result, notifications } = this.sessionService.login(username);
    if (!result.success) return result.error;

    const lines = [result.message];
    for (const notif of notifications) {
      lines.push(`[notifikasi] ${notif}`);
    }
    return lines.join("\n");
  }

  private handleLogout(): string {
    const result = this.sessionService.logout();
    if (result.success) {
      return result.message;
    }
    return result.error;
  }

  private requireLogin(): boolean {
    return this.sessionService.getCurrentUser() !== null;
  }

  private handleAddLocker(args: string[]): string {
    if (!this.requireLogin) return "Anda harus login dahulu.";
    if (!this.sessionService.isAdmin())
      return "Hanya admin yang dapat menambahkan loker.";

    if (args.length === 0) return "Penggunaan: add-locker <locker-id>";
    const result = this.lockerService.addLocker(args[0]);
    return result.success ? result.message : result.error;
  }

  private handleListLockers(): string {
    if (!this.requireLogin()) return "Anda harus login terlebih dahulu.";
    const lockers = this.lockerService.listLocker();
    if (lockers.length === 0) return "Belum ada loker yang terdaftar.";

    return lockers
      .map((l) => {
        const status =
          l.status === "TERSEDIA" ? "TERSEDIA" : `DIPESAN oleh ${l.reservedBy}`;
        return `${l.id} - ${status}`;
      })
      .join("\n");
  }
}
