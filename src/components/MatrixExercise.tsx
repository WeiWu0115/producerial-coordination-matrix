import { useState } from 'react';
import type { CellMap, MatrixCellResponse, Phase, CoordinationDomain } from '../types/study';
import { PHASES } from '../data/phases';
import { DOMAINS, DOMAIN_DESCRIPTIONS } from '../data/domains';
import MatrixCell from './MatrixCell';
import CellEditorModal from './CellEditorModal';

interface Props {
  cells: CellMap;
  onUpdate: (cells: CellMap) => void;
  onNext: () => void;
  onBack: () => void;
}

export function cellKey(phase: Phase, domain: CoordinationDomain): string {
  return `${phase}|||${domain}`;
}

function emptyCell(phase: Phase, domain: CoordinationDomain): MatrixCellResponse {
  return {
    phase,
    domain,
    marked_important: false,
    coordination_types: [],
    issue_note: '',
    producer_decision_note: '',
    success_criterion_note: '',
  };
}

export default function MatrixExercise({ cells, onUpdate, onNext, onBack }: Props) {
  const [openCell, setOpenCell] = useState<{ phase: Phase; domain: CoordinationDomain } | null>(null);

  const filledCount = Object.values(cells).filter(
    (c) =>
      c &&
      (c.marked_important || c.coordination_types.length > 0 || c.issue_note),
  ).length;

  const handleSave = (data: MatrixCellResponse) => {
    onUpdate({ ...cells, [cellKey(data.phase, data.domain)]: data });
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-6">
      <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-1">Step 2</p>
      <h2 className="text-2xl font-semibold text-slate-900 mb-2">Coordination matrix</h2>
      <p className="text-slate-500 text-sm mb-6">
        Click any cell to mark what matters and add notes. You can return to any cell at any time.
      </p>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-5 text-xs text-slate-500">
        {[
          { label: 'Hard', cls: 'bg-red-100 text-red-700 border-red-200' },
          { label: 'Flexible', cls: 'bg-blue-100 text-blue-700 border-blue-200' },
          { label: 'Dynamic', cls: 'bg-amber-100 text-amber-700 border-amber-200' },
          { label: 'Human', cls: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
          { label: 'AI', cls: 'bg-green-100 text-green-700 border-green-200' },
          { label: 'Final call', cls: 'bg-purple-100 text-purple-700 border-purple-200' },
        ].map(({ label, cls }) => (
          <span key={label} className={`px-2 py-0.5 rounded border text-[11px] font-medium ${cls}`}>
            {label}
          </span>
        ))}
        <span className="ml-1 text-slate-400">← coordination types</span>
      </div>

      {/* Matrix */}
      <div className="overflow-x-auto border border-slate-200 rounded-lg mb-5">
        <table className="w-full border-collapse min-w-[700px]">
          <thead>
            <tr>
              <th className="text-left text-xs font-semibold text-slate-500 bg-slate-50 px-4 py-3 border-b border-r border-slate-200 min-w-[200px]">
                Coordination domain
              </th>
              {PHASES.map((phase) => (
                <th
                  key={phase}
                  className="text-center text-xs font-semibold text-slate-600 bg-slate-50 px-3 py-3 border-b border-r border-slate-200 last:border-r-0 min-w-[120px]"
                >
                  {phase}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DOMAINS.map((domain, di) => (
              <tr key={domain} className="group">
                <td className="border-b border-r border-slate-200 px-4 py-3 bg-slate-50 align-top">
                  <div className="text-xs font-semibold text-slate-700 mb-0.5">{domain}</div>
                  <div className="text-[10px] text-slate-400 leading-snug">
                    {DOMAIN_DESCRIPTIONS[domain]}
                  </div>
                </td>
                {PHASES.map((phase) => {
                  const key = cellKey(phase, domain);
                  return (
                    <td
                      key={phase}
                      className={`border-b border-r border-slate-200 last:border-r-0 p-0 align-top ${
                        di === DOMAINS.length - 1 ? 'border-b-0' : ''
                      }`}
                    >
                      <MatrixCell
                        data={cells[key]}
                        onClick={() => setOpenCell({ phase, domain })}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-slate-400 mb-8">
        {filledCount === 0
          ? 'No cells filled yet — click any cell to begin.'
          : `${filledCount} cell${filledCount !== 1 ? 's' : ''} filled`}
      </p>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="px-5 py-2.5 text-sm border border-slate-200 rounded-md text-slate-600 hover:bg-slate-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="px-6 py-2.5 bg-slate-800 text-white text-sm font-medium rounded-md hover:bg-slate-700 transition-colors"
        >
          Continue to critical incident
        </button>
      </div>

      {openCell && (
        <CellEditorModal
          phase={openCell.phase}
          domain={openCell.domain}
          initialData={cells[cellKey(openCell.phase, openCell.domain)] ?? emptyCell(openCell.phase, openCell.domain)}
          onSave={handleSave}
          onClose={() => setOpenCell(null)}
        />
      )}
    </div>
  );
}
