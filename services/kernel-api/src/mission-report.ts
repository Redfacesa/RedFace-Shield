import type { OperationalKernel } from '@redface/kernel-core';
import type { RtnUri } from '@redface/shared';
import { computeDecisionLatencySeconds, formatDecisionLatency } from './metrics.js';
import { eventDisplayLabel, missionLocalId, playbackId, reportId } from './event-labels.js';
import { timelineDisplayEntries } from './mission-brief.js';

export interface MissionReportJson {
  reportId: string;
  playbackId: string;
  playbackUrl: string;
  missionId: RtnUri;
  generatedAt: string;
  summary: {
    title: string;
    objective: string;
    state: string;
    priority: string;
    outcome?: string;
    result?: string;
    durationMinutes?: number;
  };
  timeline: Array<{ time: string; label: string; type: string }>;
  participants: Array<{ organization: string; role: string }>;
  evidence: Array<{ label: string; time: string; type: string }>;
  attestations: Array<{ type: string; statement: string; by: string }>;
  mci: { missionCoordinationIndex: number; outcome: string };
  decisionLatencySeconds: number | null;
  decisionLatencyLabel: string;
  playback: { entryCount: number; durationSeconds: number };
}

function evidenceEvents(timeline: Awaited<ReturnType<OperationalKernel['history']['getMissionTimeline']>>) {
  return timeline
    .filter((e) => e.type.includes('evidence') || e.type.includes('recovery'))
    .map((e) => ({
      label: eventDisplayLabel(e.type),
      time: e.occurredAt.toISOString(),
      type: e.type,
    }));
}

export async function buildMissionReportJson(
  kernel: OperationalKernel,
  missionUri: RtnUri,
  baseUrl: string,
): Promise<MissionReportJson> {
  const mission = await kernel.mission.get(missionUri);
  const intent = await kernel.intent.get(mission.intentId);
  const timeline = await kernel.history.getMissionTimeline(missionUri);
  const participants = await kernel.mission.listParticipants(missionUri);
  const attestations = await kernel.attestation.listBySubject(missionUri);
  const playback = await kernel.history.buildPlayback(missionUri);

  const local = missionLocalId(missionUri);
  const playId = playbackId(missionUri);
  const playbackUrl = `${baseUrl.replace(/\/$/, '')}/playback?uri=${encodeURIComponent(missionUri)}`;

  const mciScore = mission.outcome?.result === 'success' ? 100 : mission.state === 'completed' ? 50 : 0;
  const decisionLatencySeconds = computeDecisionLatencySeconds(timeline);

  return {
    reportId: reportId(missionUri),
    playbackId: playId,
    playbackUrl,
    missionId: missionUri,
    generatedAt: new Date().toISOString(),
    summary: {
      title: mission.title,
      objective: intent.statement,
      state: mission.state,
      priority: mission.priority,
      outcome: mission.outcome?.summary,
      result: mission.outcome?.result,
      durationMinutes: mission.outcome?.metrics?.durationMinutes as number | undefined,
    },
    timeline: timelineDisplayEntries(timeline),
    participants: participants.map((p) => ({
      organization: p.organizationUri.split('/').pop() ?? p.organizationUri,
      role: p.role,
    })),
    evidence: evidenceEvents(timeline),
    attestations: attestations.map((a) => ({
      type: a.attestationType,
      statement: a.statement,
      by: a.attestedByUri.split('/').pop() ?? a.attestedByUri,
    })),
    mci: {
      missionCoordinationIndex: mciScore,
      outcome: mission.outcome?.result ?? mission.state,
    },
    decisionLatencySeconds,
    decisionLatencyLabel: formatDecisionLatency(decisionLatencySeconds),
    playback: {
      entryCount: playback.entries.length,
      durationSeconds: Math.round(playback.durationMs / 1000),
    },
  };
}

export function renderMissionReportHtml(report: MissionReportJson): string {
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(report.playbackUrl)}`;

  const timelineRows = report.timeline
    .map((e) => `<tr><td>${e.time}</td><td>${e.label}</td></tr>`)
    .join('');

  const evidenceRows = report.evidence
    .map((e) => `<li>${new Date(e.time).toLocaleTimeString()} — ${e.label}</li>`)
    .join('');

  const attestationBlocks = report.attestations
    .map((a) => `<div class="attestation"><strong>${a.type}</strong><p>${a.statement}</p><small>— ${a.by}</small></div>`)
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${report.reportId} — ${report.summary.title}</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: 'Segoe UI', system-ui, sans-serif; max-width: 820px; margin: 0 auto; color: #1a1a1a; line-height: 1.55; }
    .cover { min-height: 100vh; display: flex; flex-direction: column; justify-content: center; padding: 3rem 2.5rem; background: linear-gradient(160deg, #0a0e14 0%, #1a2230 100%); color: #fff; page-break-after: always; }
    .cover-brand { color: #e63946; font-weight: 800; letter-spacing: 0.15em; font-size: 0.85rem; }
    .cover h1 { font-size: 2.25rem; margin: 1rem 0 0.5rem; font-weight: 700; }
    .cover-objective { font-size: 1.15rem; color: #c8d0dc; max-width: 36rem; }
    .cover-meta { margin-top: 2.5rem; font-family: monospace; font-size: 0.9rem; color: #8b98a8; }
    .cover-metrics { display: flex; gap: 2rem; margin-top: 2rem; }
    .cover-metric { background: rgba(255,255,255,0.06); padding: 1rem 1.25rem; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); }
    .cover-metric-label { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.08em; color: #8b98a8; }
    .cover-metric-value { font-size: 1.75rem; font-weight: 700; margin-top: 0.25rem; }
    .content { padding: 2.5rem 2rem; }
    h2 { font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.08em; color: #666; border-bottom: 2px solid #e63946; padding-bottom: 0.35rem; }
    section { margin-bottom: 2rem; }
    table { width: 100%; border-collapse: collapse; }
    td { padding: 0.5rem 0; border-bottom: 1px solid #eee; }
    td:first-child { font-family: monospace; width: 5rem; color: #888; }
    .replay-box { display: flex; gap: 1.25rem; align-items: center; background: #f4f5f7; padding: 1.25rem; border-radius: 10px; border-left: 4px solid #e63946; }
    .attestation { background: #f4f5f7; padding: 1rem; border-radius: 8px; margin-bottom: 0.5rem; }
    @media print { .cover { min-height: auto; padding: 2rem; } }
  </style>
</head>
<body>
  <div class="cover">
    <div class="cover-brand">REDFACE SHIELD</div>
    <h1>Mission Report</h1>
    <p class="cover-objective">${report.summary.objective}</p>
    <div class="cover-meta">${report.reportId} · ${report.missionId}<br/>Generated ${new Date(report.generatedAt).toLocaleString()}</div>
    <div class="cover-metrics">
      <div class="cover-metric"><div class="cover-metric-label">MCI</div><div class="cover-metric-value">${report.mci.missionCoordinationIndex}%</div></div>
      <div class="cover-metric"><div class="cover-metric-label">Decision Latency</div><div class="cover-metric-value">${report.decisionLatencyLabel}</div></div>
      <div class="cover-metric"><div class="cover-metric-label">Priority</div><div class="cover-metric-value" style="text-transform:capitalize">${report.summary.priority}</div></div>
    </div>
  </div>

  <div class="content">
  <section>
    <h2>Summary</h2>
    <p><strong>${report.summary.title}</strong></p>
    ${report.summary.outcome ? `<p>Outcome: ${report.summary.outcome}</p>` : ''}
  </section>

  <section>
    <h2>Operation Replay</h2>
    <div class="replay-box">
      <img src="${qrUrl}" alt="Replay QR" width="120" height="120" />
      <div>
        <p><strong>${report.playbackId}</strong></p>
        <p>${report.playback.entryCount} events · ${report.playback.durationSeconds}s duration</p>
        <p><a href="${report.playbackUrl}">${report.playbackUrl}</a></p>
        <p><em>Full operational history available via Operation Replay — this report stays concise.</em></p>
      </div>
    </div>
  </section>

  <section>
    <h2>Timeline</h2>
    <table>${timelineRows}</table>
  </section>

  <section>
    <h2>Participants</h2>
    <ul>${report.participants.map((p) => `<li>${p.organization} (${p.role})</li>`).join('')}</ul>
  </section>

  <section>
    <h2>Evidence</h2>
    <ul>${evidenceRows || '<li>No evidence events recorded</li>'}</ul>
  </section>

  <section>
    <h2>Attestations</h2>
    ${attestationBlocks || '<p>No attestations</p>'}
  </section>
  </div>
</body>
</html>`;
}
