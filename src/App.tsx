import { useState, useEffect } from 'react';
import type {
  PageName,
  BackgroundData,
  CellMap,
  IncidentCellRef,
  CriticalIncidentResponse,
  ParticipantResponse,
  Phase,
  CoordinationDomain,
} from './types/study';
import { PHASES } from './data/phases';
import { DOMAINS } from './data/domains';
import { saveDraft, loadDraft, saveResponse } from './utils/storage';
import { exportSingleResponseJSON } from './utils/exportJson';
import IntroPage from './components/IntroPage';
import BackgroundForm from './components/BackgroundForm';
import MatrixExercise, { cellKey } from './components/MatrixExercise';
import CriticalIncidentPage from './components/CriticalIncidentPage';
import ReviewPage from './components/ReviewPage';
import AdminExport from './components/AdminExport';

const defaultBackground: BackgroundData = {
  participant_id: '',
  session_id: '',
  experience_level: '',
  project_count: '',
  project_types: [],
  location: '',
};

const PARTICIPANT_PAGES: PageName[] = ['intro', 'background', 'matrix', 'incident', 'review', 'submitted'];

function stepNumber(page: PageName): number {
  return PARTICIPANT_PAGES.indexOf(page) + 1;
}

function ProgressBar({ page }: { page: PageName }) {
  if (page === 'admin' || page === 'intro') return null;
  const total = 4;
  const current = Math.max(0, stepNumber(page) - 2);
  const pct = Math.min(100, (current / total) * 100);
  const labels = ['Background', 'Matrix', 'Critical incident', 'Review'];
  return (
    <div className="fixed top-0 left-0 right-0 bg-white border-b border-slate-200 z-40">
      <div className="h-0.5 bg-slate-100">
        <div
          className="h-0.5 bg-slate-600 transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex max-w-3xl mx-auto px-6">
        {labels.map((label, i) => {
          const done = current > i;
          const active = current === i;
          return (
            <div
              key={label}
              className={`flex-1 py-2 text-center text-[10px] font-medium ${
                done
                  ? 'text-slate-500'
                  : active
                  ? 'text-slate-800'
                  : 'text-slate-300'
              }`}
            >
              {done ? '✓ ' : ''}{label}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState<PageName>(() => {
    return window.location.search.includes('researcher') ? 'admin' : 'intro';
  });

  const draft = loadDraft();
  const [background, setBackground] = useState<BackgroundData>(
    draft?.background ?? defaultBackground,
  );
  const [cells, setCells] = useState<CellMap>(draft?.cells ?? {});
  const [selectedIncidentCells, setSelectedIncidentCells] = useState<IncidentCellRef[]>(
    draft?.selectedIncidentCells ?? [],
  );
  const [incidentForms, setIncidentForms] = useState<Record<string, CriticalIncidentResponse>>(
    draft?.incidentForms ?? {},
  );

  // Auto-save draft on every change
  useEffect(() => {
    saveDraft({ background, cells, selectedIncidentCells, incidentForms });
  }, [background, cells, selectedIncidentCells, incidentForms]);

  const goTo = (p: PageName) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const buildResponse = (): ParticipantResponse => {
    const matrixResponses = PHASES.flatMap((phase) =>
      DOMAINS.map((domain) => cells[cellKey(phase as Phase, domain as CoordinationDomain)]),
    ).filter(Boolean).filter(
      (c) => c!.marked_important || c!.coordination_types.length > 0 || c!.issue_note,
    ) as ParticipantResponse['matrix_responses'];

    const incidentCells = selectedIncidentCells
      .map((ref) => incidentForms[`${ref.phase}|||${ref.domain}`])
      .filter(Boolean) as ParticipantResponse['critical_incident_cells'];

    return {
      participant_id: background.participant_id || null,
      session_id: background.session_id || null,
      experience_level: background.experience_level || null,
      project_count: background.project_count || null,
      project_types: background.project_types,
      location: background.location || null,
      created_at: new Date().toISOString(),
      matrix_responses: matrixResponses,
      critical_incident_cells: incidentCells,
    };
  };

  const handleSubmit = () => {
    const response = buildResponse();
    saveResponse(response);
    goTo('submitted');
  };

  const handleDownloadJSON = () => {
    exportSingleResponseJSON(buildResponse());
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <ProgressBar page={page} />

      <div className={page !== 'intro' && page !== 'admin' ? 'pt-10' : ''}>
        {page === 'intro' && (
          <IntroPage onStart={() => goTo('background')} onAdmin={() => goTo('admin')} />
        )}

        {page === 'background' && (
          <BackgroundForm
            data={background}
            onChange={setBackground}
            onNext={() => goTo('matrix')}
            onBack={() => goTo('intro')}
          />
        )}

        {page === 'matrix' && (
          <MatrixExercise
            cells={cells}
            onUpdate={setCells}
            onNext={() => goTo('incident')}
            onBack={() => goTo('background')}
          />
        )}

        {page === 'incident' && (
          <CriticalIncidentPage
            cells={cells}
            selectedCells={selectedIncidentCells}
            incidentForms={incidentForms}
            onSelectCells={setSelectedIncidentCells}
            onUpdateForms={setIncidentForms}
            onNext={() => goTo('review')}
            onBack={() => goTo('matrix')}
          />
        )}

        {page === 'review' && (
          <ReviewPage
            background={background}
            cells={cells}
            selectedIncidentCells={selectedIncidentCells}
            incidentForms={incidentForms}
            onSubmit={handleSubmit}
            onBack={() => goTo('incident')}
            onDownloadJSON={handleDownloadJSON}
          />
        )}

        {page === 'submitted' && (
          <div className="max-w-lg mx-auto py-24 px-6 text-center">
            <div className="text-5xl mb-6">✓</div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-3">Thank you.</h2>
            <p className="text-slate-500 text-base mb-8">Your response has been recorded.</p>
            <div className="border border-slate-200 rounded-lg p-5 text-left mb-6 text-sm text-slate-600">
              <p className="mb-2">
                Your data has been saved locally. Please download the JSON file and share it with
                the researcher.
              </p>
              <p>If you have questions about this study, please contact the researcher directly.</p>
            </div>
            <button
              onClick={handleDownloadJSON}
              className="px-6 py-2.5 border border-slate-200 text-sm text-slate-600 rounded-md hover:bg-slate-50 transition-colors"
            >
              Download response JSON
            </button>
          </div>
        )}

        {page === 'admin' && <AdminExport onBack={() => goTo('intro')} />}
      </div>
    </div>
  );
}
