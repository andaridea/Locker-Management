import * as readline from "readline";
import { CommandHandler } from "./commands/commandHandler";
import { LockerService } from "./services/LockerService";
import { SessionService } from "./services/SessionService";
import { Store } from "./store/dataStore";

const store = new Store();
const lockerService = new LockerService(store);
const sessionService = new SessionService(store);
const commandHandler = new CommandHandler(sessionService, lockerService);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: ">",
});

console.log("=== Parcel Locker CLI ===");
console.log("Daftar Perintah:");
console.log("----------------------------------------------------------------------");
console.log("  login <username>   | Login sebagai user (dibuat otomatis jika baru)");
console.log("  logout             | Keluar dari sesi saat ini");
console.log("  add-locker <id>    | Daftarkan loker baru (hanya admin)");
console.log("  list-locker        | Tampilkan semua loker dan statusnya");
console.log("  reserve <id>       | Pesan loker yang tersedia");
console.log("  release <id>       | Lepas loker yang kamu pesan");
console.log("  queue <id>         | Masuk antrian loker yang sudah dipesan");
console.log("  status             | Lihat loker yang kamu pesan dan posisi antrian");
console.log("----------------------------------------------------------------------\n");
rl.prompt();

rl.on("line", (line) => {
  const output = commandHandler.handle(line);
  if (output) console.log(output);
  rl.prompt();
});

rl.on("close", () => {
    console.log("\nAplikasi ditutup.")
    process.exit(0);
});
