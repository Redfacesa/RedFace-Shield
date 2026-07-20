import { runRecoverySimulation } from './scenarios/vehicle-recovery.js';

runRecoverySimulation({ accelerated: true }).catch((err) => {
  console.error(err);
  process.exit(1);
});
