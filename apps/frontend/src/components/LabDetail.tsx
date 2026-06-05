import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  Play,
  Square,
  CheckCircle,
  ExternalLink,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import type { LabDetail, LabListItem } from '../types';
import { TrackBadge, DifficultyBadge, StatusBadge } from './StatusBadge';

interface LabDetailProps {
  lab: LabListItem;
  detail: LabDetail;
  onStart: () => void;
  onStop: () => void;
  onValidate: () => void;
  onCompleteManual: () => void;
  validating: boolean;
  generalMessage: string | null;
  validationMessage: string | null;
}

function AccessPanel({
  routers,
}: {
  routers?: { name: string; winboxPort?: number; sshPort?: number; webfigPort?: number; username: string; password: string }[];
}) {
  if (!routers || routers.length === 0) {
    return <p className="text-secondary">No hay acceso de router configurado.</p>;
  }
  return (
    <table className="access-table">
      <thead>
        <tr>
          <th>Router</th>
          <th>WinBox</th>
          <th>SSH</th>
          <th>WebFig</th>
          <th>Usuario</th>
          <th>Clave</th>
        </tr>
      </thead>
      <tbody>
        {routers.map((r) => (
          <tr key={r.name}>
            <td>{r.name}</td>
            <td>{r.winboxPort ?? '-'}</td>
            <td>{r.sshPort ?? '-'}</td>
            <td>{r.webfigPort ?? '-'}</td>
            <td>{r.username}</td>
            <td>{r.password}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function DiagramPanel({ diagram }: { diagram?: string }) {
  if (!diagram) return <p className="text-secondary">No hay diagrama disponible.</p>;
  return <pre className="diagram-pre">{diagram}</pre>;
}

function ObjectivesPanel({ objectives }: { objectives: string[] }) {
  return (
    <ul className="objectives-list">
      {objectives.map((obj, i) => (
        <li key={i}>{obj}</li>
      ))}
    </ul>
  );
}

function InstructionsPanel({ instructions }: { instructions?: string }) {
  if (!instructions) return <p className="text-secondary">No hay instrucciones disponibles.</p>;
  return (
    <div className="markdown-body">
      <ReactMarkdown>{instructions}</ReactMarkdown>
    </div>
  );
}

function ResourcesPanel({
  manifestResources,
  resourcesMd,
}: {
  manifestResources: LabDetail['manifest']['resources'];
  resourcesMd?: string;
}) {
  const groups: Record<string, typeof manifestResources> = {
    'Docs oficiales': manifestResources.filter((r) => r.type === 'official-docs'),
    'Temas relacionados': manifestResources.filter((r) => r.type === 'related-topic'),
    'Busquedas sugeridas': manifestResources.filter((r) => r.type === 'search-term'),
    'Videos/articulos opcionales': manifestResources.filter((r) => r.type === 'video' || r.type === 'article'),
  };

  return (
    <div>
      {Object.entries(groups).map(([name, items]) =>
        items.length > 0 ? (
          <div key={name} className="resource-group">
            <h4 className="resource-group-title">{name}</h4>
            <ul className="resource-list">
              {items.map((r, i) => (
                <li key={i} className="resource-item">
                  {r.url ? (
                    <a href={r.url} target="_blank" rel="noreferrer">
                      {r.title}
                      <ExternalLink size={12} />
                    </a>
                  ) : (
                    <span>{r.title}</span>
                  )}
                  {r.description && <span className="resource-desc"> — {r.description}</span>}
                </li>
              ))}
            </ul>
          </div>
        ) : null
      )}
      {resourcesMd && (
        <div className="markdown-body" style={{ marginTop: 12 }}>
          <ReactMarkdown>{resourcesMd}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}

function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="detail-section">
      <div className="collapsible-header" onClick={() => setOpen(!open)}>
        <h3 className="section-title">{title}</h3>
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </div>
      {open && <div className="collapsible-body">{children}</div>}
    </div>
  );
}

function ValidationSection({
  lab,
  onValidate,
  onCompleteManual,
  validating,
  validationMessage,
}: {
  lab: LabListItem;
  onValidate: () => void;
  onCompleteManual: () => void;
  validating: boolean;
  validationMessage: string | null;
}) {
  const isManual = lab.validation.type === 'manual' || lab.mode === 'physical-manual';

  return (
    <div className="detail-section">
      <h3 className="section-title">Validacion</h3>
      <div className="toolbar">
        {isManual ? (
          <button className="btn btn-success" onClick={onCompleteManual} disabled={validating}>
            <CheckCircle size={14} />
            {validating ? 'Completando...' : 'Marcar completado'}
          </button>
        ) : (
          <button className="btn btn-primary" onClick={onValidate} disabled={validating}>
            <CheckCircle size={14} />
            {validating ? 'Validando...' : 'Validar'}
          </button>
        )}
      </div>
      {validationMessage && (
        <div
          className={`validation-result ${
            validationMessage.toLowerCase().includes('passed') ||
            validationMessage.toLowerCase().includes('success') ||
            validationMessage.toLowerCase().includes('complete')
              ? 'success'
              : 'error'
          }`}
        >
          {validationMessage}
        </div>
      )}
    </div>
  );
}

export function LabDetailPanel({
  lab,
  detail,
  onStart,
  onStop,
  onValidate,
  onCompleteManual,
  validating,
  generalMessage,
  validationMessage,
}: LabDetailProps) {
  const [showSolution, setShowSolution] = useState(false);

  return (
    <div className="detail-panel">
      <div className="detail-header" style={{ justifyContent: 'flex-end' }}>
        <div className="toolbar">
          {lab.status === 'running' ? (
            <button className="btn btn-danger" onClick={onStop}>
              <Square size={14} />
              Detener
            </button>
          ) : (
            <button className="btn btn-primary" onClick={onStart}>
              <Play size={14} />
              Iniciar
            </button>
          )}
        </div>
      </div>

      {generalMessage && (
        <div
          className={`validation-result ${
            generalMessage.toLowerCase().includes('success') || generalMessage.toLowerCase().includes('started') || generalMessage.toLowerCase().includes('stopped')
              ? 'success'
              : 'error'
          }`}
          style={{ marginBottom: 16 }}
        >
          {generalMessage}
        </div>
      )}

      <div className="detail-section">
        <h3 className="section-title">Titulo</h3>
        <p className="detail-title" style={{ margin: 0 }}>
          {detail.manifest.title}
        </p>
      </div>

      <div className="detail-section">
        <h3 className="section-title">Track</h3>
        <TrackBadge track={detail.manifest.track} />
      </div>

      <div className="detail-section">
        <h3 className="section-title">Dificultad</h3>
        <DifficultyBadge difficulty={detail.manifest.difficulty} />
      </div>

      <div className="detail-section">
        <h3 className="section-title">Diagrama</h3>
        <DiagramPanel diagram={detail.diagram} />
      </div>

      <div className="detail-section">
        <h3 className="section-title">Objetivos</h3>
        <ObjectivesPanel objectives={detail.manifest.objectives} />
      </div>

      <div className="detail-section">
        <h3 className="section-title">Acceso</h3>
        <AccessPanel routers={detail.manifest.routers} />
      </div>

      <div className="detail-section">
        <h3 className="section-title">Instrucciones</h3>
        <InstructionsPanel instructions={detail.instructions} />
      </div>

      <div className="detail-section">
        <h3 className="section-title">Recursos</h3>
        <ResourcesPanel
          manifestResources={detail.manifest.resources}
          resourcesMd={detail.resources}
        />
      </div>

      <CollapsibleSection title="Pistas" defaultOpen={false}>
        {detail.hints ? (
          <div className="markdown-body">
            <ReactMarkdown>{detail.hints}</ReactMarkdown>
          </div>
        ) : (
          <p className="text-secondary">No hay pistas disponibles.</p>
        )}
      </CollapsibleSection>

      <ValidationSection
        lab={lab}
        onValidate={onValidate}
        onCompleteManual={onCompleteManual}
        validating={validating}
        validationMessage={validationMessage}
      />

      <div className="detail-section">
        <div className="collapsible-header" style={{ marginBottom: 8 }}>
          <h3 className="section-title">Solucion</h3>
          {!showSolution ? (
            <button className="btn btn-primary" onClick={() => setShowSolution(true)}>
              <Eye size={14} />
              Mostrar solucion
            </button>
          ) : (
            <button className="btn" onClick={() => setShowSolution(false)}>
              <EyeOff size={14} />
              Ocultar solucion
            </button>
          )}
        </div>
        {showSolution &&
          (detail.solution ? (
            <div className="markdown-body">
              <ReactMarkdown>{detail.solution}</ReactMarkdown>
            </div>
          ) : (
            <p className="text-secondary">No hay solucion disponible.</p>
          ))}
      </div>
    </div>
  );
}
