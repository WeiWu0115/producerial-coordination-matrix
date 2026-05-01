// Researcher-side multi-agent function taxonomy.
// This data is NOT shown to participants — it is used for researcher coding after data collection.

import type { CoordinationDomain } from '../types/study';

export interface AgentFunction {
  id: number;
  name: string;
  description: string;
  examples: string[];
}

export const AGENT_TAXONOMY: AgentFunction[] = [
  {
    id: 1,
    name: 'Creative Intent Agent',
    description: 'Tracks and protects the project\'s creative core.',
    examples: ['theme', 'emotional core', 'story beat', 'director\'s intention', 'visual tone', 'character motivation'],
  },
  {
    id: 2,
    name: 'Script Breakdown Agent',
    description: 'Translates the script into production elements.',
    examples: ['cast', 'props', 'costumes', 'locations', 'stunts', 'VFX', 'vehicles', 'animals', 'sensitive scenes'],
  },
  {
    id: 3,
    name: 'Feasibility & Scope Agent',
    description: 'Assesses whether an idea is producible given resources.',
    examples: ['project scope', 'resource gap', 'crew capacity', 'low-budget alternatives', 'simplification options'],
  },
  {
    id: 4,
    name: 'Budget Agent',
    description: 'Tracks cost and budget implications.',
    examples: ['location fees', 'equipment rental', 'transportation', 'parking', 'food', 'insurance', 'overtime'],
  },
  {
    id: 5,
    name: 'Schedule Agent',
    description: 'Tracks time, sequencing, and availability.',
    examples: ['actor availability', 'crew availability', 'call time', 'wrap time', 'deadlines', 'backup shooting day'],
  },
  {
    id: 6,
    name: 'Location Intelligence Agent',
    description: 'Assesses location suitability and site logistics.',
    examples: ['parking', 'bathrooms', 'power supply', 'travel time', 'holding area', 'load-in and load-out'],
  },
  {
    id: 7,
    name: 'Permit & Compliance Agent',
    description: 'Identifies legal, institutional, and safety red lines.',
    examples: ['film permits', 'road closures', 'drone rules', 'noise limits', 'insurance', 'release forms'],
  },
  {
    id: 8,
    name: 'Risk & Safety Agent',
    description: 'Identifies safety risks and production hazards.',
    examples: ['stunt risk', 'crowd risk', 'weather risk', 'actor safety', 'crew fatigue', 'emergency plan'],
  },
  {
    id: 9,
    name: 'Transportation & Mobility Agent',
    description: 'Coordinates movement of people and equipment.',
    examples: ['traffic', 'parking restrictions', 'equipment transport', 'load-in timing', 'late arrival risk'],
  },
  {
    id: 10,
    name: 'Weather & Environment Agent',
    description: 'Tracks real-time environmental conditions.',
    examples: ['rain', 'wind', 'heat', 'daylight', 'sunset', 'construction noise', 'crowd density'],
  },
  {
    id: 11,
    name: 'Human Friction Agent',
    description: 'Identifies and supports human coordination issues.',
    examples: ['conflict', 'fatigue', 'morale', 'role confusion', 'trust issue', 'actor discomfort', 'miscommunication'],
  },
  {
    id: 12,
    name: 'Communication & Context Agent',
    description: 'Maintains shared project context.',
    examples: ['call sheet', 'contact list', 'script version', 'decision log', 'change log', 'task ownership'],
  },
  {
    id: 13,
    name: 'Resource & Procurement Agent',
    description: 'Coordinates physical and material resources.',
    examples: ['equipment', 'props', 'costume', 'food', 'water', 'batteries', 'emergency purchases'],
  },
  {
    id: 14,
    name: 'Continuity Agent',
    description: 'Tracks narrative, visual, technical, and editorial continuity.',
    examples: ['shot continuity', 'costume continuity', 'lighting continuity', 'missing coverage', 'reshoot needs'],
  },
  {
    id: 15,
    name: 'Production Plan Reconfiguration Agent',
    description: 'Generates alternative plans when conditions change.',
    examples: ['alternative schedule', 'alternative location', 'backup plan', 'what-if simulation', 'recovery after delay'],
  },
  {
    id: 16,
    name: 'Stakeholder & Authority Agent',
    description: 'Maps decision rights and approval pathways.',
    examples: ['director', 'producer', 'professor', 'client', 'location owner', 'who approves', 'who must be informed'],
  },
  {
    id: 17,
    name: 'Post-production & Delivery Agent',
    description: 'Coordinates editing, versioning, and final delivery.',
    examples: ['rough cut', 'sound mix', 'color', 'export format', 'delivery specs', 'festival submission'],
  },
  {
    id: 18,
    name: 'Audience / Feedback / Legitimacy Agent',
    description: 'Tracks external feedback and reception.',
    examples: ['instructor feedback', 'test screening', 'audience comprehension', 'festival fit', 'representation risk'],
  },
];

export const DOMAIN_TO_AGENTS: Record<CoordinationDomain, number[]> = {
  'Creative Intent & Script Translation': [1, 2, 3],
  'People & Human Friction': [11, 16, 12],
  'Time, Schedule & Availability': [5, 15, 9],
  'Location, Permission & Compliance': [6, 7, 8],
  'Resources, Budget & Logistics': [4, 13, 9],
  'Environment, Continuity & Contingency': [10, 14, 15, 17, 18],
};
