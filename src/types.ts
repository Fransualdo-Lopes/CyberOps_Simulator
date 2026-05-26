export type TierType = 'Suporte N1' | 'Analista NOC/SOC N2' | 'Engenheiro de Backbone' | 'Arquiteto de Infraestrutura Crítica';

export interface UserProfile {
  username: string;
  level: number;
  xp: number;
  xpNeeded: number;
  cyberCredits: number;
  currentTier: TierType;
  resolvedChallenges: string[]; // list of challenge IDs
}

export type NodeStatus = 'healthy' | 'warning' | 'down' | 'compromised';

export interface NetworkNode {
  id: string;
  label: string;
  type: 'router' | 'switch' | 'server' | 'firewall' | 'database' | 'internet';
  status: NodeStatus;
  x: number;
  y: number;
  description: string;
  ip?: string;
}

export interface NetworkLink {
  from: string;
  to: string;
  status: 'normal' | 'saturated' | 'offline';
  bandwidthMbps: number;
}

export interface IncidentAlert {
  id: string;
  severity: 'critical' | 'medium' | 'low';
  title: string;
  description: string;
  source: string;
  timestamp: string;
  status: 'active' | 'mitigated' | 'resolved';
}

export interface Challenge {
  id: string;
  title: string;
  tier: TierType;
  xpReward: number;
  creditsReward: number;
  description: string;
  context: string;
  deviceContext: string; // which node the terminal initially connects to
  targetUptime: number; // target uptime to complete
  initialLogs: string[];
  correctCommands: string[]; // sequence or list of commands triggers to solve
  hints: string[];
  initialNodes: NetworkNode[];
  initialLinks: NetworkLink[];
  initialAlerts: IncidentAlert[];
}

export interface TerminalLog {
  text: string;
  type: 'input' | 'output' | 'error' | 'success' | 'system';
}

export interface SkillNode {
  id: string;
  name: string;
  description: string;
  cost: number;
  unlocked: boolean;
  dependsOn?: string;
  icon: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  iconName: string;
}

export interface RecruiterJob {
  id: string;
  companyName: string;
  roleName: string;
  salaryRange: string;
  model: 'Remoto' | 'Híbrido' | 'Presencial';
  requirements: {
    minLevel: number;
    requiredSkills: string[];
    minMttrMinutes: number;
  };
  description: string;
  applied: boolean;
}
