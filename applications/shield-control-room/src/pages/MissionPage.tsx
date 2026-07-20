import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button, Card, MissionHeader, ResourceList, Timeline } from '@redface/ui';
import { type MissionDetail, eventLabel, fetchMission, formatTime } from '../api';

function missionProgress(detail: MissionDetail): number {
  const { mission, timeline } = detail;
  if (mission.state === 'completed') return 100;
  if (timeline.length === 0) return mission.state === 'planning' ? 8 : 15;
  return Math.min(95, 15 + timeline.length * 6);
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

  return (
    <>
      <Link to="/" style={{ color: 'var(--rf-muted)', textDecoration: 'none', fontSize: '0.875rem' }}>← Control Room</Link>

      <MissionHeader
        eyebrow="Mission"
        title={mission.title}
        objective={mission.outcome?.summary ?? 'Recover objective safely'}
        priority={mission.priority}
        state={mission.state}
        progress={progress}
        actions={
          <>
            <Link to={`/brief?uri=${encodeURIComponent(mission.id)}`}>
              <Button>Mission Brief</Button>
            </Link>
            <Link to={`/playback?uri=${encodeURIComponent(mission.id)}`}>
              <Button>▶ Operation Replay</Button>
            </Link>
            {mission.state === 'completed' && (
              <Link to={`/report?uri=${encodeURIComponent(mission.id)}`}>
                <Button primary>Generate Report</Button>
              </Link>
            )}
          </>
        }
      />

      <div className="rf-grid-2">
        <Card title="Resources">
          {resources.length === 0 ? (
            <p style={{ color: 'var(--rf-muted)' }}>Awaiting resource allocation</p>
          ) : (
            <ResourceList items={resources} />
          )}
        </Card>
        <Card title="Participants">
          <ResourceList
            items={participants.map((p) => ({
              label: p.organizationUri.split('/').pop() ?? p.organizationUri,
              role: p.role,
            }))}
          />
        </Card>
      </div>

      <div className="rf-grid-2" style={{ marginTop: '1rem' }}>
        <Card title="Timeline">
          <Timeline
            operational
            entries={timeline.map((e) => ({
              time: formatTime(e.occurredAt),
              label: eventLabel(e.type),
            }))}
          />
        </Card>
        <Card title="Evidence">
          {evidence.length === 0 ? (
            <p style={{ color: 'var(--rf-muted)' }}>No evidence events yet</p>
          ) : (
            evidence.map((e) => (
              <div key={e.id} className="rf-resource-row">
                <span className="rf-resource-check">●</span>
                <div>
                  <strong>{eventLabel(e.type)}</strong>
                  <div style={{ fontSize: '0.85rem', color: 'var(--rf-muted)' }}>{formatTime(e.occurredAt)}</div>
                </div>
              </div>
            ))
          )}
          {attestations.map((a, i) => (
            <div key={i} style={{ marginTop: '0.75rem', padding: '0.75rem', background: 'var(--rf-surface-2)', borderRadius: 10, borderLeft: '3px solid var(--rf-accent)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--rf-accent)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{a.attestationType}</div>
              {a.statement}
            </div>
          ))}
        </Card>
      </div>
    </>
  );
}
