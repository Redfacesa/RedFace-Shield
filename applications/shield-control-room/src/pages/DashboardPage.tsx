import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  LiveMap,
  MissionCard,
  ResourcePanel,
  StatTile,
  Timeline,
} from '@redface/ui';
import { type DashboardData, eventLabel, fetchDashboard, formatDecisionLatency, formatTime } from '../api';

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

  if (error) {
    return (
      <div>
        <h2>Control Room Offline</h2>
        <p style={{ color: 'var(--rf-muted)' }}>{error}</p>
        <p>Start kernel API: <code>npm run kernel:dev</code> and seed data: <code>npm run mvp:hijacking</code></p>
      </div>
    );
  }

  if (!data) return <p style={{ color: 'var(--rf-muted)' }}>Loading operational picture…</p>;

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
      color: r.type === 'guard' ? '#3498db' : r.type === 'vehicle' ? '#e63946' : r.type === 'camera' ? '#2ecc71' : '#f1c40f',
    }));

  const feedEntries = data.recentEvents.slice(-8).reverse().flatMap((e) => {
    const mission = data.missions.find((m) => m.id === e.missionId);
    return [{
      time: formatTime(e.occurredAt),
      label: mission ? `${mission.title} — ${eventLabel(e.type)}` : eventLabel(e.type),
    }];
  });

  return (
    <>
      <div className="rf-header">
        <h1>REDFACE SHIELD CONTROL ROOM</h1>
        <span style={{ color: 'var(--rf-muted)', fontSize: '0.875rem' }}>Live · Kernel API</span>
      </div>

      <div className="rf-grid-stats" style={{ marginBottom: '1.5rem' }}>
        <StatTile label="Active Missions" value={data.stats.activeMissions} highlight />
        <StatTile label="Available Guards" value={data.stats.availableGuards} />
        <StatTile label="Vehicles" value={data.stats.vehicles} />
        <StatTile label="Cameras Online" value={data.stats.camerasOnline} />
        <StatTile label="Alerts Today" value={data.stats.alertsToday} />
        <StatTile label="MCI" value={`${data.stats.mciPercent}%`} highlight />
        <StatTile label="Decision Latency" value={formatDecisionLatency(data.stats.decisionLatencySeconds)} highlight />
      </div>

      <div className="rf-grid-2" style={{ marginBottom: '1rem' }}>
        <Card title="Live Map">
          <LiveMap markers={mapMarkers} title="Operational area" />
        </Card>
        <Card title="Mission Feed">
          {data.missions.length === 0 ? (
            <p style={{ color: 'var(--rf-muted)' }}>No missions — run npm run mvp:hijacking</p>
          ) : (
            data.missions.slice(0, 5).map((m) => (
              <MissionCard
                key={m.id}
                title={m.title}
                missionId={m.id}
                state={m.state}
                time={formatTime(m.updatedAt)}
                onClick={() => navigate(`/mission?uri=${encodeURIComponent(m.id)}`)}
              />
            ))
          )}
        </Card>
      </div>

      <div className="rf-grid-2">
        <Card title="Recent Timeline">
          <Timeline entries={feedEntries.length ? feedEntries : [{ time: '—', label: 'Awaiting events' }]} />
        </Card>
        <Card title="Resources">
          <ResourcePanel groups={resourceGroups} />
        </Card>
      </div>
    </>
  );
}
