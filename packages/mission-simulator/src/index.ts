/**
 * Mission Simulator — generates RSP events without real hardware.
 * All events publish through RSP SDK (same path as future adapters).
 */
export { runRecoverySimulation } from './scenarios/vehicle-recovery.js';
export { SCENARIO_ESTATE_ALARM, SCENARIO_CIT_ESCORT } from './scenarios/index.js';
