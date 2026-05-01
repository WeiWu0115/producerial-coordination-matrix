interface Props {
  onStart: () => void;
  onAdmin: () => void;
}

export default function IntroPage({ onStart, onAdmin }: Props) {
  return (
    <div className="max-w-2xl mx-auto py-16 px-6">
      <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-3">
        Research Exercise
      </p>
      <h1 className="text-3xl font-semibold text-slate-900 mb-3 leading-snug">
        Producerial Coordination Matrix
      </h1>
      <p className="text-slate-500 text-lg mb-10">
        How do film producers coordinate creative, human, logistical, and compliance constraints
        across the production lifecycle?
      </p>

      <div className="border border-slate-200 rounded-lg p-6 mb-5">
        <h2 className="text-base font-semibold text-slate-800 mb-2">About this exercise</h2>
        <p className="text-slate-600 text-sm leading-relaxed mb-3">
          This exercise asks how producers think across different stages of filmmaking. There are no
          right or wrong answers. We are interested in what matters from your experience.
        </p>
        <p className="text-slate-600 text-sm leading-relaxed">
          You will work through a matrix of coordination domains and production phases, marking what
          is relevant and adding short notes. At the end, you will reflect on a real production
          situation. The exercise takes approximately{' '}
          <strong className="text-slate-700">15–25 minutes</strong>.
        </p>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-8 text-sm text-slate-600">
        <strong className="text-slate-700">Please note:</strong> Do not include confidential names
        of people, companies, or productions. You may describe situations generally (e.g.,{' '}
        <em>"a short film shoot," "a student production"</em>).
      </div>

      <div className="grid grid-cols-2 gap-3 mb-10">
        {[
          { step: '1', title: 'Background', desc: 'Brief optional info about your experience' },
          { step: '2', title: 'Matrix exercise', desc: 'Mark what matters across 6 domains × 5 phases' },
          { step: '3', title: 'Critical incident', desc: 'Reflect on the 3 most important cells' },
          { step: '4', title: 'Review & submit', desc: 'Check your responses and export' },
        ].map(({ step, title, desc }) => (
          <div key={step} className="border border-slate-200 rounded-lg p-4">
            <div className="text-xs font-semibold text-slate-400 mb-1">Step {step}</div>
            <div className="text-sm font-semibold text-slate-700 mb-0.5">{title}</div>
            <div className="text-xs text-slate-500">{desc}</div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={onStart}
          className="px-6 py-2.5 bg-slate-800 text-white text-sm font-medium rounded-md hover:bg-slate-700 transition-colors"
        >
          Start exercise
        </button>
        <button
          onClick={onAdmin}
          className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
        >
          Researcher view
        </button>
      </div>
    </div>
  );
}
