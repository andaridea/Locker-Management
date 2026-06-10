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
      case "reserve":
        return this.handleReserveLocker(args);
      case "release":
        return this.handleRelease(args);
      case "queue":
        return this.handleQueue(args);
      case "status":
        return this.handleStatus();
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

  private handleReserveLocker(args: string[]): string {
    if (!this.requireLogin()) return "Anda harus login terlebih dahulu.";
    if (args.length === 0) return "Penggunaan: reserve <locker-id>";

    const result = this.lockerService.reserveLocker(
      args[0],
      this.sessionService.getCurrentUser()!,
    );
    return result.success ? result.message : result.error;
  }

  private handleRelease(args: string[]): string {
    if (!this.requireLogin()) return "Anda harus login terlebih dahulu.";
    if (args.length === 0) return "Penggunaan: release <locker-id>";

    const result = this.lockerService.releaseLocker(
      args[0],
      this.sessionService.getCurrentUser()!,
    );
    return result.success ? result.message : result.error;
  }

  private handleQueue(args: string[]): string {
    if (!this.requireLogin()) return "Anda harus login terlebih dahulu.";
    if (args.length === 0) return "Penggunaan: queue <locker-id>";

    const result = this.lockerService.joinQueue(
      args[0],
      this.sessionService.getCurrentUser()!,
    );
    return result.success ? result.message : result.error;
  }

  private handleStatus(): string {
    if (!this.requireLogin()) return "Anda harus login terlebih dahulu.";
    const username = this.sessionService.getCurrentUser()!;
    const { assignedLockers, queuePositions } =
      this.lockerService.getUserStatus(username);

    const lines: string[] = [];

    lines.push("Loker yang ditugaskan:");
    if (assignedLockers.length === 0) {
      lines.push("  (tidak ada)");
    } else {
      assignedLockers.forEach((id, i) => lines.push(`  ${i + 1}. ${id}`));
    }

    lines.push("\nAntrian tunggu:");
    if (queuePositions.length === 0) {
      lines.push("  (tidak ada)");
    } else {
      queuePositions.forEach(({ lockerId, position }) =>
        lines.push(`  ${lockerId} -> posisi ${position}`),
      );
    }

    return lines.join("\n");
  }
}
