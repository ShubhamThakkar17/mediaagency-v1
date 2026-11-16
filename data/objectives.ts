export const OBJECTIVES = [
  { id: 'awareness', label: 'Awareness', kind: 'brand' },
  { id: 'consideration', label: 'Consideration & trust', kind: 'brand' },
  { id: 'leads', label: 'Leads & enquiries', kind: 'performance' },
  { id: 'sales', label: 'Sales & footfall', kind: 'performance' },
  { id: 'launch', label: 'Launch buzz', kind: 'brand' },
] as const;
export type ObjectiveId = (typeof OBJECTIVES)[number]['id'];
export const OBJECTIVE_IDS = OBJECTIVES.map((o) => o.id) as [ObjectiveId, ...ObjectiveId[]];
export const objectiveLabel = (id: ObjectiveId) => OBJECTIVES.find((o) => o.id === id)?.label ?? id;

export const STAGES = [
  { id: 'new', label: 'New / launching' },
  { id: 'growing', label: 'Growing' },
  { id: 'established', label: 'Established' },
  { id: 'relaunch', label: 'Relaunch' },
] as const;
export type StageId = (typeof STAGES)[number]['id'];
export const STAGE_IDS = STAGES.map((s) => s.id) as [StageId, ...StageId[]];
export const stageLabel = (id: StageId) => STAGES.find((s) => s.id === id)?.label ?? id;

export const DURATIONS = [1, 3, 6, 12] as const;
export type DurationMonths = (typeof DURATIONS)[number];
