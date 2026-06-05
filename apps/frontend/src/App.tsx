import { useState, useEffect, useCallback } from 'react';
import { Monitor, RotateCcw } from 'lucide-react';
import type { LabListItem, LabDetail, PlatformStatus } from './types';
import {
  ApiError,
  fetchLabs,
  fetchLabDetail,
  startLab,
  stopLab,
  resetLab,
  validateLab,
  completeManualLab,
  fetchPlatformStatus,
} from './api';
import { LabList } from './components/LabList';
import { LabDetailPanel, type Notice } from './components/LabDetail';

type TrackFilter = 'all' | 'MTCNA' | 'MTCRE' | 'wifi-mtcna';
type LabAction = 'start' | 'stop' | 'reset' | null;

export default function App() {
  const [labs, setLabs] = useState<LabListItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<LabDetail | null>(null);
  const [filter, setFilter] = useState<TrackFilter>('all');
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [platformStatus, setPlatformStatus] = useState<PlatformStatus | null>(null);
  const [validating, setValidating] = useState(false);
  const [labAction, setLabAction] = useState<LabAction>(null);
  const [generalMessage, setGeneralMessage] = useState<Notice | null>(null);
  const [validationMessage, setValidationMessage] = useState<Notice | null>(null);

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
    if (filter === 'wifi-mtcna') {
      return (
        lab.track === 'MTCNA' &&
        (lab.topics.some((topic) => ['wireless', 'wifi', 'wi-fi'].includes(topic.toLowerCase())) ||
          lab.mode.startsWith('physical') ||
          lab.hardware?.required === true)
      );
    }
    return true;
  });

  const selectedLab = labs.find((l) => l.id === selectedId) || null;
  const activeLabId = platformStatus?.activeLab ?? null;
  const activeLabTitle = activeLabId
    ? (labs.find((l) => l.id === activeLabId)?.title ?? activeLabId)
    : null;
  const effectiveActiveLabId = labAction === 'start' && selectedId ? selectedId : activeLabId;

  function buildErrorNotice(err: unknown): Notice {
    if (err instanceof ApiError && err.activeLab) {
      const activeTitle = err.activeLab.title;
      const activeId = err.activeLab.id;
      const parts = err.message.split(`"${activeTitle}"`);
      return {
        kind: 'error',
        text: (
          <>
            {parts[0]}
            <button
              className="inline-link"
              onClick={() => setSelectedId(activeId)}
            >
              {activeTitle}
            </button>
            {parts.length > 1 ? parts.slice(1).join(`"${activeTitle}"`) : ''}
          </>
        ),
      };
    }
    return { text: err instanceof Error ? err.message : String(err), kind: 'error' };
  }

  async function handleStart() {
    if (!selectedId) return;
    setLabAction('start');
    setGeneralMessage({ text: 'Iniciando laboratorio...', kind: 'info' });
    try {
      const res = await startLab(selectedId);
      setGeneralMessage({ text: res.message, kind: 'success' });
      await loadLabs();
      if (selectedId) {
        const d = await fetchLabDetail(selectedId);
        setDetail(d);
      }
      await loadPlatformStatus();
    } catch (err) {
      setGeneralMessage(buildErrorNotice(err));
    } finally {
      setLabAction(null);
    }
  }

  async function handleStop() {
    if (!selectedId) return;
    setLabAction('stop');
    setGeneralMessage({ text: 'Deteniendo laboratorio...', kind: 'info' });
    try {
      const res = await stopLab(selectedId);
      setGeneralMessage({ text: res.message, kind: 'success' });
      await loadLabs();
      if (selectedId) {
        const d = await fetchLabDetail(selectedId);
        setDetail(d);
      }
      await loadPlatformStatus();
    } catch (err) {
      setGeneralMessage({ text: err instanceof Error ? err.message : String(err), kind: 'error' });
    } finally {
      setLabAction(null);
    }
  }

  async function handleResetLab(id: string) {
    const confirmed = window.confirm('Resetear este laboratorio destruye el estado actual y lo inicia de nuevo.');
    if (!confirmed) return;
    setLabAction('reset');
    setSelectedId(id);
    setGeneralMessage({ text: 'Reseteando laboratorio...', kind: 'info' });
    try {
      const res = await resetLab(id);
      setGeneralMessage({ text: res.message, kind: 'success' });
      await loadLabs();
      const d = await fetchLabDetail(id);
      setDetail(d);
      await loadPlatformStatus();
    } catch (err) {
      setGeneralMessage(buildErrorNotice(err));
    } finally {
      setLabAction(null);
    }
  }

  async function handleReset() {
    if (!selectedId) return;
    await handleResetLab(selectedId);
  }

  async function handleValidate() {
    if (!selectedId) return;
    setValidating(true);
    setValidationMessage(null);
    try {
      const res = await validateLab(selectedId);
      setValidationMessage({ text: res.message, kind: res.success ? 'success' : 'error' });
      await loadLabs();
    } catch (err) {
      setValidationMessage({ text: err instanceof Error ? err.message : String(err), kind: 'error' });
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
      setValidationMessage({ text: res.message, kind: res.success ? 'success' : 'error' });
      await loadLabs();
      await loadPlatformStatus();
    } catch (err) {
      setValidationMessage({ text: err instanceof Error ? err.message : String(err), kind: 'error' });
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
          {activeLabId && (
            <span className="active-lab-actions">
              <button
                onClick={() => setSelectedId(activeLabId)}
                className="active-lab-link"
              >
                Activo: {activeLabTitle}
              </button>
              <button
                onClick={() => handleResetLab(activeLabId)}
                className="topbar-reset-btn"
                disabled={labAction !== null}
                title="Resetear lab activo"
              >
                <RotateCcw size={13} />
                {labAction === 'reset' ? 'Reseteando...' : 'Resetear'}
              </button>
            </span>
          )}
        </div>
      </header>

      <div className="track-tabs">
        {(['all', 'MTCNA', 'MTCRE', 'wifi-mtcna'] as TrackFilter[]).map((f) => (
          <button
            key={f}
            className={`tab-btn ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'wifi-mtcna' ? 'Wi-Fi MTCNA' : f === 'all' ? 'Todos' : f}
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
              onReset={handleReset}
              isActiveLab={selectedId === effectiveActiveLabId}
              labAction={labAction}
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
