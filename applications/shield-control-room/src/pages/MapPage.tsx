import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, LiveMap, MissionCard } from '@redface/ui';
import { type DashboardData, fetchDashboard, formatTime } from '../api';

export function MapPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboard().then(setData).catch(() => {});
    const id = setInterval(() => fetchDashboard().then(setData).catch(() => {}), 10000);
    return () => clearInterval(id);
  }, []);

  if (!data) return <p style={{ color: 'var(--rf-muted)' }}>Loading map…</p>;

  const markers = data.resources
    .filter((r) => r.location?.lat && r.location?.lon)
    .map((r) => ({
      id: r.id,
      label: `${r.type}: ${r.id.split('/').pop()}`,
      lat: r.location!.lat,
      lon: r.location!.lon,
      color:
        r.state === 'allocated' ? '#e63946' :
        r.type === 'guard' ? '#3498db' :
        r.type === 'camera' ? '#2ecc71' : '#f1c40f',
    }));

  const activeMissions = data.missions.filter((m) => m.state === 'active' || m.state === 'planning');

  return (
    <>
      <div className="rf-header">
        <h1>Live Operational Map</h1>
        <span style={{ color: 'var(--rf-muted)' }}>{markers.length} assets · {activeMissions.length} active missions</span>
      </div>

      <Card title="Mission Control View">
        <LiveMap markers={markers} title="Guards · Vehicles · Cameras · Missions" />
      </Card>

      <div style={{ marginTop: '1rem' }}>
        <h3 style={{ fontSize: '0.9rem', color: 'var(--rf-muted)', textTransform: 'uppercase' }}>Active Missions</h3>
        {activeMissions.map((m) => (
          <MissionCard
            key={m.id}
            title={m.title}
            missionId={m.id}
            state={m.state}
            time={formatTime(m.updatedAt)}
            onClick={() => navigate(`/mission?uri=${encodeURIComponent(m.id)}`)}
          />
        ))}
      </div>
    </>
  );
}
