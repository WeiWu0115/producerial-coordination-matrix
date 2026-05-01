import type { MatrixCellResponse } from '../types/study';
import { COORDINATION_TYPES } from '../data/coordinationTypes';

interface Props {
  data: MatrixCellResponse | undefined;
  onClick: () => void;
}

export default function MatrixCell({ data, onClick }: Props) {
  if (!data) {
    return (
      <button
        onClick={onClick}
        className="w-full min-h-[56px] p-2 text-left hover:bg-slate-50 transition-colors group"
        title="Click to add response"
      >
        <span className="text-slate-300 text-xs group-hover:text-slate-400">+</span>
      </button>
    );
  }

  const hasAnyData =
    data.marked_important ||
    data.coordination_types.length > 0 ||
    data.issue_note ||
    data.producer_decision_note ||
    data.success_criterion_note;

  if (!hasAnyData) {
    return (
      <button
        onClick={onClick}
        className="w-full min-h-[56px] p-2 text-left hover:bg-slate-50 transition-colors group"
        title="Click to add response"
      >
        <span className="text-slate-300 text-xs group-hover:text-slate-400">+</span>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className="w-full min-h-[56px] p-2 text-left hover:bg-slate-50 transition-colors bg-slate-50/60"
      title="Click to edit"
    >
      <div className="flex flex-col gap-1">
        {data.marked_important && (
          <span className="text-xs font-semibold text-slate-600">✓ Important</span>
        )}
        {data.coordination_types.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {data.coordination_types.map((type) => {
              const info = COORDINATION_TYPES.find((t) => t.type === type);
              return (
                <span
                  key={type}
                  className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${info?.colorClass ?? ''}`}
                >
                  {info?.shortLabel ?? type}
                </span>
              );
            })}
          </div>
        )}
        {data.issue_note && (
          <p className="text-[10px] text-slate-500 leading-tight line-clamp-2">{data.issue_note}</p>
        )}
      </div>
    </button>
  );
}
