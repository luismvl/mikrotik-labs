import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const labDir = path.resolve(path.dirname(__filename));
const topologyFile = path.join(labDir, "topology.clab.yml");

const checks: { name: string; passed: boolean; message?: string }[] = [];
let passed = true;

function check(name: string, fn: () => void) {
  try {
    fn();
    checks.push({ name, passed: true });
  } catch (e: any) {
    passed = false;
    checks.push({ name, passed: false, message: e.message });
  }
}

check("topology.clab.yml exists", () => {
  if (!fs.existsSync(topologyFile)) {
    throw new Error("topology.clab.yml not found");
  }
});

check("containerlab command exists", () => {
  try {
    execSync("which containerlab", { stdio: "ignore" });
  } catch {
    throw new Error("containerlab not found in PATH");
  }
});

check("containerlab nodes are deployed", () => {
  const result = execSync("containerlab inspect -t topology.clab.yml --format json", {
    cwd: labDir,
    encoding: "utf-8",
    timeout: 30000,
  });
  const data = JSON.parse(result);
  const containers = Array.isArray(data?.containers) ? data.containers : Object.values(data ?? {}).flatMap((value: any) => Array.isArray(value) ? value : []);
  if (containers.length === 0) {
    throw new Error("No containers found for this topology");
  }
  const running = containers.filter((c: any) => c.state === "running");
  if (running.length === 0) {
    throw new Error("No running containers found");
  }
});

console.log(JSON.stringify({ passed, checks }, null, 2));
process.exit(passed ? 0 : 1);
