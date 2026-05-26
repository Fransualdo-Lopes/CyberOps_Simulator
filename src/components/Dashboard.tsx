import React, { useState } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, ShieldAlert, WifiOff, RefreshCw, BarChart2, Radio, Server, CheckCircle } from 'lucide-react';
import { IncidentAlert, Challenge } from '../types';

interface DashboardProps {
  alerts: IncidentAlert[];
  challenge: Challenge;
  simulatedTraffic: { name: string; tráfego: number; cpu: number; alertas: number }[];
  uptime: number;
}
export default function Dashboard({
  alerts,
  challenge,
  simulatedTraffic,
  uptime
}: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'grafana' | 'wazuh'>('grafana');

  const resolvedCount = alerts.filter(a => a.status === 'resolved').length;
  const activeCount = alerts.filter(a => a.status === 'active').length;

  return (
    <div className="flex flex-col h-[340px] bg-[#05060a] border border-[#1e2130] rounded-sm overflow-hidden relative">
      {/* Top Controls Headers */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#0c0d1e]/80 border-b border-[#1e2130]">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setActiveTab('grafana')}
            id="grafana-tab-btn"
            className={`flex items-center space-x-1.5 px-3 py-1 text-xs font-mono rounded-sm border transition ${activeTab === 'grafana' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/25' : 'text-[#5e6382] border-transparent hover:text-white'}`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Grafana Metrics</span>
          </button>
          <button
            onClick={() => setActiveTab('wazuh')}
            id="wazuh-tab-btn"
            className={`flex items-center space-x-1.5 px-3 py-1 text-xs font-mono rounded-sm border transition ${activeTab === 'wazuh' ? 'bg-rose-500/10 text-rose-400 border-rose-500/25' : 'text-[#5e6382] border-transparent hover:text-white'}`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Wazuh SIEM (SOC)</span>
          </button>
        </div>
        <div className="flex items-center space-x-3 font-mono text-[10px]">
          <div className="flex items-center space-x-1">
            <span className="text-[#5e6382]">Uptime:</span>
            <span className={`font-semibold ${uptime >= 99 ? 'text-emerald-400 animate-pulse' : 'text-amber-400'}`}>
              {uptime.toFixed(2)}%
            </span>
          </div>
          <span className="text-[#1e2130]">|</span>
          <div className="flex items-center space-x-1">
            <Radio className="w-3 h-3 text-red-500 animate-pulse animate-duration-1000" />
            <span className="text-rose-400 font-semibold">{activeCount} Incidentes</span>
          </div>
        </div>
      </div>

      {/* Main Panel Content Area */}
      <div className="flex-1 p-4 overflow-y-auto">
        {activeTab === 'grafana' ? (
          /* GRAFANA MONITORING PANEL */
          <div id="grafana-panel" className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
            {/* Left Metrics Cards */}
            <div className="space-y-3 flex flex-col justify-between">
              <div className="p-3 bg-[#0a0c16] border border-[#1e2130] rounded-sm text-left">
                <div className="text-[10px] text-[#5e6382] font-semibold uppercase tracking-wider font-mono">
                  Uso de CPU Core
                </div>
                <div className="flex items-baseline space-x-2 mt-1">
                  <span className={`text-2xl font-bold font-mono tracking-tighter ${simulatedTraffic[simulatedTraffic.length - 1]?.cpu > 70 ? 'text-rose-500' : 'text-white'}`}>
                    {simulatedTraffic[simulatedTraffic.length - 1]?.cpu.toFixed(1)}%
                  </span>
                  <span className="text-[9px] text-[#5e6382]">Normal: &lt;50%</span>
                </div>
                {/* Simulated micro bars */}
                <div className="w-full bg-[#141625] h-1.5 rounded-sm mt-2 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-1000 ${simulatedTraffic[simulatedTraffic.length - 1]?.cpu > 70 ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`}
                    style={{ width: `${Math.min(100, simulatedTraffic[simulatedTraffic.length - 1]?.cpu || 10)}%` }}
                  />
                </div>
              </div>

              <div className="p-3 bg-[#0a0c16] border border-[#1e2130] rounded-sm text-left">
                <div className="text-[10px] text-[#5e6382] font-semibold uppercase tracking-wider font-mono">
                  Largura Banda Total (ISP)
                </div>
                <div className="flex items-baseline space-x-2 mt-1">
                  <span className="text-2xl font-bold font-mono tracking-tighter text-cyan-400">
                    {simulatedTraffic[simulatedTraffic.length - 1]?.tráfego.toFixed(0)} Mbps
                  </span>
                  <span className="text-[9px] text-[#5e6382]">Cap: 1.2 Gbps</span>
                </div>
                <div className="w-full bg-[#141625] h-1.5 rounded-sm mt-2 overflow-hidden">
                  <div
                    className="h-full bg-cyan-500 transition-all duration-1000"
                    style={{ width: `${Math.min(100, (simulatedTraffic[simulatedTraffic.length - 1]?.tráfego || 50) / 10)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Right Graphic Telemetry Area */}
            <div className="md:col-span-2 bg-[#0a0c16] border border-[#1e2130] rounded-sm p-3 flex flex-col text-left">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-[#c0c0cf] font-mono font-bold uppercase tracking-wider">
                  Tráfego de Trânsito em Tempo Real
                </span>
                <span className="text-[8px] text-[#5e6382] font-mono">Refresh: 2s</span>
              </div>
              <div className="flex-1 w-full min-h-[140px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={simulatedTraffic}>
                    <defs>
                      <linearGradient id="colorTráfego" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.25}/>
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="#2d314d" fontSize={8} tickLine={false} />
                    <YAxis stroke="#2d314d" fontSize={8} width={20} tickLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#05060a', borderColor: '#1e2130', borderRadius: '2px' }}
                      labelStyle={{ color: '#ffffff', fontSize: '9px', fontFamily: 'monospace' }}
                      itemStyle={{ color: '#06b6d4', fontSize: '9px', fontFamily: 'monospace' }}
                    />
                    <Area type="monotone" dataKey="tráfego" name="Kb/s" stroke="#06b6d4" fillOpacity={1} fill="url(#colorTráfego)" strokeWidth={1.5} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        ) : (
          /* WAZUH SIEM (SOC) SECURITY CORRELATOR */
          <div id="wazuh-panel" className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
            {/* Left Column alerts stream logger */}
            <div className="flex flex-col space-y-2 bg-[#0a0c16] border border-[#1e2130] rounded-sm p-2.5 h-[230px] overflow-hidden">
              <div className="flex items-center justify-between pb-1.5 border-b border-[#1e2130]">
                <span className="text-[9px] text-[#c0c0cf] font-bold font-mono">Últimas Detecções Ativas</span>
                <span className="flex items-center space-x-1 text-[8px] text-[#ef4444] bg-[#ef4444]/15 px-1 py-0.5 rounded-sm uppercase font-mono font-semibold animate-pulse">
                  <span>●</span>
                  <span>Escaneando logs</span>
                </span>
              </div>
              <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin scrollbar-thumb-zinc-800">
                {alerts.map((al) => (
                  <div
                    key={al.id}
                    className={`p-2 rounded-sm text-left border text-[10px] ${al.status === 'resolved' ? 'bg-[#10b981]/10 border-[#10b981]/25 text-[#c0c0cf]' : (al.severity === 'critical' ? 'bg-red-950/20 border-red-500/30' : 'bg-amber-950/15 border-amber-500/20')}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`font-semibold font-mono uppercase ${al.status === 'resolved' ? 'text-[#10b981]' : (al.severity === 'critical' ? 'text-rose-400 font-bold' : 'text-amber-400')}`}>
                        [{al.severity.toUpperCase()}] {al.title}
                      </span>
                      <span className="text-[8px] text-[#5e6382] font-mono">
                        {al.status === 'resolved' ? '✓ Resolvido' : al.timestamp}
                      </span>
                    </div>
                    <div className="text-zinc-400 mt-1">{al.description}</div>
                    <div className="text-[8px] text-[#5e6382] mt-1 font-mono">Source: {al.source}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column alerts statistics bar chart */}
            <div className="bg-[#0a0c16] border border-[#1e2130] rounded-sm p-3 flex flex-col justify-between h-[230px] text-left">
              <div>
                <div className="text-[10px] text-[#c0c0cf] font-mono font-bold uppercase tracking-wider mb-1">
                  Severidade de Ameaças Reportadas
                </div>
                <div className="grid grid-cols-3 gap-2 mt-2 font-mono">
                  <div className="p-1 px-2 rounded-sm bg-[#141625] border border-[#1e2130] text-center">
                    <div className="text-[8px] text-[#5e6382]">Crítico</div>
                    <div className="text-lg font-bold text-red-500">
                      {alerts.filter(a => a.severity === 'critical' && a.status === 'active').length}
                    </div>
                  </div>
                  <div className="p-1 px-2 rounded-sm bg-[#141625] border border-[#1e2130] text-center">
                    <div className="text-[8px] text-[#5e6382]">Médio</div>
                    <div className="text-lg font-bold text-amber-500">
                      {alerts.filter(a => a.severity === 'medium' && a.status === 'active').length}
                    </div>
                  </div>
                  <div className="p-1 px-2 rounded-sm bg-[#141625] border border-[#1e2130] text-center">
                    <div className="text-[8px] text-[#5e6382]">Resolvidos</div>
                    <div className="text-lg font-bold text-emerald-500">
                      {resolvedCount}
                    </div>
                  </div>
                </div>
              </div>

              {/* Alerts historical bars */}
              <div className="h-[90px] w-full mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={simulatedTraffic}>
                    <XAxis dataKey="name" stroke="#2d314d" fontSize={7} tickLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#05060a', borderColor: '#1e2130', borderRadius: '2px' }}
                      labelStyle={{ color: '#ffffff', fontSize: '9px', fontFamily: 'monospace' }}
                      itemStyle={{ color: '#06b6d4', fontSize: '9px', fontFamily: 'monospace' }}
                    />
                    <Bar dataKey="alertas" fill="#0891b2" name="Alertas SIEM" radius={[1, 1, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
