import type { LabManifest } from '@mikrotik-labs/lab-schema';

export type LabStatus = 'not-started' | 'running' | 'passed' | 'failed' | 'completed-manual';

export interface ProgressData {
  labs: Record<string, { status: LabStatus; updatedAt?: string }>;
  activeLab: string | null;
}

export interface LabDetail {
  manifest: LabManifest;
  instructions?: string;
  hints?: string;
  solution?: string;
  resources?: string;
  diagram?: string;
}

export interface ListLabsOptions {
  includeStatus?: boolean;
}

export interface CommandResult {
  stdout: string;
  stderr: string;
  code: number;
}

export interface PlatformStatus {
  dockerAvailable: boolean;
  containerlabAvailable: boolean;
  frpcAvailable: boolean;
  activeLab: string | null;
}

export interface ActiveLabRef {
  id: string;
  title: string;
}

export interface StartLabResult {
  success: boolean;
  message: string;
  activeLab?: ActiveLabRef;
}

export interface StopLabResult {
  success: boolean;
  message: string;
}

export interface ResetLabResult {
  success: boolean;
  message: string;
  activeLab?: ActiveLabRef;
}

export interface ValidateLabResult {
  success: boolean;
  message: string;
  details?: unknown;
}

export interface CompleteManualLabResult {
  success: boolean;
  message: string;
}
