import type {
  LabListItem,
  LabDetail,
  StartLabResult,
  StopLabResult,
  ResetLabResult,
  ValidateLabResult,
  CompleteManualLabResult,
  PlatformStatus,
  ActiveLabRef,
} from './types';

const API_BASE = '/api';

export class ApiError extends Error {
  status: number;
  activeLab?: ActiveLabRef;

  constructor(status: number, body: { message?: string; activeLab?: ActiveLabRef }) {
    super(body.message || `HTTP ${status}`);
    this.name = 'ApiError';
    this.status = status;
    this.activeLab = body.activeLab;
  }
}

async function api<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, options);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new ApiError(res.status, err);
  }
  return res.json() as Promise<T>;
}

export const fetchLabs = () => api<LabListItem[]>('/labs');
export const fetchLabDetail = (id: string) => api<LabDetail>(`/labs/${id}`);
export const startLab = (id: string) =>
  api<StartLabResult>(`/labs/${id}/start`, { method: 'POST' });
export const stopLab = (id: string) =>
  api<StopLabResult>(`/labs/${id}/stop`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ destroy: false }),
  });
export const resetLab = (id: string) =>
  api<ResetLabResult>(`/labs/${id}/reset`, { method: 'POST' });
export const validateLab = (id: string) =>
  api<ValidateLabResult>(`/labs/${id}/validate`, { method: 'POST' });
export const completeManualLab = (id: string) =>
  api<CompleteManualLabResult>(`/labs/${id}/complete-manual`, { method: 'POST' });
export const fetchPlatformStatus = () => api<PlatformStatus>('/platform/status');
