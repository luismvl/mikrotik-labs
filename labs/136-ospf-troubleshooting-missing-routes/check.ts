import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const labDir = path.dirname(fileURLToPath(import.meta.url));
const topologyFile = path.join(labDir, "topology.clab.yml");
const checks = [];
let passed = true;

function add(name, ok, message = "") {
  checks.push({ name, passed: ok, message });
  if (!ok) passed = false;
}

add("topology.clab.yml exists", existsSync(topologyFile), "Smoke check only; objective checks are documented in the lab.");

try {
  execFileSync("containerlab", ["version"], { stdio: "ignore" });
  add("containerlab command exists", true);
} catch {
  add("containerlab command exists", false, "containerlab is not installed or not in PATH");
}

if (passed) {
  try {
    const raw = execFileSync("containerlab", ["inspect", "-t", "topology.clab.yml", "--format", "json"], {
      cwd: labDir,
      encoding: "utf8",
      timeout: 30000,
    });
    const data = JSON.parse(raw);
    const containers = Array.isArray(data?.containers) ? data.containers : Object.values(data ?? {}).flatMap((value: any) => Array.isArray(value) ? value : []);
    const running = containers.filter((node) => String(node.state || "").toLowerCase().includes("running"));
    add("expected nodes are running", running.length >= 3, `Expected at least 3 running nodes, found ${running.length}`);
  } catch (error) {
    add("containerlab inspect succeeds", false, error instanceof Error ? error.message : String(error));
  }
}

console.log(JSON.stringify({ passed, checks }, null, 2));
process.exit(passed ? 0 : 1);
