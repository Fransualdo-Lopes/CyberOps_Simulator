import React, { useState } from 'react';
import {
  Home,
  Layers,
  Map,
  FlaskConical,
  Briefcase,
  GraduationCap,
  HardDrive,
  Terminal,
  Activity,
  Shield,
  Shuffle,
  Cloud,
  Award,
  ListTodo,
  Flame,
  Users,
  Compass,
  Sparkles,
  BookOpen,
  Settings,
  HelpCircle,
  Play,
  History,
  TrendingUp,
  Sliders,
  ChevronDown,
  ChevronRight,
  UserCheck
} from 'lucide-react';

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

interface SidebarProps {
  currentSection: MenuSection;
  onChangeSection: (section: MenuSection) => void;
  gameMode: string;
}

interface MenuItem {
  id: MenuSection;
  label: string;
  icon: React.ComponentType<any>;
  badge?: string;
  badgeColor?: string;
}

interface CategoryGroup {
  name: string;
  icon: React.ComponentType<any>;
  items: MenuItem[];
}

export default function Sidebar({ currentSection, onChangeSection, gameMode }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    'operacional': true,
    'dashboards': true,
    'competencias': true,
    'engajamento': true,
    'suporte': true,
  });

  const toggleGroup = (name: string) => {
    setOpenGroups(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const categories: CategoryGroup[] = [
    {
      name: 'OPERACIONAL',
      icon: Compass,
      items: [
        { id: 'inicio', label: 'Início', icon: Home },
        { id: 'missao', label: 'Continuar Missão', icon: Layers, badge: 'ATIVO', badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/25' },
        { id: 'mapa', label: 'Mapa do Mundo', icon: Map },
        { id: 'labs', label: 'Laboratórios', icon: FlaskConical },
      ],
    },
    {
      name: 'DASHBOARDS & NOC/SOC',
      icon: Activity,
      items: [
        { id: 'noc', label: 'NOC Telemetria', icon: Activity },
        { id: 'soc', label: 'SOC Segurança', icon: Shield },
        { id: 'backbone', label: 'Backbone BGP', icon: Shuffle },
        { id: 'cloud', label: 'Cloud Kubernetes', icon: Cloud },
        { id: 'terminal', label: 'Terminal Linux Sandbox', icon: Terminal },
      ],
    },
    {
      name: 'COMPETÊNCIAS & CARREIRA',
      icon: Briefcase,
      items: [
        { id: 'carreira', label: 'Carreira', icon: Briefcase },
        { id: 'especializacoes', label: 'Especializações', icon: GraduationCap },
        { id: 'certificacoes', label: 'Certificações', icon: Award, badge: 'PROVAS' },
        { id: 'inventario', label: 'Inventário Técnico', icon: HardDrive },
      ],
    },
    {
      name: 'ENGAJAMENTO & SOCIAL',
      icon: Flame,
      items: [
        { id: 'diarios', label: 'Desafios Diários', icon: ListTodo, badge: 'NOVO' },
        { id: 'eventos', label: 'Eventos Globais', icon: Flame, badge: 'LIVE', badgeColor: 'bg-rose-500/25 text-rose-400 border-rose-500/30 font-bold' },
        { id: 'ranking', label: 'Ranking Global', icon: UserCheck },
        { id: 'equipe', label: 'Equipe / Clã', icon: Users },
        { id: 'historico', label: 'Histórico de Incidentes', icon: History },
        { id: 'estatisticas', label: 'Estatísticas', icon: TrendingUp },
      ],
    },
    {
      name: 'ORIENTAÇÃO & SUPORTE',
      icon: HelpCircle,
      items: [
        { id: 'mentor', label: 'Mentor IA Sênior', icon: Sparkles, badge: 'IA' },
        { id: 'wiki', label: 'Wiki Técnica', icon: BookOpen },
        { id: 'academia', label: 'Academia', icon: GraduationCap },
        { id: 'tutorial', label: 'Tutorial de Comandos', icon: Play },
        { id: 'ajuda', label: 'Ajuda rápida', icon: HelpCircle },
        { id: 'configuracoes', label: 'Configurações', icon: Settings },
      ],
    },
  ];

  const getModeColor = () => {
    switch (gameMode) {
      case 'iniciante':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25';
      case 'intermediario':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/25';
      case 'avancado':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/25';
      case 'hardcore':
        return 'text-rose-500 bg-rose-500/10 border-rose-500/25 animate-pulse';
      case 'realista':
        return 'text-purple-400 bg-purple-500/10 border-purple-500/25';
      default:
        return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/25';
    }
  };

  return (
    <div
      className={`flex flex-col bg-[#070810] border-r border-[#1e2130] h-[calc(100vh-100px)] z-20 transition-all duration-300 relative select-none ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* SIDEBAR TOGGLE BUTTON */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute top-4 -right-3 h-6 w-6 rounded-full bg-[#141625] border border-[#2d314d] text-[#c0c0cf] hover:text-white flex items-center justify-center cursor-pointer z-35 text-[10px]"
      >
        {collapsed ? '▶' : '◀'}
      </button>

      {/* GAME DIFFICUTLY / MODE FLOATING BADGE */}
      {!collapsed && (
        <div className="p-3 border-b border-[#1e2130] bg-[#0c0d1e]/40">
          <div className="text-[9px] text-[#5e6382] uppercase font-bold tracking-wider font-mono text-left">
            Modo Operacional Ativo
          </div>
          <div className={`mt-1 py-1 px-2.5 rounded-sm border text-[10px] font-mono font-black uppercase text-center ${getModeColor()}`}>
            ● MODO {gameMode}
          </div>
        </div>
      )}

      {/* SCROLLABLE MENU SECTION INDEX */}
      <div className="flex-1 overflow-y-auto py-3 space-y-4 scrollbar-thin scrollbar-thumb-zinc-800">
        {categories.map(cat => (
          <div key={cat.name} className="space-y-1">
            {/* Category Header */}
            {!collapsed ? (
              <button
                onClick={() => toggleGroup(cat.name)}
                className="w-full flex items-center justify-between px-4 py-1 text-[9.5px] font-mono font-black tracking-widest text-[#5e6382] hover:text-zinc-400 transition text-left"
              >
                <span className="truncate">{cat.name}</span>
                {openGroups[cat.name] ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              </button>
            ) : (
              <div className="border-b border-[#1e2130]/30 my-2" />
            )}

            {/* Category sub-items */}
            {(collapsed || openGroups[cat.name]) && (
              <div className="space-y-0.5">
                {cat.items.map(item => {
                  const isActive = currentSection === item.id;
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.id}
                      onClick={() => onChangeSection(item.id)}
                      id={`menu-${item.id}-btn`}
                      title={item.label}
                      className={`w-full flex items-center px-4 py-2 text-xs font-mono transition-all relative ${
                        isActive
                          ? 'bg-cyan-500/10 text-cyan-400 font-bold border-l-2 border-cyan-500'
                          : 'text-[#8e93b2] hover:bg-[#141625]/40 hover:text-white'
                      } ${collapsed ? 'justify-center' : 'justify-between'}`}
                    >
                      <div className="flex items-center space-x-2.5 truncate">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-[#5e6382]'}`} />
                        {!collapsed && <span className="truncate leading-none">{item.label}</span>}
                      </div>

                      {!collapsed && item.badge && (
                        <span
                          className={`text-[8px] px-1.5 py-0.5 rounded-sm border ${
                            item.badgeColor
                              ? item.badgeColor
                              : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
