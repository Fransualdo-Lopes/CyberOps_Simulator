import { Challenge } from '../types';

export const CHALLENGES: Challenge[] = [
  {
    id: 'linux-basics',
    title: 'Linux CLI - Análise de Logs de Acesso',
    tier: 'Suporte N1',
    xpReward: 350,
    creditsReward: 150,
    description: 'Investigue o arquivo de autenticação local para identificar tentativas de invasão por força bruta.',
    context: 'Você recebeu um chamado urgente: usuários estão reclamando de instabilidade no servidor de autenticação de clientes (Servidor-Auth). Logs indicam acessos síncronos excessivos. Diagnostique qual o IP de origem desse ataque e responda à IA.',
    deviceContext: 'Servidor-Auth',
    targetUptime: 99.1,
    initialLogs: [
      'Conectado ao Servidor-Auth (Ubuntu 24.04 LTS)',
      'Digite "help" para ver os comandos simulados disponíveis.',
      'user@servidor-auth:~$ '
    ],
    correctCommands: [
      'cat /var/log/auth.log',
      'grep "Failed password" /var/log/auth.log'
    ],
    hints: [
      'Use o comando "ls -lh /var/log" para listar os arquivos de log disponíveis.',
      'O comando "cat /var/log/auth.log" exibirá o conteúdo do log de autenticações.',
      'Utilize o comando "grep" para pesquisar por "Failed password" no arquivo de log e filtre a saída.'
    ],
    initialNodes: [
      { id: 'cli-user', label: 'Estação Aluno', type: 'switch', status: 'healthy', x: 100, y: 150, description: 'Sua estação de diagnóstico segura' },
      { id: 'Servidor-Auth', label: 'Servidor-Auth', type: 'server', status: 'warning', ip: '192.168.10.25', x: 300, y: 150, description: 'Servidor Linux de autenticação corporativa' },
      { id: 'switch-core', label: 'Switch L3 Core', type: 'switch', status: 'healthy', x: 500, y: 150, description: 'Ponto central de comunicação da rede interna' },
      { id: 'hacker-node', label: 'IP Suspeito (Internet)', type: 'internet', status: 'compromised', ip: '198.51.100.42', x: 700, y: 150, description: 'Origem desconhecida gerando requisições DDoS secundárias' }
    ],
    initialLinks: [
      { from: 'cli-user', to: 'Servidor-Auth', status: 'normal', bandwidthMbps: 100 },
      { from: 'Servidor-Auth', to: 'switch-core', status: 'saturated', bandwidthMbps: 10 },
      { from: 'switch-core', to: 'hacker-node', status: 'saturated', bandwidthMbps: 100 }
    ],
    initialAlerts: [
      { id: 'al-auth-1', severity: 'medium', title: 'Sobrecargas CPU Servidor-Auth', description: 'Uso de CPU excedeu 85% devido a tentativas de login contínuas.', source: 'Zabbix Agent', timestamp: 'Agora mesmo', status: 'active' },
      { id: 'al-auth-2', severity: 'low', title: 'IP 198.51.100.42 Conectado', description: 'IP externo efetuou +500 conexões de rede na porta SSH.', source: 'Wazuh SIEM', timestamp: 'Há 2 minutos', status: 'active' }
    ]
  },
  {
    id: 'soc-ransomware',
    title: 'SOC - Neutralização de Ransomware e Web Shell',
    tier: 'Analista NOC/SOC N2',
    xpReward: 800,
    creditsReward: 300,
    description: 'Vasculhe os processos correndo em background, finalize a rotina maliciosa que criptografou o servidor Apache e exclua o Web Shell.',
    context: 'Incident Response: O servidor "Servidor-HTTP" teve seus arquivos de web alterados para a extensão ".crypto". O SIEM do Wazuh detectou picos severos de leitura em disco causados por um processo oculto de um usuário comum (/tmp/malware-encryptor). Vá até o console deste servidor, encerre o processo do malware, remova o arquivo do web shell (backdoor.php) em /var/www/html/ e restaure as permissões corretas.',
    deviceContext: 'Servidor-HTTP',
    targetUptime: 95.0,
    initialLogs: [
      'Conectado ao Servidor-HTTP (Debian Linux Server)',
      'Aviso: Muitos processos de I/O de disco rodando na pasta /var/www/html!',
      'user@servidor-http:~$ '
    ],
    correctCommands: [
      'ps aux',
      'kill -9 1442',
      'rm -rf /var/www/html/backdoor.php',
      'chmod 644 /var/www/html/index.html'
    ],
    hints: [
      'Digite "ps aux" para achar o número de ID do processo (PID) malicioso (/tmp/backdoor que está usando alta CPU).',
      'Use o comando "kill -9 <PID>" para matar o processo anômalo (PID 1442).',
      'Use o comando "rm" para apagar permanentemente o Web Shell "/var/www/html/backdoor.php".',
      'Corrija as permissões do index para escrita segura rodando "chmod 644 /var/www/html/index.html".'
    ],
    initialNodes: [
      { id: 'Servidor-HTTP', label: 'Servidor-HTTP', type: 'server', status: 'compromised', ip: '10.0.0.8', x: 250, y: 150, description: 'Servidor Apache hospedando o portal principal' },
      { id: 'Wazuh-SIEM', label: 'Wazuh-SIEM', type: 'server', status: 'healthy', ip: '10.0.0.50', x: 450, y: 250, description: 'Coletor central de telemetria e segurança SOC' },
      { id: 'Banco-Dados', label: 'Banco-Dados', type: 'database', status: 'healthy', ip: '10.0.0.30', x: 650, y: 150, description: 'Base SQL Corporativa com transações financeiras' }
    ],
    initialLinks: [
      { from: 'Servidor-HTTP', to: 'Wazuh-SIEM', status: 'normal', bandwidthMbps: 1000 },
      { from: 'Servidor-HTTP', to: 'Banco-Dados', status: 'normal', bandwidthMbps: 1000 }
    ],
    initialAlerts: [
      { id: 'al-rs-1', severity: 'critical', title: 'Integridade de Arquivo Comprometida', description: 'FIM alert: Mudança brutal na extensão dos arquivos web para .crypto', source: 'Wazuh Agent-08', timestamp: 'Há 1 minuto', status: 'active' },
      { id: 'al-rs-2', severity: 'critical', title: 'Processo malicioso ativo', description: 'Invocação do binário criptográfico de origem anônima PID 1442', source: 'Sysmon-Linux', timestamp: 'Há 30 segundos', status: 'active' }
    ]
  },
  {
    id: 'bgp-hijacking',
    title: 'Core ISP - Mitigação de Sequestro BGP',
    tier: 'Engenheiro de Backbone',
    xpReward: 1500,
    creditsReward: 600,
    description: 'Crie filtros de anúncios BGP via Route-Map para salvar o tráfego do banco FintechSecure do sequestro criminoso do AS concorrente.',
    context: 'O ISP concorrente AS-54321 começou a anunciar o prefixo IP 200.1.1.0/24 correspondente ao core bancário. O tráfego legítimo foi desviado. Acesse a console do "Roteador-Core-01", estude o status do peer usando "show ip bgp summary", e crie um filtro proibindo anúncios falsos desse vizinho definindo um prefixo de descarte in route-map.',
    deviceContext: 'Roteador-Core-01',
    targetUptime: 99.99,
    initialLogs: [
      'Conectado ao Roteador-Core-01 (FRRouting OS v10.0)',
      'AS Local: 65112 | Prefixo: 200.1.0.0/16',
      'Roteador-Core-01# '
    ],
    correctCommands: [
      'show ip bgp summary',
      'configure terminal',
      'route-map FILTER-BGP deny 10',
      'match ip address prefix-list FALSE-BGP',
      'exit',
      'router bgp 65112',
      'neighbor 180.2.2.1 route-map FILTER-BGP in',
      'exit',
      'clear ip bgp 180.2.2.1 soft'
    ],
    hints: [
      'Visualize os Peers e o estado das sessões rodando "show ip bgp summary". O vizinho 180.2.2.1 está injetando rotas inválidas.',
      'Acesse o modo de configuração digitando "configure terminal".',
      'Crie a regra de restrição com "route-map FILTER-BGP deny 10" e amarre com a prefix-list configurando "match ip address prefix-list FALSE-BGP".',
      'Entre no escopo de roteamento "router bgp 65112" e aplique o route-map na importação com "neighbor 180.2.2.1 route-map FILTER-BGP in".',
      'Force o recálculo da tabela BGP sem derrubar o enlace físico rodando fora de config o comando "clear ip bgp 180.2.2.1 soft".'
    ],
    initialNodes: [
      { id: 'Roteador-Core-01', label: 'Roteador-Core-01', type: 'router', status: 'warning', ip: '200.1.1.1', x: 200, y: 150, description: 'Roteador de borda principal do Backbone (AS-65112)' },
      { id: 'FintechSecure-AS', label: 'Parceiro Bancário', type: 'database', status: 'warning', ip: '200.1.1.2', x: 450, y: 150, description: 'Prefixos IP afetados pela injeção global de anúncios falsos' },
      { id: 'AS-Malicioso', label: 'ISP Invasor (AS-54321)', type: 'router', status: 'compromised', ip: '180.2.2.1', x: 700, y: 150, description: 'Provedor concorrente anunciando indevidamente subredes bancárias' }
    ],
    initialLinks: [
      { from: 'Roteador-Core-01', to: 'FintechSecure-AS', status: 'offline', bandwidthMbps: 10000 },
      { from: 'Roteador-Core-01', to: 'AS-Malicioso', status: 'saturated', bandwidthMbps: 10000 },
      { from: 'AS-Malicioso', to: 'FintechSecure-AS', status: 'saturated', bandwidthMbps: 10000 }
    ],
    initialAlerts: [
      { id: 'al-bgp-1', severity: 'critical', title: 'Adjacência BGP Violada', description: 'Rotas do prefixo 200.1.1.0/24 redirecionadas para AS-54321 pelo peer 180.2.2.1', source: 'Looking Glass', timestamp: 'Agora', status: 'active' },
      { id: 'al-bgp-2', severity: 'medium', title: 'Invalidation RPKI Ativa', description: 'Múltiplos roteadores downstream acusam Root Hijack de BGP', source: 'Global Routing Registry', timestamp: 'Há 5 minutos', status: 'active' }
    ]
  }
];

export const SKILL_TREE: any[] = [
  { id: 'linux-shell', name: 'Fundamentos de Linux Shell', description: 'Domine a locomoção básica, análise e filtragem estruturada de logs usando utilitários nativos.', cost: 100, unlocked: true, icon: 'Terminal' },
  { id: 'network-ipv4', name: 'Arquitetura IP e Subredes', description: 'Aprenda a realizar cálculos de CIDR, máscaras e divisão lógica sem falhas.', cost: 150, unlocked: true, icon: 'Globe' },
  { id: 'firewall-iptables', name: 'Filtros de Pacotes (Firewalls)', description: 'Crie políticas seguras utilizando iptables/nftables para blindar servidores de portas expostas.', cost: 200, unlocked: false, dependsOn: 'linux-shell', icon: 'Shield' },
  { id: 'siem-wazuh', name: 'SIEM e Incident Response', description: 'Analise alarmes, entenda correlações de ataques e identifique anomalias em tempo real.', cost: 300, unlocked: false, dependsOn: 'firewall-iptables', icon: 'Eye' },
  { id: 'routing-protocols', name: 'Roteamento Dinâmico (OSPF)', description: 'Defina redes autónomas em malhas OSPF redundantes de alta integridade.', cost: 400, unlocked: false, dependsOn: 'network-ipv4', icon: 'Network' },
  { id: 'bgp-backbone', name: 'Engenharia BGP Core', description: 'Adquira expertise no fechamento de peering, trânsitos, IXPs nacionais e regras de preferência.', cost: 600, unlocked: false, dependsOn: 'routing-protocols', icon: 'Cpu' },
  { id: 'cloud-kubernetes', name: 'Orquestração Kubernetes', description: 'Opere pods resilientes, configure ingress controllers e gerencie deploys de alta complexidade.', cost: 800, unlocked: false, dependsOn: 'siem-wazuh', icon: 'Cloud' }
];

export const INITIAL_ACHIEVEMENTS: any[] = [
  { id: 'first_login', title: 'Sessão Estabelecida', description: 'Logou com sucesso no simulador embutido por xterm.', unlocked: true, iconName: 'Key' },
  { id: 'fat_finger', title: 'The Fat Finger (O Dedo Gordo)', description: 'Derrubou por acidente as regras internas de segurança do laboratório (Simulado via comandos).', unlocked: false, iconName: 'AlertTriangle' },
  { id: 'malware_slayer', title: 'Caçador de Ransomwares', description: 'Identificou, analisou e eliminou uma backdoor ativa antes que ela criptografasse o banco relacional.', unlocked: false, iconName: 'Skull' },
  { id: 'uptime_overlord', title: 'Soberano do Uptime', description: 'Manteve a topologia principal rodando com 100% de disponibilidade no desafio de engenharia.', unlocked: false, iconName: 'Cpu' },
  { id: 'certified_bgp', title: 'Guardião da Internet Global', description: 'Aprovou e aplicou filtros de injeção defensiva de rotas BGP mitigando o Hostage Router.', unlocked: false, iconName: 'Award' }
];

export const INITIAL_RECRUITERS: any[] = [
  {
    id: 'rec-1',
    companyName: 'MasterLink Telecom',
    roleName: 'Analista de NOC Júnior',
    salaryRange: 'R$ 3.200 - R$ 4.500',
    model: 'Remoto',
    requirements: { minLevel: 2, requiredSkills: ['Fundamentos de Linux Shell', 'Arquitetura IP e Subredes'], minMttrMinutes: 15 },
    description: 'Procuramos novos profissionais para o nosso time de suporte e monitoria de Backbone de Internet L3. Diferencial saber interpretar logs básicos.',
    applied: false
  },
  {
    id: 'rec-2',
    companyName: 'NetShield Security',
    roleName: 'Técnico de SOC / Blue Team Pleno',
    salaryRange: 'R$ 5.500 - R$ 7.200',
    model: 'Híbrido',
    requirements: { minLevel: 10, requiredSkills: ['Filtros de Pacotes (Firewalls)', 'SIEM e Incident Response'], minMttrMinutes: 10 },
    description: 'Atuação na blindagem de servidores cloud e resposta a incidentes de Ransomware e escalação de privilégios.',
    applied: false
  },
  {
    id: 'rec-3',
    companyName: 'Backbone Brasil IXP',
    roleName: 'Engenheiro de Redes Core (BGP/MPLS)',
    salaryRange: 'R$ 9.800 - R$ 13.000',
    model: 'Híbrido',
    requirements: { minLevel: 20, requiredSkills: ['Engenharia BGP Core', 'Roteamento Dinâmico (OSPF)'], minMttrMinutes: 5 },
    description: 'Engenheiro sênior focado na preservação de enlaces de peering estratégico e roteamento dinâmico redundante de alta capacidade.',
    applied: false
  }
];
