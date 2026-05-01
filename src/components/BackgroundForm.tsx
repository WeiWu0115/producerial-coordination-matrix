import type { BackgroundData } from '../types/study';
import { PROJECT_TYPES, EXPERIENCE_LEVELS } from '../data/coordinationTypes';

interface Props {
  data: BackgroundData;
  onChange: (data: BackgroundData) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function BackgroundForm({ data, onChange, onNext, onBack }: Props) {
  const set = (field: keyof BackgroundData, value: string | string[]) => {
    onChange({ ...data, [field]: value });
  };

  const toggleProjectType = (type: string) => {
    const types = data.project_types.includes(type)
      ? data.project_types.filter((t) => t !== type)
      : [...data.project_types, type];
    set('project_types', types);
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-6">
      <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-1">Step 1</p>
      <h2 className="text-2xl font-semibold text-slate-900 mb-2">About you</h2>
      <p className="text-slate-500 text-sm mb-8">All fields are optional. This helps us interpret your responses.</p>

      <div className="border border-slate-200 rounded-lg p-6 mb-5 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">
              Participant ID (provided by researcher)
            </label>
            <input
              type="text"
              value={data.participant_id}
              onChange={(e) => set('participant_id', e.target.value)}
              placeholder="e.g. P001"
              className="w-full text-sm border border-slate-200 rounded px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-400"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">
              Session ID (if applicable)
            </label>
            <input
              type="text"
              value={data.session_id}
              onChange={(e) => set('session_id', e.target.value)}
              placeholder="e.g. S001"
              className="w-full text-sm border border-slate-200 rounded px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Experience level</label>
          <select
            value={data.experience_level}
            onChange={(e) => set('experience_level', e.target.value)}
            className="w-full text-sm border border-slate-200 rounded px-3 py-2 text-slate-800 focus:outline-none focus:border-slate-400 bg-white"
          >
            <option value="">— select —</option>
            {EXPERIENCE_LEVELS.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">
            Approximate number of projects produced
          </label>
          <input
            type="text"
            value={data.project_count}
            onChange={(e) => set('project_count', e.target.value)}
            placeholder="e.g. 3–5"
            className="w-full text-sm border border-slate-200 rounded px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-400"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 mb-2">
            Types of projects (select all that apply)
          </label>
          <div className="flex flex-wrap gap-2">
            {PROJECT_TYPES.map((t) => {
              const selected = data.project_types.includes(t);
              return (
                <button
                  key={t}
                  onClick={() => toggleProjectType(t)}
                  className={`text-xs px-3 py-1.5 rounded border transition-colors ${
                    selected
                      ? 'bg-slate-800 border-slate-800 text-white'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-400'
                  }`}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">
            Location / region (optional)
          </label>
          <input
            type="text"
            value={data.location}
            onChange={(e) => set('location', e.target.value)}
            placeholder="e.g. Boston, MA"
            className="w-full text-sm border border-slate-200 rounded px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-400"
          />
        </div>
      </div>

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
          Continue to matrix
        </button>
      </div>
    </div>
  );
}
