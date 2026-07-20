import { RspEventTypesV1, RspPublisher, type RspPublishFn } from '@redface/rsp';
import { buildRtnUri, type RtnUri } from '@redface/shared';
import { migrate, runVehicleRecoveryDemo } from '@redface/kernel-core';

/** Simulated telemetry injected into Demonstration A via RSP SDK */

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function runRecoverySimulation(options?: { accelerated?: boolean }): Promise<void> {
  const delay = options?.accelerated ? 10 : 500;

  await migrate();
  const { kernel, missionUri } = await runVehicleRecoveryDemo({ quiet: true });

  try {
    const rsp = new RspPublisher({
      publish: ((input) => kernel.events.publish(input)) satisfies RspPublishFn,
    });

    const cameraUri = buildRtnUri('resource', 'CAM-PARKING-12');
    const guardRef = {
      uri: buildRtnUri('guard', '284729'),
      organizationUri: buildRtnUri('organization', 'field-demo'),
    };

    console.log('=== Mission Simulator: Demonstration A ===\n');
    console.log('Injecting simulated RSP events via SDK...\n');

    const base = new Date();
    const at = (offsetSeconds: number) => new Date(base.getTime() + offsetSeconds * 1000);

    await rsp.publish({
      type: RspEventTypesV1.cameraMotionDetected,
      mission: missionUri,
      source: { uri: cameraUri, organizationUri: buildRtnUri('organization', 'mall-demo') },
      payload: { zone: 'Parking Level B2', confidence: 0.94 },
      occurredAt: at(330),
    });
    await sleep(delay);

    await rsp.publish({
      type: RspEventTypesV1.gpsLocationUpdated,
      mission: missionUri,
      source: guardRef,
      payload: { lat: -33.915, lon: 18.425, speedKph: 42 },
      occurredAt: at(360),
    });
    await sleep(delay);

    await rsp.publish({
      type: RspEventTypesV1.guardCheckin,
      mission: missionUri,
      source: guardRef,
      payload: { status: 'on_scene' },
      occurredAt: at(390),
    });

    const playback = await kernel.history.buildPlayback(missionUri);

    console.log('--- Simulated timeline ---\n');
    for (const line of playback.lines) {
      console.log(line);
    }

    console.log(`\n✓ ${playback.entries.length} events · ${Math.round(playback.durationMs / 1000)}s span`);
    console.log('✓ All simulator events published through RSP SDK');
  } finally {
    await kernel.close();
  }
}

export type { RtnUri };
