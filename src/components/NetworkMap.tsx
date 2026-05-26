import React from 'react';
import { NetworkNode, NetworkLink } from '../types';
import { Network, Server, Database, Shield, Globe2, Cpu, Wifi } from 'lucide-react';

interface NetworkMapProps {
  nodes: NetworkNode[];
  links: NetworkLink[];
  selectedNodeId: string;
  onSelectNode: (nodeId: string) => void;
  activeIncidentSources: string[];
}

export default function NetworkMap({
  nodes,
  links,
  selectedNodeId,
  onSelectNode,
  activeIncidentSources
}: NetworkMapProps) {
  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'router':
        return <Cpu className="w-5 h-5" />;
      case 'switch':
        return <Network className="w-5 h-5" />;
      case 'server':
        return <Server className="w-5 h-5" />;
      case 'database':
        return <Database className="w-5 h-5" />;
      case 'firewall':
        return <Shield className="w-5 h-5" />;
      case 'internet':
      default:
        return <Globe2 className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string, isIncidentSource: boolean) => {
    if (isIncidentSource) return { bg: 'bg-red-500/25 border-red-500 text-red-400', glow: 'shadow-[0_0_15px_rgba(239,68,68,0.5)]' };
    switch (status) {
      case 'healthy':
        return { bg: 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400', glow: 'shadow-[0_0_10px_rgba(16,185,129,0.2)]' };
      case 'warning':
        return { bg: 'bg-amber-500/15 border-amber-500/50 text-amber-400', glow: 'shadow-[0_0_10px_rgba(245,158,11,0.3)]' };
      case 'down':
        return { bg: 'bg-red-500/20 border-red-500/50 text-red-400', glow: 'shadow-[0_0_15px_rgba(239,68,68,0.4)]' };
      case 'compromised':
        return { bg: 'bg-cyan-950/40 border-cyan-500/80 text-cyan-400', glow: 'shadow-[0_0_15px_rgba(6,182,212,0.5)] border-dashed' };
      default:
        return { bg: 'bg-zinc-800/50 border-zinc-700 text-zinc-400', glow: '' };
    }
  };

  const getLinkStyle = (status: string) => {
    switch (status) {
      case 'offline':
        return { stroke: 'stroke-red-600/30', dash: '8,8', flowClass: '', speed: 0 };
      case 'saturated':
        return { stroke: 'stroke-amber-400', dash: '4,4', flowClass: 'animate-pulse', speed: 2 };
      case 'normal':
      default:
        return { stroke: 'stroke-emerald-500/60', dash: 'none', flowClass: '', speed: 4 };
    }
  };

  return (
    <div className="relative w-full h-[260px] bg-[#0a0c16] border border-[#1e2130] rounded-sm overflow-hidden p-4">
      {/* Background Tech Net Grids */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e2130_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

      {/* Top Title Bar */}
      <div className="absolute top-2 left-4 flex items-center justify-between w-[calc(100%-2rem)] pointer-events-none z-10">
        <div className="flex items-center space-x-2 text-[10px] font-mono tracking-wider uppercase text-[#c0c0cf] bg-[#141625] px-2 py-0.5 rounded-sm border border-[#2d314d]">
          <Wifi className="w-3.5 h-3.5 text-cyan-455 text-cyan-400 animate-pulse" />
          <span>Monitor Backbone Live Topologia</span>
        </div>
        <div className="text-[10px] font-mono text-zinc-500">
          Legenda: <span className="text-emerald-400">● Ativo</span> | <span className="text-amber-400">● Warning</span> | <span className="text-red-400">● Link Off</span>
        </div>
      </div>

      {/* SVG Canvas */}
      <svg className="w-full h-full min-h-[220px]" viewBox="0 0 800 300" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="healthy-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#059669" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id="alert-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#dc2626" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Links (Line segments between nodes) */}
        {links.map((link, idx) => {
          const fromNode = nodes.find(n => n.id === link.from);
          const toNode = nodes.find(n => n.id === link.to);
          if (!fromNode || !toNode) return null;

          const style = getLinkStyle(link.status);

          return (
            <g key={`link-${idx}`} className="transition-all duration-500">
              {/* Underlying thick backing line for cleaner glow effects */}
              <line
                x1={fromNode.x}
                y1={fromNode.y}
                x2={toNode.x}
                y2={toNode.y}
                className={`${style.stroke} opacity-20`}
                strokeWidth="6"
              />
              {/* Main routing link interface */}
              <line
                x1={fromNode.x}
                y1={fromNode.y}
                x2={toNode.x}
                y2={toNode.y}
                className={`${style.stroke} ${style.flowClass}`}
                strokeWidth="2"
                strokeDasharray={style.dash === 'none' ? undefined : style.dash}
              />
              {/* Flowing particle animation if link is active */}
              {link.status !== 'offline' && (
                <circle r="4" fill={link.status === 'saturated' ? '#f59e0b' : '#34d399'} className="filter drop-shadow-[0_0_3px_rgba(52,211,153,0.8)]">
                  <animateMotion
                    dur={`${link.status === 'saturated' ? '1.5s' : '3.5s'}`}
                    repeatCount="indefinite"
                    path={`M ${fromNode.x},${fromNode.y} L ${toNode.x},${toNode.y}`}
                  />
                </circle>
              )}
            </g>
          );
        })}

        {/* Node Element Pins */}
        {nodes.map(node => {
          const isSelected = selectedNodeId === node.id || node.id.toLowerCase() === selectedNodeId.toLowerCase();
          const isIncidentSource = activeIncidentSources.some(
            src => src.toLowerCase().includes(node.id.toLowerCase()) || node.id.toLowerCase().includes(src.toLowerCase())
          );
          const color = getStatusColor(node.status, isIncidentSource);

          // Render coordinate labels, circles, icons
          return (
            <g
              key={node.id}
              transform={`translate(${node.x}, ${node.y})`}
              className="cursor-pointer group select-none"
              onClick={() => onSelectNode(node.id)}
            >
              {/* Ripple Ring under Warning/Compromised Nodes */}
              {(node.status === 'down' || node.status === 'compromised' || isIncidentSource) && (
                <circle
                  r="24"
                  fill="none"
                  stroke={isIncidentSource || node.status === 'down' ? '#ef4444' : '#06b6d4'}
                  strokeWidth="1.5"
                  className="animate-ping opacity-30"
                />
              )}

              {/* Outside Glow Card frame */}
              <circle
                r="18"
                className={`transition-all duration-300 ${isSelected ? 'fill-[#05060a]/90 stroke-cyan-400 stroke-2 ring-2 ring-cyan-500/20' : 'fill-[#0a0c16] stroke-[#2d314d] hover:stroke-cyan-500/55'} ${color.glow}`}
              />

              {/* Circle Inside Background with specific status styling */}
              <circle
                r="14"
                className={`transition-all duration-300 ${color.bg} flex items-center justify-center`}
              />

              {/* Icon Container */}
              <g transform="translate(-10, -10)" className="text-inherit">
                <foreignObject width="20" height="20" className="pointer-events-none">
                  <div className={`flex items-center justify-center w-full h-full text-[12px] opacity-90 ${isSelected ? 'text-cyan-400 font-bold' : ''}`}>
                    {getNodeIcon(node.type)}
                  </div>
                </foreignObject>
              </g>

              {/* Styled Human Title and IP Label Box */}
              <g transform="translate(0, 32)">
                <rect
                  x="-65"
                  y="-12"
                  width="130"
                  height="26"
                  rx="1"
                  className={`${isSelected ? 'fill-[#0d0f1d]/95 stroke-cyan-500/60' : 'fill-[#0a0c16]/95 stroke-[#1e2130]'} stroke`}
                  strokeWidth="1"
                />
                {/* Node Title */}
                <text
                  className="font-mono text-[9px] font-medium"
                  fill={isSelected ? '#ffffff' : '#a1a1aa'}
                  textAnchor="middle"
                  y="-1"
                >
                  {node.label}
                </text>
                {/* Node IP Subtitle */}
                <text
                  className="font-mono text-[7.5px]"
                  fill={node.status === 'down' ? '#ef4444' : '#5e6382'}
                  textAnchor="middle"
                  y="9"
                >
                  {node.ip || 'Local / Internal'}
                </text>
              </g>

              {/* Hover Node Tooltip Box */}
              <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" transform="translate(0, -32)">
                <rect
                  x="-80"
                  y="-32"
                  width="160"
                  height="34"
                  rx="1"
                  fill="#05060a"
                  stroke="#2d314d"
                  strokeWidth="1"
                />
                <text className="font-sans text-[8px] fill-zinc-200" y="-18" textAnchor="middle">
                  {node.description}
                </text>
                <text className="font-mono text-[7.5px] fill-cyan-400" y="-8" textAnchor="middle">
                  Status: {node.status.toUpperCase()}
                </text>
              </g>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
