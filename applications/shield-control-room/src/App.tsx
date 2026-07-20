import { useEffect } from 'react';
import { Route, Routes, useLocation, useSearchParams } from 'react-router-dom';
import { ControlRoomLayout, NavLink } from '@redface/ui';
import { DashboardPage } from './pages/DashboardPage';
import { MissionListPage } from './pages/MissionListPage';
import { MissionPage } from './pages/MissionPage';
import { BriefPage } from './pages/BriefPage';
import { ReportPage } from './pages/ReportPage';
import { PlaybackPage } from './pages/PlaybackPage';
import { MapPage } from './pages/MapPage';
import { WallPage } from './pages/WallPage';

function ShellNav() {
  const { pathname } = useLocation();
  return (
    <>
      <NavLink to="/" active={pathname === '/'}>Dashboard</NavLink>
      <NavLink to="/missions" active={pathname === '/missions'}>Missions</NavLink>
      <NavLink to="/map" active={pathname === '/map'}>Live Map</NavLink>
      <NavLink to="/playback" active={pathname.startsWith('/playback')}>Operation Replay</NavLink>
      <NavLink to="/wall" active={pathname === '/wall'}>Operations Wall</NavLink>
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

function ControlRoomShell() {
  return (
    <ControlRoomLayout nav={<ShellNav />}>
      <TvDisplayMode />
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/missions" element={<MissionListPage />} />
        <Route path="/mission" element={<MissionPage />} />
        <Route path="/brief" element={<BriefPage />} />
        <Route path="/report" element={<ReportPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/playback" element={<PlaybackPage />} />
      </Routes>
    </ControlRoomLayout>
  );
}

export function App() {
  return (
    <Routes>
      <Route path="/wall" element={<WallPage />} />
      <Route path="/*" element={<ControlRoomShell />} />
    </Routes>
  );
}
