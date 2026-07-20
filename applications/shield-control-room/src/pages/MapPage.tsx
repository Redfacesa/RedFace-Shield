import { useEffect, useMemo, useState } from 'react';
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

  const markers = useMemo(() => {
    if (!data) return [];
    return data.resources
      .filter((r) => r.location?.lat && r.location?.lon)
      .map((r) => ({
        id: r.id,
        label: `${r.type}: ${r.id.split('/').pop()}`,
        lat: r.location!.lat,
        lon: r.location!.lon,
        color:
          r.state === 'allocated' ? 'var(--rf-emergency)' :
          r.type === 'guard' ? 'var(--rf-police)' :
          r.type === 'camera' ? 'var(--rf-safe)' : 'var(--rf-warning)',
        live: r.state === 'allocated' || r.type === 'vehicle',
        offline: r.state === 'unavailable',
      }));
  }, [data]);

  if (!data) return <p style={{ color: 'var(--rf-muted)' }}>Loading map…</p>;

  const activeMissions = data.missions.filter((m) => m.state === 'active' || m.state === 'planning');

  return (
    <>
      <div className="rf-header rf-animate-in">
        <div>
          <div style={{ fontSize: '0.7rem', letterSpacing: '0.14em', color: 'var(--rf-muted)' }}>OPERATIONS</div>
          <h1 style={{ fontSize: '1.5rem', marginTop: '0.25rem' }}>Live Operational Map</h1>
        </div>
        <span style={{ color: 'var(--rf-muted)', fontSize: '1rem' }}>
          {markers.length} assets · {activeMissions.length} active
        </span>
      </div>

      <Card title="Mission Control View">
        <LiveMap markers={markers} title="Guards · Vehicles · Cameras · Missions" tall />
      </Card>

      <div style={{ marginTop: '1.25rem' }}>
        <h3 style={{ fontSize: '0.85rem', color: 'var(--rf-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Active Missions
        </h3>
        {activeMissions.map((m, i) => (
          <div key={m.id} style={{ animationDelay: `${i * 60}ms` }}>
            <MissionCard
              title={m.title}
              missionId={m.id}
              state={m.state}
              time={formatTime(m.updatedAt)}
              onClick={() => navigate(`/mission?uri=${encodeURIComponent(m.id)}`)}
            />
          </div>
        ))}
      </div>
    </>
  );
}
