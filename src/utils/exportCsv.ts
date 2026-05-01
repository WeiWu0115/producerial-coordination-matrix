import type { ParticipantResponse } from '../types/study';

function escapeCsv(value: string | null | undefined): string {
  if (value == null) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

function triggerDownload(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportMatrixResponsesCSV(responses: ParticipantResponse[]): void {
  const header = [
    'participant_id',
    'session_id',
    'experience_level',
    'project_types',
    'phase',
    'domain',
    'marked_important',
    'coordination_types',
    'issue_note',
    'producer_decision_note',
    'success_criterion_note',
    'created_at',
  ].join(',');

  const rows: string[] = [header];

  for (const r of responses) {
    for (const cell of r.matrix_responses) {
      rows.push([
        escapeCsv(r.participant_id),
        escapeCsv(r.session_id),
        escapeCsv(r.experience_level),
        escapeCsv((r.project_types || []).join('; ')),
        escapeCsv(cell.phase),
        escapeCsv(cell.domain),
        cell.marked_important ? 'true' : 'false',
        escapeCsv(cell.coordination_types.join('; ')),
        escapeCsv(cell.issue_note),
        escapeCsv(cell.producer_decision_note),
        escapeCsv(cell.success_criterion_note),
        escapeCsv(r.created_at),
      ].join(','));
    }
  }

  const date = new Date().toISOString().slice(0, 10);
  triggerDownload(rows.join('\n'), `pcm_matrix_responses_${date}.csv`);
}

export function exportIncidentResponsesCSV(responses: ParticipantResponse[]): void {
  const header = [
    'participant_id',
    'session_id',
    'phase',
    'domain',
    'incident_description',
    'why_important',
    'constraint_type',
    'ai_help',
    'human_final_call',
    'created_at',
  ].join(',');

  const rows: string[] = [header];

  for (const r of responses) {
    for (const inc of r.critical_incident_cells) {
      rows.push([
        escapeCsv(r.participant_id),
        escapeCsv(r.session_id),
        escapeCsv(inc.phase),
        escapeCsv(inc.domain),
        escapeCsv(inc.incident_description),
        escapeCsv(inc.why_important),
        escapeCsv(inc.constraint_type.join('; ')),
        escapeCsv(inc.ai_help),
        escapeCsv(inc.human_final_call),
        escapeCsv(r.created_at),
      ].join(','));
    }
  }

  const date = new Date().toISOString().slice(0, 10);
  triggerDownload(rows.join('\n'), `pcm_incident_responses_${date}.csv`);
}
