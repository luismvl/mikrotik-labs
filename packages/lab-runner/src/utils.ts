import { spawn } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import type { CommandResult } from './types.js';

export async function getRepoRoot(): Promise<string> {
  const envRoot = process.env.MIKROTIK_LABS_ROOT;
  if (envRoot) {
    return path.resolve(envRoot);
  }
  let current = process.cwd();
  while (true) {
    const parent = path.dirname(current);
    if (parent === current) break;
    try {
      const pkgPath = path.join(current, 'package.json');
      const raw = await fs.readFile(pkgPath, 'utf-8');
      const pkg = JSON.parse(raw) as { name?: string };
      if (pkg.name === 'mikrotik-labs') {
        return current;
      }
    } catch {
      // ignore
    }
    try {
      const labsDir = path.join(current, 'labs');
      const packagesDir = path.join(current, 'packages');
      const s1 = await fs.stat(labsDir);
      const s2 = await fs.stat(packagesDir);
      if (s1.isDirectory() && s2.isDirectory()) {
        return current;
      }
    } catch {
      // ignore
    }
    current = parent;
  }
  throw new Error('Could not resolve mikrotik-labs repo root. Set MIKROTIK_LABS_ROOT.');
}

export async function getLabsDir(): Promise<string> {
  const root = await getRepoRoot();
  return path.join(root, 'labs');
}

export async function listLabIds(): Promise<string[]> {
  const labsDir = await getLabsDir();
  try {
    const entries = await fs.readdir(labsDir, { withFileTypes: true });
    return entries.filter((e) => e.isDirectory()).map((e) => e.name).sort();
  } catch {
    return [];
  }
}

export async function readOptionalFile(filePath: string): Promise<string | undefined> {
  try {
    return await fs.readFile(filePath, 'utf-8');
  } catch {
    return undefined;
  }
}

export function execCommand(command: string, args: string[], options?: { cwd?: string; env?: NodeJS.ProcessEnv; timeout?: number }): Promise<CommandResult> {
  return new Promise((resolve) => {
    const child = spawn(command, args, {
      cwd: options?.cwd,
      env: { ...process.env, ...options?.env },
      shell: false,
    });
    let stdout = '';
    let stderr = '';
    let settled = false;
    const timeoutMs = options?.timeout ?? 120_000;
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      child.kill('SIGTERM');
      const timeoutMsg = `Command timed out after ${timeoutMs} ms`;
      resolve({ stdout, stderr: stderr || timeoutMsg, code: 124 });
    }, timeoutMs);
    child.stdout?.on('data', (data: Buffer) => {
      stdout += data.toString();
    });
    child.stderr?.on('data', (data: Buffer) => {
      stderr += data.toString();
    });
    child.on('close', (code) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve({ stdout, stderr, code: code ?? 1 });
    });
    child.on('error', (err) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve({ stdout, stderr: stderr || err.message, code: 1 });
    });
  });
}
