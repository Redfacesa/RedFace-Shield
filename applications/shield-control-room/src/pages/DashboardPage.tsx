import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  LiveMap,
  ResourcePanel,
  ScanLine,
  StatTile,
  Timeline,
} from '@redface/ui';
import { type DashboardData, eventLabel, fetchDashboard, formatDecisionLatency, formatTime } from '../api';

function missionCounts(missions: DashboardData['missions']) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const critical = missions.filter(
    (m) => m.priority === 'critical' && ['planning', 'active', 'paused'].includes(m.state),
  ).length;
  const pending = missions.filter((m) => m.state === 'planning').length;
  const resolvedToday = missions.filter(
    (m) => m.state === 'completed' && new Date(m.updatedAt) >= today,
  ).length;
  const active = missions.filter((m) => ['planning', 'active', 'paused'].includes(m.state)).length;
  return { critical, pending, resolvedToday, active };
}

export function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboard()
      .then(setData)
      .catch((e) => setError(e instanceof Error ? e.message : 'Load failed'));
    const id = setInterval(() => fetchDashboard().then(setData).catch(() => {}), 15000);
    return () => clearInterval(id);
  }, []);

  const counts = useMemo(() => (data ? missionCounts(data.missions) : null), [data]);

  const coverage = useMemo(() => {
    if (!data?.resources.length) return 0;
    const located = data.resources.filter((r) => r.location?.lat && r.location?.lon).length;
    return Math.round((located / data.resources.length) * 100);
  }, [data]);

  if (error) {
    return (
      <div>
        <h2>Control Room Offline</h2>
        <p style={{ color: 'var(--rf-muted)' }}>{error}</p>
        <p>Start kernel API: <code>npm run kernel:dev</code> and seed data: <code>npm run mvp:hijacking</code></p>
      </div>
    );
  }

  if (!data || !counts) return <p style={{ color: 'var(--rf-muted)' }}>Loading operational picture…</p>;

  const resourceGroups = data.resources.reduce<Record<string, number>>((acc, r) => {
    acc[r.type] = (acc[r.type] ?? 0) + 1;
    return acc;
  }, {});

  const mapMarkers = data.resources
    .filter((r) => r.location?.lat && r.location?.lon)
    .slice(0, 24)
    .map((r) => ({
      id: r.id,
      label: r.id.split('/').pop() ?? r.type,
      lat: r.location!.lat,
      lon: r.location!.lon,
      color:
        r.type === 'guard' ? 'var(--rf-police)' :
        r.type === 'vehicle' ? 'var(--rf-emergency)' :
        r.type === 'camera' ? 'var(--rf-safe)' : 'var(--rf-warning)',
      live: r.state === 'allocated' || r.state === 'available',
      offline: r.state === 'unavailable',
    }));

  const feedEntries = data.recentEvents.slice(-8).reverse().flatMap((e) => {
    const mission = data.missions.find((m) => m.id === e.missionId);
    return [{
      time: formatTime(e.occurredAt),
      label: mission ? `${mission.title} — ${eventLabel(e.type)}` : eventLabel(e.type),
    }];
  });

  const resourcesOnline = data.resources.filter((r) => r.state !== 'unavailable').length;

  return (
    <>
      <div className="rf-header rf-animate-in">
        <div>
          <div style={{ fontSize: '0.7rem', letterSpacing: '0.14em', color: 'var(--rf-muted)' }}>OPERATIONS</div>
          <h1 style={{ fontSize: '1.5rem', marginTop: '0.25rem' }}>Control Room</h1>
        </div>
        <span className="rf-alert-banner" style={{ margin: 0, borderLeftColor: 'var(--rf-safe)' }}>
          <span style={{ color: 'var(--rf-safe)', fontWeight: 700 }}>● LIVE</span>
          <span style={{ color: 'var(--rf-muted)' }}>Kernel connected</span>
        </span>
      </div>

      <div className="rf-ops-grid-hero">
        <StatTile label="Active Missions" value={counts.active} variant="success" hero />
        <StatTile label="Critical" value={counts.critical} variant="critical" hero />
        <StatTile label="Pending" value={counts.pending} variant="warning" hero />
        <StatTile label="Resolved Today" value={counts.resolvedToday} variant="info" hero />
      </div>

      <div className="rf-ops-grid-metrics">
        <StatTile label="Decision Latency" value={formatDecisionLatency(data.stats.decisionLatencySeconds)} variant="info" />
        <StatTile label="Mission Coordination Index" value={`${data.stats.mciPercent}%`} variant="success" />
        <StatTile label="Resources Online" value={resourcesOnline} />
        <StatTile label="Coverage" value={`${coverage}%`} />
        <StatTile label="Alerts Today" value={data.stats.alertsToday} variant={data.stats.alertsToday > 0 ? 'warning' : 'neutral'} />
      </div>

      <div className="rf-grid-2" style={{ marginBottom: '1rem' }}>
        <Card title="Live Map">
          <LiveMap markers={mapMarkers} title="Operational area" tall />
        </Card>
        <Card title="Mission Feed">
          {data.missions.length === 0 ? (
            <p style={{ color: 'var(--rf-muted)' }}>No missions — run npm run mvp:hijacking</p>
          ) : (
            data.missions.slice(0, 5).map((m, i) => (
              <div key={m.id} style={{ animationDelay: `${i * 80}ms`, marginBottom: '0.5rem' }}>
                <ScanLine
                  severity={m.priority === 'critical' && m.state !== 'completed' ? 'critical' : m.state === 'completed' ? 'success' : 'info'}
                  title={m.title.length > 28 ? `${m.title.slice(0, 28)}…` : m.title.toUpperCase()}
                  segments={[m.state.replace('_', ' ').toUpperCase(), formatTime(m.updatedAt)]}
                  onClick={() => navigate(`/mission?uri=${encodeURIComponent(m.id)}`)}
                />
              </div>
            ))
          )}
        </Card>
      </div>

      <div className="rf-grid-2">
        <Card title="Recent Timeline">
          <Timeline entries={feedEntries.length ? feedEntries : [{ time: '—', label: 'Awaiting events' }]} operational />
        </Card>
        <Card title="Resources">
          <ResourcePanel groups={resourceGroups} />
        </Card>
      </div>
    </>
  );
}
