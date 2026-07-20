import { useEffect } from 'react';
import { Route, Routes, useLocation, useSearchParams } from 'react-router-dom';
import { ControlRoomLayout, NavLink } from '@redface/ui';
import { DashboardPage } from './pages/DashboardPage';
import { MissionListPage } from './pages/MissionListPage';
import { MissionPage } from './pages/MissionPage';
import { PlaybackPage } from './pages/PlaybackPage';
import { MapPage } from './pages/MapPage';

function ShellNav() {
  const { pathname } = useLocation();
  return (
    <>
      <NavLink to="/" active={pathname === '/'}>Dashboard</NavLink>
      <NavLink to="/missions" active={pathname === '/missions'}>Missions</NavLink>
      <NavLink to="/map" active={pathname === '/map'}>Live Map</NavLink>
      <NavLink to="/playback" active={pathname.startsWith('/playback')}>Playback</NavLink>
    </>
  );
}

function TvDisplayMode() {
  const [params] = useSearchParams();
  useEffect(() => {
    const enabled = params.get('tv') === '1' || window.localStorage.getItem('rf-tv') === '1';
    document.documentElement.classList.toggle('rf-tv', enabled);
    if (params.get('tv') === '1') window.localStorage.setItem('rf-tv', '1');
  }, [params]);
  return null;
}

export function App() {
  return (
    <ControlRoomLayout nav={<ShellNav />}>
      <TvDisplayMode />
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/missions" element={<MissionListPage />} />
        <Route path="/mission" element={<MissionPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/playback" element={<PlaybackPage />} />
      </Routes>
    </ControlRoomLayout>
  );
}
