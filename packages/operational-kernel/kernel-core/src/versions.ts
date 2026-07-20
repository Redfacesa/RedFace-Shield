/** Engine semantic versions — Architecture v1.0 */

export const ARCHITECTURE_VERSION = '1.0.0' as const;
export const KERNEL_VERSION = '1.0.0' as const;

export const ENGINE_VERSIONS = {
  identity: '1.0.0',
  organization: '1.0.0',
  ownership: '1.0.0',
  capability: '1.0.0',
  trust: '1.0.0',
  attestation: '1.0.0',
  intent: '1.0.0',
  mission: '1.0.0',
  resource: '1.0.0',
  policy: '1.0.0',
  event: '1.0.0',
  history: '1.0.0',
  credential: '0.0.0',
  session: '0.0.0',
  intelligence: '0.0.0',
  economy: '0.0.0',
} as const;

export type EngineName = keyof typeof ENGINE_VERSIONS;
