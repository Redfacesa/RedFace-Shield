import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, MissionCard, StatusChip } from '@redface/ui';
import { type MissionSummary, fetchDashboard, formatTime } from '../api';

type StateFilter = 'all' | 'active' | 'completed' | 'planning';

const ACTIVE_STATES = new Set(['planning', 'active', 'paused']);

export function MissionListPage() {
  const [missions, setMissions] = useState<MissionSummary[]>([]);
  const [query, setQuery] = useState('');
  const [stateFilter, setStateFilter] = useState<StateFilter>('all');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboard()
      .then((d) => setMissions(d.missions))
      .catch((e) => setError(e instanceof Error ? e.message : 'Load failed'));
    const id = setInterval(() => {
      fetchDashboard()
        .then((d) => setMissions(d.missions))
        .catch(() => {});
    }, 15000);
    return () => clearInterval(id);
  }, []);

  const filtered = useMemo(() => {
    return missions
      .filter((m) => {
        if (stateFilter === 'all') return true;
        if (stateFilter === 'active') return ACTIVE_STATES.has(m.state);
        if (stateFilter === 'completed') return m.state === 'completed';
        return m.state === stateFilter;
      })
      .filter((m) => {
        if (!query.trim()) return true;
        const q = query.toLowerCase();
        return m.title.toLowerCase().includes(q) || m.id.toLowerCase().includes(q) || m.type.includes(q);
      })
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [missions, query, stateFilter]);

  const counts = useMemo(() => ({
    all: missions.length,
    active: missions.filter((m) => ACTIVE_STATES.has(m.state)).length,
    completed: missions.filter((m) => m.state === 'completed').length,
    planning: missions.filter((m) => m.state === 'planning').length,
  }), [missions]);

  if (error) return <p>{error}</p>;

  return (
    <>
      <div className="rf-header">
        <h1>Mission Queue</h1>
        <span style={{ color: 'var(--rf-muted)' }}>{filtered.length} shown · {missions.length} total</span>
      </div>

      <Card title="Filters">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
          <input
            type="search"
            placeholder="Search missions…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: '1 1 240px',
              padding: '0.5rem 0.75rem',
              background: 'var(--rf-surface-2)',
              color: 'var(--rf-text)',
              border: '1px solid var(--rf-border)',
              borderRadius: 8,
            }}
          />
          {(['all', 'active', 'planning', 'completed'] as const).map((filter) => (
            <button
              key={filter}
              type="button"
              className={`rf-btn ${stateFilter === filter ? 'rf-btn-primary' : ''}`}
              onClick={() => setStateFilter(filter)}
            >
              {filter} ({counts[filter]})
            </button>
          ))}
        </div>
      </Card>

      <div style={{ marginTop: '1rem' }}>
        {filtered.length === 0 ? (
          <Card title="No missions">
            <p style={{ color: 'var(--rf-muted)', margin: 0 }}>Adjust filters or seed demo data with npm run mvp:hijacking</p>
          </Card>
        ) : (
          filtered.map((m) => (
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
      </div>

      <Card title="Queue Summary" >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.75rem' }}>
          {(['planning', 'active', 'paused', 'completed'] as const).map((state) => (
            <div key={state} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <StatusChip state={state} />
              <strong>{missions.filter((m) => m.state === state).length}</strong>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
