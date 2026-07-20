import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button, Card, PriorityBadge, StatusChip } from '@redface/ui';
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
    <div className="rf-brief">
      <div className="rf-brief-header">
        <Link to={`/mission?uri=${encodeURIComponent(uri)}`} style={{ color: 'var(--rf-muted)', textDecoration: 'none', fontSize: '0.875rem' }}>
          ← Mission
        </Link>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginTop: '0.75rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--rf-accent)' }}>Mission Brief</div>
            <h1 style={{ margin: '0.5rem 0 0', fontSize: '1.75rem' }}>{brief.title}</h1>
            <div style={{ fontFamily: 'var(--rf-mono)', fontSize: '0.8rem', color: 'var(--rf-muted)', marginTop: '0.5rem' }}>{brief.missionId}</div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <PriorityBadge priority={brief.priority} />
            <StatusChip state={brief.state} />
          </div>
        </div>
        <p className="rf-brief-objective">{brief.objective}</p>
      </div>

      <div className="rf-grid-2">
        <Card title="Current Intelligence">
          {brief.currentIntelligence.map((line) => (
            <p key={line} style={{ margin: '0 0 0.75rem', fontSize: '1.05rem' }}>{line}</p>
          ))}
        </Card>
        <Card title="Assigned Resources">
          {brief.assignedResources.length === 0 ? (
            <p style={{ color: 'var(--rf-muted)' }}>Resources pending allocation</p>
          ) : (
            brief.assignedResources.map((r) => (
              <div key={`${r.label}-${r.role}`} style={{ marginBottom: '0.75rem', fontSize: '1.05rem' }}>
                <strong>{r.label}</strong>
                <span style={{ color: 'var(--rf-muted)' }}> — {r.type} ({r.role})</span>
              </div>
            ))
          )}
        </Card>
      </div>

      <div className="rf-grid-2" style={{ marginTop: '1rem' }}>
        <Card title="Participants">
          {brief.participants.map((p) => (
            <div key={`${p.organization}-${p.role}`} style={{ marginBottom: '0.5rem', fontSize: '1.05rem' }}>
              <span style={{ color: 'var(--rf-success)' }}>✓ </span>
              {p.organization} <span style={{ color: 'var(--rf-muted)' }}>({p.role})</span>
            </div>
          ))}
        </Card>
        <Card title="Success Criteria">
          {brief.successCriteria.map((c) => (
            <div key={c} style={{ marginBottom: '0.5rem', fontSize: '1.05rem' }}>✓ {c}</div>
          ))}
        </Card>
      </div>

      <Card title="Known Risks" >
        {brief.knownRisks.map((risk) => (
          <div key={risk} className="rf-brief-risk">{risk}</div>
        ))}
      </Card>

      <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem' }}>
        <Link to={`/mission?uri=${encodeURIComponent(uri)}`}>
          <Button primary>Begin Mission</Button>
        </Link>
        <Link to={`/wall`}>
          <Button>Open Operations Wall</Button>
        </Link>
      </div>
    </div>
  );
}
