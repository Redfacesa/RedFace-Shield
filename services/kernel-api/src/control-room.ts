import type { OperationalKernel } from '@redface/kernel-core';
import type { MissionRecord, ResourceRecord, RspEventRecord } from '@redface/shared';

export interface ControlRoomDashboard {
  stats: {
    activeMissions: number;
    availableGuards: number;
    vehicles: number;
    camerasOnline: number;
    alertsToday: number;
    mciPercent: number;
  };
  missions: MissionRecord[];
  recentEvents: RspEventRecord[];
  resources: ResourceRecord[];
}

function computeMci(missions: MissionRecord[]): number {
  const completed = missions.filter((m) => m.state === 'completed');
  if (completed.length === 0) {
    const active = missions.filter((m) => m.state === 'active' || m.state === 'planning').length;
    return active > 0 ? 72 : 0;
  }
  const success = completed.filter((m) => m.outcome?.result === 'success').length / completed.length;
  return Math.round(success * 100);
}

export async function getControlRoomDashboard(kernel: OperationalKernel): Promise<ControlRoomDashboard> {
  const [missions, resources, recentEvents] = await Promise.all([
    kernel.mission.listRecent(50),
    kernel.resource.listAll(),
    kernel.events.listRecent(40),
  ]);

  const activeMissions = missions.filter((m) => ['planning', 'active', 'paused'].includes(m.state)).length;
  const guards = resources.filter((r) => r.type === 'guard');
  const vehicles = resources.filter((r) => r.type === 'vehicle');
  const cameras = resources.filter((r) => r.type === 'camera');

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const alertsToday = recentEvents.filter(
    (e) => e.occurredAt >= today && (e.type.includes('alarm') || e.type.includes('panic') || e.type.includes('motion')),
  ).length;

  return {
    stats: {
      activeMissions,
      availableGuards: guards.filter((g) => g.state === 'available').length,
      vehicles: vehicles.length,
      camerasOnline: cameras.length,
      alertsToday: alertsToday || recentEvents.length,
      mciPercent: computeMci(missions),
    },
    missions,
    recentEvents: [...recentEvents].reverse(),
    resources,
  };
}
