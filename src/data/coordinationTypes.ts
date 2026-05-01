import type { CoordinationType } from '../types/study';

export interface CoordinationTypeInfo {
  type: CoordinationType;
  shortLabel: string;
  colorClass: string;
  dotClass: string;
}

export const COORDINATION_TYPES: CoordinationTypeInfo[] = [
  {
    type: 'Hard constraint / cannot be violated',
    shortLabel: 'Hard',
    colorClass: 'bg-red-100 text-red-700 border-red-200',
    dotClass: 'bg-red-500',
  },
  {
    type: 'Flexible or negotiable',
    shortLabel: 'Flexible',
    colorClass: 'bg-blue-100 text-blue-700 border-blue-200',
    dotClass: 'bg-blue-500',
  },
  {
    type: 'Dynamic / changes in real time',
    shortLabel: 'Dynamic',
    colorClass: 'bg-amber-100 text-amber-700 border-amber-200',
    dotClass: 'bg-amber-500',
  },
  {
    type: 'Human friction',
    shortLabel: 'Human',
    colorClass: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    dotClass: 'bg-yellow-500',
  },
  {
    type: 'AI could help',
    shortLabel: 'AI',
    colorClass: 'bg-green-100 text-green-700 border-green-200',
    dotClass: 'bg-green-500',
  },
  {
    type: 'Human producer must make final call',
    shortLabel: 'Final call',
    colorClass: 'bg-purple-100 text-purple-700 border-purple-200',
    dotClass: 'bg-purple-500',
  },
];

export const PROJECT_TYPES = [
  'Short film',
  'Thesis film',
  'Commercial',
  'Music video',
  'Documentary',
  'Branded content',
  'Other',
];

export const EXPERIENCE_LEVELS = [
  'Student producer',
  'Emerging / independent producer',
  'Commercial producer',
  'Other',
];
