import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button, Card, StatusChip } from '@redface/ui';
import { type MissionBrief, fetchMissionBrief } from '../api';

export function BriefPage() {
  const [params] = useSearchParams();
  const uri = params.get('uri') ?? '';
  const [brief, setBrief] = useState<MissionBrief | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!uri) return;
    fetchMissionBrief(uri)
      .then(setBrief)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed'));
  }, [uri]);

  if (error) return <p>{error}</p>;
  if (!brief) return <p style={{ color: 'var(--rf-muted)' }}>Loading mission brief…</p>;

  return (
    <>
      <div className="rf-header">
        <div>
          <Link to={`/mission?uri=${encodeURIComponent(uri)}`} style={{ color: 'var(--rf-muted)', textDecoration: 'none', fontSize: '0.875rem' }}>
            ← Mission
          </Link>
          <h1 style={{ marginTop: '0.5rem' }}>Mission Brief</h1>
          <div style={{ fontFamily: 'var(--rf-mono)', fontSize: '0.8rem', color: 'var(--rf-muted)' }}>{brief.missionId}</div>
        </div>
        <StatusChip state={brief.state} />
      </div>

      <Card title="Objective">
        <p style={{ fontSize: '1.15rem', margin: 0 }}>{brief.objective}</p>
        <p style={{ color: 'var(--rf-muted)', marginTop: '0.75rem' }}>{brief.title}</p>
      </Card>

      <div className="rf-grid-2" style={{ marginTop: '1rem' }}>
        <Card title="Priority">
          <p style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, textTransform: 'capitalize' }}>{brief.priority}</p>
        </Card>
        <Card title="Participants">
          {brief.participants.map((p) => (
            <div key={`${p.organization}-${p.role}`} style={{ marginBottom: '0.5rem' }}>
              <span style={{ color: 'var(--rf-success)' }}>✓ </span>
              {p.organization} <span style={{ color: 'var(--rf-muted)' }}>({p.role})</span>
            </div>
          ))}
        </Card>
      </div>

      <div className="rf-grid-2" style={{ marginTop: '1rem' }}>
        <Card title="Current Intelligence">
          <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
            {brief.currentIntelligence.map((line) => (
              <li key={line} style={{ marginBottom: '0.5rem' }}>{line}</li>
            ))}
          </ul>
        </Card>
        <Card title="Assigned Resources">
          {brief.assignedResources.length === 0 ? (
            <p style={{ color: 'var(--rf-muted)' }}>Resources pending allocation</p>
          ) : (
            brief.assignedResources.map((r) => (
              <div key={`${r.label}-${r.role}`} style={{ marginBottom: '0.5rem' }}>
                <strong>{r.label}</strong>
                <span style={{ color: 'var(--rf-muted)' }}> — {r.type} ({r.role})</span>
              </div>
            ))
          )}
        </Card>
      </div>

      <div className="rf-grid-2" style={{ marginTop: '1rem' }}>
        <Card title="Known Risks">
          <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
            {brief.knownRisks.map((risk) => (
              <li key={risk} style={{ marginBottom: '0.5rem', color: 'var(--rf-warning)' }}>{risk}</li>
            ))}
          </ul>
        </Card>
        <Card title="Success Criteria">
          <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
            {brief.successCriteria.map((c) => (
              <li key={c} style={{ marginBottom: '0.5rem' }}>{c}</li>
            ))}
          </ul>
        </Card>
      </div>

      <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem' }}>
        <Link to={`/mission?uri=${encodeURIComponent(uri)}`}>
          <Button primary>Open Mission Workspace</Button>
        </Link>
        <Link to={`/playback?uri=${encodeURIComponent(uri)}`}>
          <Button>▶ Playback</Button>
        </Link>
      </div>
    </>
  );
}
