import { RefreshCw } from 'lucide-react';
import type { LabListItem } from '../types';
import { StatusBadge, DifficultyBadge, TrackBadge } from './StatusBadge';

interface LabListProps {
  labs: LabListItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onRefresh: () => void;
  loading: boolean;
}

export function LabList({ labs, selectedId, onSelect, onRefresh, loading }: LabListProps) {
  return (
    <div className="lab-list-panel">
      <div className="lab-list-header">
        <h2 className="panel-title">Labs ({labs.length})</h2>
        <button className="btn" onClick={onRefresh} disabled={loading} title="Actualizar">
          <RefreshCw size={14} className={loading ? 'spin' : ''} />
          Actualizar
        </button>
      </div>
      <div className="lab-list">
        {labs.length === 0 && (
          <div className="empty-state">
            <p>No hay labs disponibles.</p>
            <p className="empty-hint">Crea labs en el directorio /labs para empezar.</p>
          </div>
        )}
        {labs.map((lab) => (
          <div
            key={lab.id}
            className={`lab-card ${selectedId === lab.id ? 'selected' : ''}`}
            onClick={() => onSelect(lab.id)}
          >
            <div className="lab-row-header">
              <h3 className="lab-row-title">{lab.title}</h3>
              <StatusBadge status={lab.status} />
            </div>
            <div className="lab-row-meta">
              <TrackBadge track={lab.track} />
              <DifficultyBadge difficulty={lab.difficulty} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
