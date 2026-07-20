import type { OperationalKernel } from '@redface/kernel-core';
import type { RtnUri } from '@redface/shared';
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
    body { font-family: system-ui, sans-serif; max-width: 800px; margin: 2rem auto; color: #111; line-height: 1.5; }
    h1 { font-size: 1.5rem; margin-bottom: 0.25rem; }
    .meta { color: #666; font-size: 0.875rem; margin-bottom: 2rem; }
    section { margin-bottom: 1.5rem; }
    table { width: 100%; border-collapse: collapse; }
    td { padding: 0.4rem 0; border-bottom: 1px solid #eee; }
    td:first-child { font-family: monospace; width: 5rem; color: #666; }
    .playback-box { display: flex; gap: 1rem; align-items: center; background: #f8f8f8; padding: 1rem; border-radius: 8px; }
    .attestation { background: #f8f8f8; padding: 0.75rem; border-radius: 8px; margin-bottom: 0.5rem; }
    @media print { body { margin: 1rem; } }
  </style>
</head>
<body>
  <h1>Mission Report</h1>
  <div class="meta">${report.reportId} · ${report.missionId} · Generated ${new Date(report.generatedAt).toLocaleString()}</div>

  <section>
    <h2>Summary</h2>
    <p><strong>${report.summary.title}</strong></p>
    <p>${report.summary.objective}</p>
    <p>Priority: ${report.summary.priority} · State: ${report.summary.state}</p>
    ${report.summary.outcome ? `<p>Outcome: ${report.summary.outcome}</p>` : ''}
  </section>

  <section>
    <h2>Mission Coordination Index</h2>
    <p><strong>${report.mci.missionCoordinationIndex}%</strong> — ${report.mci.outcome}</p>
  </section>

  <section>
    <h2>Playback</h2>
    <div class="playback-box">
      <img src="${qrUrl}" alt="Playback QR" width="120" height="120" />
      <div>
        <p><strong>${report.playbackId}</strong></p>
        <p>${report.playback.entryCount} events · ${report.playback.durationSeconds}s duration</p>
        <p><a href="${report.playbackUrl}">${report.playbackUrl}</a></p>
        <p><em>Full operational history available via playback — report stays concise.</em></p>
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
</body>
</html>`;
}
