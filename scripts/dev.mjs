// Accept both Next.js CLI flags and the managed preview's Vite-style flags.
import { spawn } from "node:child_process";
const incoming = process.argv.slice(2);
const args = [];
for (let i = 0; i < incoming.length; i++) {
  if (incoming[i] === "--strictPort") continue;
  args.push(incoming[i] === "--host" ? "--hostname" : incoming[i]);
}
const mode = incoming.includes("--strictPort")
  ? ["start"]
  : ["dev", "--webpack"];
const child = spawn(
  process.execPath,
  ["node_modules/next/dist/bin/next", ...mode, ...args],
  { stdio: "inherit" },
);
for (const signal of ["SIGINT", "SIGTERM"])
  process.on(signal, () => child.kill(signal));
child.on("exit", (code) => process.exit(code ?? 1));
