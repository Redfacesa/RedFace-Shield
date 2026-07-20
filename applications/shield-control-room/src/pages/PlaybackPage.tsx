import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button, Card, PlaybackTimeline } from '@redface/ui';
import { type DashboardData, fetchDashboard, fetchMission } from '../api';

export function PlaybackPage() {
  const [params] = useSearchParams();
  const initialUri = params.get('uri') ?? '';
  const [missions, setMissions] = useState<DashboardData['missions']>([]);
  const [selectedUri, setSelectedUri] = useState(initialUri);
  const [entries, setEntries] = useState<Array<{ time: string; label: string }>>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    fetchDashboard().then((d) => {
      setMissions(d.missions);
      if (!selectedUri && d.missions[0]) setSelectedUri(d.missions[0].id);
    });
  }, [selectedUri]);

  useEffect(() => {
    if (!selectedUri) return;
    fetchMission(selectedUri, true).then((d) => {
      setEntries(d.playback?.entries ?? []);
      setActiveIndex(0);
      setPlaying(false);
    });
  }, [selectedUri]);

  useEffect(() => {
    if (!playing || entries.length === 0) return;
    if (activeIndex >= entries.length - 1) {
      setPlaying(false);
      return;
    }
    const t = setTimeout(() => setActiveIndex((i) => i + 1), 1200);
    return () => clearTimeout(t);
  }, [playing, activeIndex, entries.length]);

  return (
    <>
      <div className="rf-header">
        <div>
          <Link to="/" style={{ color: 'var(--rf-muted)', textDecoration: 'none', fontSize: '0.875rem' }}>← Dashboard</Link>
          <h1 style={{ marginTop: '0.5rem' }}>▶ Operation Replay</h1>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button onClick={() => { setActiveIndex(0); setPlaying(false); }}>Reset</Button>
          <Button primary onClick={() => setPlaying(true)}>Play</Button>
        </div>
      </div>

      <div className="rf-grid-2">
        <Card title="Select Mission">
          <select
            value={selectedUri}
            onChange={(e) => setSelectedUri(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', background: 'var(--rf-surface-2)', color: 'var(--rf-text)', border: '1px solid var(--rf-border)', borderRadius: 8 }}
          >
            {missions.map((m) => (
              <option key={m.id} value={m.id}>{m.title}</option>
            ))}
          </select>
        </Card>
        <Card title="Scrub">
          <input
            type="range"
            min={0}
            max={Math.max(0, entries.length - 1)}
            value={activeIndex}
            onChange={(e) => { setActiveIndex(Number(e.target.value)); setPlaying(false); }}
            style={{ width: '100%' }}
          />
        </Card>
      </div>

      <Card title="Operation Replay Timeline" >
        {entries.length === 0 ? (
          <p style={{ color: 'var(--rf-muted)' }}>No playback data</p>
        ) : (
          <PlaybackTimeline entries={entries} activeIndex={activeIndex} />
        )}
      </Card>
    </>
  );
}
