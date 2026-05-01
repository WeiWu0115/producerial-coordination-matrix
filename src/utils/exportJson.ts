import type { ParticipantResponse } from '../types/study';

function triggerDownload(content: string, filename: string, type: string): void {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportSingleResponseJSON(response: ParticipantResponse): void {
  const pid = response.participant_id || 'unknown';
  const date = response.created_at.slice(0, 10);
  const filename = `pcm_response_${pid}_${date}.json`;
  triggerDownload(JSON.stringify(response, null, 2), filename, 'application/json');
}

export function exportAllResponsesJSON(responses: ParticipantResponse[]): void {
  const date = new Date().toISOString().slice(0, 10);
  const filename = `pcm_all_responses_${date}.json`;
  triggerDownload(JSON.stringify(responses, null, 2), filename, 'application/json');
}
