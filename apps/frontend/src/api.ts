import type {
  LabListItem,
  LabDetail,
  StartLabResult,
  StopLabResult,
  ValidateLabResult,
  CompleteManualLabResult,
  PlatformStatus,
} from './types';

const API_BASE = '/api';

async function api<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, options);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || `HTTP ${res.status}`);
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
export const validateLab = (id: string) =>
  api<ValidateLabResult>(`/labs/${id}/validate`, { method: 'POST' });
export const completeManualLab = (id: string) =>
  api<CompleteManualLabResult>(`/labs/${id}/complete-manual`, { method: 'POST' });
export const fetchPlatformStatus = () => api<PlatformStatus>('/platform/status');
