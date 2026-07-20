import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button, Card } from '@redface/ui';
import { type MissionReport, fetchMissionReport } from '../api';

export function ReportPage() {
  const [params] = useSearchParams();
  const uri = params.get('uri') ?? '';
  const [report, setReport] = useState<MissionReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!uri) return;
    fetchMissionReport(uri)
      .then(setReport)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed'));
  }, [uri]);

  const printReport = () => {
    window.open(`/api/missions?uri=${encodeURIComponent(uri)}&report=html`, '_blank');
  };

  if (error) return <p>{error}</p>;
  if (!report) return <p style={{ color: 'var(--rf-muted)' }}>Generating mission report…</p>;

  return (
    <>
      <div className="rf-header">
        <div>
          <Link to={`/mission?uri=${encodeURIComponent(uri)}`} style={{ color: 'var(--rf-muted)', textDecoration: 'none', fontSize: '0.875rem' }}>
            ← Mission
          </Link>
          <h1 style={{ marginTop: '0.5rem' }}>Mission Report</h1>
          <div style={{ fontFamily: 'var(--rf-mono)', fontSize: '0.8rem', color: 'var(--rf-muted)' }}>
            {report.reportId} · {report.missionId}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button onClick={printReport}>Print / PDF</Button>
          <a href={`/api/missions?uri=${encodeURIComponent(uri)}&report=json`} download={`${report.reportId}.json`}>
            <Button>Download JSON</Button>
          </a>
        </div>
      </div>

      <Card title="Summary">
        <p style={{ fontSize: '1.1rem', fontWeight: 700 }}>{report.summary.title}</p>
        <p>{report.summary.objective}</p>
        {report.summary.outcome && <p style={{ color: 'var(--rf-success)' }}>{report.summary.outcome}</p>}
        <p style={{ color: 'var(--rf-muted)', fontSize: '0.875rem' }}>
          MCI: {report.mci.missionCoordinationIndex}% · Generated {new Date(report.generatedAt).toLocaleString()}
        </p>
      </Card>

      <div className="rf-grid-2" style={{ marginTop: '1rem' }}>
        <Card title="Playback Reference">
          <p><strong>{report.playbackId}</strong></p>
          <p style={{ fontSize: '0.875rem', color: 'var(--rf-muted)' }}>
            {report.playback.entryCount} events · {report.playback.durationSeconds}s
          </p>
          <p style={{ fontSize: '0.8rem', wordBreak: 'break-all' }}>{report.playbackUrl}</p>
          <p style={{ color: 'var(--rf-muted)', fontSize: '0.875rem' }}>
            Full operational history available via playback — this report stays concise.
          </p>
          <Link to={`/playback?uri=${encodeURIComponent(uri)}`}>
            <Button primary>▶ Open Playback</Button>
          </Link>
        </Card>
        <Card title="Attestations">
          {report.attestations.map((a) => (
            <div key={`${a.type}-${a.by}`} style={{ marginBottom: '0.75rem', padding: '0.5rem', background: 'var(--rf-surface-2)', borderRadius: 8 }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--rf-accent)' }}>{a.type}</div>
              {a.statement}
              <div style={{ fontSize: '0.75rem', color: 'var(--rf-muted)' }}>— {a.by}</div>
            </div>
          ))}
        </Card>
      </div>

      <Card title="Timeline" >
        {report.timeline.map((e) => (
          <div key={`${e.time}-${e.type}`} style={{ display: 'grid', gridTemplateColumns: '5rem 1fr', gap: '0.5rem', padding: '0.35rem 0', borderBottom: '1px solid var(--rf-border)' }}>
            <span style={{ fontFamily: 'var(--rf-mono)', color: 'var(--rf-muted)' }}>{e.time}</span>
            <span>{e.label}</span>
          </div>
        ))}
      </Card>
    </>
  );
}
