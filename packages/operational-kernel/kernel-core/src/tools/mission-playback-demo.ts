/**
 * Runs MVP hijacking recovery and prints mission playback.
 * Demonstrates scrubbable operational timeline from immutable events.
 */
import { migrate, runVehicleRecoveryDemo } from '../mvp/hijacking-recovery.js';

async function main(): Promise<void> {
  await migrate();
  const { kernel, missionUri } = await runVehicleRecoveryDemo({ quiet: true });

  try {
    const playback = await kernel.history.buildPlayback(missionUri);

    console.log('=== Mission Playback ===\n');
    console.log(`Mission: ${playback.missionUri}`);
    console.log(`Duration: ${Math.round(playback.durationMs / 1000)}s\n`);

    for (const line of playback.lines) {
      console.log(line);
    }

    console.log('\n✓ Playback generated from immutable event timeline');
  } finally {
    await kernel.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
