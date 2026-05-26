import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Award,
  BookOpen,
  ChevronRight,
  TrendingUp,
  Sliders,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Shield,
  Activity,
  User,
  Star,
  Info,
  ListTodo,
  Terminal as TerminalIcon,
  HardDrive,
  Cloud,
  Layers,
  ArrowRight,
  RefreshCw,
  Users,
  Search,
  Book,
  Globe,
  Settings,
  Flame,
  UserCheck,
  Check,
  Database,
  Compass,
  Shuffle
} from 'lucide-react';
import { Challenge, UserProfile, SkillNode, Achievement, IncidentAlert } from '../types';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

export type MenuSection =
  | 'inicio'
  | 'missao'
  | 'mapa'
  | 'labs'
  | 'carreira'
  | 'especializacoes'
  | 'inventario'
  | 'terminal'
  | 'noc'
  | 'soc'
  | 'backbone'
  | 'cloud'
  | 'certificacoes'
  | 'diarios'
  | 'eventos'
  | 'ranking'
  | 'equipe'
  | 'mentor'
  | 'wiki'
  | 'configuracoes'
  | 'ajuda'
  | 'tutorial'
  | 'academia'
  | 'historico'
  | 'estatisticas';

interface ExtraViewsProps {
  currentSection: MenuSection;
  onChangeSection: (section: MenuSection) => void;
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  challenges: Challenge[];
  currentChallenge: Challenge;
  onSelectChallenge: (challenge: Challenge) => void;
  gameMode: string;
  setGameMode: (mode: string) => void;
  skills: SkillNode[];
  achievements: Achievement[];
  resolvedChallenges: string[];
  simulatedMetrics: { name: string; tráfego: number; cpu: number; alertas: number }[];
  uptime: number;
  alerts: IncidentAlert[];
}

export default function ExtraViews({
  currentSection,
  onChangeSection,
  profile,
  setProfile,
  challenges,
  currentChallenge,
  onSelectChallenge,
  gameMode,
  setGameMode,
  skills,
  achievements,
  resolvedChallenges,
  simulatedMetrics,
  uptime,
  alerts
}: ExtraViewsProps) {

  // ==========================================
  // CONFIGURATIONS STATE
  // ==========================================
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hudScale, setHudScale] = useState('100%');
  const [crtFilter, setCrtFilter] = useState(true);

  // ==========================================
  // INVENTORY ENIGMA UPGRADES
  // ==========================================
  const [inventory, setInventory] = useState([
    { id: 'wireshark', name: 'Software Wireshark Gold Licença 🦈', desc: 'Habilita visualização avançada de pacotes hexadecimais no SOC.', bough: true, cost: 0 },
    { id: 'ram', name: 'Módulo Expansor de RAM Virtual (+16 GB) 💾', desc: 'Melhora tempo de processamento de comandos CLI redundantes.', bough: false, cost: 120 },
    { id: 'fiber', name: 'Adaptador Transceiver Fibra SFP+ 10Gbps 🔌', desc: 'Incrementa o refresco do Grafana Telemetria em 0.5 segundos.', bough: false, cost: 200 },
    { id: 'decal', name: 'Skin Holográfica "Cyber Shield" do Terminal 🎨', desc: 'Cosmético visual de elite para o console do NOC.', bough: false, cost: 80 },
    { id: 'nmap', name: 'Scripts de Varredura Nmap Scripting Engine (NSE) 🔎', desc: 'Auto-auditoria de portas em servidores Linux no sandbox.', bough: false, cost: 150 },
  ]);

  const handleBuyItem = (id: string, cost: number) => {
    if (profile.cyberCredits >= cost) {
      setInventory(prev => prev.map(item => item.id === id ? { ...item, bough: true } : item));
      setProfile(prev => ({ ...prev, cyberCredits: prev.cyberCredits - cost }));
    }
  };

  // ==========================================
  // KUBERNETES CONTAINER SYSTEM STATE
  // ==========================================
  const [k8sPods, setK8sPods] = useState([
    { name: 'auth-validator-pod-0x', status: 'Running', restarts: 2, cpu: '12m', mem: '144Mi' },
    { name: 'payment-gateway-gateway-7f', status: 'CrashLoopBackOff', restarts: 15, cpu: '0m', mem: '0Mi' },
    { name: 'frontend-nginx-edge-bb', status: 'Running', restarts: 0, cpu: '45m', mem: '64Mi' },
    { name: 'db-sharded-postgresql-0', status: 'Running', restarts: 1, cpu: '88m', mem: '512Mi' },
  ]);
  const [scalingReplicas, setScalingReplicas] = useState(4);
  const [restartingPod, setRestartingPod] = useState<string | null>(null);

  const handleRestartPod = (name: string) => {
    setRestartingPod(name);
    setTimeout(() => {
      setK8sPods(prev =>
        prev.map(pod =>
          pod.name === name ? { ...pod, status: 'Running', restarts: pod.restarts + 1, cpu: '12m', mem: '98Mi' } : pod
        )
      );
      setRestartingPod(null);
    }, 1500);
  };

  // ==========================================
  // SANDBOX TERMINAL STATE
  // ==========================================
  const [sandboxCmd, setSandboxCmd] = useState('');
  const [sandboxLogs, setSandboxLogs] = useState<{ text: string; type: string }[]>([
    { text: 'ISOLATED CLI SANDBOX ENVIRONMENT - Ubuntu Server Node', type: 'system' },
    { text: 'Digite "help" ou tente comandos para testar a sintaxe Linux.', type: 'output' },
  ]);

  const handleSandboxSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const command = sandboxCmd.trim();
    if (!command) return;

    const nextLogs = [...sandboxLogs, { text: `user@sandbox-cli:~$ ${command}`, type: 'input' }];
    const lower = command.toLowerCase();

    if (lower === 'help') {
      nextLogs.push({ text: 'Comandos disponíveis: help, clear, whoami, ping 8.8.8.8, ifconfig, date, uname -a, nmap localhost, host virtual-isp.net', type: 'system' });
    } else if (lower === 'clear') {
      setSandboxLogs([]);
      setSandboxCmd('');
      return;
    } else if (lower === 'whoami') {
      nextLogs.push({ text: 'recruta-cyberops-academy', type: 'output' });
    } else if (lower.startsWith('ping')) {
      nextLogs.push({ text: 'PING 8.8.8.8 (8.8.8.8) 56(84) bytes of data.', type: 'output' });
      nextLogs.push({ text: '64 bytes from 8.8.8.8: icmp_seq=1 ttl=118 time=8.12 ms', type: 'output' });
      nextLogs.push({ text: '64 bytes from 8.8.8.8: icmp_seq=2 ttl=118 time=6.45 ms', type: 'output' });
      nextLogs.push({ text: '--- 8.8.8.8 ping statistics ---', type: 'system' });
      nextLogs.push({ text: '2 packets transmitted, 2 received, 0% packet loss, time 1002ms', type: 'success' });
    } else if (lower === 'ifconfig') {
      nextLogs.push({ text: 'eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500', type: 'output' });
      nextLogs.push({ text: '        inet 192.168.10.85  netmask 255.255.255.0  broadcast 192.168.10.255', type: 'output' });
      nextLogs.push({ text: '        inet6 fe80::d9f:bc31:fa2e:cd41  prefixlen 64  scopeid 0x20<link>', type: 'output' });
      nextLogs.push({ text: '        RX packets 241952  bytes 182451296 (182.4 MB)', type: 'output' });
    } else if (lower === 'date') {
      nextLogs.push({ text: new Date().toISOString(), type: 'output' });
    } else if (lower.includes('uname')) {
      nextLogs.push({ text: 'Linux cyberops-sandbox-kernel 6.6.15-generic-amd64 #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux', type: 'output' });
    } else if (lower.includes('nmap')) {
      nextLogs.push({ text: 'Starting Nmap 7.94 ( https://nmap.org ) at ' + new Date().toLocaleTimeString(), type: 'system' });
      nextLogs.push({ text: 'Nmap scan report for localhost (127.0.0.1)', type: 'output' });
      nextLogs.push({ text: 'PORT     STATE SERVICE', type: 'system' });
      nextLogs.push({ text: '22/tcp   open  ssh', type: 'success' });
      nextLogs.push({ text: '80/tcp   open  http', type: 'success' });
      nextLogs.push({ text: '443/tcp  open  https', type: 'output' });
      nextLogs.push({ text: 'Nmap done: 1 IP address (1 host up) scanned in 0.05 seconds', type: 'success' });
    } else {
      nextLogs.push({ text: `bash: ${command}: comando não encontrado no interpretador do simulador.`, type: 'error' });
    }

    setSandboxLogs(nextLogs);
    setSandboxCmd('');
  };

  // ==========================================
  // CERTIFICATION EXAMS QUIZ STATE
  // ==========================================
  const [activeExam, setActiveExam] = useState<string | null>(null);
  const [examScore, setExamScore] = useState(0);
  const [examStep, setExamStep] = useState(0);
  const [examFailed, setExamFailed] = useState(false);
  const [examPassed, setExamPassed] = useState(false);
  const [earnedCerts, setEarnedCerts] = useState<string[]>([]);

  const exams = [
    {
      id: 'cert_noc1',
      title: 'EXAME: Operador NOC I',
      desc: 'Valida competência em redes, topologia física, e leitura de latência de roteadores.',
      rewardCredits: 200,
      rewardXP: 400,
      badge: 'NOC-1',
      questions: [
        {
          q: 'Qual o papel fundamental do Syslog em infraestrutura de TI?',
          opts: [
            'Roteamento de prefixos externos na tabela BGP.',
            'Coleta centralizada de mensagens de log de servidores e dispositivos de rede.',
            'Criptografar arquivos locais para prevenir backdoors PHP.'
          ],
          ans: 1
        },
        {
          q: 'Se uma interface do roteador está sinalizando status "Saturation" no mapa do NOC, qual o seu significado técnico?',
          opts: [
            'A largura de banda de trânsito ultrapassou o limite ou capacidade suportada do enlace.',
            'O tráfego de backbone está completamente cortado fisicamente.',
            'Ocorreu um ataque de Ransomware com alteração de extensão de arquivo.'
          ],
          ans: 0
        },
        {
          q: 'O que representa a sigla MTTR em Operações de NOC/SOC?',
          opts: [
            'Maximum Time To Route - Prefixo máximo anunciado.',
            'Mean Time To Resolution - Tempo Médio de Resolução de Incidentes.',
            'Multicast Traffic Tree Ring.'
          ],
          ans: 1
        }
      ]
    },
    {
      id: 'cert_bgp',
      title: 'EXAME: Engenheiro de Backbone BGP',
      desc: 'Valida conhecimentos em sessões dinâmicas BGP, ASNs, Prefixos IP e Route-Maps de segurança.',
      rewardCredits: 350,
      rewardXP: 600,
      badge: 'BGP-Warden',
      questions: [
        {
          q: 'O que caracteriza um ataque de Sequestro BGP (BGP Hijacking)?',
          opts: [
            'Floodar com pings repetitivos o gateway padrão de um switch de camada bidi-direcional.',
            'Anúncio não autorizado de prefixos IP por um Sistema Autónomo concorrente para desviar tráfego.',
            'Mudar a porta do servidor Apache de 80 para 8080.'
          ],
          ans: 1
        },
        {
          q: 'Qual regra filtramos num route-map para rejeitar anúncios maliciosos de prefixo?',
          opts: [
            'Um bloco "permit 10" sem casamento de IP.',
            'Um bloco "deny" amarrado a uma prefix-list contendo os anúncios falsos.',
            'Deletar a sessão BGP física usando "clear hard".'
          ],
          ans: 1
        },
        {
          q: 'Qual comando recarrega a tabela de adjacência BGP de forma "suave" sem desconectar o enlace?',
          opts: [
            'clear ip bgp <IP> soft',
            'rm -rf /etc/bgp/peers.conf',
            'configure terminal'
          ],
          ans: 0
        }
      ]
    },
    {
      id: 'cert_linux',
      title: 'EXAME: Especialista Linux Shell',
      desc: 'Valida competência em utilitários de filtros de logs, gerência de processos hostis, segurança e firewalls.',
      rewardCredits: 200,
      rewardXP: 450,
      badge: 'CLI-Master',
      questions: [
        {
          q: 'Qual comando Linux permite extrair de forma precisa linhas que batem com uma string específica?',
          opts: [
            'ls -lh',
            'ps aux',
            'grep "string_alvo" arquivo'
          ],
          ans: 2
        },
        {
          q: 'Se um processo de malware está rodando com PID 1442, como forçamos a sua terminação imediata?',
          opts: [
            'kill -9 1442',
            'chmod 644 1442',
            'rm -rf /proc/1442'
          ],
          ans: 0
        },
        {
          q: 'Qual permissão decimal representa leitura e escrita para o dono, e leitura simples para os demais (segura para Web index)?',
          opts: [
            'chmod 777',
            'chmod 644',
            'chmod 000'
          ],
          ans: 1
        }
      ]
    }
  ];

  const handleStartExam = (id: string) => {
    setActiveExam(id);
    setExamScore(0);
    setExamStep(0);
    setExamFailed(false);
    setExamPassed(false);
  };

  const handleAnswerExam = (idx: number) => {
    const activeExamData = exams.find(e => e.id === activeExam)!;
    const isCorrect = idx === activeExamData.questions[examStep].ans;

    let nextScore = examScore;
    if (isCorrect) {
      nextScore += 1;
      setExamScore(nextScore);
    }

    if (examStep + 1 < activeExamData.questions.length) {
      setExamStep(prev => prev + 1);
    } else {
      // Finished
      if (nextScore === activeExamData.questions.length) {
        setExamPassed(true);
        if (!earnedCerts.includes(activeExamData.badge)) {
          setEarnedCerts(prev => [...prev, activeExamData.badge]);
          setProfile(prev => ({
            ...prev,
            xp: prev.xp + activeExamData.rewardXP,
            cyberCredits: prev.cyberCredits + activeExamData.rewardCredits
          }));
        }
      } else {
        setExamFailed(true);
      }
    }
  };

  // ==========================================
  // MAP EXTRA LATENCY INTERACTIVE DEMO
  // ==========================================
  const [selectedCityNode, setSelectedCityNode] = useState<string | null>(null);
  const [pingOutput, setPingOutput] = useState<string[]>([]);
  const [pinging, setPinging] = useState(false);

  const cityNodes = [
    { name: 'PTT-SP (São Paulo Co-Location)', ip: '200.219.14.5', latency: '4ms', load: '68%', status: 'healthy', speed: '400 Gbps' },
    { name: 'PTT-RJ (Rio de Janeiro Backbone)', ip: '200.219.22.41', latency: '12ms', load: '85%', status: 'warning', speed: '200 Gbps' },
    { name: 'Fortaleza SEC-02 (International Hub)', ip: '200.222.1.9', latency: '42ms', load: '14%', status: 'healthy', speed: '1 Gbps' },
    { name: 'PTT-RS (Porto Alegre Edge)', ip: '200.198.54.3', latency: '24ms', load: '92%', status: 'warning', speed: '10 Gbps' },
  ];

  const handleTriggerPingCity = (node: typeof cityNodes[0]) => {
    setPinging(true);
    setSelectedCityNode(node.name);
    setPingOutput([]);
    let counter = 0;
    const timer = setInterval(() => {
      counter++;
      if (counter <= 3) {
        setPingOutput(prev => [...prev, `64 bytes from ${node.ip}: icmp_seq=${counter} ttl=54 time=${(parseFloat(node.latency) + (Math.random() * 2 - 1)).toFixed(2)} ms`]);
      } else {
        clearInterval(timer);
        setPingOutput(prev => [...prev, `--- ${node.name} ping statistics ---`, `3 packets transmitted, 3 received, 0% packet loss, service level 100% OK.`]);
        setPinging(false);
      }
    }, 450);
  };

  // ==========================================
  // DAILY DISASTERS STATE
  // ==========================================
  const [completedDailies, setCompletedDailies] = useState<string[]>([]);

  const dailies = [
    { id: 'daily-ping', text: 'Analise ping local à subrede', q: 'Qual comando inicia o ping a um roteador terminal?', opt: ['ping <IP>', 'systemctl list', 'mkdir /var/log'], ans: 0 },
    { id: 'daily-log', text: 'Vire o log SSH primário', q: 'Em qual arquivo logamos erros do SSH daemon no Linux?', opt: ['/var/log/syslog', '/var/log/auth.log', '/tmp/malware'], ans: 1 },
    { id: 'daily-kill', text: 'Combata ameaça com sinal de morte', q: 'Qual opção de sinal força kill a matar com prioridade máxima?', opt: ['-9', '-15', '-sighup'], ans: 0 }
  ];

  const handleAnswerDaily = (id: string, ansIdx: number, correctIdx: number) => {
    if (ansIdx === correctIdx) {
      if (!completedDailies.includes(id)) {
        setCompletedDailies(prev => [...prev, id]);
        setProfile(prev => ({ ...prev, cyberCredits: prev.cyberCredits + 50, xp: prev.xp + 100 }));
      }
    } else {
      alert("Resposta incorreta! Revise a lógica técnica!");
    }
  };


  // ==========================================
  // GLOBAL RENDERER
  // ==========================================
  switch (currentSection) {

    // 1. INÍCIO VIEW
    case 'inicio': {
      const remainingResolved = challenges.filter(c => resolvedChallenges.includes(c.id)).length;
      return (
        <div className="space-y-6 text-left">
          {/* Welcome visual card */}
          <div className="bg-gradient-to-br from-[#0c0d1e] to-[#0a0c16] border border-[#1e2130] p-6 rounded-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 h-full w-1/3 bg-gradient-to-l from-cyan-500/5 to-transparent pointer-events-none" />
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center space-x-2.5">
                  <Sparkles className="w-5 h-5 text-cyan-400 animate-bounce" />
                  <span>Olá, {profile.username}! Que bom te ver no Core.</span>
                </h2>
                <p className="text-xs text-[#8e93b2] mt-1 font-sans">
                  Você está logado na plataforma gamificada de simulação de infraestrutura crítica e segurança de tráfego. Siga os próximos passos sugeridos para progredir na sua carreira.
                </p>
              </div>
              <button
                onClick={() => onChangeSection('missao')}
                className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-black text-xs font-mono font-black uppercase rounded-sm transition tracking-wider shadow-[0_0_20px_rgba(6,182,212,0.15)] shrink-0 cursor-pointer"
              >
                Continuar Missões Ativas ⚡
              </button>
            </div>
          </div>

          {/* Quick status grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#0a0c16] border border-[#1e2130] p-4 rounded-sm flex flex-col justify-between">
              <div>
                <span className="text-[10px] text-[#5e6382] uppercase font-bold font-mono tracking-wider">
                  Mapeador de Objetivos
                </span>
                <h4 className="text-sm font-bold text-white mt-1">Laboratórios Práticos</h4>
              </div>
              <div className="mt-4 flex items-baseline justify-between font-mono">
                <span className="text-2xl font-bold font-mono text-cyan-400">
                  {remainingResolved} / {challenges.length}
                </span>
                <span className="text-xs text-[#5e6382]">
                  {((remainingResolved / challenges.length) * 100).toFixed(0)}% Concluído
                </span>
              </div>
              <div className="w-full bg-[#141625] h-1.5 rounded-sm mt-2 overflow-hidden">
                <div className="h-full bg-cyan-400" style={{ width: `${(remainingResolved / challenges.length) * 100}%` }} />
              </div>
            </div>

            <div className="bg-[#0a0c16] border border-[#1e2130] p-4 rounded-sm flex flex-col justify-between">
              <div>
                <span className="text-[10px] text-[#5e6382] uppercase font-bold font-mono tracking-wider">
                  Medalhas e Provas acadêmicas
                </span>
                <h4 className="text-sm font-bold text-white mt-1">Certificações de Elite</h4>
              </div>
              <div className="mt-4 flex items-baseline justify-between font-mono">
                <span className="text-2xl font-bold font-mono text-amber-400">
                  {earnedCerts.length} Obtidas
                </span>
                <span className="text-xs text-[#5e6382]">De 3 provas oficiais</span>
              </div>
              <div className="w-full bg-[#141625] h-1.5 rounded-sm mt-2 overflow-hidden">
                <div className="h-full bg-amber-400" style={{ width: `${(earnedCerts.length / 3) * 100}%` }} />
              </div>
            </div>

            <div className="bg-[#0a0c16] border border-[#1e2130] p-4 rounded-sm flex flex-col justify-between">
              <div>
                <span className="text-[10px] text-[#5e6382] uppercase font-bold font-mono tracking-wider">
                  Nível e Reconhecimento
                </span>
                <h4 className="text-sm font-bold text-white mt-1">Tier Profissional Atual</h4>
              </div>
              <div className="mt-4">
                <span className="text-[#c0c0cf] font-mono font-bold text-xs flex items-center space-x-1.5 bg-[#141625] border border-[#2d314d] p-1.5 px-2.5 rounded-sm">
                  <Award className="w-4 h-4 text-cyan-400" />
                  <span>{profile.currentTier}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* PRÓXIMO PASSO SUGERIDO */}
            <div className="bg-[#0a0c16] border border-[#1e2130] p-5 rounded-sm space-y-4">
              <h3 className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center space-x-1.5">
                <Compass className="w-4 h-4" />
                <span>Trilha de Aprendizado Recomendada</span>
              </h3>
              <div className="bg-[#141625] p-3.5 rounded-sm border border-[#2d314d] flex items-start space-x-3">
                <div className="shrink-0 rounded bg-cyan-600/10 p-2 text-cyan-400 text-xs font-mono font-bold">
                  PASS 1
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase font-mono">
                    Mitigar força bruta no Servidor-Auth
                  </h4>
                  <p className="text-[11px] text-[#8e93b2] mt-1">
                    Insira comandos no simulador de terminal para examinar logs SSH vazados com o script <code>cat /var/log/auth.log</code>.
                  </p>
                  <button
                    onClick={() => {
                      onSelectChallenge(challenges[0]);
                      onChangeSection('missao');
                    }}
                    className="mt-3 inline-flex items-center space-x-1 text-[10.5px] text-cyan-400 font-bold hover:underline"
                  >
                    <span>Abrir Laboratório</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="bg-[#141625]/40 p-3.5 rounded-sm border border-[#2d314d] flex items-start space-x-3 opacity-60">
                <div className="shrink-0 rounded bg-[#5e6382]/10 p-2 text-[#5e6382] text-xs font-mono font-bold">
                  PASS 2
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#c0c0cf] uppercase font-mono">
                    Responder à prova de Operador NOC I
                  </h4>
                  <p className="text-[11px] text-[#5e6382] mt-1">
                    Conquiste sua primeira certificação digital completando o quiz de 3 questões no módulo Certificações.
                  </p>
                </div>
              </div>
            </div>

            {/* NOTIFICATION FROM SIMULATION HEADQUARTERS */}
            <div className="bg-[#0a0c16] border border-[#1e2130] p-5 rounded-sm space-y-4">
              <h3 className="font-mono text-xs font-bold text-[#ef4444] uppercase tracking-wider flex items-center space-x-1.5">
                <Flame className="w-4 h-4 text-rose-500" />
                <span>Central de Notificações / Feed de Operações</span>
              </h3>
              <div className="space-y-2.5 font-mono text-[10.5px]">
                <div className="p-2 bg-rose-500/5 border border-rose-500/20 rounded-sm">
                  <span className="text-[#ef4444] font-bold">[SOC ALERTA]</span> Injeção de requisições anômalas porta SSH detectada no ISP Core. Reforcem os firewalls locais.
                </div>
                <div className="p-2 bg-emerald-500/5 border border-emerald-500/20 rounded-sm">
                  <span className="text-emerald-400 font-bold">[NOC INFO]</span> O tráfego de backbone com Rio de Janeiro (PTT-RJ) normalizou após o reset do link redundante.
                </div>
                <div className="p-2 bg-cyan-500/5 border border-cyan-500/20 rounded-sm">
                  <span className="text-cyan-400 font-bold">[ACADEMIA]</span> Nova postagem adicionada à Wiki do simulador: "Aprenda a mapear rotas usando filters route-maps via CLI".
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // 2. MAPA DO MUNDO
    case 'mapa': {
      return (
        <div className="space-y-6 text-left">
          <div className="bg-[#0a0c16] border border-[#1e2130] p-5 rounded-sm">
            <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center space-x-2">
              <Globe className="w-4 h-4 text-cyan-400" />
              <span>Diagnóstico de Conectividade do Backbone Nacional</span>
            </h2>
            <p className="text-xs text-[#8e93b2] mt-1">
              Testar e simular tempos de resposta e largura de canal entre hubs de trânsito. Clique em qualquer localidade para interagir.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
              <div className="lg:col-span-2 bg-[#05060a] border border-[#1e2130] p-4 rounded-sm relative min-h-[300px] flex flex-col justify-between">
                {/* Visual outline Map mock */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 0)', backgroundSize: '15px 15px' }} />

                <div className="relative z-10 flex flex-wrap gap-4 items-center justify-around h-full py-10">
                  {cityNodes.map(node => (
                    <button
                      key={node.name}
                      onClick={() => handleTriggerPingCity(node)}
                      className={`p-3.5 bg-[#0c0d1e] border rounded-sm relative text-left transition w-44 hover:border-cyan-500 ${selectedCityNode === node.name ? 'border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)] bg-cyan-950/10' : 'border-[#2d314d]'}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-zinc-400 font-bold">{node.name.split(' ')[0]}</span>
                        <span className={`h-2 w-2 rounded-full ${node.status === 'healthy' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                      </div>
                      <div className="mt-2 text-[10px] font-mono text-cyan-400">IP: {node.ip}</div>
                      <div className="text-[9px] font-mono text-[#5e6382] mt-1">Latência estimada: {node.latency}</div>
                    </button>
                  ))}
                </div>

                <div className="text-[10px] text-[#5e6382] font-mono text-center border-t border-[#1e2130]/60 pt-2">
                  Toque em um ponto do mapa para simular rotas síncronas de ping e analisar picos de saturação.
                </div>
              </div>

              <div className="bg-[#05060a] border border-[#1e2130] p-4 rounded-sm flex flex-col justify-between text-xs font-mono">
                <div>
                  <h4 className="text-xs font-bold text-white uppercase text-cyan-400">CONSOLE DE PING DO BACKBONE</h4>
                  <p className="text-[11px] text-[#5e6382] mt-1 leading-normal">
                    Exibe a transmissão de pacotes ICMP para monitorar degradação das fibras.
                  </p>

                  <div className="bg-[#07080f] p-3 rounded-sm border border-[#1e2130] mt-4 min-h-[160px] overflow-y-auto font-mono text-[10.5px]">
                    {selectedCityNode ? (
                      <div className="space-y-1">
                        <div className="text-cyan-400 font-bold"># Disparando ping para {selectedCityNode}...</div>
                        {pingOutput.map((line, idx) => (
                          <div key={idx} className={line.startsWith('-') ? 'text-[#5e6382]' : 'text-zinc-300'}>{line}</div>
                        ))}
                        {pinging && <div className="text-cyan-400 animate-pulse">Ping em progresso...</div>}
                      </div>
                    ) : (
                      <div className="text-[#5e6382] italic text-center pt-8">
                        Selecione um nó do mapa para ler telemetria dinâmica ICMP.
                      </div>
                    )}
                  </div>
                </div>

                {selectedCityNode && (
                  <div className="mt-4 pt-3 border-t border-[#1e2130] bg-[#0c0d1e]/40 p-2.5 rounded-sm">
                    {cityNodes.filter(n => n.name === selectedCityNode).map(node => (
                      <div key={node.name} className="space-y-1 text-[11px]">
                        <div className="flex justify-between"><span>Hub Tráfego:</span> <strong className="text-white">{node.speed}</strong></div>
                        <div className="flex justify-between"><span>Carga Ativa:</span> <strong className="text-amber-400">{node.load}</strong></div>
                        <div className="flex justify-between"><span>Status físico:</span> <strong className="text-emerald-400 uppercase font-black">{node.status}</strong></div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }

    // 3. LABORATÓRIOS
    case 'labs': {
      return (
        <div className="space-y-6 text-left">
          <div className="bg-[#0a0c16] border border-[#1e2130] p-5 rounded-sm">
            <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
              Central de Simulações e Laboratórios Operacionais
            </h2>
            <p className="text-xs text-[#8e93b2] mt-1">
              Desafios reais baseados em incidentes rotineiros nas grandes ISPs e centrais de Blue Team corporativos. Complete desafios para subir de nível e arrecadar créditos simulados.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              {challenges.map(chall => {
                const isActive = currentChallenge.id === chall.id;
                const isSolved = resolvedChallenges.includes(chall.id);

                return (
                  <div
                    key={chall.id}
                    className={`p-5 rounded-sm border flex flex-col justify-between h-[210px] text-left transition ${
                      isActive
                        ? 'bg-cyan-950/20 border-cyan-500/60 shadow-[0_0_20px_rgba(6,182,212,0.1)]'
                        : isSolved
                          ? 'bg-[#141625]/60 border-[#2d314d]'
                          : 'bg-[#141625] border-[#2d314d]'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-center text-[10px] font-mono">
                        <span className="text-[#5e6382] font-semibold">{chall.tier}</span>
                        {isSolved ? (
                          <span className="text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-sm border border-emerald-500/20 flex items-center space-x-1">
                            <Check className="w-3 h-3" />
                            <span>CONCLUÍDO</span>
                          </span>
                        ) : (
                          <span className="text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded-sm border border-amber-500/20">
                            PENDENTE
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-white mt-2 truncate font-mono">{chall.title}</h4>
                      <p className="text-[11px] text-[#8e93b2] mt-1 leading-normal line-clamp-3">
                        {chall.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#1e2130]/60 flex items-center justify-between">
                      <div className="text-[10px] font-mono">
                        <span className="text-cyan-400">+{chall.xpReward} XP</span>
                        <span className="text-[#5e6382] mx-1">|</span>
                        <span className="text-amber-400">+{chall.creditsReward} CC</span>
                      </div>
                      <button
                        onClick={() => {
                          onSelectChallenge(chall);
                          onChangeSection('missao');
                        }}
                        className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-black font-mono font-bold text-[10px] rounded-sm transition cursor-pointer"
                      >
                        Iniciar Lab 🛠️
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    // 4. ESPECIALIZAÇÕES
    case 'especializacoes': {
      return (
        <div className="space-y-6 text-left">
          <div className="bg-[#0a0c16] border border-[#1e2130] p-5 rounded-sm">
            <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
              Áreas de Especialização Técnica
            </h2>
            <p className="text-xs text-[#8e93b2] mt-1">
              Especializar-se em trilhas específicas concede títulos profissionais para impressionar os B2B Recruiters e habilitar conquistas.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {[
                { name: 'Redes Linux / CLI', icon: TerminalIcon, progress: 100, level: 'Mestre', desc: 'Sintaxe básica, filtros de logs, pipes, redirectors e permissões do Linux', badge: 'Especialista Linux' },
                { name: 'Engenharia IP Core / LAN', icon: Globe, progress: 80, level: 'Intermediário V', desc: 'Subredes, cálculos CIDR, endereçamento e redundância física LAN', badge: 'Arquiteto de IP' },
                { name: 'Roteamento Backbone BGP', icon: Shuffle, progress: 40, level: 'Iniciante III', desc: 'BGP peering, ASN, route-maps, prefix-lists e injeção de rotas dinâmicas', badge: 'Guardião do Backbone' },
                { name: 'Incident Response / SOC', icon: Shield, progress: 50, level: 'Junior II', desc: 'Análise de SIEM Wazuh, remoção de malwares backdoor e contenção síncrona', badge: 'Analista SOC' },
                { name: 'Infraestrutura Cloud Kubernetes', icon: Cloud, progress: 10, level: 'Aprendiz I', desc: 'Pods Kubernetes, Docker, container pools e balanceadores ingress', badge: 'Operador Cloud' }
              ].map(spec => (
                <div key={spec.name} className="p-4 bg-[#141625] border border-[#2d314d] rounded-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center space-x-2.5">
                      <div className="p-1.5 rounded-sm bg-cyan-500/10 text-cyan-400">
                        <spec.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white font-mono">{spec.name}</h4>
                        <span className="text-[9px] text-cyan-400 font-mono">Nível: {spec.level}</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-[#8e93b2] mt-2 leading-normal">
                      {spec.desc}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#1e2130]">
                    <div className="flex justify-between text-[10px] font-mono text-[#5e6382] mb-1">
                      <span>Progresso na Trilha</span>
                      <span className="text-white">{spec.progress}%</span>
                    </div>
                    <div className="w-full bg-[#05060a] h-1.5 rounded-sm overflow-hidden">
                      <div className="h-full bg-cyan-400" style={{ width: `${spec.progress}%` }} />
                    </div>
                    <div className="mt-3 text-[10px] bg-[#0c0d1e] p-1 px-2 border border-[#1e2130] rounded-sm text-center font-mono">
                      Título Desbloqueável: <strong className="text-amber-400 font-bold">{spec.badge}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // 5. INVENTÁRIO TÉCNICO
    case 'inventario': {
      return (
        <div className="space-y-6 text-left">
          <div className="bg-[#0a0c16] border border-[#1e2130] p-5 rounded-sm">
            <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center space-x-2">
              <HardDrive className="w-4 h-4 text-cyan-400" />
              <span>Inventário Técnico / Sala de Equipamentos</span>
            </h2>
            <p className="text-xs text-[#8e93b2] mt-1">
              Adquira módulos de hardware e licenças profissionais de simulação para melhorar suas métricas de uptime ou acelerar comandos CLI!
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {inventory.map(item => (
                <div key={item.id} className="p-4 bg-[#141625] border border-[#2d314d] rounded-sm flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-white uppercase font-mono">{item.name}</h4>
                    <p className="text-[11px] text-[#8e93b2] leading-normal">{item.desc}</p>
                    {item.bough ? (
                      <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 p-1 px-2 rounded-sm inline-block font-mono font-semibold">
                        ✓ INSTALADO NO NODE LAN
                      </span>
                    ) : (
                      <span className="text-[9px] text-[#5e6382] font-mono block uppercase">
                        Custo: <strong className="text-amber-400">{item.cost} CC</strong>
                      </span>
                    )}
                  </div>

                  {!item.bough && (
                    <button
                      onClick={() => handleBuyItem(item.id, item.cost)}
                      disabled={profile.cyberCredits < item.cost}
                      className={`px-3 py-1.5 text-[10px] font-mono font-bold rounded-sm transition shrink-0 cursor-pointer ${
                        profile.cyberCredits >= item.cost
                          ? 'bg-amber-500 hover:bg-amber-400 text-black'
                          : 'bg-[#05060a] text-[#5e6382] border border-[#1e2130] cursor-not-allowed'
                      }`}
                    >
                      Adquirir módulo
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // 6. TERMINAL LINUX SANDBOX
    case 'terminal': {
      return (
        <div className="space-y-6 text-left font-sans">
          <div className="bg-[#0a0c16] border border-[#1e2130] p-5 rounded-sm">
            <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center space-x-2">
              <TerminalIcon className="w-4 h-4 text-cyan-400" />
              <span>Interpretador CLI Independente (Playground)</span>
            </h2>
            <p className="text-xs text-[#8e93b2] mt-1">
              Pratique comandos do Unix/Linux sem a necessidade de estar em uma missão ativa. Ótimo para experimentar a sintaxe de rede livremente.
            </p>

            <div className="mt-5 border border-[#1e2130] rounded-sm bg-[#05060a] text-[#c0c0cf] font-mono text-xs overflow-hidden flex flex-col h-[350px]">
              {/* Header */}
              <div className="bg-[#0c0d1e] px-4 py-2 border-b border-[#1e2130] flex justify-between text-[#5e6382]">
                <span>user@sandbox-cli:~</span>
                <span>Console Sandbox Ativo</span>
              </div>

              {/* Logs */}
              <div className="flex-1 p-4 overflow-y-auto space-y-1.5">
                {sandboxLogs.map((log, idx) => (
                  <div
                    key={idx}
                    className={
                      log.type === 'system'
                        ? 'text-cyan-400 font-bold'
                        : log.type === 'input'
                          ? 'text-white'
                          : log.type === 'error'
                            ? 'text-rose-500'
                            : log.type === 'success'
                              ? 'text-emerald-400'
                              : 'text-zinc-300'
                    }
                  >
                    {log.text}
                  </div>
                ))}
              </div>

              {/* Input Command form */}
              <form onSubmit={handleSandboxSubmit} className="bg-[#07080f] p-2 border-t border-[#1e2130] flex items-center space-x-2">
                <span className="text-cyan-400 font-bold shrink-0">user@sandbox-cli:~$</span>
                <input
                  type="text"
                  value={sandboxCmd}
                  onChange={e => setSandboxCmd(e.target.value)}
                  placeholder="Digite comandos (ex: help, whoami, ifconfig)..."
                  className="flex-1 outline-none text-white border-none bg-transparent placeholder-zinc-700"
                />
              </form>
            </div>
          </div>
        </div>
      );
    }

    // 7. NOC TELEMETRIA
    case 'noc': {
      return (
        <div className="space-y-6 text-left">
          <div className="bg-[#0a0c16] border border-[#1e2130] p-5 rounded-sm">
            <div className="flex items-center justify-between border-b border-[#1e2130] pb-3 mb-4">
              <div>
                <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <span>Network Operations Center (NOC) Monitoria L3</span>
                </h2>
                <p className="text-xs text-[#8e93b2] mt-0.5">
                  Visualização em tempo real de banda de backbone dinâmico e indicadores de degradação de fibra.
                </p>
              </div>
              <div className="text-right font-mono text-xs">
                Uptime Global: <strong className="text-emerald-400">{uptime.toFixed(2)}%</strong>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 p-4 bg-[#05060a] border border-[#1e2130] rounded-sm text-left h-[210px] flex flex-col justify-between">
                <div className="text-[10px] text-[#5e6382] font-mono font-bold uppercase">Largura de Trânsito ISP (Kb/s)</div>
                <div className="h-[140px] w-full mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={simulatedMetrics}>
                      <XAxis dataKey="name" stroke="#2d314d" fontSize={8} tickLine={false} />
                      <YAxis stroke="#2d314d" fontSize={8} tickLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#05060a', borderColor: '#1e2130' }} />
                      <Area type="monotone" dataKey="tráfego" stroke="#06b6d4" fill="rgba(6,182,212,0.15)" strokeWidth={1.5} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="p-4 bg-[#05060a] border border-[#1e2130] rounded-sm flex flex-col justify-between">
                <div className="text-[10px] text-[#5e6382] font-mono font-bold uppercase">Uso de Rede Core do CPU</div>
                <div className="flex-1 flex flex-col justify-center mb-2 font-mono text-left">
                  <span className="text-3xl font-black text-rose-500 tracking-tighter">
                    {simulatedMetrics[simulatedMetrics.length - 1]?.cpu}%
                  </span>
                  <p className="text-[10px] text-zinc-500 mt-1">Uso atual síncrono consolidado de hardware e processamentos nativos.</p>
                </div>
                <div className="w-full bg-[#141625] h-2 rounded-sm overflow-hidden">
                  <div className="h-full bg-rose-500" style={{ width: `${simulatedMetrics[simulatedMetrics.length - 1]?.cpu}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // 8. SOC SEGURANÇA
    case 'soc': {
      return (
        <div className="space-y-6 text-left">
          <div className="bg-[#0a0c16] border border-[#1e2130] p-5 rounded-sm">
            <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center space-x-2">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span>Security Operations Center (SOC) Wazuh SIEM</span>
            </h2>
            <p className="text-xs text-[#8e93b2] mt-1">
              Registro estruturado de vazamento de segredos e detecções do agente Wazuh na LAN local.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
              <div className="lg:col-span-2 space-y-3 font-mono text-[10.5px]">
                <h4 className="text-[10px] text-[#5e6382] font-bold uppercase">STREAM LOG DE EVENTOS ATIVOS</h4>
                {alerts.map(al => (
                  <div key={al.id} className="p-3 bg-[#05060a] border border-[#1e2130] rounded-sm text-left flex justify-between items-center">
                    <div>
                      <span className={`font-bold ${al.severity === 'critical' ? 'text-rose-500' : 'text-amber-400'}`}>
                        [{al.severity.toUpperCase()}] {al.title}
                      </span>
                      <p className="text-[#8e93b2] mt-1 text-[10px]">{al.description}</p>
                    </div>
                    <span className="text-[9.5px] text-[#5e6382]">{al.status === 'resolved' ? '✓ Resolvido' : '● Ativo'}</span>
                  </div>
                ))}
              </div>

              <div className="bg-[#05060a] border border-[#1e2130] p-4 rounded-sm flex flex-col justify-between h-[230px]">
                <div>
                  <h4 className="text-[10px] text-[#5e6382] font-mono font-bold uppercase">Dano Consolidado</h4>
                  <p className="text-[11px] text-[#8e93b2] mt-1 font-mono leading-normal">
                    Frequência com que os sistemas sofreram descompressão.
                  </p>
                </div>
                <div className="h-[120px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={simulatedMetrics}>
                      <Bar dataKey="alertas" fill="#ef4444" radius={[1, 1, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // 9. BACKBONE BGP
    case 'backbone': {
      return (
        <div className="space-y-6 text-left">
          <div className="bg-[#0a0c16] border border-[#1e2130] p-5 rounded-sm">
            <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
              Arquitetura de Backbone ISP (AS-65112)
            </h2>
            <p className="text-xs text-[#8e93b2] mt-1">
              Esquemas dinâmicos de redirecionamento global. BGP Hijack ocorre se um peer anuncia prefixos mentirosos.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="p-4 bg-[#141625] border border-[#2d314d] rounded-sm text-xs font-mono space-y-3 leading-relaxed">
                <h4 className="text-xs font-bold text-cyan-400 uppercase">PEERING E VIZINHANÇAS</h4>
                <div className="p-2.5 bg-[#05060a] border border-[#1e2130] space-y-1 rounded-sm">
                  <div><strong>ASN Local:</strong> 65112</div>
                  <div><strong>Prefixos anunciados:</strong> 200.1.0.0/16</div>
                </div>

                <div className="p-2.5 bg-[#05060a] border border-[#1e2130] space-y-1 rounded-sm">
                  <div className="text-white font-bold">Neighbor 1: AS-65000 (Legítimo)</div>
                  <div>IP: 200.1.1.2 | Status: Established</div>
                </div>

                <div className="p-2.5 bg-rose-950/10 border border-rose-500/25 space-y-1 rounded-sm">
                  <div className="text-rose-400 font-bold">Neighbor 2: AS-54321 (Concorrente Hostil)</div>
                  <div>IP: 180.2.2.1 | Status: Hijacking IP 200.1.1.0/24!</div>
                </div>
              </div>

              <div className="bg-[#141625]/40 border border-[#2d314d] rounded-sm p-4 text-xs space-y-3 leading-relaxed">
                <h4 className="text-xs font-bold text-[#c0c0cf] uppercase font-mono">DICA DE SINTAXE DE SEGURANÇA</h4>
                <p className="text-[#8e93b2]">
                  Caso observe injeção de rotas do vizinho invasor, configure um range de filtros no route-map e aplique no neighbor direcionado na entrada (IN):
                </p>
                <pre className="bg-[#05060a] p-3 border border-[#1e2130] text-cyan-300 font-mono text-[10px] overflow-x-auto rounded-sm leading-normal">
                  route-map FILTER-BGP deny 10 {"\n"}
                  match ip address prefix-list FALSE-BGP {"\n"}
                  exit {"\n"}
                  router bgp 65112 {"\n"}
                  neighbor 180.2.2.1 route-map FILTER-BGP in {"\n"}
                  clear ip bgp 180.2.2.1 soft
                </pre>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // 10. CLOUD KUBERNETES
    case 'cloud': {
      return (
        <div className="space-y-6 text-left">
          <div className="bg-[#0a0c16] border border-[#1e2130] p-5 rounded-sm">
            <div className="flex justify-between items-center border-b border-[#1e2130] pb-3 mb-4">
              <div>
                <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center space-x-2">
                  <Cloud className="w-4 h-4 text-cyan-400" />
                  <span>Gerência de Microserviços Kubernetes Cloud</span>
                </h2>
                <p className="text-xs text-[#8e93b2] mt-0.5">
                  Audite o estado dos pods locais e verifique instabilidade.
                </p>
              </div>
              <div className="text-xs font-mono text-[#5e6382] flex items-center space-x-1.5">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>k8s-v1.30.2</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-[#05060a] border border-[#1e2130] p-4 rounded-sm text-xs font-mono">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xs font-bold text-cyan-400 uppercase">Tabela de Pods (kubectl get pods)</h4>
                  <div className="text-[10px] text-[#5e6382]">Replicas Clustered: {scalingReplicas}</div>
                </div>

                <div className="space-y-2">
                  {k8sPods.map(pod => (
                    <div key={pod.name} className="p-3 bg-[#0c0d1e] border border-[#1e2130] rounded-sm flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="text-white font-bold">{pod.name}</div>
                        <div className="text-[10px] text-[#5e6382]">CPU: {pod.cpu} | MEM: {pod.mem}</div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`text-[10.5px] font-bold uppercase ${pod.status === 'Running' ? 'text-emerald-400' : 'text-rose-500 animate-pulse'}`}>
                          {pod.status}
                        </span>
                        <button
                          onClick={() => handleRestartPod(pod.name)}
                          disabled={restartingPod === pod.name}
                          className="px-2 py-1 bg-[#141625] border border-[#2d314d] text-[10px] text-cyan-400 hover:border-cyan-500 rounded-sm cursor-pointer disabled:opacity-40"
                        >
                          {restartingPod === pod.name ? 'Reiniciando...' : 'kubectl restart'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#05060a] border border-[#1e2130] p-4 rounded-sm flex flex-col justify-between text-xs font-mono text-left leading-relaxed">
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase text-cyan-400">ESCALA RÁPIDA DE CONTAINERS</h4>
                  <p className="text-[#8e93b2]">
                    Regule a contagem de réplicas ativas dos PODs de transição de dados de modo a evitar saturação da CPU.
                  </p>
                  <div className="flex items-center justify-between bg-[#07080f] p-3 border border-[#1e2130] rounded-sm">
                    <span>Active Deployment Replicas:</span>
                    <strong className="text-white text-base font-black">{scalingReplicas}</strong>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setScalingReplicas(prev => Math.max(1, prev - 1))}
                      className="flex-1 py-1 px-2 bg-[#141625] border border-[#2d314d] text-center"
                    >
                      Downscale -1
                    </button>
                    <button
                      onClick={() => setScalingReplicas(prev => Math.min(20, prev + 1))}
                      className="flex-1 py-1 px-2 bg-cyan-600 font-bold text-black text-center"
                    >
                      Upscale +1
                    </button>
                  </div>
                </div>

                <div className="bg-[#07080f] p-3 border border-[#1e2130] rounded-sm text-[10.5px] text-[#5e6382] leading-normal mt-4">
                  Dica: Pods no estado <strong>CrashLoopBackOff</strong> representam containers que falharam no boot. Execute a reinicialização rápida para restaurá-los!
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // 11. CERTIFICAÇÕES
    case 'certificacoes': {
      return (
        <div className="space-y-6 text-left">
          <div className="bg-[#0a0c16] border border-[#1e2130] p-5 rounded-sm">
            <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
              Painel de Certificações e Exames Oficiais
            </h2>
            <p className="text-xs text-[#8e93b2] mt-1">
              Faça provas técnicas para chancelar suas competências. Provas exigem 100% de precisão para concessão do título.
            </p>

            {activeExam ? (
              // Quiz Active
              <div className="mt-6 bg-[#05060a] border border-[#1e2130] p-6 rounded-sm text-left font-mono">
                {exams.filter(e => e.id === activeExam).map(examItem => {
                  const currentQ = examItem.questions[examStep];

                  return (
                    <div key={examItem.id} className="space-y-6">
                      <div className="flex justify-between items-center border-b border-[#1e2130] pb-2 text-xs">
                        <span className="text-cyan-400 font-bold uppercase">{examItem.title}</span>
                        <span>Questão {examStep + 1} de {examItem.questions.length}</span>
                      </div>

                      {examPassed ? (
                        <div className="space-y-4 text-center py-6">
                          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-pulse" />
                          <h3 className="text-sm font-bold text-white">PARABÉNS! VOCÊ PASSOU NO EXAME!</h3>
                          <p className="text-xs text-[#8e93b2]">
                            O título técnico e as insígnias digitais correspondentes foram vinculados ao seu perfil de estudante de alta capacidade.
                          </p>
                          <div className="inline-block p-1 px-4.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 rounded-sm text-xs font-black">
                            Insignia Concedida: {examItem.badge} 🏅
                          </div>
                          <div className="mt-4 pt-3 flex gap-2">
                            <button
                              onClick={() => {
                                setEarnedCerts(prev => Array.from(new Set([...prev, examItem.badge])));
                                setActiveExam(null);
                              }}
                              className="w-full py-2 bg-cyan-600 text-black font-bold text-xs"
                            >
                              Finalizar e Resgatar Recompensas
                            </button>
                          </div>
                        </div>
                      ) : examFailed ? (
                        <div className="space-y-4 text-center py-6">
                          <XCircle className="w-12 h-12 text-rose-500 mx-auto" />
                          <h3 className="text-sm font-bold text-white">REPROVADO POR ERROS OPERACIONAIS</h3>
                          <p className="text-xs text-[#8e93b2]">
                            Exames de simulação exigem gabarito completo (100% acertos) para habilitar conformidade corporativa. Estude a Wiki e tente novamente.
                          </p>
                          <div className="mt-4 pt-3 flex gap-2">
                            <button onClick={() => handleStartExam(examItem.id)} className="w-full py-2 bg-[#141625] border border-[#2d314d] text-white">
                              Tentar Novamente
                            </button>
                            <button onClick={() => setActiveExam(null)} className="w-full py-2 bg-[#05060a] text-[#5e6382]">
                              Voltar ao Painel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <h4 className="text-sm font-bold text-white leading-relaxed">{currentQ.q}</h4>
                          <div className="space-y-2">
                            {currentQ.opts.map((opt, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleAnswerExam(idx)}
                                className="w-full text-left p-3.5 bg-[#0c0d1e] border border-[#1e2130] hover:border-cyan-500 text-xs text-zinc-300 rounded-sm hover:text-white transition cursor-pointer"
                              >
                                {idx + 1}. {opt}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              // Quiz List
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                {exams.map(exam => {
                  const alreadyDone = earnedCerts.includes(exam.badge);

                  return (
                    <div key={exam.id} className="p-4 bg-[#141625] border border-[#2d314d] rounded-sm flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between text-[9px] font-mono mb-2">
                          <span className="text-[#5e6382]">Dificuldade V</span>
                          {alreadyDone && <span className="text-emerald-400">✓ CONQUISTADO</span>}
                        </div>
                        <h4 className="text-xs font-bold text-white font-mono uppercase">{exam.title}</h4>
                        <p className="text-[11px] text-[#8e93b2] mt-2 leading-normal">
                          {exam.desc}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-[#1e2130] flex items-center justify-between">
                        <div className="text-[10px] font-mono text-cyan-400">
                          +{exam.rewardCredits} Credits
                        </div>
                        <button
                          onClick={() => handleStartExam(exam.id)}
                          className="px-3 py-1.5 bg-cyan-600 font-mono text-black font-semibold text-[10px] rounded-sm hover:bg-cyan-500 cursor-pointer"
                        >
                          {alreadyDone ? 'Refazer Exame 🔄' : 'Prestar exame 📝'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      );
    }

    // 12. DESAFIOS DIÁRIOS
    case 'diarios': {
      return (
        <div className="space-y-6 text-left animate-duration-1000">
          <div className="bg-[#0a0c16] border border-[#1e2130] p-5 rounded-sm">
            <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center space-x-2">
              <ListTodo className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>Desafios e Quests Diárias Operacionais</span>
            </h2>
            <p className="text-xs text-[#8e93b2] mt-1">
              Micro-tarefas diárias rápidas do tipo Blue Team para acumular recursos adicionais e turbinar seu XP operacional. Reclame créditos completando as de hoje!
            </p>

            <div className="space-y-4 mt-6">
              {dailies.map(daily => {
                const finished = completedDailies.includes(daily.id);

                return (
                  <div key={daily.id} className="p-4 bg-[#141625] border border-[#2d314d] rounded-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className={`h-2.5 w-2.5 rounded-full ${finished ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                        <h4 className="text-xs font-bold text-white uppercase font-mono">{daily.text}</h4>
                      </div>
                      <p className="text-[11px] text-[#8e93b2] font-mono">{daily.q}</p>
                      <div className="flex gap-2 mt-2">
                        {daily.opt.map((opt, oIdx) => (
                          <button
                            key={oIdx}
                            onClick={() => handleAnswerDaily(daily.id, oIdx, daily.ans)}
                            disabled={finished}
                            className="bg-[#05060a] border border-[#1e2130] p-1.5 px-3 rounded-sm text-[10px] font-mono hover:border-cyan-500 hover:text-white cursor-pointer disabled:opacity-40"
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="text-right font-mono text-[10.5px]">
                      {finished ? (
                        <span className="text-emerald-400 font-bold font-semibold">✓ RECOMPENSA RESGATADA</span>
                      ) : (
                        <span className="text-cyan-400">+50 CC / +100 XP</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    // 13. EVENTOS GLOBAIS
    case 'eventos': {
      return (
        <div className="space-y-6 text-left">
          <div className="bg-[#0a0c16] border border-[#1e2130] p-5 rounded-sm">
            <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center space-x-2">
              <Flame className="w-4 h-4 text-rose-500 animate-pulse" />
              <span>Eventos Globais Co-Operativos (Live Alerts)</span>
            </h2>
            <p className="text-xs text-[#8e93b2] mt-1">
              Catástrofes síncronas que demandam esforço operacional de múltiplos estudantes. Contribua fazendo mitigação de logs e configure regras de firewall!
            </p>

            <div className="space-y-4 mt-6">
              {[
                { name: 'Onda DDoS massiva PTT-SP', desc: 'Ataque direcionador de largura IP de 2.4 Tbps sufocando infra de redes.', difficulty: 'Hardcore', progress: 84 },
                { name: 'Campanha Ativa Apache Struts RCE', desc: 'Vulnerabilidade zero-day permitindo execução remota de código e webshell backdoor.', difficulty: 'Extremo', progress: 45 }
              ].map(evt => (
                <div key={evt.name} className="p-4 bg-[#141625] border border-[#2d314d] rounded-sm flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[8px] bg-rose-500/25 text-rose-400 border border-rose-500/30 p-1 rounded-sm uppercase font-mono font-bold">ALERTA GERAL ONLINE</span>
                      <h4 className="text-xs font-bold text-white font-mono uppercase mt-2">{evt.name}</h4>
                      <p className="text-[11px] text-[#8e93b2] leading-normal">{evt.desc}</p>
                    </div>
                    <span className="text-[10px] text-rose-400 font-mono font-semibold">Dificuldade: {evt.difficulty}</span>
                  </div>

                  <div className="mt-4 pt-3.5 border-t border-[#1e2130]">
                    <div className="flex justify-between font-mono text-[10px] text-[#5e6382] mb-1">
                      <span>Esforço Coletivo de Mitigação</span>
                      <span className="text-cyan-400 font-bold">{evt.progress}% Resolvido</span>
                    </div>
                    <div className="w-full bg-[#05060a] h-2 rounded-sm overflow-hidden">
                      <div className="h-full bg-rose-500" style={{ width: `${evt.progress}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // 14. RANKING GLOBAL
    case 'ranking': {
      return (
        <div className="space-y-6 text-left">
          <div className="bg-[#0a0c16] border border-[#1e2130] p-5 rounded-sm">
            <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center space-x-2">
              <UserCheck className="w-4 h-4 text-cyan-400" />
              <span>Leaderboard Técnico Global / Ranking Alunos</span>
            </h2>
            <p className="text-xs text-[#8e93b2] mt-1">
              Sua posição baseada em nível consolidado, MTTR médio (Tempo de Resolução), e laboratórios limpos operacionais.
            </p>

            <div className="mt-4 border border-[#1e2130] bg-[#05060a] rounded-sm font-mono text-xs overflow-hidden">
              <div className="bg-[#0c0d1e] p-3 px-4 text-[#5e6382] flex justify-between font-bold uppercase tracking-wider">
                <span className="w-16">Posição</span>
                <span className="flex-1">Operador / Pseudônimo</span>
                <span className="w-24 text-center">Nível</span>
                <span className="w-28 text-right">MTTR Médio</span>
              </div>

              {[
                { r: '1º', name: 'Backbone_God ⚡', level: 144, mttr: '2m 14s', active: false },
                { r: '2º', name: 'Sudoers_Warlord 🔑', level: 98, mttr: '5m 45s', active: false },
                { r: '3º', name: 'Packets_Slayer 🦈', level: 75, mttr: '6m 12s', active: false },
                { r: '4º', name: 'Recrita Ops (Você)', level: profile.level, mttr: '11m 40s', active: true },
                { r: '5º', name: 'BlueTeam_Br 🛡️', level: 4, mttr: '14m 02s', active: false }
              ].map(user => (
                <div
                  key={user.r}
                  className={`p-3.5 px-4 flex justify-between border-b border-[#1e2130] hover:bg-[#141625]/20 ${user.active ? 'bg-cyan-500/5 border-l-2 border-cyan-500 text-cyan-400' : 'text-[#c0c0cf]'}`}
                >
                  <span className="w-16 font-bold">{user.r}</span>
                  <span className="flex-1 font-sans">{user.name}</span>
                  <span className="w-24 text-center font-bold">{user.level}</span>
                  <span className="w-28 text-right font-bold text-amber-400">{user.mttr}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // 15. EQUIPE / CLÃ
    case 'equipe': {
      return (
        <div className="space-y-6 text-left">
          <div className="bg-[#0a0c16] border border-[#1e2130] p-5 rounded-sm">
            <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center space-x-2">
              <Users className="w-4 h-4 text-cyan-400" />
              <span>Divisões de Guildas e Blue-Teams (Clãs)</span>
            </h2>
            <p className="text-xs text-[#8e93b2] mt-1">
              Colabore em grupos dinâmicos corporativos de segurança, combinando sua MTTR para subir no leaderboard de clãs e acumular multiplicadores síncronos de CC.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="p-4 bg-[#141625] border border-[#2d314d] rounded-sm text-xs font-mono">
                <h4 className="text-xs font-bold text-white uppercase font-mono mb-3">Seu Clã Operacional</h4>
                <div className="p-4 bg-[#05060a] border border-[#1e2130] rounded-sm space-y-3 leading-relaxed text-left">
                  <div className="flex gap-2.5 items-center">
                    <div className="h-10 w-10 bg-gradient-to-r from-red-600 to-rose-600 rounded-sm flex items-center justify-center text-white font-black text-xl">
                      AS
                    </div>
                    <div>
                      <h5 className="font-bold text-white text-sm uppercase">AS-SUDOERS NETWORKING DIVISION</h5>
                      <span className="text-[10px] text-[#5e6382]">Líder: root_slayer66</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-[#8e93b2] mt-2">
                    "Configurando roteadores reais, contendo Ransomwares e defendendo o ASN com persistência."
                  </p>
                  <div className="border-t border-[#1e2130] pt-2 flex justify-between text-[10px]">
                    <span>Multiplicador Clã:</span>
                    <strong className="text-cyan-400">1.25x CC Boost</strong>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-[#141625] border border-[#2d314d] rounded-sm font-sans flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white uppercase font-mono mb-3">DURANTE OS EVENTOS DE AUDITORIA</h4>
                  <p className="text-xs text-[#8e93b2] leading-relaxed">
                    Estar vinculado a um Blue Team permite dividir tarefas nos desafios simulados síncronos e trocar dicas práticas de comandos CLI e relatórios de MTTR de forma descentralizada.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#1e2130] bg-[#0c0d1e] p-2.5 rounded-sm">
                  <span className="block text-[8px] font-mono uppercase font-bold text-[#5e6382]">Membros Ativos Atualmente</span>
                  <div className="flex items-center gap-1.5 mt-1.5 text-xs font-mono text-zinc-300">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>root_slayer66 (Established), hacker_slayer, userOps18</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // 16. MENTOR IA (FREESTANDING CHAT BOX)
    case 'mentor': {
      return (
        <div className="space-y-6 text-left">
          <div className="bg-[#0a0c16] border border-[#1e2130] p-5 rounded-sm">
            <h2 className="text-xs font-bold text-white uppercase font-mono tracking-wider mb-2">Central do Mentor IA Técnico</h2>
            <p className="text-xs text-[#8e93b2] leading-relaxed">
              Consulte seu líder de Blue Team para tirar quaisquer dúvidas de infraestrutura síncrona. Digite comandos ou pergunte conselhos profissionais.
            </p>
            <div className="mt-4 font-sans text-xs italic text-[#5e6382]">
              Dica: O painel de conversação direta está disponível na lateral direita do <strong>NOC/SOC Operations HUB</strong> (aba Continuar Missão). Acesse-o lá para bater papo contextualizado integrado com os simuladores de CLI e ver os relatórios de erros!
            </div>
          </div>
        </div>
      );
    }

    // 17. WIKI TÉCNICA
    case 'wiki': {
      const [searchQuery, setSearchQuery] = useState('');

      const wikiDocs = [
        { title: 'ls e cat (Varredura de Logs)', keywords: 'ls cat logs linux console', body: 'ls lista diretórios locais, cat lê arquivos por padrão. Muito útil no monitoramento de logs do auth.log.' },
        { title: 'grep filtros rápidos', keywords: 'grep filter linux pipe logs terminal', body: 'Filtra strings úteis. Exemplo: grep "Failed password" /var/log/auth.log extrai todos os logins SSH que falharam.' },
        { title: 'ps aux e kill -9 (Gestão de processos)', keywords: 'ps kill process malware pid processamento', body: 'ps aux exibe identificadores PID e percentual de CPU de cada binário em background. kill -9 <PID> cessa imediatamente o binário malicioso do Ransomware.' },
        { title: 'BGP Route-Maps (Engenharia de Rota)', keywords: 'bgp route-map routing asn vizinho', body: 'Cria filtros síncronos amarrados no neighbor terminal na direção de importação (IN) para barrar falsos anúncios de rotas sequestradas.' },
        { title: 'Chmod permissões digitais', keywords: 'chmod index perms permissao linux html', body: 'Regula visibilidade e escrita. chmod 644 index.html garante privilégio de leitura pública e escrita exclusiva para o root.' },
      ];

      const filteredDocs = wikiDocs.filter(d =>
        d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.keywords.toLowerCase().includes(searchQuery.toLowerCase())
      );

      return (
        <div className="space-y-6 text-left">
          <div className="bg-[#0a0c16] border border-[#1e2130] p-5 rounded-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1e2130] pb-3 mb-4">
              <div>
                <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 text-cyan-400" />
                  <span>Manual de Sobrevivência e Wiki Técnica Integrada</span>
                </h2>
                <p className="text-xs text-[#8e93b2] mt-0.5">
                  Consulte sintaxe, terminologias, e códigos operacionais recomendados a qualquer momento.
                </p>
              </div>

              {/* Search filter input */}
              <div className="relative font-mono text-xs w-full md:w-64">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#5e6382]" />
                <input
                  type="text"
                  placeholder="Pesquisar manual..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-[#05060a] border border-[#1e2130] rounded-sm py-1.5 pl-8 pr-3 outline-none text-white focus:border-cyan-500 placeholder-zinc-700"
                />
              </div>
            </div>

            <div className="space-y-4">
              {filteredDocs.map(doc => (
                <div key={doc.title} className="p-4 bg-[#141625] border border-[#2d314d] rounded-sm leading-relaxed text-xs">
                  <h4 className="text-xs font-bold text-cyan-400 uppercase font-mono mb-2">{doc.title}</h4>
                  <p className="text-zinc-300 text-[11px] leading-relaxed">{doc.body}</p>
                </div>
              ))}
              {filteredDocs.length === 0 && (
                <div className="text-center py-6 text-zinc-500 font-mono">
                  Sintaxe ou conceito não localizado no manual integrado. Tente termos chaves como log, route-map ou ps.
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    // 18. CONFIGURAÇÕES
    case 'configuracoes': {
      return (
        <div className="space-y-6 text-left">
          <div className="bg-[#0a0c16] border border-[#1e2130] p-5 rounded-sm">
            <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>Painel de Ajustes Operacionais e Nível do Simulador</span>
            </h2>
            <p className="text-xs text-[#8e93b2] mt-1">
              Configure filtros gráficos adicionais, alertas e modifique o nível de dificuldade operacional de acordo com seus conhecimentos técnicos.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="p-4 bg-[#141625] border border-[#2d314d] rounded-sm text-xs font-mono space-y-4">
                <h4 className="text-xs font-bold text-cyan-400 uppercase font-mono">MODOS DE APRENDIZADO</h4>
                <div className="space-y-2">
                  {[
                    { id: 'iniciante', name: 'Modo Iniciante', desc: 'Dicas persistentes e explanações passo a passo CLI.' },
                    { id: 'intermediario', name: 'Modo Intermediário', desc: 'Alertas estruturados em background.' },
                    { id: 'avancado', name: 'Modo Avançado', desc: 'Menos dicas, penalidade por MTTR síncrona e clientes simulados irritados.' },
                    { id: 'hardcore', name: 'Modo Hardcore', desc: 'Picos severos de tráfego, múltiplos incidentes na rede LAN.' },
                    { id: 'realista', name: 'Modo Realista SLA', desc: 'Impacto financeiro virtual baseado no tempo de restauração.' }
                  ].map(mode => (
                    <button
                      key={mode.id}
                      onClick={() => setGameMode(mode.id)}
                      className={`w-full p-2.5 rounded-sm border text-left transition cursor-pointer flex justify-between items-center ${
                        gameMode === mode.id
                          ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400 font-bold'
                          : 'bg-[#05060a] border-[#1e2130] text-[#a5a9c2]'
                      }`}
                    >
                      <div>
                        <div className="font-bold">{mode.name}</div>
                        <div className="text-[9.5px] text-[#5e6382] mt-0.5 leading-normal">{mode.desc}</div>
                      </div>
                      {gameMode === mode.id && <Check className="w-4 h-4 shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-[#141625] border border-[#2d314d] rounded-sm font-mono text-xs space-y-4">
                <h4 className="text-xs font-bold text-[#c0c0cf] uppercase font-mono">INTERFACE E COMPILADORES</h4>

                <div className="flex items-center justify-between border-b border-[#1e2130] pb-2">
                  <span>Efeito de Filtros CRT no Console:</span>
                  <button onClick={() => setCrtFilter(!crtFilter)} className="px-2 py-1 bg-[#05060a] border border-[#1e2130] text-cyan-400 rounded-sm">
                    {crtFilter ? 'ATIVADO' : 'DESACTIVADO'}
                  </button>
                </div>

                <div className="flex items-center justify-between border-b border-[#1e2130] pb-2">
                  <span>Sinal Sonoro de Bip SSH:</span>
                  <button onClick={() => setSoundEnabled(!soundEnabled)} className="px-2 py-1 bg-[#05060a] border border-[#1e2130] text-cyan-400 rounded-sm">
                    {soundEnabled ? 'ATIVADO' : 'MUTADO'}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span>Escala HUD das Topologias:</span>
                  <select
                    value={hudScale}
                    onChange={e => setHudScale(e.target.value)}
                    className="bg-[#05060a] border border-[#1e2130] text-cyan-400 p-1 rounded-sm cursor-pointer outline-none font-mono"
                  >
                    <option value="90%">90% (Denso)</option>
                    <option value="100%">100% (Padrão)</option>
                    <option value="110%">110% (Ampliado)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // 19. AJUDA RÁPIDA (ONBOARDING)
    case 'ajuda': {
      return (
        <div className="space-y-6 text-left">
          <div className="bg-[#0a0c16] border border-[#1e2130] p-5 rounded-sm">
            <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center space-x-2">
              <HelpCircle className="w-5 h-5 text-cyan-400" />
              <span>Tutorial de Integração de Boas-vindas (Onboarding)</span>
            </h2>
            <p className="text-xs text-[#8e93b2] mt-1">
              Dúvidas frequentes de novatos sobre como operar o simulador. Siga o guia sequencial:
            </p>

            <div className="space-y-4 mt-6 text-xs text-[#c0c0cf] font-sans leading-relaxed">
              {[
                { title: '1. Como analisar o mapa de conexões do laboratório?', desc: 'O mapa gráfico exibe roteadores, servidores e as pontes LAN em tempo real. Se houver picos de congestionamento ou comprometimentos, os nós piscarão na cor vermelha e alarmes do Wazuh soarão no NOC.' },
                { title: '2. Como resolvo o console do terminal?', desc: 'Você deve interagir com os hosts. Selecione um roteador no mapa, estude os comandos correspondentes digitando "help" e insira as correções necessárias (ex: chmod, kill -9 ou configure terminal BGP).' },
                { title: '3. Como obter ajuda se eu ficar perdido?', desc: 'Abra a aba do NOC/SOC HUB e use a caixa de diálogo do Mentor IA no menu direito. Ele identificará o que falta fazer e recomendará didaticamente o próximo passo operacional sem revelar comandos explícitos diretivos.' }
              ].map(guide => (
                <div key={guide.title} className="p-4 bg-[#141625] border border-[#2d314d] rounded-sm">
                  <h4 className="text-xs font-bold text-white uppercase font-mono mb-2">{guide.title}</h4>
                  <p className="text-[11.5px] leading-relaxed mt-1 text-[#8e93b2]">{guide.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // 20. TUTORIAL (COMMAND TRAINER)
    case 'tutorial': {
      return (
        <div className="space-y-6 text-left">
          <div className="bg-[#0a0c16] border border-[#1e2130] p-5 rounded-sm">
            <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
              Treinador Sintático CLI (Tutorial de Comandos)
            </h2>
            <p className="text-xs text-[#8e93b2] mt-1">
              Pratique a escrita exata de filtros lógicos comuns do Unix e roteamento Backbone para memorizar e evitar erros operacionais síncronos.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 leading-relaxed">
              <div className="p-4 bg-[#141625] border border-[#2d314d] rounded-sm text-xs space-y-3 font-mono">
                <h4 className="text-xs font-bold text-cyan-400 uppercase">MÓDULO 1: FILTRAR FALHAS DE SSH NO SYSLOG</h4>
                <p className="text-[#8e93b2]">
                  Utilizamos comandos baseados no buscador regexp nativo para vasculhar logs anômalos. Digite exatamente a cadeia para encontrar logins SSH inválidos:
                </p>
                <div className="bg-[#05060a] p-3 border border-[#1e2130] rounded-sm text-center">
                  <code className="text-white text-xs select-all">grep "Failed password" /var/log/auth.log</code>
                </div>
              </div>

              <div className="p-4 bg-[#141625] border border-[#2d314d] rounded-sm text-xs space-y-3 font-mono">
                <h4 className="text-xs font-bold text-cyan-400 uppercase">MÓDULO 2: ENCERRAMENTO IMEDIATO DE INCIDENTE</h4>
                <p className="text-[#8e93b2]">
                  Quando identificamos um ransomware consorciado com alta CPU em background, enviamos sinal 9 (TERM) com o ID de processo correspondente:
                </p>
                <div className="bg-[#05060a] p-3 border border-[#1e2130] rounded-sm text-center">
                  <code className="text-white text-xs select-all">kill -9 1442</code>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // 21. ACADEMIA (THEORY READINGS)
    case 'academia': {
      return (
        <div className="space-y-6 text-left">
          <div className="bg-[#0a0c16] border border-[#1e2130] p-5 rounded-sm">
            <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
              Aulas Teóricas e Caderno de Redes de Computadores
            </h2>
            <p className="text-xs text-[#8e93b2] mt-1">
              Estude teorias sólidas para gabaritar os exames de certificações. Conteúdo didático elaborado por engenheiros sêniores de backbone.
            </p>

            <div className="space-y-4 mt-6 text-xs text-[#c0c0cf] leading-relaxed">
              {[
                { title: 'A CAMADA OSI ENCAPSULATION DE DADOS', desc: 'Redes operam em 7 camadas lógicas. Dispositivos comuns tipo Switches atuam em Camada 2 (Data-Link) tratando frames Ethernet baseados em endereços MAC físicos. Roteadores e gateways operam em Camada 3 (Network) tratando pacotes baseados em protocolos IP CIDR, decidindo trajetórias redundantes.' },
                { title: 'COMO FUNCIONA O PROTOCOLO BGP', desc: 'BGP (Border Gateway Protocol) é o tecido dinâmico de roteamento que mantém a rede mundial amarrada. Ele opera anunciando prefixos IP de sistemas autónomos (AS). Quando um AS criminoso mente anunciando subredes de terceiros (BGP Hijacking), força o tráfego global a passar por rotas invasoras. Solucionamos isso aplicando route-map defensivo deny.' }
              ].map(aca => (
                <div key={aca.title} className="p-4 bg-[#141625] border border-[#2d314d] rounded-sm">
                  <h4 className="text-xs font-bold text-white uppercase font-mono mb-2">{aca.title}</h4>
                  <p className="text-[11.5px] mt-1 leading-relaxed text-[#8e93b2]">{aca.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // 22. HISTÓRICO DE INCIDENTES
    case 'historico': {
      return (
        <div className="space-y-6 text-left">
          <div className="bg-[#0a0c16] border border-[#1e2130] p-5 rounded-sm">
            <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
              Histórico Operacional de Resolução de Chamados
            </h2>
            <p className="text-xs text-[#8e93b2] mt-1">
              Registro crônico dos incidentes operados pelo aluno desde o início do treinamento.
            </p>

            <div className="mt-4 border border-[#1e2130] bg-[#05060a] rounded-sm font-mono text-xs overflow-hidden">
              <div className="bg-[#0c0d1e] p-3 px-4 text-[#5e6382] flex justify-between font-bold uppercase">
                <span>Laboratório de Rede / Incidente</span>
                <span>Uptime Resolvido</span>
                <span>Relatório Técnico</span>
              </div>

              {resolvedChallenges.length === 0 ? (
                <div className="p-6 text-center text-zinc-500 italic">
                  Nenhum chamado foi mitigado ainda nesta sessão. Complete desafios na aba Laboratórios!
                </div>
              ) : (
                resolvedChallenges.map(challId => {
                  const targetChall = challenges.find(c => c.id === challId);
                  if (!targetChall) return null;

                  return (
                    <div key={challId} className="p-3.5 px-4 flex justify-between border-b border-[#1e2130] hover:bg-[#141625]/20">
                      <span className="text-white font-bold">{targetChall.title}</span>
                      <span className="text-emerald-400 font-bold">100.00% [ESTÁVEL]</span>
                      <span className="text-cyan-400 text-[10.5px]">✓ Conformidade OK</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      );
    }

    // 23. ESTATÍSTICAS
    case 'estatisticas': {
      const statsData = [
        { subject: 'Linux CLI', score: 95 },
        { subject: 'IPv4 Rede', score: 80 },
        { subject: 'Firewalling IPtables', score: resolvedChallenges.includes('soc-ransomware') ? 70 : 15 },
        { subject: 'Dinâmicas BGP', score: resolvedChallenges.includes('bgp-hijacking') ? 95 : 10 },
        { subject: 'SIEM Wazuh', score: resolvedChallenges.includes('soc-ransomware') ? 90 : 20 },
      ];

      return (
        <div className="space-y-6 text-left">
          <div className="bg-[#0a0c16] border border-[#1e2130] p-5 rounded-sm">
            <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
              Análise e Métricas de Capacitação do Recruta
            </h2>
            <p className="text-xs text-[#8e93b2] mt-1">
              Desempenho com base nas interações com o CLI, velocidade de MTTR, e exames concluídos do simulador.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <div className="p-4 bg-[#05060a] border border-[#1e2130] rounded-sm text-xs font-mono h-[240px] flex flex-col justify-between">
                <h4 className="text-[10px] text-[#5e6382] font-mono font-bold uppercase mb-2">Acurácia de Comandos e Resolução</h4>
                <div className="flex-1 w-full min-h-[140px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={simulatedMetrics}>
                      <XAxis dataKey="name" stroke="#2d314d" fontSize={8} />
                      <YAxis stroke="#2d314d" fontSize={8} />
                      <Tooltip />
                      <Line type="monotone" dataKey="cpu" stroke="#06b6d4" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="p-4 bg-[#05060a] border border-[#1e2130] rounded-sm text-xs font-mono">
                <h4 className="text-[10px] text-[#5e6382] font-mono font-bold uppercase mb-3">CONHECIMENTO POR DOMÍNIO TÉCNICO</h4>
                <div className="space-y-3">
                  {statsData.map(stat => (
                    <div key={stat.subject}>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span>{stat.subject}</span>
                        <span className="text-cyan-400 font-bold">{stat.score}/100</span>
                      </div>
                      <div className="w-full bg-[#141625] h-2 rounded-sm overflow-hidden">
                        <div className="h-full bg-cyan-400" style={{ width: `${stat.score}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    default:
      return null;
  }
}
