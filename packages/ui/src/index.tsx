import type { ReactNode } from 'react';

export function Card({ title, children, action }: { title?: string; children: ReactNode; action?: ReactNode }) {
  return (
    <div className="rf-card">
      {(title || action) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          {title && <h3 style={{ margin: 0, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--rf-muted)' }}>{title}</h3>}
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

export function StatTile({ label, value, highlight }: { label: string; value: string | number; highlight?: boolean }) {
  return (
    <div className="rf-stat" style={highlight ? { borderColor: 'var(--rf-accent)' } : undefined}>
      <div className="rf-stat-label">{label}</div>
      <div className="rf-stat-value" style={highlight ? { color: 'var(--rf-accent)' } : undefined}>{value}</div>
    </div>
  );
}

export function StatusChip({ state }: { state: string }) {
  const cls = ['active', 'completed', 'planning', 'paused'].includes(state) ? `rf-chip-${state}` : 'rf-chip-planning';
  return <span className={`rf-chip ${cls}`}>{state.replace('_', ' ')}</span>;
}

export function Button({ children, primary, onClick, type = 'button' }: { children: ReactNode; primary?: boolean; onClick?: () => void; type?: 'button' | 'submit' }) {
  return (
    <button type={type} className={`rf-btn ${primary ? 'rf-btn-primary' : ''}`} onClick={onClick}>
      {children}
    </button>
  );
}

export function ControlRoomLayout({ children, nav }: { children: ReactNode; nav: ReactNode }) {
  return (
    <div className="rf-layout">
      <aside className="rf-sidebar">
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--rf-accent)' }}>REDFACE</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--rf-muted)', letterSpacing: '0.08em' }}>SHIELD CONTROL ROOM</div>
        </div>
        {nav}
      </aside>
      <main className="rf-main">{children}</main>
    </div>
  );
}

export function NavLink({ to, active, children }: { to: string; active?: boolean; children: ReactNode }) {
  return (
    <a href={to} className={`rf-nav-link ${active ? 'active' : ''}`}>
      {children}
    </a>
  );
}

export interface TimelineEntry {
  time: string;
  label: string;
}

export function Timeline({ entries }: { entries: TimelineEntry[] }) {
  return (
    <div>
      {entries.map((entry, i) => (
        <div key={`${entry.time}-${i}`} className="rf-timeline-item">
          <div className="rf-timeline-time">{entry.time}</div>
          <div>{entry.label}</div>
        </div>
      ))}
    </div>
  );
}

export function PlaybackTimeline({ entries, activeIndex }: { entries: TimelineEntry[]; activeIndex: number }) {
  return (
    <div style={{ padding: '1rem 0' }}>
      {entries.map((entry, i) => {
        const state = i < activeIndex ? 'done' : i === activeIndex ? 'active' : '';
        return (
          <div key={`${entry.time}-${i}`} className={`rf-playback-step ${state}`}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ fontFamily: 'var(--rf-mono)', fontSize: '1.25rem', minWidth: '4rem' }}>{entry.time}</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>{entry.label}</div>
            </div>
            {i < entries.length - 1 && <div style={{ marginLeft: '2rem', color: 'var(--rf-muted)' }}>↓</div>}
          </div>
        );
      })}
    </div>
  );
}

export interface MapMarker {
  id: string;
  label: string;
  lat: number;
  lon: number;
  color: string;
}

export function LiveMap({ markers, title }: { markers: MapMarker[]; title?: string }) {
  const lats = markers.map((m) => m.lat);
  const lons = markers.map((m) => m.lon);
  const minLat = Math.min(...lats, -34);
  const maxLat = Math.max(...lats, -33.8);
  const minLon = Math.min(...lons, 18.3);
  const maxLon = Math.max(...lons, 18.5);

  const project = (lat: number, lon: number) => ({
    left: `${((lon - minLon) / (maxLon - minLon || 1)) * 85 + 7}%`,
    top: `${((maxLat - lat) / (maxLat - minLat || 1)) * 80 + 10}%`,
  });

  return (
    <div className="rf-map">
      <div className="rf-map-grid" />
      {title && (
        <div style={{ position: 'absolute', top: 12, left: 12, fontSize: '0.75rem', color: 'var(--rf-muted)', textTransform: 'uppercase' }}>
          {title}
        </div>
      )}
      {markers.map((m) => {
        const pos = project(m.lat, m.lon);
        return (
          <div
            key={m.id}
            className="rf-map-marker"
            style={{ ...pos, background: m.color, color: m.color }}
            title={m.label}
          />
        );
      })}
    </div>
  );
}

export function MissionCard({
  title,
  missionId,
  state,
  time,
  onClick,
}: {
  title: string;
  missionId: string;
  state: string;
  time: string;
  onClick?: () => void;
}) {
  return (
    <div
      className="rf-card"
      style={{ cursor: onClick ? 'pointer' : undefined, marginBottom: '0.75rem' }}
      onClick={onClick}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <div>
          <div style={{ fontFamily: 'var(--rf-mono)', fontSize: '0.75rem', color: 'var(--rf-muted)' }}>{time}</div>
          <div style={{ fontWeight: 700, marginTop: '0.25rem' }}>{title}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--rf-muted)', marginTop: '0.25rem' }}>{missionId}</div>
        </div>
        <StatusChip state={state} />
      </div>
    </div>
  );
}

export function ResourcePanel({ groups }: { groups: Record<string, number> }) {
  return (
    <div style={{ display: 'grid', gap: '0.5rem' }}>
      {Object.entries(groups).map(([type, count]) => (
        <div key={type} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--rf-border)' }}>
          <span style={{ textTransform: 'capitalize' }}>{type.replace('_', ' ')}</span>
          <strong>{count}</strong>
        </div>
      ))}
    </div>
  );
}
