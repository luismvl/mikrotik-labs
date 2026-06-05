import path from 'node:path';
import { promises as fs } from 'node:fs';
import { parseLabManifest, type LabManifest } from '@mikrotik-labs/lab-schema';
import { getLabsDir, getRepoRoot, listLabIds, readOptionalFile, execCommand } from './utils.js';
import { loadProgress, saveProgress } from './progress.js';
import type {
  LabStatus,
  LabDetail,
  StartLabResult,
  StopLabResult,
  ResetLabResult,
  ValidateLabResult,
  CompleteManualLabResult,
  PlatformStatus,
  ListLabsOptions,
  ActiveLabRef,
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
        errors.push(`Al laboratorio "${id}" le falta el archivo requerido: ${file}`);
      }
    }
    let manifest: LabManifest;
    try {
      manifest = await readLabManifest(id);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      errors.push(`El laboratorio "${id}" tiene un manifiesto inválido: ${message}`);
      continue;
    }
    if (manifest.mode === 'containerlab') {
      for (const file of ['topology.clab.yml', 'check.ts']) {
        try {
          await fs.access(path.join(labDir, file));
        } catch {
          errors.push(`Al laboratorio "${id}" (containerlab) le falta el archivo requerido: ${file}`);
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

async function getActiveLabRef(id: string): Promise<ActiveLabRef> {
  const lab = await getLab(id);
  return { id, title: lab?.title ?? id };
}

async function destroyContainerlab(id: string, cleanup = false): Promise<{ success: boolean; output: string }> {
  const labsDir = await getLabsDir();
  const labDir = path.join(labsDir, id);
  const args = ['destroy', '-t', 'topology.clab.yml'];
  if (cleanup) args.push('--cleanup');
  const result = await execCommand('containerlab', args, { cwd: labDir, timeout: cleanup ? 30_000 : undefined });
  return {
    success: result.code === 0,
    output: result.stderr || result.stdout,
  };
}

async function deployContainerlab(id: string): Promise<{ success: boolean; output: string }> {
  const labsDir = await getLabsDir();
  const labDir = path.join(labsDir, id);
  const result = await execCommand('containerlab', ['deploy', '-t', 'topology.clab.yml'], { cwd: labDir });
  return {
    success: result.code === 0,
    output: result.stderr || result.stdout,
  };
}

export async function startLab(id: string): Promise<StartLabResult> {
  const manifest = await getLab(id);
  if (!manifest) {
    return { success: false, message: `Lab "${id}" no encontrado.` };
  }
  const activeLab = await getActiveLab();
  if (activeLab && activeLab !== id) {
    const active = await getActiveLabRef(activeLab);
    return {
      success: false,
      message: `Ya hay otro laboratorio activo: "${active.title}". Deténlo antes de iniciar uno nuevo.`,
      activeLab: active,
    };
  }
  if (activeLab === id) {
    return { success: true, message: `El laboratorio "${manifest.title}" ya está activo.` };
  }
  if (manifest.mode === 'containerlab') {
    const result = await deployContainerlab(id);
    if (!result.success) {
      await destroyContainerlab(id, true);
      await execCommand('docker', ['network', 'rm', 'mikrotik-labs-mgmt'], { timeout: 30_000 });
      const output = result.output;
      const imageHint = output.includes('pull access denied') && output.includes('vrnetlab/mikrotik_routeros')
        ? '\n\nLas imágenes de RouterOS CHR no se descargan automáticamente desde Docker Hub. Construye o carga la imagen local de vrnetlab `vrnetlab/mikrotik_routeros:7.16`; consulta docs/ROUTEROS_CHR_IMAGE.md.'
        : '';
      return { success: false, message: `Error al desplegar containerlab: ${output}${imageHint}` };
    }
    await setLabStatus(id, 'running');
    await setActiveLab(id);
    return { success: true, message: `Laboratorio "${manifest.title}" iniciado correctamente.` };
  }
  if (manifest.mode === 'quiz' || manifest.mode === 'physical-manual') {
    await setLabStatus(id, 'running');
    await setActiveLab(id);
    return { success: true, message: `Laboratorio "${manifest.title}" marcado como activo.` };
  }
  if (manifest.mode === 'physical-auto') {
    return { success: false, message: 'El modo physical-auto aún no está implementado.' };
  }
  return { success: false, message: `Modo de laboratorio desconocido: ${manifest.mode}` };
}

export async function stopLab(id: string, options?: { destroy?: boolean }): Promise<StopLabResult> {
  const manifest = await getLab(id);
  if (!manifest) {
    return { success: false, message: `Lab "${id}" no encontrado.` };
  }
  if (manifest.mode === 'containerlab') {
    const result = await destroyContainerlab(id, options?.destroy === true);
    if (!result.success) {
      return { success: false, message: `Error al destruir containerlab: ${result.output}` };
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
  return { success: true, message: `Laboratorio "${manifest.title}" detenido.` };
}

export async function resetLab(id: string): Promise<ResetLabResult> {
  const manifest = await getLab(id);
  if (!manifest) {
    return { success: false, message: `Lab "${id}" no encontrado.` };
  }

  const activeLab = await getActiveLab();
  if (activeLab && activeLab !== id) {
    const active = await getActiveLabRef(activeLab);
    return {
      success: false,
      message: `Ya hay otro laboratorio activo: "${active.title}". Deténlo antes de resetear este laboratorio.`,
      activeLab: active,
    };
  }

  if (manifest.mode === 'containerlab') {
    await destroyContainerlab(id, true);
    const result = await deployContainerlab(id);
    if (!result.success) {
      return { success: false, message: `Error al resetear containerlab: ${result.output}` };
    }
  } else if (manifest.mode === 'physical-auto') {
    return { success: false, message: 'El modo physical-auto aún no está implementado.' };
  }

  await setLabStatus(id, 'running');
  await setActiveLab(id);
  return { success: true, message: `Laboratorio "${manifest.title}" reseteado correctamente.` };
}

export async function validateLab(id: string): Promise<ValidateLabResult> {
  const manifest = await getLab(id);
  if (!manifest) {
    return { success: false, message: `Lab "${id}" no encontrado.` };
  }
  if (manifest.validation.type === 'manual') {
    return { success: true, message: 'Este laboratorio requiere validación manual. Usa completeManualLab() para marcarlo como completado.' };
  }
  if (manifest.validation.type === 'quiz') {
    return { success: true, message: 'Este es un laboratorio de cuestionario. Envía las respuestas mediante el frontend.' };
  }
  const labsDir = await getLabsDir();
  const labDir = path.join(labsDir, id);
  const checkPath = path.join(labDir, 'check.ts');
  try {
    await fs.access(checkPath);
  } catch {
    return { success: false, message: `La validación automática está configurada pero falta check.ts en el laboratorio "${id}".` };
  }
  const result = await execCommand('pnpm', ['exec', 'tsx', 'check.ts'], { cwd: labDir });
  if (result.code !== 0) {
    return { success: false, message: `Validación fallida: ${result.stderr || result.stdout}` };
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
  return { success: passed, message: passed ? 'Validación superada.' : 'Validación fallida.', details: parsed };
}

export async function completeManualLab(id: string): Promise<CompleteManualLabResult> {
  const manifest = await getLab(id);
  if (!manifest) {
    return { success: false, message: `Lab "${id}" no encontrado.` };
  }
  if (manifest.validation.type !== 'manual' && manifest.mode !== 'physical-manual') {
    return { success: false, message: 'Este laboratorio no admite finalización manual.' };
  }
  await setLabStatus(id, 'completed-manual');
  await setActiveLab(null);
  return { success: true, message: `Laboratorio "${id}" marcado como completado manualmente.` };
}

export async function getPlatformStatus(): Promise<PlatformStatus> {
  const [docker, containerlab, frpc, activeLab, repoRoot] = await Promise.all([
    execCommand('docker', ['--version']),
    execCommand('containerlab', ['version']),
    execCommand('frpc', ['--version']),
    getActiveLab(),
    getRepoRoot(),
  ]);
  let frpcConfigured = false;
  try {
    const frpcConfig = await fs.readFile(path.join(repoRoot, 'config', 'frpc.toml'), 'utf-8');
    frpcConfigured = !frpcConfig.includes('YOUR_VPS_IP_OR_DOMAIN') && !frpcConfig.includes('YOUR_STRONG_TOKEN_HERE');
  } catch {
    frpcConfigured = false;
  }
  return {
    dockerAvailable: docker.code === 0,
    containerlabAvailable: containerlab.code === 0,
    frpcAvailable: frpc.code === 0 && frpcConfigured,
    activeLab,
  };
}
