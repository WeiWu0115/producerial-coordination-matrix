# CLAUDE.md — Producerial Coordination Matrix

This file gives an AI assistant full context to continue working on this project.

---

## What this project is

A React web app for a research study on film producer coordination. Research participants (film producer students and early-career producers) complete an interactive matrix exercise during or after an interview.

The researcher is studying how producers coordinate creative, human, logistical, legal, and environmental constraints across filmmaking workflows — and how this can inform the design of multi-agent AI systems.

**Key design principle:** Participants only see 6 broad coordination domains. The 18-agent researcher taxonomy (in `src/data/agentTaxonomy.ts`) is for researcher-side coding after data collection — never expose it to participants.

---

## Tech stack

- **React 18 + Vite 4 + TypeScript**
- **Tailwind CSS v3** — academic/minimal style, white background, slate accents, no gradients
- **Supabase** — database backend for storing submitted responses
- **Vercel** — hosting

---

## Live URLs

| URL | Who uses it |
|---|---|
| `https://producerial-coordination-matrix.vercel.app` | Research participants |
| `https://producerial-coordination-matrix.vercel.app?researcher` | Researcher only — shows all submissions, charts, export |

---

## Infrastructure

| Service | Detail |
|---|---|
| GitHub | `https://github.com/WeiWu0115/producerial-coordination-matrix` |
| Vercel project | `weiwu0115s-projects / producerial-coordination-matrix` |
| Supabase project | `pcm-research` — `https://fpwblxfehfrdhsmaffqp.supabase.co` |
| Supabase table | `responses` — columns: `id`, `submitted_at`, `response_data` (jsonb) |

### Supabase table schema

```sql
create table responses (
  id uuid default gen_random_uuid() primary key,
  submitted_at timestamp with time zone default timezone('utc', now()) not null,
  response_data jsonb not null
);
alter table responses enable row level security;
create policy "allow inserts" on responses for insert with check (true);
create policy "allow reads" on responses for select using (true);
```

### Environment variables

Stored in `.env.local` (gitignored) and in Vercel project settings:

```
VITE_SUPABASE_URL=https://fpwblxfehfrdhsmaffqp.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_IL79nyPzVCqIb5AGeqswDw_H8T3Yva_
```

---

## Run locally

```bash
cd "/Users/wu.w4/Desktop/film interview"
npm run dev
# → http://localhost:5173
# → http://localhost:5173?researcher  (researcher view)
```

## Deploy

```bash
npm run build        # verify build passes first
git add -A
git commit -m "description"
git push
vercel --prod        # redeploy to production
```

---

## File structure

```
src/
├── types/study.ts              # All TypeScript types
├── data/
│   ├── phases.ts               # 5 production phases
│   ├── domains.ts              # 6 coordination domains + descriptions
│   ├── coordinationTypes.ts    # 6 constraint types with colors
│   └── agentTaxonomy.ts        # 18-agent researcher taxonomy (NOT shown to participants)
├── lib/
│   └── supabase.ts             # Supabase client (reads env vars)
├── utils/
│   ├── storage.ts              # localStorage draft + Supabase read/write
│   ├── exportJson.ts           # JSON download helpers
│   └── exportCsv.ts            # CSV export (matrix + incidents, separate files)
├── components/
│   ├── IntroPage.tsx           # Page 1 — intro + "Researcher view" link
│   ├── BackgroundForm.tsx      # Page 2 — optional participant background
│   ├── MatrixExercise.tsx      # Page 3 — 6×5 interactive matrix table
│   ├── MatrixCell.tsx          # Single cell with status indicators
│   ├── CellEditorModal.tsx     # Modal: importance checkbox, type chips, 3 text fields
│   ├── CriticalIncidentPage.tsx # Page 4 — select 3 cells + incident forms
│   ├── ReviewPage.tsx          # Page 5 — summary table + submit/download
│   └── AdminExport.tsx         # Researcher view — loads from Supabase, charts, exports
├── App.tsx                     # State management, page routing, submit handler
├── main.tsx                    # Entry point
├── vite-env.d.ts               # ImportMeta env type declarations
└── styles/index.css            # Tailwind imports + minimal global styles
```

---

## Data flow

1. **Participant fills matrix** → state stored in React + auto-saved to `localStorage` as draft
2. **Participant submits** → saved to `localStorage` (backup) AND to Supabase `responses` table
3. **Researcher opens `?researcher`** → `AdminExport` fetches all rows from Supabase, displays summaries and export buttons

### Response JSON shape

```json
{
  "participant_id": "P001",
  "session_id": "S001",
  "experience_level": "Student producer",
  "project_types": ["short film"],
  "created_at": "2026-05-01T...",
  "matrix_responses": [
    {
      "phase": "Shooting",
      "domain": "People & Human Friction",
      "marked_important": true,
      "coordination_types": ["Human friction", "Dynamic / changes in real time"],
      "issue_note": "Actor arrived late",
      "producer_decision_note": "Resequenced the shot list",
      "success_criterion_note": "Shoot completed without losing key scene"
    }
  ],
  "critical_incident_cells": [
    {
      "phase": "Shooting",
      "domain": "People & Human Friction",
      "incident_description": "...",
      "why_important": "...",
      "constraint_type": ["Human friction"],
      "ai_help": "...",
      "human_final_call": "..."
    }
  ]
}
```

---

## Key decisions already made

- **No router library** — simple `page` state variable in `App.tsx`, conditional rendering
- **Tailwind only** — no component library, no shadcn, no charts library (bar charts are plain CSS divs)
- **Supabase publishable key in frontend** — safe because RLS is enabled; anon key only allows insert + select
- **localStorage as backup** — if Supabase fails on submit, response is still saved locally and participant can download JSON
- **No delete in researcher view** — intentional, to protect research data from accidental deletion
- **18-agent taxonomy hidden from participants** — stored in `agentTaxonomy.ts`, used only for researcher-side mapping after data collection

---

## Participant flow

```
Intro → Background (optional) → Matrix (6×5) → Critical Incident (top 3) → Review → Submit
```

## Researcher flow

```
Open ?researcher → see all Supabase submissions → charts by phase/domain/type → export JSON or CSV
```

---

## Potential next steps (not yet built)

- Password protection for researcher view (currently just a URL param)
- Supabase auth for researcher login
- More detailed review: show decision notes + success criteria in admin table
- Agent taxonomy mapping UI for researcher to code responses
- Email notification when new response arrives
