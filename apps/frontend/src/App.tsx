import { useState, useEffect, useCallback } from 'react';
import { Monitor } from 'lucide-react';
import type { LabListItem, LabDetail, PlatformStatus } from './types';
import {
  fetchLabs,
  fetchLabDetail,
  startLab,
  stopLab,
  validateLab,
  completeManualLab,
  fetchPlatformStatus,
} from './api';
import { LabList } from './components/LabList';
import { LabDetailPanel } from './components/LabDetail';

type TrackFilter = 'all' | 'MTCNA' | 'MTCRE' | 'wifi-physical';

export default function App() {
  const [labs, setLabs] = useState<LabListItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<LabDetail | null>(null);
  const [filter, setFilter] = useState<TrackFilter>('all');
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [platformStatus, setPlatformStatus] = useState<PlatformStatus | null>(null);
  const [validating, setValidating] = useState(false);
  const [generalMessage, setGeneralMessage] = useState<string | null>(null);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);

  const loadLabs = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchLabs();
      setLabs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadPlatformStatus = useCallback(async () => {
    try {
      const data = await fetchPlatformStatus();
      setPlatformStatus(data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    loadLabs();
    loadPlatformStatus();
  }, [loadLabs, loadPlatformStatus]);

  useEffect(() => {
    if (!selectedId) {
      setDetail(null);
      return;
    }
    setDetailLoading(true);
    setGeneralMessage(null);
    setValidationMessage(null);
    fetchLabDetail(selectedId)
      .then(setDetail)
      .catch((err) => {
        console.error(err);
        setDetail(null);
      })
      .finally(() => setDetailLoading(false));
  }, [selectedId]);

  const filteredLabs = labs.filter((lab) => {
    if (filter === 'all') return true;
    if (filter === 'MTCNA') return lab.track === 'MTCNA';
    if (filter === 'MTCRE') return lab.track === 'MTCRE';
    if (filter === 'wifi-physical') return lab.mode.startsWith('physical') || lab.hardware?.required === true;
    return true;
  });

  const selectedLab = labs.find((l) => l.id === selectedId) || null;

  async function handleStart() {
    if (!selectedId) return;
    try {
      const res = await startLab(selectedId);
      setGeneralMessage(res.message);
      await loadLabs();
      if (selectedId) {
        const d = await fetchLabDetail(selectedId);
        setDetail(d);
      }
      await loadPlatformStatus();
    } catch (err) {
      setGeneralMessage(err instanceof Error ? err.message : String(err));
    }
  }

  async function handleStop() {
    if (!selectedId) return;
    try {
      const res = await stopLab(selectedId);
      setGeneralMessage(res.message);
      await loadLabs();
      if (selectedId) {
        const d = await fetchLabDetail(selectedId);
        setDetail(d);
      }
      await loadPlatformStatus();
    } catch (err) {
      setGeneralMessage(err instanceof Error ? err.message : String(err));
    }
  }

  async function handleValidate() {
    if (!selectedId) return;
    setValidating(true);
    setValidationMessage(null);
    try {
      const res = await validateLab(selectedId);
      setValidationMessage(res.message);
      await loadLabs();
    } catch (err) {
      setValidationMessage(err instanceof Error ? err.message : String(err));
    } finally {
      setValidating(false);
    }
  }

  async function handleCompleteManual() {
    if (!selectedId) return;
    setValidating(true);
    setValidationMessage(null);
    try {
      const res = await completeManualLab(selectedId);
      setValidationMessage(res.message);
      await loadLabs();
      await loadPlatformStatus();
    } catch (err) {
      setValidationMessage(err instanceof Error ? err.message : String(err));
    } finally {
      setValidating(false);
    }
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-left">
          <Monitor size={20} />
          <div>
            <h1 className="header-title">MikroTik Labs</h1>
            <p className="header-subtitle">Laboratorios de certificacion MTCNA + MTCRE</p>
          </div>
        </div>
        <div className="platform-status">
          <span>
            <span className={`status-dot ${platformStatus?.dockerAvailable ? 'ok' : 'err'}`} />
            Docker
          </span>
          <span>
            <span className={`status-dot ${platformStatus?.containerlabAvailable ? 'ok' : 'err'}`} />
            Containerlab
          </span>
          <span>
            <span className={`status-dot ${platformStatus?.frpcAvailable ? 'ok' : 'err'}`} />
            frpc
          </span>
          {platformStatus?.activeLab && (
            <span style={{ color: '#93c5fd' }}>Activo: {platformStatus.activeLab}</span>
          )}
        </div>
      </header>

      <div className="track-tabs">
        {(['all', 'MTCNA', 'MTCRE', 'wifi-physical'] as TrackFilter[]).map((f) => (
          <button
            key={f}
            className={`tab-btn ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'wifi-physical' ? 'Wi-Fi / Fisico' : f === 'all' ? 'Todos' : f}
          </button>
        ))}
      </div>

      <main className="main">
        <LabList
          labs={filteredLabs}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onRefresh={loadLabs}
          loading={loading}
        />
        <div className="detail-container">
          {detailLoading && <div className="empty-state">Cargando detalle...</div>}
          {!detailLoading && selectedLab && detail && (
            <LabDetailPanel
              lab={selectedLab}
              detail={detail}
              onStart={handleStart}
              onStop={handleStop}
              onValidate={handleValidate}
              onCompleteManual={handleCompleteManual}
              validating={validating}
              generalMessage={generalMessage}
              validationMessage={validationMessage}
            />
          )}
          {!detailLoading && !selectedLab && (
            <div className="empty-state">
              <p>Selecciona un lab para ver el detalle.</p>
            </div>
          )}
          {!detailLoading && selectedLab && !detail && (
            <div className="empty-state">
              <p>No se pudo cargar el detalle del lab.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
