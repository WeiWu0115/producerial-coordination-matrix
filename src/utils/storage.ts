import type { ParticipantResponse, CellMap, BackgroundData, IncidentCellRef, CriticalIncidentResponse } from '../types/study';
import { supabase } from '../lib/supabase';

export async function saveResponseToSupabase(response: ParticipantResponse): Promise<void> {
  const { error } = await supabase.from('responses').insert({ response_data: response });
  if (error) throw error;
}

export async function loadAllResponsesFromSupabase(): Promise<ParticipantResponse[]> {
  const { data, error } = await supabase
    .from('responses')
    .select('response_data')
    .order('submitted_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map((row) => row.response_data as ParticipantResponse);
}

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
