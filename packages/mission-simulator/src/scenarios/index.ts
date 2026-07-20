/** Demonstration scenario definitions — B and C are specified, not yet fully simulated */

export const SCENARIO_ESTATE_ALARM = {
  id: 'demonstration-b-estate-alarm',
  name: 'Estate Alarm Response',
  tests: ['camera event', 'dispatch', 'multiple responders', 'property', 'stewardship', 'timeline'],
  status: 'defined' as const,
};

export const SCENARIO_CIT_ESCORT = {
  id: 'demonstration-c-cit-escort',
  name: 'Cash-in-Transit Escort',
  tests: ['planned mission', 'dynamic routing', 'multiple organizations', 'operational context', 'mission completion'],
  status: 'defined' as const,
};
