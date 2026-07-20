import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { OperationalKernel } from '@redface/kernel-core';
import { getControlRoomDashboard } from './control-room.js';
import { getHealthStatus, type HealthStatus } from './health.js';
import { formatDecisionLatency } from './metrics.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

interface CompanyState {
  odrLevel: number;
  odrLabel: string;
  deployments: Array<{
    id: string;
    customer: string;
    status: string;
    start: string | null;
    missions: number;
  }>;
  openLearningTickets: number;
  activeHypotheses: number;
  engineeringFocus: string[];
  instrumentationPending: string[];
}

function loadCompanyState(): CompanyState {
  const raw = readFileSync(join(__dirname, '../data/company-state.json'), 'utf8');
  return JSON.parse(raw) as CompanyState;
}

export interface MissionIntelSummary {
  generatedAt: string;
  odrLevel: number;
  odrLabel: string;
  health: HealthStatus;
  operations: {
    missionsInKernel: number;
    activeMissions: number;
    mciPercent: number;
    decisionLatencySeconds: number | null;
    decisionLatencyLabel: string;
  };
  deployments: CompanyState['deployments'];
  learning: {
    openLearningTickets: number;
    activeHypotheses: number;
    engineeringFocus: string[];
    instrumentationPending: string[];
  };
  questions: {
    deploymentsHealthy: { answer: string; detail: string };
    operatorsSucceeding: { answer: string; detail: string };
    whatWeAreLearning: { answer: string; detail: string };
    engineeringFocusNext: { answer: string; detail: string };
  };
}

export async function getMissionIntelSummary(kernel: OperationalKernel): Promise<MissionIntelSummary> {
  const [health, dashboard, company] = await Promise.all([
    getHealthStatus(kernel),
    getControlRoomDashboard(kernel),
    Promise.resolve(loadCompanyState()),
  ]);

  const deploymentsHealthy =
    health.status === 'healthy' && health.database === 'healthy'
      ? 'Yes — kernel and database healthy'
      : health.status === 'degraded'
        ? 'Degraded — check database'
        : 'No — service unhealthy';

  const operatorsSucceeding =
    dashboard.stats.mciPercent >= 80
      ? `Strong demo metrics (MCI ${dashboard.stats.mciPercent}%)`
      : dashboard.missions.length > 0
        ? `Demo data only — awaiting DEP-001 real operators`
        : 'No mission data — seed or deploy';

  return {
    generatedAt: new Date().toISOString(),
    odrLevel: company.odrLevel,
    odrLabel: company.odrLabel,
    health,
    operations: {
      missionsInKernel: dashboard.missions.length,
      activeMissions: dashboard.stats.activeMissions,
      mciPercent: dashboard.stats.mciPercent,
      decisionLatencySeconds: dashboard.stats.decisionLatencySeconds,
      decisionLatencyLabel: formatDecisionLatency(dashboard.stats.decisionLatencySeconds),
    },
    deployments: company.deployments,
    learning: {
      openLearningTickets: company.openLearningTickets,
      activeHypotheses: company.activeHypotheses,
      engineeringFocus: company.engineeringFocus,
      instrumentationPending: company.instrumentationPending,
    },
    questions: {
      deploymentsHealthy: {
        answer: health.status === 'healthy' ? 'Healthy' : health.status,
        detail: `${deploymentsHealthy}. ${company.deployments.filter((d) => d.status === 'active').length} active deployment(s).`,
      },
      operatorsSucceeding: {
        answer: dashboard.stats.mciPercent >= 80 ? 'Demo succeeding' : 'Awaiting reference deployment',
        detail: `${operatorsSucceeding}. Decision Latency: ${formatDecisionLatency(dashboard.stats.decisionLatencySeconds)}.`,
      },
      whatWeAreLearning: {
        answer: `${company.openLearningTickets} open learning ticket(s)`,
        detail: 'See docs/operations/LEARNING-TICKET-TEMPLATE.md and WEEKLY-MISSION-REVIEW.md. First ticket: LT-001 (Wall allocation visibility).',
      },
      engineeringFocusNext: {
        answer: company.engineeringFocus[0] ?? 'Reference deployment',
        detail: company.engineeringFocus.join(' · '),
      },
    },
  };
}
