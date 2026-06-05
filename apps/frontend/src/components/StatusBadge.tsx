import type { LabStatus, Difficulty } from '../types';

const statusLabels: Record<LabStatus, string> = {
  'not-started': 'Sin iniciar',
  running: 'En curso',
  passed: 'Aprobado',
  failed: 'Fallido',
  'completed-manual': 'Completado',
};

const difficultyLabels: Record<Difficulty, string> = {
  easy: 'Facil',
  medium: 'Medio',
  hard: 'Dificil',
  exam: 'Simulacion',
};

export function StatusBadge({ status }: { status: LabStatus }) {
  return <span className={`badge badge-status-${status}`}>{statusLabels[status]}</span>;
}

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  return <span className={`badge badge-difficulty-${difficulty}`}>{difficultyLabels[difficulty]}</span>;
}

export function TrackBadge({ track }: { track: string }) {
  return <span className={`badge badge-track-${track}`}>{track}</span>;
}
