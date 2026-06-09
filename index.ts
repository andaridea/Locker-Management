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

console.log("=== Locker Management CLI ===");
console.log("Ketik perintah Anda. Contoh: login admin\n");
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
