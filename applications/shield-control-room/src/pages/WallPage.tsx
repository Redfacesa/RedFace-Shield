import { useEffect, useMemo, useState } from 'react';
import { LiveMap, PlaybackTimeline, StatTile } from '@redface/ui';
import { type DashboardData, eventLabel, fetchDashboard, fetchMission, formatTime } from '../api';

type WallPanel = 'overview' | 'playback';

export function WallPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [panel, setPanel] = useState<WallPanel>('overview');
  const [playbackEntries, setPlaybackEntries] = useState<Array<{ time: string; label: string }>>([]);
  const [playbackIndex, setPlaybackIndex] = useState(0);
  const [clock, setClock] = useState(new Date());

  useEffect(() => {
    document.documentElement.classList.add('rf-tv', 'rf-wall-mode');
    return () => {
      document.documentElement.classList.remove('rf-tv', 'rf-wall-mode');
    };
  }, []);

  useEffect(() => {
    const load = () => fetchDashboard().then(setData).catch(() => {});
    load();
    const poll = setInterval(load, 5000);
    const tick = setInterval(() => setClock(new Date()), 1000);
    const rotate = setInterval(() => setPanel((p) => (p === 'overview' ? 'playback' : 'overview')), 30000);
    return () => {
      clearInterval(poll);
      clearInterval(tick);
      clearInterval(rotate);
    };
  }, []);

  const featuredMission = data?.missions[0];

  useEffect(() => {
    if (!featuredMission) return;
    fetchMission(featuredMission.id, true).then((d) => {
      setPlaybackEntries(d.playback?.entries ?? []);
      setPlaybackIndex(0);
    });
  }, [featuredMission?.id]);

  useEffect(() => {
    if (panel !== 'playback' || playbackEntries.length === 0) return;
    const t = setInterval(() => {
      setPlaybackIndex((i) => (i >= playbackEntries.length - 1 ? 0 : i + 1));
    }, 1500);
    return () => clearInterval(t);
  }, [panel, playbackEntries.length]);

  const mapMarkers = useMemo(() => {
    if (!data) return [];
    return data.resources
      .filter((r) => r.location?.lat && r.location?.lon)
      .map((r) => ({
        id: r.id,
        label: r.id.split('/').pop() ?? r.type,
        lat: r.location!.lat,
        lon: r.location!.lon,
        color:
          r.state === 'allocated' ? '#e63946' :
          r.type === 'guard' ? '#3498db' :
          r.type === 'camera' ? '#2ecc71' : '#f1c40f',
      }));
  }, [data]);

  const alerts = data?.recentEvents.slice(-6).reverse() ?? [];
  const activeMissions = data?.missions.filter((m) => ['planning', 'active', 'paused'].includes(m.state)) ?? [];

  if (!data) {
    return (
      <div className="rf-wall">
        <div className="rf-wall-loading">Connecting to operational kernel…</div>
      </div>
    );
  }

  return (
    <div className="rf-wall">
      <header className="rf-wall-header">
        <div>
          <div className="rf-wall-brand">REDFACE SHIELD</div>
          <div className="rf-wall-subtitle">OPERATIONS WALL</div>
        </div>
        <div className="rf-wall-status">
          <span className="rf-wall-live">● LIVE</span>
          <span>{clock.toLocaleTimeString('en-GB')}</span>
        </div>
      </header>

      <div className="rf-grid-stats rf-wall-stats">
        <StatTile label="Active Missions" value={data.stats.activeMissions} highlight />
        <StatTile label="Guards Available" value={data.stats.availableGuards} />
        <StatTile label="Vehicles" value={data.stats.vehicles} />
        <StatTile label="Cameras" value={data.stats.camerasOnline} />
        <StatTile label="Alerts Today" value={data.stats.alertsToday} />
        <StatTile label="MCI" value={`${data.stats.mciPercent}%`} highlight />
      </div>

      {panel === 'overview' ? (
        <div className="rf-wall-grid">
          <section className="rf-wall-panel">
            <h2>Live Map</h2>
            <LiveMap markers={mapMarkers} title="Operational area" />
          </section>
          <section className="rf-wall-panel">
            <h2>Active Missions</h2>
            {activeMissions.length === 0 ? (
              <p className="rf-wall-muted">No active missions — latest completed shown below</p>
            ) : (
              activeMissions.map((m) => (
                <div key={m.id} className="rf-wall-mission-row">
                  <strong>{m.title}</strong>
                  <span className={`rf-wall-state rf-wall-state-${m.state}`}>{m.state}</span>
                </div>
              ))
            )}
            {data.missions.slice(0, 3).map((m) => (
              <div key={m.id} className="rf-wall-mission-row">
                <span className="rf-wall-muted">{formatTime(m.updatedAt)}</span>
                <strong>{m.title}</strong>
                <span className={`rf-wall-state rf-wall-state-${m.state}`}>{m.state}</span>
              </div>
            ))}
          </section>
          <section className="rf-wall-panel">
            <h2>Alerts & Events</h2>
            {alerts.map((e) => (
              <div key={e.id} className="rf-wall-alert">
                <span className="rf-wall-muted">{formatTime(e.occurredAt)}</span>
                <span>{eventLabel(e.type)}</span>
              </div>
            ))}
          </section>
          <section className="rf-wall-panel">
            <h2>Resources</h2>
            {Object.entries(
              data.resources.reduce<Record<string, number>>((acc, r) => {
                acc[r.type] = (acc[r.type] ?? 0) + 1;
                return acc;
              }, {}),
            ).map(([type, count]) => (
              <div key={type} className="rf-wall-resource-row">
                <span style={{ textTransform: 'capitalize' }}>{type.replace('_', ' ')}</span>
                <strong>{count}</strong>
              </div>
            ))}
          </section>
        </div>
      ) : (
        <section className="rf-wall-panel rf-wall-playback-panel">
          <h2>Live Playback — {featuredMission?.title ?? 'Mission'}</h2>
          {playbackEntries.length === 0 ? (
            <p className="rf-wall-muted">Loading playback…</p>
          ) : (
            <PlaybackTimeline entries={playbackEntries} activeIndex={playbackIndex} />
          )}
        </section>
      )}
    </div>
  );
}
