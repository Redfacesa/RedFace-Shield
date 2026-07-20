import { useEffect, useState } from 'react';
import { Card, StatTile } from '@redface/ui';

interface IntelSummary {
  odrLevel: number;
  odrLabel: string;
  operations: {
    missionsInKernel: number;
    activeMissions: number;
    mciPercent: number;
    decisionLatencyLabel: string;
  };
  deployments: Array<{ id: string; customer: string; status: string; missions: number }>;
  learning: {
    openLearningTickets: number;
    activeHypotheses: number;
    engineeringFocus: string[];
    instrumentationPending: string[];
  };
  questions: {
    deploymentsHealthy: { answer: string; detail: string };
    operatorsSucceeding: { answer: string; detail: string };
    whatWeAreLearning: { answer: string; detail: string };
    engineeringFocusNext: { answer: string; detail: string };
  };
}

export function IntelPage() {
  const [intel, setIntel] = useState<IntelSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    fetch('/api/intel/summary')
      .then((r) => {
        if (!r.ok) throw new Error(`Intel API ${r.status} — restart kernel: npm run kernel:dev`);
        return r.json();
      })
      .then((data) => {
        setIntel(data);
        setError(null);
      })
      .catch((e) => {
        setError(e instanceof Error ? e.message : 'Failed to load intel');
      });
  };

  useEffect(() => {
    load();
    const id = setInterval(load, 30000);
    return () => clearInterval(id);
  }, []);

  if (error) {
    return (
      <div>
        <h2>Mission Intelligence unavailable</h2>
        <p style={{ color: 'var(--rf-muted)' }}>{error}</p>
        <p>The <code>/intel/summary</code> endpoint requires a current kernel API. Stop and restart:</p>
        <pre style={{ background: 'var(--rf-surface-2)', padding: '1rem', borderRadius: 8 }}>npm run kernel:dev</pre>
      </div>
    );
  }

  if (!intel) return <p style={{ color: 'var(--rf-muted)' }}>Loading Mission Intelligence…</p>;

  const q = intel.questions;

  return (
    <>
      <div className="rf-header">
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--rf-accent)', letterSpacing: '0.1em' }}>INTERNAL ONLY</div>
          <h1>Mission Intelligence</h1>
          <p style={{ color: 'var(--rf-muted)', margin: 0 }}>
            ODR-{intel.odrLevel} · {intel.odrLabel}
          </p>
        </div>
      </div>

      <div className="rf-grid-stats" style={{ marginBottom: '1.5rem' }}>
        <StatTile label="Missions" value={intel.operations.missionsInKernel} />
        <StatTile label="MCI" value={`${intel.operations.mciPercent}%`} highlight />
        <StatTile label="Decision Latency" value={intel.operations.decisionLatencyLabel} highlight />
        <StatTile label="Learning Tickets" value={intel.learning.openLearningTickets} />
      </div>

      <Card title="1. Are deployments healthy?">
        <p style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 0.5rem' }}>{q.deploymentsHealthy.answer}</p>
        <p style={{ color: 'var(--rf-muted)', margin: 0 }}>{q.deploymentsHealthy.detail}</p>
        <div style={{ marginTop: '1rem' }}>
          {intel.deployments.map((d) => (
            <div key={d.id} style={{ display: 'flex', gap: '1rem', padding: '0.35rem 0', borderBottom: '1px solid var(--rf-border)' }}>
              <strong>{d.id}</strong>
              <span>{d.customer}</span>
              <span style={{ color: 'var(--rf-muted)' }}>{d.status}</span>
            </div>
          ))}
        </div>
      </Card>

      <div className="rf-grid-2" style={{ marginTop: '1rem' }}>
        <Card title="2. Are operators succeeding?">
          <p style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 0.5rem' }}>{q.operatorsSucceeding.answer}</p>
          <p style={{ color: 'var(--rf-muted)', margin: 0 }}>{q.operatorsSucceeding.detail}</p>
        </Card>
        <Card title="3. What are we learning?">
          <p style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 0.5rem' }}>{q.whatWeAreLearning.answer}</p>
          <p style={{ color: 'var(--rf-muted)', margin: 0 }}>{q.whatWeAreLearning.detail}</p>
        </Card>
      </div>

      <Card title="4. Where should engineering focus next?">
        <p style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 0.5rem' }}>{q.engineeringFocusNext.answer}</p>
        <p style={{ color: 'var(--rf-muted)', margin: '0 0 1rem' }}>{q.engineeringFocusNext.detail}</p>
        <p style={{ fontSize: '0.8rem', color: 'var(--rf-muted)' }}>
          Instrumentation pending (ODR-2): {intel.learning.instrumentationPending.join(', ')}
        </p>
      </Card>
    </>
  );
}
