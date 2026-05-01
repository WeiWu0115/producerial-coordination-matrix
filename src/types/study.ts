export type Phase =
  | 'Script / Creative Intent'
  | 'Pre-production'
  | 'Shooting'
  | 'Editing'
  | 'Screening';

export type CoordinationDomain =
  | 'Creative Intent & Script Translation'
  | 'People & Human Friction'
  | 'Time, Schedule & Availability'
  | 'Location, Permission & Compliance'
  | 'Resources, Budget & Logistics'
  | 'Environment, Continuity & Contingency';

export type CoordinationType =
  | 'Hard constraint / cannot be violated'
  | 'Flexible or negotiable'
  | 'Dynamic / changes in real time'
  | 'Human friction'
  | 'AI could help'
  | 'Human producer must make final call';

export interface MatrixCellResponse {
  phase: Phase;
  domain: CoordinationDomain;
  marked_important: boolean;
  coordination_types: CoordinationType[];
  issue_note: string;
  producer_decision_note: string;
  success_criterion_note: string;
}

export interface CriticalIncidentResponse {
  phase: Phase;
  domain: CoordinationDomain;
  incident_description: string;
  why_important: string;
  constraint_type: CoordinationType[];
  ai_help: string;
  human_final_call: string;
}

export interface BackgroundData {
  participant_id: string;
  session_id: string;
  experience_level: string;
  project_count: string;
  project_types: string[];
  location: string;
}

export interface ParticipantResponse {
  participant_id: string | null;
  session_id: string | null;
  experience_level: string | null;
  project_count: string | null;
  project_types: string[];
  location: string | null;
  created_at: string;
  matrix_responses: MatrixCellResponse[];
  critical_incident_cells: CriticalIncidentResponse[];
}

export type PageName =
  | 'intro'
  | 'background'
  | 'matrix'
  | 'incident'
  | 'review'
  | 'submitted'
  | 'admin';

export type CellKey = string; // `${phase}|||${domain}`

export type CellMap = Record<CellKey, MatrixCellResponse>;

export interface IncidentCellRef {
  phase: Phase;
  domain: CoordinationDomain;
}
