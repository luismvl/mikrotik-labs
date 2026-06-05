export type LabStatus = 'not-started' | 'running' | 'passed' | 'failed' | 'completed-manual';

export type ResourceType = 'official-docs' | 'related-topic' | 'search-term' | 'video' | 'article';

export interface Resource {
  type: ResourceType;
  title: string;
  url?: string;
  description?: string;
}

export type LabMode = 'containerlab' | 'quiz' | 'physical-auto' | 'physical-manual';
export type Difficulty = 'easy' | 'medium' | 'hard' | 'exam';
export type ValidationType = 'automatic' | 'manual' | 'quiz' | 'mixed';

export interface Router {
  name: string;
  winboxPort?: number;
  sshPort?: number;
  webfigPort?: number;
  username: string;
  password: string;
}

export interface Hardware {
  required: boolean;
  deviceType?: 'mikrotik-wireless-router';
  knownModel?: string;
  connectionMode?: 'same-lan' | 'direct-ethernet' | 'manual';
}

export interface Validation {
  type: ValidationType;
}

export interface LabManifest {
  id: string;
  title: string;
  track: 'MTCNA' | 'MTCRE';
  mode: LabMode;
  difficulty: Difficulty;
  topics: string[];
  resources: Resource[];
  objectives: string[];
  prerequisites?: string[];
  routers?: Router[];
  validation: Validation;
  hardware?: Hardware;
}

export interface LabListItem extends LabManifest {
  status: LabStatus;
}

export interface LabDetail {
  manifest: LabManifest;
  instructions?: string;
  hints?: string;
  solution?: string;
  resources?: string;
  diagram?: string;
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

export interface PlatformStatus {
  dockerAvailable: boolean;
  containerlabAvailable: boolean;
  frpcAvailable: boolean;
  activeLab: string | null;
}

export interface ProgressData {
  labs: Record<string, { status: LabStatus }>;
  activeLab: string | null;
}

export interface ActiveLabRef {
  id: string;
  title: string;
}
