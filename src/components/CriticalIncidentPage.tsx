import { useState } from 'react';
import type {
  CellMap,
  IncidentCellRef,
  CriticalIncidentResponse,
  Phase,
  CoordinationDomain,
  CoordinationType,
} from '../types/study';
import { PHASES } from '../data/phases';
import { DOMAINS } from '../data/domains';
import { COORDINATION_TYPES } from '../data/coordinationTypes';
import { cellKey } from './MatrixExercise';

interface Props {
  cells: CellMap;
  selectedCells: IncidentCellRef[];
  incidentForms: Record<string, CriticalIncidentResponse>;
  onSelectCells: (cells: IncidentCellRef[]) => void;
  onUpdateForms: (forms: Record<string, CriticalIncidentResponse>) => void;
  onNext: () => void;
  onBack: () => void;
}

function incidentKey(phase: Phase, domain: CoordinationDomain) {
  return `${phase}|||${domain}`;
}

function emptyIncident(phase: Phase, domain: CoordinationDomain): CriticalIncidentResponse {
  return {
    phase,
    domain,
    incident_description: '',
    why_important: '',
    constraint_type: [],
    ai_help: '',
    human_final_call: '',
  };
}

export default function CriticalIncidentPage({
  cells,
  selectedCells,
  incidentForms,
  onSelectCells,
  onUpdateForms,
  onNext,
  onBack,
}: Props) {
  const [localForms, setLocalForms] = useState<Record<string, CriticalIncidentResponse>>(incidentForms);

  const isSelected = (phase: Phase, domain: CoordinationDomain) =>
    selectedCells.some((c) => c.phase === phase && c.domain === domain);

  const toggleCell = (phase: Phase, domain: CoordinationDomain) => {
    if (isSelected(phase, domain)) {
      onSelectCells(selectedCells.filter((c) => !(c.phase === phase && c.domain === domain)));
    } else {
      if (selectedCells.length >= 3) return;
      onSelectCells([...selectedCells, { phase, domain }]);
      if (!localForms[incidentKey(phase, domain)]) {
        const updated = { ...localForms, [incidentKey(phase, domain)]: emptyIncident(phase, domain) };
        setLocalForms(updated);
        onUpdateForms(updated);
      }
    }
  };

  const updateForm = (key: string, updates: Partial<CriticalIncidentResponse>) => {
    const updated = { ...localForms, [key]: { ...localForms[key], ...updates } };
    setLocalForms(updated);
    onUpdateForms(updated);
  };

  const toggleConstraintType = (key: string, type: CoordinationType) => {
    const form = localForms[key];
    const has = form.constraint_type.includes(type);
    updateForm(key, {
      constraint_type: has
        ? form.constraint_type.filter((t) => t !== type)
        : [...form.constraint_type, type],
    });
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-6">
      <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-1">Step 3</p>
      <h2 className="text-2xl font-semibold text-slate-900 mb-2">Critical incident reflection</h2>
      <p className="text-slate-500 text-sm mb-6">
        Thinking about a real production situation you experienced, select the{' '}
        <strong className="text-slate-700">three cells</strong> that best explain what mattered most.
      </p>

      {/* Cell selector */}
      <div className="border border-slate-200 rounded-lg p-5 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-semibold text-slate-700">Select up to 3 cells</h3>
          <span className="text-xs text-slate-400">{selectedCells.length} / 3 selected</span>
        </div>

        {DOMAINS.map((domain) => (
          <div key={domain} className="mb-5 last:mb-0">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              {domain}
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {PHASES.map((phase) => {
                const hasCellData = !!cells[cellKey(phase, domain)]?.marked_important ||
                  (cells[cellKey(phase, domain)]?.coordination_types?.length ?? 0) > 0 ||
                  !!cells[cellKey(phase, domain)]?.issue_note;
                const selected = isSelected(phase, domain);
                const disabled = !selected && selectedCells.length >= 3;

                return (
                  <button
                    key={phase}
                    onClick={() => toggleCell(phase, domain)}
                    disabled={disabled}
                    className={`text-[11px] px-2 py-2 rounded border transition-colors text-center leading-tight ${
                      selected
                        ? 'bg-slate-800 border-slate-800 text-white'
                        : disabled
                        ? 'border-slate-100 text-slate-300 cursor-not-allowed'
                        : hasCellData
                        ? 'border-slate-400 text-slate-700 bg-slate-50 hover:border-slate-600'
                        : 'border-slate-200 text-slate-500 hover:border-slate-400 hover:text-slate-700'
                    }`}
                  >
                    {phase}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Incident forms */}
      {selectedCells.length === 0 && (
        <p className="text-sm text-slate-400 mb-8">Select cells above to add incident reflections.</p>
      )}

      {selectedCells.map((ref, i) => {
        const key = incidentKey(ref.phase, ref.domain);
        const form = localForms[key] ?? emptyIncident(ref.phase, ref.domain);

        return (
          <div key={key} className="border border-slate-200 rounded-lg p-6 mb-5">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-xs text-slate-400">{ref.phase}</div>
                <div className="text-sm font-semibold text-slate-800">{ref.domain}</div>
              </div>
              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                Incident {i + 1}
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  What happened?
                </label>
                <textarea
                  value={form.incident_description}
                  onChange={(e) => updateForm(key, { incident_description: e.target.value })}
                  placeholder="Describe the situation briefly…"
                  rows={2}
                  className="w-full text-sm border border-slate-200 rounded px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-400 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  Why was this important?
                </label>
                <textarea
                  value={form.why_important}
                  onChange={(e) => updateForm(key, { why_important: e.target.value })}
                  placeholder="What was at stake?"
                  rows={2}
                  className="w-full text-sm border border-slate-200 rounded px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-400 resize-none"
                />
              </div>

              <div>
                <div className="text-xs font-medium text-slate-500 mb-2">
                  Constraint type (select all that apply)
                </div>
                <div className="flex flex-wrap gap-2">
                  {COORDINATION_TYPES.map(({ type, shortLabel, colorClass }) => {
                    const active = form.constraint_type.includes(type);
                    return (
                      <button
                        key={type}
                        onClick={() => toggleConstraintType(key, type)}
                        className={`text-xs px-2.5 py-1 rounded border transition-colors ${
                          active ? colorClass : 'border-slate-200 text-slate-500 hover:border-slate-400'
                        }`}
                      >
                        {shortLabel}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  Could AI have helped? How?
                </label>
                <textarea
                  value={form.ai_help}
                  onChange={(e) => updateForm(key, { ai_help: e.target.value })}
                  placeholder="Optional — describe any way AI assistance could have supported the producer…"
                  rows={2}
                  className="w-full text-sm border border-slate-200 rounded px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-400 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  What did the human producer still need to decide?
                </label>
                <textarea
                  value={form.human_final_call}
                  onChange={(e) => updateForm(key, { human_final_call: e.target.value })}
                  placeholder="What required the producer's judgment, regardless of tools available?"
                  rows={2}
                  className="w-full text-sm border border-slate-200 rounded px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-400 resize-none"
                />
              </div>
            </div>
          </div>
        );
      })}

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="px-5 py-2.5 text-sm border border-slate-200 rounded-md text-slate-600 hover:bg-slate-50 transition-colors"
        >
          Back to matrix
        </button>
        <button
          onClick={() => { onUpdateForms(localForms); onNext(); }}
          className="px-6 py-2.5 bg-slate-800 text-white text-sm font-medium rounded-md hover:bg-slate-700 transition-colors"
        >
          Continue to review
        </button>
      </div>
    </div>
  );
}
