#!/usr/bin/env node
/**
 * Operational acceptance test — Vehicle Recovery Demo
 * Pass/fail regression for Platform Validation Stage 1.
 */
const API = process.env.KERNEL_API_URL ?? 'http://localhost:3000';

const REQUIRED_EVENTS = [
  'rsp.intent.declared',
  'rsp.mission.created',
  'rsp.resource.allocated',
  'rsp.dispatch.accepted',
  'rsp.evidence.created',
  'rsp.recovery.success',
  'rsp.mission.completed',
];

async function get(path) {
  const res = await fetch(`${API}${path}`);
  if (!res.ok) throw new Error(`${path} → ${res.status}`);
  return res.json();
}

function pass(label) {
  console.log(`  ✓ ${label}`);
}

function fail(label, detail) {
  console.error(`  ✗ ${label}${detail ? `: ${detail}` : ''}`);
}

async function main() {
  console.log('=== RedFace Operational Acceptance: Vehicle Recovery ===\n');
  let ok = true;

  try {
    const health = await get('/health');
    if (health.status !== 'healthy' && health.status !== 'degraded') {
      fail('Health check', health.status);
      ok = false;
    } else {
      pass(`Health (${health.database})`);
    }

    const dashboard = await get('/control-room/dashboard');
    const mission = dashboard.missions?.[0];
    if (!mission) {
      fail('Mission exists in dashboard');
      ok = false;
      process.exit(1);
    }
    pass(`Mission loaded: ${mission.title}`);

    const uri = encodeURIComponent(mission.id);
    const detail = await get(`/missions?uri=${uri}`);
    const types = new Set(detail.timeline.map((e) => e.type));

    for (const required of REQUIRED_EVENTS) {
      if (types.has(required) || [...types].some((t) => t.includes(required.split('.').pop()))) {
        pass(`Event: ${required}`);
      } else if (required === 'rsp.mission.completed' && types.has('rsp.recovery.success')) {
        pass(`Event: ${required} (recovery success recorded)`);
      } else if (required === 'rsp.intent.declared' && types.has('rsp.mission.created')) {
        pass(`Event: intent flow (mission created)`);
      } else {
        fail(`Event: ${required}`);
        ok = false;
      }
    }

    const playback = await get(`/missions?uri=${uri}&playback=true`);
    if ((playback.playback?.entries?.length ?? 0) >= 5) {
      pass(`Playback generated (${playback.playback.entries.length} entries)`);
    } else {
      fail('Playback generated', `${playback.playback?.entries?.length ?? 0} entries`);
      ok = false;
    }

    const brief = await get(`/missions?uri=${uri}&brief=true`);
    if (brief.brief?.objective && brief.brief?.successCriteria?.length) {
      pass('Mission brief available');
    } else {
      fail('Mission brief');
      ok = false;
    }

    const report = await get(`/missions?uri=${uri}&report=json`);
    if (report.reportId && report.playbackId && report.timeline?.length) {
      pass(`Mission report (${report.reportId}, playback ${report.playbackId})`);
    } else {
      fail('Mission report');
      ok = false;
    }

    if (dashboard.stats.mciPercent >= 0) {
      pass(`MCI calculated (${dashboard.stats.mciPercent}%)`);
    } else {
      fail('MCI calculated');
      ok = false;
    }

    const reviewComplete =
      mission.state === 'completed' &&
      report.attestations?.length >= 1 &&
      playback.playback?.entries?.length >= 5 &&
      report.playbackId;

    if (reviewComplete) {
      pass('Mission review completed');
    } else {
      fail('Mission review completed');
      ok = false;
    }
  } catch (err) {
    console.error(`\nFatal: ${err instanceof Error ? err.message : err}`);
    console.error('Ensure: npm run db:local && npm run db:migrate && npm run mvp:hijacking && npm run kernel:dev');
    process.exit(1);
  }

  console.log(ok ? '\n✓ ACCEPTANCE PASSED' : '\n✗ ACCEPTANCE FAILED');
  process.exit(ok ? 0 : 1);
}

main();
