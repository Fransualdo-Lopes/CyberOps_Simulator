import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Terminal as TerminalIcon,
  ShieldAlert,
  Cpu,
  Award,
  Briefcase,
  Layers,
  BookOpen,
  Share2,
  Users,
  CheckCircle,
  HelpCircle,
  Clock,
  LogOut,
  User,
  Star,
  Info,
  Activity,
  Check,
  Square,
  Eye,
  EyeOff
} from 'lucide-react';
import { CHALLENGES, SKILL_TREE, INITIAL_ACHIEVEMENTS, INITIAL_RECRUITERS } from './data/challenges';
import { Challenge, NetworkNode, NetworkLink, IncidentAlert, TerminalLog, UserProfile, SkillNode, Achievement, RecruiterJob } from './types';
import NetworkMap from './components/NetworkMap';
import { getInitialBasicsFS, getInitialSocFS, VirtualFileSystemNode } from './data/virtualFs';
import { executeLinuxCommand, executeBgpCommand } from './utils/terminalEmulator';
import Terminal from './components/Terminal';
import Dashboard from './components/Dashboard';
import MentorIA from './components/MentorIA';
import CareerMode from './components/CareerMode';
import Sidebar, { MenuSection } from './components/Sidebar';
import ExtraViews from './components/ExtraViews';

export default function App() {
  // Current active menu section and game difficulty mode
  const [currentSection, setCurrentSection] = useState<MenuSection>('inicio');
  const [gameMode, setGameMode] = useState<string>('iniciante');

  // SLA Pressure timers
  const [slaCountdown, setSlaCountdown] = useState<number>(900); // 15 mins in seconds
  const [financialLoss, setFinancialLoss] = useState<number>(0);

  // Current active view: 'ops' (NOC/SOC monitor), 'career' (Skills & Jobs), 'about' (Manual)
  const [activeTab, setActiveTab] = useState<'ops' | 'career' | 'about'>('ops');

  // Gamified User Profile
  const [profile, setProfile] = useState<UserProfile>({
    username: 'Recrita Ops',
    level: 1,
    xp: 150,
    xpNeeded: 1000,
    cyberCredits: 250,
    currentTier: 'Suporte N1',
    resolvedChallenges: []
  });

  // Active Challenge Selection
  const [currentChallenge, setCurrentChallenge] = useState<Challenge>({ ...CHALLENGES[0] });

  // Stateful copy of nodes, links and alerts for the active challenge
  const [nodes, setNodes] = useState<NetworkNode[]>([...CHALLENGES[0].initialNodes]);
  const [links, setLinks] = useState<NetworkLink[]>([...CHALLENGES[0].initialLinks]);
  const [alerts, setAlerts] = useState<IncidentAlert[]>([...CHALLENGES[0].initialAlerts]);
  const [terminalLogs, setTerminalLogs] = useState<TerminalLog[]>([
    { text: 'SISTEMA OPERACIONAL INICIALIZADO', type: 'system' },
    ...CHALLENGES[0].initialLogs.map(t => ({ text: t, type: 'output' } as TerminalLog))
  ]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [deviceContext, setDeviceContext] = useState<string>(CHALLENGES[0].deviceContext);

  // Skill Tree, Achievements, Recruiters
  const [skills, setSkills] = useState<SkillNode[]>([...SKILL_TREE]);
  const [achievements, setAchievements] = useState<Achievement[]>([...INITIAL_ACHIEVEMENTS]);
  const [jobs, setJobs] = useState<RecruiterJob[]>([...INITIAL_RECRUITERS]);
  const [recruiterInbox, setRecruiterInbox] = useState<string>(
    'Complete laboratórios e desbloqueie competências na aba Árvore de Skills para receber feedback de entrevistas de emprego simulados!'
  );

  // Navigation Node Selected State
  const [selectedNodeId, setSelectedNodeId] = useState<string>(CHALLENGES[0].deviceContext);

  // Victory celebration state
  const [showVictoryModal, setShowVictoryModal] = useState(false);
  const [victoryChallengeTitle, setVictoryChallengeTitle] = useState('');

  // Simulated metrics over time
  const [simulatedMetrics, setSimulatedMetrics] = useState<{ name: string; tráfego: number; cpu: number; alertas: number }[]>(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      name: `${i * 5}s`,
      tráfego: 300 + Math.random() * 120,
      cpu: 45 + Math.random() * 15,
      alertas: 2
    }));
  });
  const [simulatedUptime, setSimulatedUptime] = useState(CHALLENGES[0].targetUptime);

  // Track SOC Ransomware intermediate state
  const [socState, setSocState] = useState({
    killedMalware: false,
    deletedWebshell: false,
    fixedPermissions: false
  });

  // Track BGP Hijacking intermediate config states
  const [bgpState, setBgpState] = useState({
    createdRouteMap: false,
    matchedPrefixList: false,
    enteredRouterBgp: false,
    configuredNeighbor: false
  });

  // Interactive Terminal Emulator states
  const [showNetworkMap, setShowNetworkMap] = useState<boolean>(false);
  const [terminalCurrentDir, setTerminalCurrentDir] = useState<string>('/home/user');
  const [terminalFileSystem, setTerminalFileSystem] = useState<Record<string, VirtualFileSystemNode>>(() => getInitialBasicsFS());
  const [hasExecutedDiscovery, setHasExecutedDiscovery] = useState<boolean>(false);
  const [hasExecutedBgpSummary, setHasExecutedBgpSummary] = useState<boolean>(false);
  const [showChecklist, setShowChecklist] = useState<boolean>(true);

  // Handle active challenge change
  const selectChallenge = (chall: Challenge) => {
    setCurrentChallenge({ ...chall });
    setNodes([...chall.initialNodes]);
    setLinks([...chall.initialLinks]);
    setAlerts([...chall.initialAlerts]);
    setTerminalLogs([
      { text: `[CONECTADO NO EQUIPAMENTO: ${chall.deviceContext}]`, type: 'system' },
      ...chall.initialLogs.map(t => ({ text: t, type: 'output' } as TerminalLog))
    ]);
    setCommandHistory([]);
    setDeviceContext(chall.deviceContext);
    setSelectedNodeId(chall.deviceContext);
    setSimulatedUptime(chall.targetUptime);
    
    // Initialize corresponding filesystems and dirs
    if (chall.id === 'linux-basics') {
      setTerminalCurrentDir('/home/user');
      setTerminalFileSystem(getInitialBasicsFS());
    } else if (chall.id === 'soc-ransomware') {
      setTerminalCurrentDir('/var/www/html');
      setTerminalFileSystem(getInitialSocFS());
    } else {
      setTerminalCurrentDir('/');
      setTerminalFileSystem({});
    }

    setSocState({ killedMalware: false, deletedWebshell: false, fixedPermissions: false });
    setBgpState({ createdRouteMap: false, matchedPrefixList: false, enteredRouterBgp: false, configuredNeighbor: false });
    setHasExecutedDiscovery(false);
    setHasExecutedBgpSummary(false);
  };

  // Ticker of live real-time network flow statistics
  useEffect(() => {
    const handle = setInterval(() => {
      const activeAlerts = alerts.filter(a => a.status === 'active');
      const hasCritical = activeAlerts.some(a => a.severity === 'critical');
      const hasMedium = activeAlerts.some(a => a.severity === 'medium');

      // Degrade simulated uptime if there are active incidents
      setSimulatedUptime(prev => {
        if (activeAlerts.length > 0) {
          const degradation = hasCritical ? 0.08 : (hasMedium ? 0.03 : 0.01);
          return Math.max(78.5, prev - degradation);
        } else {
          // Recover values up to target
          return Math.min(100.0, prev + 0.04);
        }
      });

      // Update plotting lists
      setSimulatedMetrics(prev => {
        const nextList = [...prev.slice(1)];
        const lastSec = parseInt(prev[prev.length - 1].name) + 5;

        // Peak or cool down metrics based on alerts
        let cpuTarget = 20 + Math.random() * 10;
        let trafficTarget = 250 + Math.random() * 80;

        if (activeAlerts.length > 0) {
          if (currentChallenge.id === 'soc-ransomware' && !socState.killedMalware) {
            cpuTarget = 88 + Math.random() * 10; // Ransomware eats CPU!
          } else {
            cpuTarget = 65 + Math.random() * 15;
          }
          trafficTarget = 550 + Math.random() * 200; // congestion/attack flooding
        }

        nextList.push({
          name: `${lastSec}s`,
          tráfego: Math.round(trafficTarget),
          cpu: Math.round(cpuTarget),
          alertas: activeAlerts.length
        });
        return nextList;
      });
    }, 2500);

    return () => clearInterval(handle);
  }, [alerts, currentChallenge, socState]);

  // SLA Pressure Timer and Financial Tracker
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (alerts.some(a => a.status === 'active') && (gameMode === 'avancado' || gameMode === 'hardcore' || gameMode === 'realista')) {
      interval = setInterval(() => {
        setSlaCountdown(prev => Math.max(0, prev - 1));
        setFinancialLoss(prev => prev + (gameMode === 'realista' ? 0.75 : (gameMode === 'hardcore' ? 1.50 : 0.45)));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [alerts, gameMode]);

  // Terminal command executor engine
  const executeCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    // Command History listing
    setCommandHistory(prev => [...prev, trimmed]);

    const lower = trimmed.toLowerCase();
    const cmdBase = trimmed.split(/\s+/)[0].toLowerCase();

    if (cmdBase === 'clear') {
      setTerminalLogs([]);
      return;
    }

    // Prepare prompt prefix log for input reflection
    const promptChar = currentChallenge.id === 'bgp-hijacking' ? '#' : '$';
    
    // For servers Linux prompt representation
    let promptPrefix = `${deviceContext}${promptChar} `;
    if (currentChallenge.id !== 'bgp-hijacking') {
      const isSoc = currentChallenge.id === 'soc-ransomware';
      const host = isSoc ? 'servidor-http' : 'servidor-auth';
      const user = isSoc ? 'apache' : 'root';
      const homeDir = isSoc ? '/var/www' : '/home/user';
      const promptCharL = user === 'root' ? '#' : '$';
      let dirDisplay = terminalCurrentDir;
      if (terminalCurrentDir === homeDir) {
        dirDisplay = '~';
      } else if (terminalCurrentDir === '/root' && user === 'root') {
        dirDisplay = '~';
      }
      promptPrefix = `${user}@${host}:${dirDisplay}${promptCharL} `;
    }

    const inputLog: TerminalLog = { text: `${promptPrefix}${trimmed}`, type: 'input' };

    // Validar ordem operacional lógica (Descoberta antes de Ação Corretiva/Modificação)
    const parts = trimmed.split(/\s+/);
    const showArg = parts.slice(1).join(' ').toLowerCase();

    let isDiscovery = false;
    if (currentChallenge.id === 'linux-basics' && cmdBase === 'ls') {
      isDiscovery = true;
    } else if (currentChallenge.id === 'soc-ransomware' && (cmdBase === 'ps' || cmdBase === 'lsof' || lower.includes('ps ') || lower.includes('lsof '))) {
      isDiscovery = true;
    } else if (currentChallenge.id === 'bgp-hijacking' && (cmdBase === 'show' || cmdBase === 'sh' || cmdBase === 'ping' || lower.startsWith('ping '))) {
      isDiscovery = true;
    }

    if (isDiscovery) {
      setHasExecutedDiscovery(true);
    }

    if (currentChallenge.id === 'bgp-hijacking') {
      if ((cmdBase === 'show' || cmdBase === 'sh') && (showArg === 'ip bgp summary' || showArg === 'ip bgp sum')) {
        setHasExecutedBgpSummary(true);
      }
    }

    let orderViolation = false;
    let mentorWarning: TerminalLog | null = null;

    if (!hasExecutedDiscovery && !isDiscovery) {
      if (currentChallenge.id === 'linux-basics' && (cmdBase === 'cat' || cmdBase === 'grep')) {
        orderViolation = true;
        mentorWarning = {
          text: `💡 [Mentor IA]: Antes de visualizar os logs ou tentar filtrá-los com grep, é fundamental auditar o diretório para verificar quais arquivos de log de autenticação estão disponíveis!\n👉 Execute primeiro o comando de descoberta básico: "ls -la /var/log"`,
          type: 'system'
        };
      } else if (currentChallenge.id === 'soc-ransomware' && (cmdBase === 'kill' || cmdBase === 'rm' || cmdBase === 'chmod')) {
        orderViolation = true;
        mentorWarning = {
          text: `💡 [Mentor IA]: Não se apresse! Antes de tentar encerrar processos via kill, remover código ou alterar permissões, você precisa obter contexto sobre o que está ativo no servidor apache (/var/www/html).\n👉 Execute primeiro o comando de descoberta de processos: "ps aux" ou de conexões/portas: "lsof -i"`,
          type: 'system'
        };
      } else if (currentChallenge.id === 'bgp-hijacking' && (cmdBase === 'configure' || cmdBase === 'conf' || cmdBase === 'route-map' || cmdBase === 'router' || cmdBase === 'neighbor' || cmdBase === 'clear')) {
        orderViolation = true;
        mentorWarning = {
          text: `💡 [Mentor IA]: Pare um segundo! Antes de entrar no modo de configuração terminal ou aplicar regras de filtro de vizinhança BGP, você deve analisar o estado das sessões vizinhas e das tabelas de rotas para entender a anomalia.\n👉 Execute primeiro o comando de descoberta de rede: "show ip bgp summary" ou o de tabelas de rotas: "show ip route"`,
          type: 'system'
        };
      }
    }

    // Validação complementar para exigir show ip bgp summary especificamente antes da configuração terminal na mitigação
    if (currentChallenge.id === 'bgp-hijacking' && !hasExecutedBgpSummary && !orderViolation) {
      if (cmdBase === 'configure' || cmdBase === 'conf' || cmdBase === 'route-map' || cmdBase === 'router' || cmdBase === 'neighbor' || cmdBase === 'clear') {
        orderViolation = true;
        mentorWarning = {
          text: `💡 [Mentor IA]: Alto lá! Antes de entrar no modo de configuração terminal ou tentar criar regras para mitigar o sequestro BGP, é indispensável que você analise o estado atual dos peers BGP para identificar qual vizinho está injetando prefixos falsificados.\n👉 Execute o comando diagnóstico: "show ip bgp summary"`,
          type: 'system'
        };
      }
    }

    if (orderViolation && mentorWarning) {
      setTerminalLogs(prev => [...prev, inputLog, mentorWarning!]);
      return;
    }

    let nextLogs: TerminalLog[] = [];

    if (currentChallenge.id === 'bgp-hijacking') {
      const result = executeBgpCommand(trimmed, deviceContext, bgpState);
      nextLogs = result.logs;
      setDeviceContext(result.nextDeviceContext);
      setSelectedNodeId(result.nextDeviceContext);
      if (result.bgpConfigState) {
        setBgpState(result.bgpConfigState);
      }
      if (result.triggerResolution) {
        triggerIncidentResolution('bgp-hijacking');
      }
    } else {
      // Linux environments
      const result = executeLinuxCommand(trimmed, terminalCurrentDir, terminalFileSystem, currentChallenge.id, socState);
      nextLogs = result.logs;
      setTerminalCurrentDir(result.nextDir);
      setTerminalFileSystem(result.nextFileSystem);
      if (result.socConfigState) {
        setSocState(result.socConfigState);
      }
      if (result.triggerResolution) {
        triggerIncidentResolution(currentChallenge.id);
      }
    }

    setTerminalLogs(prev => [...prev, inputLog, ...nextLogs]);
  };

  // Triggers final verification and opens congratulation card pop-up!
  const triggerIncidentResolution = (challId: string) => {
    if (profile.resolvedChallenges.includes(challId)) return;

    const matchedChall = CHALLENGES.find(c => c.id === challId);
    if (!matchedChall) return;

    // Award XP and cyber credits
    setProfile(prev => {
      const nextXp = prev.xp + matchedChall.xpReward;
      const nextCredits = prev.cyberCredits + matchedChall.creditsReward;
      let nextLevel = prev.level;
      let nextTier = prev.currentTier;

      if (nextXp >= prev.xpNeeded) {
        nextLevel += 1;
      }

      // Upgrade tier logically on levels
      if (nextLevel >= 15) {
        nextTier = 'Arquiteto de Infraestrutura Crítica';
      } else if (nextLevel >= 10) {
        nextTier = 'Engenheiro de Backbone';
      } else if (nextLevel >= 4) {
        nextTier = 'Analista NOC/SOC N2';
      }

      return {
        ...prev,
        xp: nextXp,
        cyberCredits: nextCredits,
        level: nextLevel,
        currentTier: nextTier,
        resolvedChallenges: [...prev.resolvedChallenges, challId]
      };
    });

    // Resolve system node and alarms states visually
    setNodes(prev => prev.map(n => ({ ...n, status: 'healthy' })));
    setLinks(prev => prev.map(l => ({ ...l, status: 'normal' })));
    setAlerts(prev => prev.map(a => ({ ...a, status: 'resolved' })));

    // Unlock corresponding achievement card
    setAchievements(prev => prev.map(ach => {
      if (challId === 'linux-basics' && ach.id === 'first_login') return { ...ach, unlocked: true };
      if (challId === 'soc-ransomware' && ach.id === 'malware_slayer') return { ...ach, unlocked: true };
      if (challId === 'bgp-hijacking' && (ach.id === 'certified_bgp' || ach.id === 'uptime_overlord')) return { ...ach, unlocked: true };
      return ach;
    }));

    // Trigger Success celebration screen UI
    setVictoryChallengeTitle(matchedChall.title);
    setShowVictoryModal(true);
  };

  // Restores terminal and topology states cleanly for replication
  const resetChallenge = () => {
    selectChallenge(currentChallenge);
  };

  // Skill Tree Unlock trigger
  const handleUnlockSkill = (skillId: string) => {
    const sNode = skills.find(s => s.id === skillId);
    if (!sNode || sNode.unlocked || profile.cyberCredits < sNode.cost) return;

    setProfile(prev => ({
      ...prev,
      cyberCredits: prev.cyberCredits - sNode.cost
    }));

    setSkills(prev => prev.map(s => {
      if (s.id === skillId) return { ...s, unlocked: true };
      return s;
    }));

    // Alert achievements
    setTerminalLogs(prev => [
      ...prev,
      { text: `✓ [SKILL OUTSTANDING UNLOCKED]: Adquiriu competência "${sNode.name}"!`, type: 'success' }
    ]);
  };

  // Job Submission recruiter analyzer
  const handleApplyJob = (jobId: string) => {
    const targetJob = jobs.find(j => j.id === jobId);
    if (!targetJob) return;

    // Mark applied
    setJobs(prev => prev.map(j => {
      if (j.id === jobId) return { ...j, applied: true };
      return j;
    }));

    // Evaluate application on student stats
    const matchingSkills = targetJob.requirements.requiredSkills.filter(reqS => {
      const sn = skills.find(s => s.name === reqS);
      return sn ? sn.unlocked : false;
    }).length;

    const meetsSkills = matchingSkills === targetJob.requirements.requiredSkills.length;
    const meetsLevel = profile.level >= targetJob.requirements.minLevel;

    if (meetsSkills && meetsLevel) {
      setRecruiterInbox(
        `Parabéns, Recruta! O time de engenheiros da "${targetJob.companyName}" aprovou seu portfólio no CyberOps Simulator. Eles gostaram das suas certificações e agendaram uma entrevista técnica com você na próxima terça-feira às 14:00!`
      );
    } else {
      setRecruiterInbox(
        `Sua candidatura para a vaga "${targetJob.roleName}" de "${targetJob.companyName}" foi arquivada. Motivo: Faltam competências chaves no seu currículo. Conclua mais simulados e compre as Skills exigidas na árvore!`
      );
    }
  };

  // Safe server AI Mentor requests caller
  const handleSendPromptToMentor = async (userQuestion: string): Promise<string> => {
    try {
      const response = await fetch('/api/mentor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: userQuestion,
          challengeTitle: currentChallenge.title,
          challengeContext: currentChallenge.context,
          commandHistory: commandHistory,
          userLevel: profile.level,
          currentTier: profile.currentTier,
          selectedNode: selectedNodeId
        })
      });

      if (!response.ok) {
        throw new Error('Server returned unsafe response status');
      }

      const data = await response.json();
      return data.response;
    } catch (e: any) {
      return `Mentor Offline: Não conseguimos contactar o servidor local de IA para processar sua dúvida. Chave do Gemini pode não estar presente.`;
    }
  };

  return (
    <div className="min-h-screen bg-[#05060a] text-[#c0c0cf] flex flex-col font-sans transition-all relative overflow-x-hidden antialiased">
      {/* GRID OVERLAY BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 0)', backgroundSize: '30px 30px' }} />
      {/* GLAMOUR CYBER TOPPING GRAPHIC BAR */}
      <div className="h-1 w-full bg-gradient-to-r from-cyan-500 to-blue-600 font-sans z-30" />

      {/* RE-ESTABBED HEADER PANEL */}
      <header className="border-b border-[#1e2130] bg-[#0a0c16] py-3.5 px-6 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 relative z-10 w-full max-w-[2100px] mx-auto">
        <div className="flex items-center space-x-3 text-left">
          <div className="p-2 rounded bg-cyan-500 flex items-center justify-center text-black">
            <Cpu className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="font-sans font-bold text-lg tracking-tighter text-white uppercase flex items-center space-x-2">
              <span>CyberOps <span className="text-cyan-500 underline decoration-2">Simulator</span></span>
              <span className="text-[9.5px] font-mono px-2 py-0.5 rounded bg-[#141625] border border-[#2d314d] text-cyan-400 font-normal uppercase tracking-wider">
                Labs Backbone v2.0
              </span>
            </h1>
            <p className="text-[11px] text-[#5e6382] font-medium">Habilitação de Redes Core & Cyber SOC focada em Impacto Social</p>
          </div>
        </div>

        {/* Global Level Profile Scoreboard Badge */}
        <div className="flex flex-wrap items-center gap-4 bg-[#141625] p-2 px-4 rounded-sm border border-[#2d314d]">
          <div className="flex items-center space-x-2 text-left">
            <div className="h-8 w-8 rounded bg-cyan-600/30 border border-cyan-500/30 flex items-center justify-center text-xs font-mono font-bold text-cyan-400">
              {profile.level}
            </div>
            <div>
              <div className="text-[10px] text-[#5e6382] font-sans uppercase font-bold tracking-wider">User XP: {profile.xp}</div>
              <div className="w-32 bg-[#05060a] h-1.5 rounded-sm overflow-hidden mt-0.5">
                <div className="h-full bg-[#0891b2]" style={{ width: `${(profile.xp / profile.xpNeeded) * 100}%` }} />
              </div>
            </div>
          </div>

          <div className="hidden sm:block text-[#1e2130] text-lg">|</div>

          <div className="text-left">
            <span className="text-[9px] text-[#5e6382] uppercase font-bold block">Tier Profissional</span>
            <span className="text-xs font-bold text-cyan-400 mt-0.5 block flex items-center space-x-1 font-mono">
              <Award className="w-3.5 h-3.5 text-cyan-400" />
              <span>{profile.currentTier}</span>
            </span>
          </div>

          <div className="hidden sm:block text-[#1e2130] text-lg">|</div>

          <div className="text-left font-mono">
            <span className="text-[9px] text-[#5e6382] uppercase font-bold block">V-Credits 🪙</span>
            <span className="text-xs font-black text-amber-400 mt-0.5 block px-2 py-0.5 bg-[#05060a] border border-[#2d314d] rounded-sm">${profile.cyberCredits.toFixed(2)} CC</span>
          </div>
        </div>
      </header>

      {/* SEPARATOR BORDER */}
      <div className="h-[1px] w-full bg-[#1e2130] relative z-20" />

      {/* MAIN VIEW CONTENT BOARD WITH SIDEBAR */}
      <div className="flex-1 w-full max-w-[2100px] mx-auto flex flex-col md:flex-row relative z-10 overflow-hidden">
        {/* LEFT COLLAPSIBLE MULTI-GROUP SIDEBAR */}
        <Sidebar
          currentSection={currentSection}
          onChangeSection={(sec) => {
            setCurrentSection(sec);
            if (sec === 'missao') {
              setActiveTab('ops');
            } else if (sec === 'carreira') {
              setActiveTab('career');
            } else if (sec === 'wiki') {
              setActiveTab('about');
            }
          }}
          gameMode={gameMode}
        />

        {/* CONTAINER VIEWPORT */}
        <main className="flex-1 p-4 md:p-6 pb-24 overflow-y-auto min-h-[calc(100vh-85px)]">
          <AnimatePresence mode="wait">
            {currentSection === 'missao' ? (
              /* NOC/SOC INCIDENT MONITOR HUB */
              <motion.div
                key="ops-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="grid grid-cols-1 xl:grid-cols-12 gap-6 text-left"
              >
              {/* LEFT & CENTER INTERFACES COLUMN (8 cols) */}
              <div className="xl:col-span-8 space-y-6">

                {/* INTERACTIVE MISSION CHECKLIST CARDS */}
                <div className="bg-[#0a0c16] border border-[#1e2130] rounded-sm shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
                  {/* HEADER WITH TOGGLE BUTTON */}
                  <div className="p-3.5 px-4 flex items-center justify-between border-b border-[#1e2130] bg-[#0d0f21]">
                    <div className="flex items-center space-x-2.5">
                      <div className="p-1 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                        <Activity className="w-4 h-4 animate-pulse" />
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-zinc-100 uppercase tracking-wider font-mono">
                          Checklist de Avanço da Missão
                        </h3>
                        <p className="text-[10px] text-[#5e6382] font-mono leading-none mt-0.5">
                          Acompanhamento em tempo real dos marcos mitigatórios
                        </p>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => setShowChecklist(prev => !prev)}
                      className="flex items-center space-x-1.5 px-2.5 py-1 text-[10px] font-mono font-bold uppercase rounded border transition duration-150 text-[#5e6382] border-zinc-800 hover:text-cyan-400 hover:border-cyan-500/30 bg-[#121428]"
                    >
                      {showChecklist ? (
                        <>
                          <EyeOff className="w-3 h-3 animate-pulse text-zinc-400" />
                          <span>Ocultar Checklist</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-3 h-3 text-cyan-400" />
                          <span>Exibir Checklist</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* SLIDING CHECKLIST CONTENT */}
                  <AnimatePresence initial={false}>
                    {showChecklist && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.15, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 space-y-3 bg-[#070810]/80">
                          {(() => {
                            const isSolved = profile.resolvedChallenges.includes(currentChallenge.id);
                            let steps: { label: string; desc: string; done: boolean }[] = [];

                            if (currentChallenge.id === 'linux-basics') {
                              steps = [
                                {
                                  label: "Descoberta de Atividades",
                                  desc: "Analisar os registros de auditoria e conexões do host (/var/log/auth.log) executando cat ou ls.",
                                  done: hasExecutedDiscovery || isSolved
                                },
                                {
                                  label: "Critério Resolvido",
                                  desc: "Filtrar os IPs agressores de tentativas falhas de login (grep 'Failed password' auth.log).",
                                  done: isSolved
                                }
                              ];
                            } else if (currentChallenge.id === 'soc-ransomware') {
                              steps = [
                                {
                                  label: "Investigação Inicial",
                                  desc: "Mapear a árvore de execução de processos ou portas ativas no servidor (ps aux / lsof -i).",
                                  done: hasExecutedDiscovery || socState.killedMalware || isSolved
                                },
                                {
                                  label: "Matar Processo Cifrador",
                                  desc: "Sinalizar e derrubar por força o PID cifrador abusivo (kill -9 1442).",
                                  done: socState.killedMalware || isSolved
                                },
                                {
                                  label: "Saneamento de Arquivos",
                                  desc: "Remover a backdoor web shell injetada no Apache (rm backdoor.php).",
                                  done: socState.deletedWebshell || isSolved
                                },
                                {
                                  label: "Privilégios de index.html",
                                  desc: "Normalizar as permissões de leitura pública de index.html (chmod 644 index.html).",
                                  done: socState.fixedPermissions || isSolved
                                }
                              ];
                            } else if (currentChallenge.id === 'bgp-hijacking') {
                              steps = [
                                {
                                  label: "Auditoria Router BGP",
                                  desc: "Investigar feeds de anúncios para extrair peers de inundação (show ip bgp summary / show ip route).",
                                  done: hasExecutedBgpSummary || bgpState.createdRouteMap || isSolved
                                },
                                {
                                  label: "Definição do Route-Map",
                                  desc: "Construir a estrutura básica de política do router (route-map FILTER-BGP deny 10).",
                                  done: bgpState.createdRouteMap || isSolved
                                },
                                {
                                  label: "Vincular Prefix-List",
                                  desc: "Vincular a prefix-list FALSE-BGP para casar com anúncios maliciosos (match ip address prefix-list FALSE-BGP).",
                                  done: bgpState.matchedPrefixList || isSolved
                                },
                                {
                                  label: "Roteamento Autônomo",
                                  desc: "Acessar o bloco do daemon BGP com o ASN corporativo (router bgp 65112).",
                                  done: bgpState.enteredRouterBgp || isSolved
                                },
                                {
                                  label: "Filtro no Peer Intruso",
                                  desc: "Amarrar o filtro inbound de importação ao IP invasor (neighbor 180.2.2.1 route-map FILTER-BGP in).",
                                  done: bgpState.configuredNeighbor || isSolved
                                },
                                {
                                  label: "Reload BGP Soft Clear",
                                  desc: "Executar recarregamento suave soft-clear para restaurar as rotas corretas (clear ip bgp 180.2.2.1 soft).",
                                  done: isSolved
                                }
                              ];
                            }

                            if (steps.length === 0) {
                              return (
                                <p className="text-xs text-zinc-500 italic">
                                  Nenhum checklist de etapas disponível para este lab.
                                </p>
                              );
                            }

                            return (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {steps.map((s, idx) => (
                                  <div
                                    key={idx}
                                    className={`p-3 rounded border transition flex flex-col justify-between text-left ${
                                      s.done
                                        ? 'bg-[#10b981]/5 border-[#10b981]/25 shadow-[0_0_15px_rgba(16,185,129,0.03)]'
                                        : 'bg-[#121422]/60 border-[#1e2130]/90'
                                    }`}
                                  >
                                    <div className="flex items-start space-x-2.5">
                                      <div className="mt-0.5 shrink-0">
                                        {s.done ? (
                                          <div className="h-4.5 w-4.5 bg-emerald-500/20 border border-emerald-400 rounded-full flex items-center justify-center text-emerald-400">
                                            <Check className="w-3 h-3 stroke-[3.5]" />
                                          </div>
                                        ) : (
                                          <div className="h-4.5 w-4.5 border border-zinc-700 hover:border-zinc-500 rounded-full bg-[#121422]" />
                                        )}
                                      </div>
                                      <div>
                                        <div className="flex items-center space-x-1.5 flex-wrap">
                                          <span className="text-[9px] font-mono uppercase bg-zinc-800/80 px-1.5 py-0.5 rounded text-zinc-400">
                                            Etapa {idx + 1}
                                          </span>
                                          <span className={`text-[11px] font-bold font-mono tracking-tight ${s.done ? 'text-emerald-405' : 'text-[#c0c0cf]'}`}>
                                            {s.label}
                                          </span>
                                        </div>
                                        <p className="text-[10px] text-zinc-400 leading-relaxed mt-1.5 font-sans">
                                          {s.desc}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="mt-3 pt-2.5 border-t border-[#1e2130]/40 flex items-center justify-between text-[9px] font-mono text-zinc-500">
                                      <span>Módulo: {s.label}</span>
                                      <span className={s.done ? 'text-emerald-400 font-extrabold text-[10px] flex items-center space-x-1' : 'text-zinc-600'}>
                                        {s.done ? '✓ CONCLUÍDO' : 'PENDENTE'}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            );
                          })()}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* MODE SPECIFIC WIDGETS */}
                {gameMode === 'iniciante' && (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-sm text-left font-mono text-xs text-emerald-400 space-y-1.5 shadow-[0_0_15px_rgba(16,185,129,0.05)]">
                    <div className="font-extrabold flex items-center space-x-1.5 uppercase tracking-wide text-white">
                      <CheckCircle className="w-4 h-4 text-emerald-400 animate-bounce shrink-0" />
                      <span>Orientações de Suporte (Modo Iniciante Ativo)</span>
                    </div>
                    <p className="text-zinc-300 text-[11px] leading-relaxed">
                      {currentChallenge.id === 'linux-basics' ? (
                        <span>Para este laboratório básico de Linux, investigue os logs de autenticação do host. Execute <code>cat /var/log/auth.log</code> no terminal para relatar os acessos, ou filtre diretamente por acessos falhos usando <code>grep "Failed password" /var/log/auth.log</code>. Copie o IP de brute force encontrado e envie uma mensagem ao Mentor IA para receber as congratulações de mitigação!</span>
                      ) : currentChallenge.id === 'soc-ransomware' ? (
                        <span>Localize processos abusadores rodando <code>ps aux</code>. O PID sequestrador é o 1442; encerre-o rodando <code>kill -9 1442</code>. Depois remova o backdoor malicioso com <code>rm -rf /var/www/html/backdoor.php</code> e recupere as permissões de gravação do site com <code>chmod 644 /var/www/html/index.html</code>!</span>
                      ) : (
                        <span>Inicie examinando os roteadores BGP rodando <code>show ip bgp summary</code>. Em seguida, entre na interface do console via <code>configure terminal</code> seguido de <code>route-map FILTER-BGP deny 10</code>. Combine prefixos usando <code>match ip address prefix-list FALSE-BGP</code>, digite <code>exit</code>, configure o daemon AS65112 com <code>router bgp 65112</code> e amarre a regra com <code>neighbor 180.2.2.1 route-map FILTER-BGP in</code>. Conclua aplicando reload suave via <code>clear ip bgp 180.2.2.1 soft</code>!</span>
                      )}
                    </p>
                  </div>
                )}

                {(gameMode === 'avancado' || gameMode === 'hardcore' || gameMode === 'realista') && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
                    {/* Countdown Box */}
                    <div className="bg-[#0c0d1e] border border-rose-505/30 p-3.5 rounded-sm flex flex-col justify-between text-left">
                      <span className="text-[9px] text-[#5e6382] uppercase font-bold tracking-wider">Prazo de MTTR do Chamado</span>
                      <div className="text-rose-500 font-extrabold text-lg mt-1 animate-pulse flex items-center space-x-1.5">
                        <Clock className="w-4 h-4 text-rose-500 shrink-0" />
                        <span>{Math.floor(slaCountdown / 60)}:{(slaCountdown % 60).toString().padStart(2, '0')}</span>
                      </div>
                      <span className="text-[9px] text-zinc-500">Multas severas de SLA caso expire.</span>
                    </div>

                    {/* Financial Loss box */}
                    <div className="bg-[#0c0d1e] border border-rose-505/30 p-3.5 rounded-sm flex flex-col justify-between text-left">
                      <span className="text-[9px] text-[#5e6382] uppercase font-bold tracking-wider">Prejuízo Financeiro Contratual</span>
                      <div className="text-rose-500 font-extrabold text-lg mt-1">
                        ${financialLoss.toFixed(2)} USD
                      </div>
                      <span className="text-[9px] text-zinc-500">Perda estimada por segundo indisponível.</span>
                    </div>

                    {/* Live Complaints Log */}
                    <div className="bg-[#0c0d1e] border border-[#1e2130] p-3.5 rounded-sm text-left flex flex-col justify-between">
                      <span className="text-[9px] text-amber-500 uppercase font-black tracking-wider flex items-center space-x-1">
                        <span className="h-1.5 w-1.5 bg-amber-500 rounded-full animate-ping shrink-0" />
                        <span>FEEDS DE CLIENTES IMPACTADOS</span>
                      </span>
                      <div className="text-[10px] text-zinc-300 mt-1 italic truncate">
                        {currentChallenge.id === 'linux-basics' ? (
                          '"Minha VPN corporativa está offline!"'
                        ) : currentChallenge.id === 'soc-ransomware' ? (
                          '"A home do site virou tela preta ransomware!"'
                        ) : (
                          '"Perdemos tráfego de BGP e rotas de gateway!"'
                        )}
                      </div>
                      <span className="text-[9px] text-zinc-600">Central de Incidentes ISP.</span>
                    </div>
                  </div>
                )}

                {/* SELECT ACTIVE SIMULATION SCENARIO BAR */}
                <div className="p-4 bg-[#0a0c16] border border-[#1e2130] rounded-sm text-left">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-[10px] uppercase font-bold tracking-wider font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-400/20">
                      Modo de Simulação
                    </span>
                    <h3 className="text-xs font-bold text-[#c0c0cf]">Escolha um Laboratório Prático:</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {CHALLENGES.map((chall) => {
                      const isActive = currentChallenge.id === chall.id;
                      const isSolved = profile.resolvedChallenges.includes(chall.id);

                      return (
                        <button
                          key={chall.id}
                          onClick={() => selectChallenge(chall)}
                          className={`p-3 rounded-sm border text-left transition ${isActive ? 'bg-cyan-950/30 border-cyan-500/60 ring-1 ring-cyan-500/30' : 'bg-[#141625] border-[#2d314d] hover:border-[#1e2130]'} relative`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-mono font-medium text-zinc-500">{chall.tier}</span>
                            {isSolved && (
                              <span className="text-[8px] bg-emerald-500/10 text-emerald-400 px-1 rounded-full font-mono font-semibold">
                                ✓ Resolvido
                              </span>
                            )}
                          </div>
                          <h4 className="font-sans font-bold text-[11.5px] text-zinc-200 truncate mt-1">
                            {chall.title}
                          </h4>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* ACTIVE LABORATORY CONTEXT BANNER */}
                <div className="p-4 bg-[#0a0c16] border border-[#1e2130] rounded-sm text-left relative overflow-hidden">
                  <div className="absolute right-4 top-4 text-[#5e6382] opacity-10 pointer-events-none">
                    <Info className="w-16 h-16" />
                  </div>
                  <h3 className="font-sans font-bold text-sm text-cyan-400 uppercase tracking-wider">
                    {currentChallenge.title}
                  </h3>
                  <p className="text-[11.5px] text-[#c0c0cf] mt-2 leading-relaxed">
                    <strong>Missão:</strong> {currentChallenge.context}
                  </p>
                  <div className="mt-4 pt-3.5 border-t border-[#1e2130] grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono text-[#5e6382] lg:divide-x lg:divide-[#1e2130]">
                    <div className="col-span-1">
                      <span className="block text-[8.5px] uppercase font-bold text-[#5e6382]">Equipamento Alvo</span>
                      <strong className="text-white font-semibold font-mono">{currentChallenge.deviceContext}</strong>
                    </div>
                    <div className="col-span-1 lg:pl-4">
                      <span className="block text-[8.5px] uppercase font-bold text-[#5e6382]">XP de Recompensa</span>
                      <strong className="text-cyan-400 font-semibold">+{currentChallenge.xpReward} XP</strong>
                    </div>
                    <div className="col-span-1 lg:pl-4">
                      <span className="block text-[8.5px] uppercase font-bold text-[#5e6382]">CyberCredits</span>
                      <strong className="text-amber-400 font-semibold">+{currentChallenge.creditsReward} CC</strong>
                    </div>
                    <div className="col-span-1 lg:pl-4 flex items-center space-x-1.5">
                      <div>
                        <span className="block text-[8.5px] uppercase font-bold text-[#5e6382]">Limite MTTR</span>
                        <strong className="text-white font-semibold">15 Minutos</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* LIVE NETWORK TOPOLOGY VISUALIZER */}
                <div id="network-map-container" className="border border-[#1e2130] bg-[#0a0c16] rounded-sm overflow-hidden transition-all duration-300">
                  <div className="p-3 bg-[#0d0f1d] flex items-center justify-between border-b border-[#1e2130] select-none">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-400/20">
                        Topologia
                      </span>
                      <h4 className="text-xs font-bold text-[#c0c0cf] font-sans">Visualizador de Mapa de Rede</h4>
                    </div>
                    <button
                      id="toggle-network-map-btn"
                      onClick={() => setShowNetworkMap(!showNetworkMap)}
                      className="text-[11px] font-mono px-3 py-1 bg-[#141625] hover:bg-[#1e2135] text-cyan-400 hover:text-cyan-300 rounded border border-[#2d314d] hover:border-cyan-500/30 transition duration-150 font-bold"
                    >
                      {showNetworkMap ? '[-] OCULTAR MAPA' : '[+] EXIBIR MAPA DE TOPOLOGIA'}
                    </button>
                  </div>
                  <AnimatePresence initial={false}>
                    {showNetworkMap && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <NetworkMap
                          nodes={nodes}
                          links={links}
                          selectedNodeId={selectedNodeId}
                          onSelectNode={(nodeId) => setSelectedNodeId(nodeId)}
                          activeIncidentSources={alerts.filter(a => a.status === 'active').map(a => a.source)}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* GRAPH GRAFANA & SIEM TELEMETRY DUAL PANEL */}
                <Dashboard
                  alerts={alerts}
                  challenge={currentChallenge}
                  simulatedTraffic={simulatedMetrics}
                  uptime={simulatedUptime}
                />

                {/* CONSOLE TERMINAL EMULATOR */}
                <Terminal
                  logs={terminalLogs}
                  deviceContext={selectedNodeId}
                  onExecute={executeCommand}
                  onReset={resetChallenge}
                  challengeId={currentChallenge.id}
                  currentDir={terminalCurrentDir}
                  terminalFileSystem={terminalFileSystem}
                />
              </div>

              {/* RIGHT COLUMN: AI MENTOR SIDE ASSISTANT PANEL (4 cols) */}
              <div className="xl:col-span-4">
                <MentorIA
                  challenge={currentChallenge}
                  commandHistory={commandHistory}
                  userLevel={profile.level}
                  onSendMentorPrompt={handleSendPromptToMentor}
                />
              </div>
            </motion.div>
          ) : currentSection === 'carreira' ? (
            /* CAREER SCREEN (Skills tree / B2B Jobs) */
            <motion.div
              key="career-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
            >
              <CareerMode
                profile={profile}
                skills={skills}
                achievements={achievements}
                jobs={jobs}
                onUnlockSkill={handleUnlockSkill}
                onApplyJob={handleApplyJob}
                messageLog={recruiterInbox}
              />
            </motion.div>
          ) : (
            /* EXTRA INTEGRATIVE GAMIFIED VIEWS EXCLUSIONS */
            <motion.div
              key="extra-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
            >
              <ExtraViews
                currentSection={currentSection}
                onChangeSection={(sec) => {
                  setCurrentSection(sec);
                  if (sec === 'missao') {
                    setActiveTab('ops');
                  } else if (sec === 'carreira') {
                    setActiveTab('career');
                  } else if (sec === 'wiki') {
                    setActiveTab('about');
                  }
                }}
                profile={profile}
                setProfile={setProfile}
                challenges={CHALLENGES}
                currentChallenge={currentChallenge}
                onSelectChallenge={(chall) => {
                  selectChallenge(chall);
                  setCurrentSection('missao');
                  setActiveTab('ops');
                }}
                gameMode={gameMode}
                setGameMode={setGameMode}
                skills={skills}
                achievements={achievements}
                resolvedChallenges={profile.resolvedChallenges}
                simulatedMetrics={simulatedMetrics}
                uptime={simulatedUptime}
                alerts={alerts}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>

      {/* VICTORY CELEBRATION MODAL OVERLAY */}
      <AnimatePresence>
        {showVictoryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 font-sans select-none animate-fade-in">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#0a0c16] border border-cyan-500/30 p-6 rounded-sm max-w-md w-full text-center relative shadow-[0_0_50px_rgba(6,182,212,0.25)]"
            >
              <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
                <CheckCircle className="w-6 h-6 animate-pulse" />
              </div>

              <h3 className="text-lg font-bold tracking-tighter text-white font-sans uppercase">
                CONQUISTA DESBLOQUEADA!
              </h3>
              <p className="text-xs text-cyan-400 mt-1 font-mono font-bold uppercase tracking-widest">
                Laboratório Resolvido com Sucesso
              </p>

              <div className="bg-[#141625] p-4 rounded-sm my-4 text-left border border-[#2d314d]">
                <span className="text-[10px] text-cyan-400 font-mono font-bold uppercase">
                  Desafio Concluído:
                </span>
                <h4 className="text-xs font-bold text-white mt-0.5 uppercase decoration-cyan-500">
                  {victoryChallengeTitle}
                </h4>
                <p className="text-[11px] leading-relaxed text-[#c0c0cf] mt-2">
                  Os indicadores de Uptime estabilizaram, o tráfego de backbone voltou ao normal e a telemetria do SOC cessou os picos de alarmes operacionais. Você foi promovido e acumulou insígnias digitais!
                </p>
              </div>

              <button
                onClick={() => setShowVictoryModal(false)}
                className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-black font-mono rounded-sm text-xs transition duration-150 font-bold uppercase"
              >
                Retornar ao NOC Hub
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FOOTER BAR */}
      <footer className="fixed bottom-0 left-0 right-0 py-2.5 px-6 border-t border-[#1e2130] bg-[#080a14] flex items-center justify-between text-[10px] text-[#5e6382] font-mono select-none z-40 w-full max-w-[2100px] mx-auto">
        <div>
          <span>CyberOps Education Initiative</span>
        </div>
        <div className="flex gap-4">
          <span>Mem: 2.1GB / 4.0GB</span>
          <span className="text-cyan-500 font-semibold uppercase font-bold decoration-1">Sim-Mode: Client/Wasm</span>
          <span className="text-[#1e2130]">|</span>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse animate-duration-1000"></span>
            <span className="text-green-500 font-semibold">● AMBIENTE PRONTO</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
