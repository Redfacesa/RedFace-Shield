import {
  ARCHITECTURE_VERSION,
  ENGINE_VERSIONS,
  KERNEL_VERSION,
  type OperationalKernel,
} from '@redface/kernel-core';

const RSP_VERSION = '1.0.0';
const startedAt = Date.now();

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  version: string;
  kernel: string;
  engines: typeof ENGINE_VERSIONS;
  database: 'healthy' | 'unhealthy';
  redis: 'healthy' | 'not_configured';
  rsp: string;
  uptime: number;
  build: string;
}

export async function getHealthStatus(kernel: OperationalKernel): Promise<HealthStatus> {
  let database: HealthStatus['database'] = 'healthy';
  try {
    await kernel.ping();
  } catch {
    database = 'unhealthy';
  }

  const status: HealthStatus['status'] = database === 'healthy' ? 'healthy' : 'degraded';

  return {
    status,
    version: ARCHITECTURE_VERSION,
    kernel: KERNEL_VERSION,
    engines: ENGINE_VERSIONS,
    database,
    redis: 'not_configured',
    rsp: RSP_VERSION,
    uptime: Math.floor((Date.now() - startedAt) / 1000),
    build: process.env.BUILD_TIME ?? new Date(startedAt).toISOString(),
  };
}
