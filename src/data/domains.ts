import type { CoordinationDomain } from '../types/study';

export interface DomainInfo {
  domain: CoordinationDomain;
  description: string;
}

export const DOMAINS: CoordinationDomain[] = [
  'Creative Intent & Script Translation',
  'People & Human Friction',
  'Time, Schedule & Availability',
  'Location, Permission & Compliance',
  'Resources, Budget & Logistics',
  'Environment, Continuity & Contingency',
];

export const DOMAIN_DESCRIPTIONS: Record<CoordinationDomain, string> = {
  'Creative Intent & Script Translation':
    'Theme, story beats, director vision, script breakdown, visual tone',
  'People & Human Friction':
    'Cast, crew, conflict, communication, morale, role clarity',
  'Time, Schedule & Availability':
    'Call times, deadlines, availability windows, sequencing',
  'Location, Permission & Compliance':
    'Permits, releases, legal rules, safety, institutional policy',
  'Resources, Budget & Logistics':
    'Equipment, budget, transport, food, procurement',
  'Environment, Continuity & Contingency':
    'Weather, continuity, reshoot needs, post-production, audience',
};
