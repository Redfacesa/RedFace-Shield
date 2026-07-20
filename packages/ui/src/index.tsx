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

export function StatTile({
  label,
  value,
  highlight,
  variant,
  hero,
}: {
  label: string;
  value: string | number;
  highlight?: boolean;
  variant?: 'critical' | 'success' | 'warning' | 'info' | 'neutral';
  hero?: boolean;
}) {
  const variantClass = variant ? `rf-stat-${variant}` : highlight ? 'rf-stat-highlight' : '';
  return (
    <div className={`rf-stat ${hero ? 'rf-stat-hero' : ''} ${variantClass}`.trim()}>
      <div className="rf-stat-label">{label}</div>
      <div className="rf-stat-value">{value}</div>
    </div>
  );
}

export function StatusChip({ state }: { state: string }) {
  const cls = ['active', 'completed', 'planning', 'paused', 'critical'].includes(state) ? `rf-chip-${state}` : 'rf-chip-planning';
  return <span className={`rf-chip ${cls}`}>{state.replace('_', ' ')}</span>;
}

export function PriorityBadge({ priority }: { priority: string }) {
  const level = priority.toLowerCase();
  return (
    <div className={`rf-priority rf-priority-${level}`}>
      <span className="rf-priority-label">Priority</span>
      <span className="rf-priority-value">{priority}</span>
    </div>
  );
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

export function Timeline({ entries, operational }: { entries: TimelineEntry[]; operational?: boolean }) {
  return (
    <div className={operational ? 'rf-ops-timeline' : undefined}>
      {entries.map((entry, i) => (
        <div key={`${entry.time}-${i}`} className="rf-timeline-item rf-animate-in" style={{ animationDelay: `${i * 40}ms` }}>
          <div className="rf-timeline-time">{entry.time}</div>
          <div>{entry.label}</div>
        </div>
      ))}
    </div>
  );
}

export function ProgressBar({ value, label }: { value: number; label?: string }) {
  const pct = Math.min(100, Math.max(0, value));
  const complete = pct >= 100;
  return (
    <div className={`rf-progress ${complete ? 'rf-progress-complete' : ''}`}>
      <div className="rf-progress-label">
        <span>{label ?? 'Progress'}</span>
        <span>{pct}%</span>
      </div>
      <div className="rf-progress-track">
        <div className="rf-progress-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function MissionHeader({
  eyebrow,
  title,
  objective,
  priority,
  state,
  progress,
  actions,
}: {
  eyebrow?: string;
  title: string;
  objective?: string;
  priority?: string;
  state: string;
  progress?: number;
  actions?: ReactNode;
}) {
  return (
    <div className="rf-mission-header rf-animate-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          {eyebrow && (
            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--rf-accent)' }}>
              {eyebrow}
            </div>
          )}
          <h1 className="rf-mission-title">{title}</h1>
          {objective && <p className="rf-mission-objective">{objective}</p>}
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {priority && <PriorityBadge priority={priority} />}
          <StatusChip state={state} />
          {actions}
        </div>
      </div>
      {progress !== undefined && <ProgressBar value={progress} />}
    </div>
  );
}

export function ResourceList({ items }: { items: Array<{ label: string; role?: string }> }) {
  return (
    <div>
      {items.map((item) => (
        <div key={`${item.label}-${item.role}`} className="rf-resource-row">
          <span className="rf-resource-check">✓</span>
          <span>{item.label}</span>
          {item.role && <span style={{ color: 'var(--rf-muted)', marginLeft: 'auto' }}>{item.role}</span>}
        </div>
      ))}
    </div>
  );
}

export function PlaybackTimeline({ entries, activeIndex }: { entries: TimelineEntry[]; activeIndex: number }) {
  return (
    <div className="rf-replay">
      {entries.map((entry, i) => {
        const state = i < activeIndex ? 'done' : i === activeIndex ? 'active' : '';
        return (
          <div key={`${entry.time}-${i}`} className={`rf-replay-step ${state}`}>
            <div className="rf-replay-marker" />
            <div className="rf-replay-content">
              <div className="rf-replay-time">{entry.time}</div>
              <div className="rf-replay-label">{entry.label}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** Operator-facing alias */
export const ReplayTimeline = PlaybackTimeline;

export interface MapMarker {
  id: string;
  label: string;
  lat: number;
  lon: number;
  color: string;
  live?: boolean;
  offline?: boolean;
}

export function LiveMap({ markers, title, tall }: { markers: MapMarker[]; title?: string; tall?: boolean }) {
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
    <div className="rf-map" style={tall ? { minHeight: 420 } : undefined}>
      <div className="rf-map-grid" />
      {title && (
        <div style={{ position: 'absolute', top: 12, left: 12, fontSize: '0.75rem', color: 'var(--rf-muted)', textTransform: 'uppercase' }}>
          {title}
        </div>
      )}
      {markers.map((m, i) => {
        const pos = project(m.lat, m.lon);
        const cls = ['rf-map-marker', m.live ? 'rf-map-marker-live' : '', m.offline ? 'rf-map-marker-offline' : ''].filter(Boolean).join(' ');
        return (
          <div
            key={m.id}
            className={cls}
            style={{ ...pos, background: m.color, color: m.color, animationDelay: `${i * 60}ms` }}
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
      className="rf-card rf-mission-card"
      style={{ cursor: onClick ? 'pointer' : undefined, marginBottom: '0.75rem', animationDelay: '0ms' }}
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
