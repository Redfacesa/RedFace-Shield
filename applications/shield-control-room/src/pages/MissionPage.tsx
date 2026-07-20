import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button, Card, StatusChip, Timeline } from '@redface/ui';
import { type MissionDetail, eventLabel, fetchMission, formatTime } from '../api';

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

  if (error) return <p>{error}</p>;
  if (!detail) return <p style={{ color: 'var(--rf-muted)' }}>Loading mission…</p>;

  const { mission, timeline, participants, attestations } = detail;
  const evidence = timeline.filter((e) => e.type.includes('evidence') || e.type.includes('recovery'));

  return (
    <>
      <div className="rf-header">
        <div>
          <Link to="/" style={{ color: 'var(--rf-muted)', textDecoration: 'none', fontSize: '0.875rem' }}>← Dashboard</Link>
          <h1 style={{ marginTop: '0.5rem' }}>{mission.title}</h1>
          <div style={{ fontFamily: 'var(--rf-mono)', fontSize: '0.8rem', color: 'var(--rf-muted)' }}>{mission.id}</div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <StatusChip state={mission.state} />
          <Link to={`/playback?uri=${encodeURIComponent(mission.id)}`}>
            <Button primary>▶ Playback</Button>
          </Link>
        </div>
      </div>

      <div className="rf-grid-2">
        <Card title="Objective">
          <p style={{ margin: 0, fontSize: '1.1rem' }}>{mission.outcome?.summary ?? 'Recover objective safely'}</p>
          <div style={{ marginTop: '1rem', color: 'var(--rf-muted)', fontSize: '0.875rem' }}>
            Type: {mission.type.replace('_', ' ')} · Priority: {mission.priority}
          </div>
        </Card>
        <Card title="Participants">
          {participants.length === 0 ? (
            <p style={{ color: 'var(--rf-muted)' }}>No participants registered</p>
          ) : (
            participants.map((p) => (
              <div key={p.organizationUri} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--rf-success)' }}>✓</span>
                <span>{p.organizationUri.split('/').pop()}</span>
                <span style={{ color: 'var(--rf-muted)' }}>({p.role})</span>
              </div>
            ))
          )}
        </Card>
      </div>

      <div className="rf-grid-2" style={{ marginTop: '1rem' }}>
        <Card title="Timeline">
          <Timeline
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
              <div key={e.id} style={{ marginBottom: '0.75rem' }}>
                <strong>{eventLabel(e.type)}</strong>
                <div style={{ fontSize: '0.8rem', color: 'var(--rf-muted)' }}>{formatTime(e.occurredAt)}</div>
              </div>
            ))
          )}
          {attestations.map((a, i) => (
            <div key={i} style={{ marginTop: '0.75rem', padding: '0.5rem', background: 'var(--rf-surface-2)', borderRadius: 8 }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--rf-accent)' }}>{a.attestationType}</div>
              {a.statement}
            </div>
          ))}
        </Card>
      </div>
    </>
  );
}
