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
}
