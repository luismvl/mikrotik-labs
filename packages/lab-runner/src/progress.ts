import path from 'node:path';
import { promises as fs } from 'node:fs';
import { getRepoRoot } from './utils.js';
import type { ProgressData } from './types.js';

async function getProgressPath(): Promise<string> {
  const root = await getRepoRoot();
  return path.join(root, 'data', 'progress.json');
}

export async function loadProgress(): Promise<ProgressData> {
  try {
    const data = await fs.readFile(await getProgressPath(), 'utf-8');
    return JSON.parse(data) as ProgressData;
  } catch {
    return { labs: {}, activeLab: null };
  }
}

export async function saveProgress(progress: ProgressData): Promise<void> {
  const p = await getProgressPath();
  await fs.mkdir(path.dirname(p), { recursive: true });
  await fs.writeFile(p, JSON.stringify(progress, null, 2), 'utf-8');
}
