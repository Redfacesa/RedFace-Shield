import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Button,
  Card,
  DispatchIndicator,
  EvidenceCounter,
  NextActionBanner,
  ResourceBadge,
  ResourceList,
  ScanLine,
  StatusRing,
  Timeline,
} from '@redface/ui';
import { type MissionDetail, eventLabel, fetchMission, formatTime } from '../api';

function missionProgress(detail: MissionDetail): number {
  const { mission, timeline } = detail;
  if (mission.state === 'completed') return 100;
  if (timeline.length === 0) return mission.state === 'planning' ? 8 : 15;
  return Math.min(95, 15 + timeline.length * 6);
}

function dispatchStatus(timeline: MissionDetail['timeline']): 'pending' | 'dispatched' | 'en_route' | 'complete' {
  const types = new Set(timeline.map((e) => e.type));
  if (types.has('rsp.dispatch.arrived')) return 'complete';
  if (types.has('rsp.dispatch.en_route')) return 'en_route';
  if (types.has('rsp.dispatch.accepted')) return 'dispatched';
  return 'pending';
}

function nextAction(
  mission: MissionDetail['mission'],
  evidenceCount: number,
  uri: string,
): { text: string; tone: 'critical' | 'warning' | 'success' | 'info'; href?: string; primary?: string } {
  if (mission.state === 'completed') {
    return { text: 'Generate Mission Report for insurers and management', tone: 'success', href: `/report?uri=${encodeURIComponent(uri)}`, primary: 'Generate Report' };
  }
  if (evidenceCount > 0 && mission.state !== 'planning') {
    return { text: 'Review evidence · open Operation Replay for supervisor sign-off', tone: 'info', href: `/playback?uri=${encodeURIComponent(uri)}`, primary: 'Open Replay' };
  }
  if (mission.state === 'planning') {
    return { text: 'Review Mission Brief before authorizing execution', tone: 'warning', href: `/brief?uri=${encodeURIComponent(uri)}`, primary: 'Open Brief' };
  }
  if (mission.priority === 'critical') {
    return { text: 'Monitor dispatch · critical mission in progress', tone: 'critical' };
  }
  return { text: 'Monitor live timeline · await field updates', tone: 'info' };
}

function scanSeverity(priority: string, state: string): 'critical' | 'warning' | 'success' | 'info' {
  if (state === 'completed') return 'success';
  if (priority === 'critical') return 'critical';
  if (state === 'planning') return 'warning';
  return 'info';
}

export function MissionPage() {
  const [params] = useSearchParams();
  const uri = params.get('uri') ?? '';
  const [detail, setDetail] = useState<MissionDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!uri) return;
    fetchMission(uri)
      .then(setDetail)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed'));
  }, [uri]);

  const resources = useMemo(() => {
    if (!detail) return [];
    return detail.timeline
      .filter((e) => e.type.includes('resource.allocated'))
      .map((e) => ({
        label: String((e.payload.resource as string | undefined)?.split('/').pop() ?? 'Resource'),
        role: String(e.payload.role ?? 'assigned'),
      }));
  }, [detail]);

  if (error) return <p>{error}</p>;
  if (!detail) return <p style={{ color: 'var(--rf-muted)' }}>Loading mission…</p>;

  const { mission, timeline, participants, attestations } = detail;
  const evidence = timeline.filter((e) => e.type.includes('evidence') || e.type.includes('recovery'));
  const progress = missionProgress(detail);
  const dispatch = dispatchStatus(timeline);
  const action = nextAction(mission, evidence.length, uri);
  const lastEvent = timeline[timeline.length - 1];
  const scanTitle = mission.title.replace(/^Recover vehicle /i, '').toUpperCase() || mission.type.replace('_', ' ').toUpperCase();

  return (
    <>
      <Link to="/" style={{ color: 'var(--rf-muted)', textDecoration: 'none', fontSize: '0.875rem' }}>← Control Room</Link>

      <div style={{ margin: '1rem 0' }}>
        <ScanLine
          severity={scanSeverity(mission.priority, mission.state)}
          title={scanTitle}
          segments={[
            mission.priority.toUpperCase(),
            lastEvent ? formatTime(lastEvent.occurredAt) : formatTime(mission.updatedAt),
            `${progress}%`,
          ]}
        />
      </div>

      <NextActionBanner
        action={action.text}
        tone={action.tone}
        actionNode={
          action.href && action.primary ? (
            <Link to={action.href}><Button primary>{action.primary}</Button></Link>
          ) : undefined
        }
      />

      <div className="rf-mission-focus rf-animate-in" style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <StatusRing percent={progress} />
          <div style={{ flex: 1, minWidth: '200px' }}>
            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--rf-muted)' }}>Objective</div>
            <p style={{ fontSize: '1.2rem', fontWeight: 600, margin: '0.35rem 0 0.75rem', lineHeight: 1.4 }}>
              {mission.outcome?.summary ?? 'Recover objective safely'}
            </p>
            <DispatchIndicator status={dispatch} />
          </div>
          <EvidenceCounter count={evidence.length} />
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem' }}>
          {resources.map((r) => (
            <ResourceBadge key={`${r.label}-${r.role}`} label={`${r.label} (${r.role})`} />
          ))}
        </div>
      </div>

      <div className="rf-grid-2">
        <Card title="Timeline">
          <Timeline
            operational
            entries={timeline.map((e) => ({
              time: formatTime(e.occurredAt),
              label: eventLabel(e.type),
            }))}
          />
        </Card>
        <Card title="Participants & Evidence">
          <ResourceList
            items={participants.map((p) => ({
              label: p.organizationUri.split('/').pop() ?? p.organizationUri,
              role: p.role,
            }))}
          />
          {evidence.map((e) => (
            <div key={e.id} className="rf-resource-row rf-animate-in">
              <span className="rf-resource-check">●</span>
              <div>
                <strong>{eventLabel(e.type)}</strong>
                <div style={{ fontSize: '0.85rem', color: 'var(--rf-muted)' }}>{formatTime(e.occurredAt)}</div>
              </div>
            </div>
          ))}
          {attestations.map((a, i) => (
            <div key={i} style={{ marginTop: '0.75rem', padding: '0.75rem', background: 'var(--rf-layer-elevated)', borderRadius: 10, borderLeft: '3px solid var(--rf-accent)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--rf-accent)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{a.attestationType}</div>
              {a.statement}
            </div>
          ))}
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            <Link to={`/brief?uri=${encodeURIComponent(mission.id)}`}><Button>Brief</Button></Link>
            <Link to={`/playback?uri=${encodeURIComponent(mission.id)}`}><Button>Replay</Button></Link>
          </div>
        </Card>
      </div>
    </>
  );
}
