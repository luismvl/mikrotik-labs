import path from 'node:path';
import { promises as fs } from 'node:fs';
import { parseLabManifest, type LabManifest } from '@mikrotik-labs/lab-schema';
import { getLabsDir, listLabIds, readOptionalFile, execCommand } from './utils.js';
import { loadProgress, saveProgress } from './progress.js';
import type {
  LabStatus,
  LabDetail,
  StartLabResult,
  StopLabResult,
  ValidateLabResult,
  CompleteManualLabResult,
  PlatformStatus,
  ListLabsOptions,
} from './types.js';

export * from './types.js';

export async function listLabs(options?: ListLabsOptions): Promise<Array<LabManifest & { status: LabStatus }>> {
  const ids = await listLabIds();
  const progress = options?.includeStatus !== false ? await loadProgress() : null;
  const labs: Array<LabManifest & { status: LabStatus }> = [];
  for (const id of ids) {
    try {
      const manifest = await getLab(id);
      if (manifest) {
        labs.push({
          ...manifest,
          status: progress?.labs[id]?.status ?? 'not-started',
        });
      }
    } catch {
      // skip invalid labs
    }
  }
  return labs;
}

async function readLabManifest(id: string): Promise<LabManifest> {
  const labsDir = await getLabsDir();
  const manifestPath = path.join(labsDir, id, 'manifest.json');
  const raw = JSON.parse(await fs.readFile(manifestPath, 'utf-8'));
  return parseLabManifest(raw);
}

export async function getLab(id: string): Promise<LabManifest | undefined> {
  try {
    return await readLabManifest(id);
  } catch {
    return undefined;
  }
}

export async function getLabDetail(id: string): Promise<LabDetail | undefined> {
  const manifest = await getLab(id);
  if (!manifest) return undefined;
  const labsDir = await getLabsDir();
  const dir = path.join(labsDir, id);
  const [instructions, hints, solution, resources, diagram] = await Promise.all([
    readOptionalFile(path.join(dir, 'instructions.md')),
    readOptionalFile(path.join(dir, 'hints.md')),
    readOptionalFile(path.join(dir, 'solution.md')),
    readOptionalFile(path.join(dir, 'resources.md')),
    readOptionalFile(path.join(dir, 'diagram.mmd')),
  ]);
  return {
    manifest,
    instructions,
    hints,
    solution,
    resources,
    diagram,
  };
}

export async function validateLabCatalog(): Promise<{ valid: boolean; errors: string[] }> {
  const ids = await listLabIds();
  const errors: string[] = [];
  for (const id of ids) {
    const labDir = path.join(await getLabsDir(), id);
    const required = ['manifest.json', 'instructions.md', 'hints.md', 'solution.md', 'resources.md', 'diagram.mmd'];
    for (const file of required) {
      try {
        await fs.access(path.join(labDir, file));
      } catch {
        errors.push(`Lab "${id}" is missing required file: ${file}`);
      }
    }
    let manifest: LabManifest;
    try {
      manifest = await readLabManifest(id);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      errors.push(`Lab "${id}" has invalid manifest: ${message}`);
      continue;
    }
    if (manifest.mode === 'containerlab') {
      for (const file of ['topology.clab.yml', 'check.ts']) {
        try {
          await fs.access(path.join(labDir, file));
        } catch {
          errors.push(`Lab "${id}" (containerlab) is missing required file: ${file}`);
        }
      }
    }
  }
  return { valid: errors.length === 0, errors };
}

export async function getProgress(): Promise<{ labs: Record<string, { status: LabStatus }>; activeLab: string | null }> {
  const data = await loadProgress();
  const labs: Record<string, { status: LabStatus }> = {};
  for (const [id, entry] of Object.entries(data.labs)) {
    labs[id] = { status: entry.status };
  }
  return { labs, activeLab: data.activeLab };
}

export async function setLabStatus(id: string, status: LabStatus): Promise<void> {
  const progress = await loadProgress();
  progress.labs[id] = { status, updatedAt: new Date().toISOString() };
  await saveProgress(progress);
}

export async function getActiveLab(): Promise<string | null> {
  const progress = await loadProgress();
  return progress.activeLab;
}

export async function setActiveLab(id: string | null): Promise<void> {
  const progress = await loadProgress();
  progress.activeLab = id;
  await saveProgress(progress);
}

export async function startLab(id: string): Promise<StartLabResult> {
  const manifest = await getLab(id);
  if (!manifest) {
    return { success: false, message: `Lab "${id}" not found.` };
  }
  const activeLab = await getActiveLab();
  if (activeLab && activeLab !== id) {
    return { success: false, message: `Another lab is already active: "${activeLab}". Stop it before starting a new lab.` };
  }
  if (activeLab === id) {
    return { success: true, message: `Lab "${id}" is already active.` };
  }
  if (manifest.mode === 'containerlab') {
    const labsDir = await getLabsDir();
    const labDir = path.join(labsDir, id);
    const result = await execCommand('containerlab', ['deploy', '-t', 'topology.clab.yml'], { cwd: labDir });
    if (result.code !== 0) {
      return { success: false, message: `containerlab deploy failed: ${result.stderr || result.stdout}` };
    }
    await setLabStatus(id, 'running');
    await setActiveLab(id);
    return { success: true, message: `Lab "${id}" started successfully.` };
  }
  if (manifest.mode === 'quiz' || manifest.mode === 'physical-manual') {
    await setLabStatus(id, 'running');
    await setActiveLab(id);
    return { success: true, message: `Lab "${id}" marked as active.` };
  }
  if (manifest.mode === 'physical-auto') {
    return { success: false, message: 'physical-auto mode is not implemented yet.' };
  }
  return { success: false, message: `Unknown lab mode: ${manifest.mode}` };
}

export async function stopLab(id: string, options?: { destroy?: boolean }): Promise<StopLabResult> {
  const manifest = await getLab(id);
  if (!manifest) {
    return { success: false, message: `Lab "${id}" not found.` };
  }
  if (manifest.mode === 'containerlab') {
    const labsDir = await getLabsDir();
    const labDir = path.join(labsDir, id);
    const args = ['destroy', '-t', 'topology.clab.yml'];
    if (options?.destroy) {
      // no additional flag needed for basic destroy
    }
    const result = await execCommand('containerlab', args, { cwd: labDir });
    if (result.code !== 0) {
      return { success: false, message: `containerlab destroy failed: ${result.stderr || result.stdout}` };
    }
  }
  const activeLab = await getActiveLab();
  if (activeLab === id) {
    await setActiveLab(null);
  }
  const progress = await loadProgress();
  if (progress.labs[id]?.status === 'running') {
    await setLabStatus(id, 'not-started');
  }
  return { success: true, message: `Lab "${id}" stopped.` };
}

export async function validateLab(id: string): Promise<ValidateLabResult> {
  const manifest = await getLab(id);
  if (!manifest) {
    return { success: false, message: `Lab "${id}" not found.` };
  }
  if (manifest.validation.type === 'manual') {
    return { success: true, message: 'This lab requires manual validation. Use completeManualLab() to mark it complete.' };
  }
  if (manifest.validation.type === 'quiz') {
    return { success: true, message: 'This is a quiz lab. Submit answers via the frontend.' };
  }
  const labsDir = await getLabsDir();
  const labDir = path.join(labsDir, id);
  const checkPath = path.join(labDir, 'check.ts');
  try {
    await fs.access(checkPath);
  } catch {
    return { success: false, message: `Automatic validation is configured but check.ts is missing in lab "${id}".` };
  }
  const result = await execCommand('pnpm', ['exec', 'tsx', 'check.ts'], { cwd: labDir });
  if (result.code !== 0) {
    return { success: false, message: `Validation failed: ${result.stderr || result.stdout}` };
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(result.stdout);
  } catch {
    parsed = { raw: result.stdout };
  }
  const passed = parsed && typeof parsed === 'object' && 'passed' in parsed
    ? (parsed as { passed: boolean }).passed
    : true;
  await setLabStatus(id, passed ? 'passed' : 'failed');
  return { success: passed, message: passed ? 'Validation passed.' : 'Validation failed.', details: parsed };
}

export async function completeManualLab(id: string): Promise<CompleteManualLabResult> {
  const manifest = await getLab(id);
  if (!manifest) {
    return { success: false, message: `Lab "${id}" not found.` };
  }
  if (manifest.validation.type !== 'manual' && manifest.mode !== 'physical-manual') {
    return { success: false, message: 'This lab does not support manual completion.' };
  }
  await setLabStatus(id, 'completed-manual');
  await setActiveLab(null);
  return { success: true, message: `Lab "${id}" marked as completed manually.` };
}

export async function getPlatformStatus(): Promise<PlatformStatus> {
  const [docker, containerlab, frpc, activeLab] = await Promise.all([
    execCommand('docker', ['--version']),
    execCommand('containerlab', ['version']),
    execCommand('frpc', ['--version']),
    getActiveLab(),
  ]);
  return {
    dockerAvailable: docker.code === 0,
    containerlabAvailable: containerlab.code === 0,
    frpcAvailable: frpc.code === 0,
    activeLab,
  };
}
