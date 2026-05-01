import type { ParticipantResponse, CellMap, BackgroundData, IncidentCellRef, CriticalIncidentResponse } from '../types/study';

const DRAFT_KEY = 'pcm_draft';
const RESPONSES_KEY = 'pcm_responses';

export interface DraftState {
  background: BackgroundData;
  cells: CellMap;
  selectedIncidentCells: IncidentCellRef[];
  incidentForms: Record<string, CriticalIncidentResponse>;
}

export function saveDraft(state: DraftState): void {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(state));
  } catch {
    // Storage may be unavailable
  }
}

export function loadDraft(): DraftState | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as DraftState;
  } catch {
    return null;
  }
}

export function clearDraft(): void {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {
    // ignore
  }
}

export function saveResponse(response: ParticipantResponse): void {
  try {
    const existing = loadAllResponses();
    existing.push(response);
    localStorage.setItem(RESPONSES_KEY, JSON.stringify(existing));
  } catch {
    // ignore
  }
}

export function loadAllResponses(): ParticipantResponse[] {
  try {
    const raw = localStorage.getItem(RESPONSES_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as ParticipantResponse[];
  } catch {
    return [];
  }
}

export function deleteResponse(index: number): void {
  try {
    const existing = loadAllResponses();
    existing.splice(index, 1);
    localStorage.setItem(RESPONSES_KEY, JSON.stringify(existing));
  } catch {
    // ignore
  }
}
