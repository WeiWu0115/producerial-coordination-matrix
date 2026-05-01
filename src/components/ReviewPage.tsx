import type {
  BackgroundData,
  CellMap,
  IncidentCellRef,
  CriticalIncidentResponse,
  Phase,
  CoordinationDomain,
} from '../types/study';
import { PHASES } from '../data/phases';
import { DOMAINS } from '../data/domains';
import { COORDINATION_TYPES } from '../data/coordinationTypes';
import { cellKey } from './MatrixExercise';

interface Props {
  background: BackgroundData;
  cells: CellMap;
  selectedIncidentCells: IncidentCellRef[];
  incidentForms: Record<string, CriticalIncidentResponse>;
  onSubmit: () => void;
  onBack: () => void;
  onDownloadJSON: () => void;
}

function incidentKey(phase: Phase, domain: CoordinationDomain) {
  return `${phase}|||${domain}`;
}

export default function ReviewPage({
  background,
  cells,
  selectedIncidentCells,
  incidentForms,
  onSubmit,
  onBack,
  onDownloadJSON,
}: Props) {
  const filledCells = PHASES.flatMap((phase) =>
    DOMAINS.map((domain) => ({ phase, domain, data: cells[cellKey(phase, domain)] })),
  ).filter(
    ({ data }) =>
      data &&
      (data.marked_important || data.coordination_types.length > 0 || data.issue_note),
  );

  return (
    <div className="max-w-3xl mx-auto py-10 px-6">
      <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-1">Step 4</p>
      <h2 className="text-2xl font-semibold text-slate-900 mb-2">Review your responses</h2>
      <p className="text-slate-500 text-sm mb-8">
        Check your answers before submitting. You can go back to edit any section.
      </p>

      {/* Background */}
      <div className="border border-slate-200 rounded-lg p-5 mb-5">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">Participant background</h3>
        <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm">
          {[
            ['Participant ID', background.participant_id],
            ['Session ID', background.session_id],
            ['Experience level', background.experience_level],
            ['Projects', background.project_count],
            ['Project types', (background.project_types || []).join(', ')],
            ['Location', background.location],
          ].map(([label, value]) => (
            <div key={label} className="flex gap-2">
              <span className="text-slate-400 min-w-[100px]">{label}:</span>
              <span className="text-slate-700">{value || '—'}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Matrix responses */}
      <div className="border border-slate-200 rounded-lg p-5 mb-5">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">
          Matrix responses{' '}
          <span className="text-slate-400 font-normal">({filledCells.length} cells filled)</span>
        </h3>
        {filledCells.length === 0 ? (
          <p className="text-sm text-slate-400 italic">No cells were marked.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse min-w-[580px]">
              <thead>
                <tr className="bg-slate-50">
                  {['Phase', 'Domain', 'Types', 'Issue note'].map((h) => (
                    <th
                      key={h}
                      className="text-left text-slate-500 font-semibold px-3 py-2 border border-slate-200"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filledCells.map(({ phase, domain, data }) => (
                  <tr key={`${phase}|||${domain}`}>
                    <td className="px-3 py-2 border border-slate-200 text-slate-600 align-top whitespace-nowrap">
                      {phase}
                    </td>
                    <td className="px-3 py-2 border border-slate-200 text-slate-600 align-top">
                      {domain}
                    </td>
                    <td className="px-3 py-2 border border-slate-200 align-top">
                      <div className="flex flex-wrap gap-1">
                        {data!.coordination_types.length === 0 ? (
                          <span className="text-slate-300">—</span>
                        ) : (
                          data!.coordination_types.map((t) => {
                            const info = COORDINATION_TYPES.find((ct) => ct.type === t);
                            return (
                              <span
                                key={t}
                                className={`px-1.5 py-0.5 rounded border ${info?.colorClass ?? ''}`}
                              >
                                {info?.shortLabel ?? t}
                              </span>
                            );
                          })
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-2 border border-slate-200 text-slate-600 align-top">
                      {data!.issue_note || <span className="text-slate-300">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Critical incidents */}
      <div className="border border-slate-200 rounded-lg p-5 mb-8">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">Critical incidents</h3>
        {selectedIncidentCells.length === 0 ? (
          <p className="text-sm text-slate-400 italic">No incidents recorded.</p>
        ) : (
          selectedIncidentCells.map((ref, i) => {
            const key = incidentKey(ref.phase, ref.domain);
            const form = incidentForms[key];
            return (
              <div
                key={key}
                className={`pb-4 mb-4 ${i < selectedIncidentCells.length - 1 ? 'border-b border-slate-100' : ''}`}
              >
                <div className="flex gap-3 items-baseline mb-2">
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                    {i + 1}
                  </span>
                  <span className="text-xs font-semibold text-slate-600">
                    {ref.phase} — {ref.domain}
                  </span>
                </div>
                {form && (
                  <div className="text-xs text-slate-500 space-y-1 pl-8">
                    {form.incident_description && (
                      <div><span className="text-slate-400">What happened: </span>{form.incident_description}</div>
                    )}
                    {form.why_important && (
                      <div><span className="text-slate-400">Why important: </span>{form.why_important}</div>
                    )}
                    {form.constraint_type.length > 0 && (
                      <div>
                        <span className="text-slate-400">Types: </span>
                        {form.constraint_type.map((t) => {
                          const info = COORDINATION_TYPES.find((ct) => ct.type === t);
                          return info?.shortLabel ?? t;
                        }).join(', ')}
                      </div>
                    )}
                    {form.ai_help && (
                      <div><span className="text-slate-400">AI could help: </span>{form.ai_help}</div>
                    )}
                    {form.human_final_call && (
                      <div><span className="text-slate-400">Human final call: </span>{form.human_final_call}</div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <div className="flex gap-3 flex-wrap">
        <button
          onClick={onBack}
          className="px-5 py-2.5 text-sm border border-slate-200 rounded-md text-slate-600 hover:bg-slate-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={onDownloadJSON}
          className="px-5 py-2.5 text-sm border border-slate-200 rounded-md text-slate-600 hover:bg-slate-50 transition-colors"
        >
          Download JSON
        </button>
        <button
          onClick={onSubmit}
          className="px-6 py-2.5 bg-slate-800 text-white text-sm font-medium rounded-md hover:bg-slate-700 transition-colors"
        >
          Submit response
        </button>
      </div>
    </div>
  );
}
