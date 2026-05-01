import { useState } from 'react';
import type { ParticipantResponse } from '../types/study';
import { PHASES } from '../data/phases';
import { DOMAINS } from '../data/domains';
import { COORDINATION_TYPES } from '../data/coordinationTypes';
import { loadAllResponses, deleteResponse } from '../utils/storage';
import { exportSingleResponseJSON, exportAllResponsesJSON } from '../utils/exportJson';
import { exportMatrixResponsesCSV, exportIncidentResponsesCSV } from '../utils/exportCsv';

interface Props {
  onBack: () => void;
}

function BarChart({ label, count, max }: { label: string; count: number; max: number }) {
  const pct = max === 0 ? 0 : Math.round((count / max) * 100);
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-slate-600 w-48 flex-shrink-0 leading-tight">{label}</span>
      <div className="flex-1 bg-slate-100 rounded h-3">
        <div
          className="bg-slate-400 h-3 rounded transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-slate-400 w-6 text-right">{count}</span>
    </div>
  );
}

export default function AdminExport({ onBack }: Props) {
  const [responses, setResponses] = useState<ParticipantResponse[]>(loadAllResponses);
  const [expanded, setExpanded] = useState<number | null>(null);

  const reload = () => setResponses(loadAllResponses());

  const handleDelete = (i: number) => {
    if (!window.confirm('Delete this response permanently?')) return;
    deleteResponse(i);
    reload();
    if (expanded === i) setExpanded(null);
  };

  // Summary stats
  const allCells = responses.flatMap((r) => r.matrix_responses);
  const allIncidents = responses.flatMap((r) => r.critical_incident_cells);

  const cellsByPhase = PHASES.map((phase) => ({
    label: phase,
    count: allCells.filter((c) => c.phase === phase).length,
  }));
  const cellsByDomain = DOMAINS.map((domain) => ({
    label: domain,
    count: allCells.filter((c) => c.domain === domain).length,
  }));
  const typeCount = COORDINATION_TYPES.map(({ type, shortLabel }) => ({
    label: shortLabel,
    count: allCells.filter((c) => c.coordination_types.includes(type)).length,
  }));

  const maxPhase = Math.max(...cellsByPhase.map((x) => x.count), 1);
  const maxDomain = Math.max(...cellsByDomain.map((x) => x.count), 1);
  const maxType = Math.max(...typeCount.map((x) => x.count), 1);

  return (
    <div className="max-w-4xl mx-auto py-10 px-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-1">
            Researcher view
          </p>
          <h2 className="text-2xl font-semibold text-slate-900">Data export &amp; summary</h2>
        </div>
        <button
          onClick={onBack}
          className="text-sm text-slate-500 hover:text-slate-700 border border-slate-200 px-4 py-2 rounded transition-colors"
        >
          ← Participant view
        </button>
      </div>

      {/* Counts */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Responses', value: responses.length },
          { label: 'Matrix cells filled', value: allCells.length },
          { label: 'Incident reflections', value: allIncidents.length },
        ].map(({ label, value }) => (
          <div key={label} className="border border-slate-200 rounded-lg p-4 text-center">
            <div className="text-3xl font-semibold text-slate-800 mb-1">{value}</div>
            <div className="text-xs text-slate-400">{label}</div>
          </div>
        ))}
      </div>

      {responses.length > 0 && (
        <>
          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
            <div className="border border-slate-200 rounded-lg p-5">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-3">
                Cells by phase
              </h3>
              <div className="space-y-2">
                {cellsByPhase.map((x) => (
                  <BarChart key={x.label} label={x.label} count={x.count} max={maxPhase} />
                ))}
              </div>
            </div>
            <div className="border border-slate-200 rounded-lg p-5">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-3">
                Cells by domain
              </h3>
              <div className="space-y-2">
                {cellsByDomain.map((x) => (
                  <BarChart key={x.label} label={x.label} count={x.count} max={maxDomain} />
                ))}
              </div>
            </div>
          </div>

          <div className="border border-slate-200 rounded-lg p-5 mb-8">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-3">
              Coordination type frequency (across all cells)
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {typeCount.map((x) => (
                <BarChart key={x.label} label={x.label} count={x.count} max={maxType} />
              ))}
            </div>
          </div>

          {/* Export buttons */}
          <div className="border border-slate-200 rounded-lg p-5 mb-8">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-4">
              Export all data
            </h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => exportAllResponsesJSON(responses)}
                className="px-4 py-2 text-sm border border-slate-200 rounded text-slate-600 hover:bg-slate-50 transition-colors"
              >
                All responses — JSON
              </button>
              <button
                onClick={() => exportMatrixResponsesCSV(responses)}
                className="px-4 py-2 text-sm border border-slate-200 rounded text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Matrix responses — CSV
              </button>
              <button
                onClick={() => exportIncidentResponsesCSV(responses)}
                className="px-4 py-2 text-sm border border-slate-200 rounded text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Incident responses — CSV
              </button>
            </div>
          </div>

          {/* Individual responses */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <div className="bg-slate-50 px-5 py-3 border-b border-slate-200">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Individual responses
              </h3>
            </div>
            {responses.map((r, i) => (
              <div key={i} className="border-b border-slate-100 last:border-b-0">
                <div className="flex items-center justify-between px-5 py-3">
                  <div className="text-sm text-slate-700">
                    <span className="font-medium">{r.participant_id || `Response ${i + 1}`}</span>
                    {r.experience_level && (
                      <span className="text-slate-400 ml-2 text-xs">{r.experience_level}</span>
                    )}
                    <span className="text-slate-400 ml-2 text-xs">
                      {r.matrix_responses.length} cells · {r.created_at.slice(0, 10)}
                    </span>
                  </div>
                  <div className="flex gap-2 items-center">
                    <button
                      onClick={() => setExpanded(expanded === i ? null : i)}
                      className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {expanded === i ? 'Collapse' : 'Expand'}
                    </button>
                    <button
                      onClick={() => exportSingleResponseJSON(r)}
                      className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      JSON
                    </button>
                    <button
                      onClick={() => handleDelete(i)}
                      className="text-xs text-red-300 hover:text-red-500 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {expanded === i && (
                  <div className="px-5 pb-4 bg-slate-50/60">
                    <div className="text-xs text-slate-500 space-y-1 mb-3">
                      <div>Experience: {r.experience_level || '—'}</div>
                      <div>Projects: {r.project_count || '—'}</div>
                      <div>Types: {(r.project_types || []).join(', ') || '—'}</div>
                      <div>Location: {r.location || '—'}</div>
                    </div>
                    {r.matrix_responses.length > 0 && (
                      <div className="overflow-x-auto">
                        <table className="text-[11px] border-collapse w-full min-w-[500px]">
                          <thead>
                            <tr className="bg-slate-100">
                              {['Phase', 'Domain', 'Types', 'Note'].map((h) => (
                                <th key={h} className="text-left text-slate-500 font-semibold px-2 py-1.5 border border-slate-200">
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {r.matrix_responses.map((cell, ci) => (
                              <tr key={ci}>
                                <td className="px-2 py-1.5 border border-slate-200 text-slate-600 whitespace-nowrap">{cell.phase}</td>
                                <td className="px-2 py-1.5 border border-slate-200 text-slate-600">{cell.domain}</td>
                                <td className="px-2 py-1.5 border border-slate-200 text-slate-600">
                                  {cell.coordination_types.map((t) => {
                                    const info = COORDINATION_TYPES.find((ct) => ct.type === t);
                                    return info?.shortLabel ?? t;
                                  }).join(', ') || '—'}
                                </td>
                                <td className="px-2 py-1.5 border border-slate-200 text-slate-600">{cell.issue_note || '—'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {responses.length === 0 && (
        <div className="border border-slate-200 rounded-lg p-10 text-center">
          <p className="text-slate-400 text-sm">No responses submitted yet.</p>
          <p className="text-slate-400 text-xs mt-1">
            Responses will appear here after participants submit the exercise.
          </p>
        </div>
      )}
    </div>
  );
}
