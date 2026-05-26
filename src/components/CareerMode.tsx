import React from 'react';
import { Award, Briefcase, ChevronRight, Check, Key, Shield, Globe2, Network, Cpu, Lock, Star, Sparkles } from 'lucide-react';
import { UserProfile, SkillNode, Achievement, RecruiterJob } from '../types';

interface CareerModeProps {
  profile: UserProfile;
  skills: SkillNode[];
  achievements: Achievement[];
  jobs: RecruiterJob[];
  onUnlockSkill: (skillId: string) => void;
  onApplyJob: (jobId: string) => void;
  messageLog: string;
}

export default function CareerMode({
  profile,
  skills,
  achievements,
  jobs,
  onUnlockSkill,
  onApplyJob,
  messageLog
}: CareerModeProps) {
  const getSkillIcon = (iconName: string) => {
    switch (iconName) {
      case 'Terminal':
        return <Key className="w-4 h-4" />;
      case 'Globe':
        return <Globe2 className="w-4 h-4" />;
      case 'Shield':
        return <Shield className="w-4 h-4" />;
      case 'Network':
        return <Network className="w-4 h-4" />;
      case 'Cpu':
        return <Cpu className="w-4 h-4" />;
      default:
        return <Award className="w-4 h-4" />;
    }
  };

  // Helper checks if parent skills unlocked
  const isSkillLockState = (sk: SkillNode) => {
    if (sk.unlocked) return false;
    if (!sk.dependsOn) return false;
    const parent = skills.find(s => s.id === sk.dependsOn);
    return parent ? !parent.unlocked : true;
  };

  return (
    <div id="career-hub-panel" className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-1 text-left">
      {/* LEFT COLUMN: Skill Tree & Achievements (8 cols) */}
      <div className="lg:col-span-8 space-y-6">
        {/* SKILL TREE */}
        <div className="bg-[#0a0c16] border border-[#1e2130] rounded-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="text-left">
              <h3 className="font-sans font-semibold text-sm text-white flex items-center space-x-1.5 uppercase tracking-wider">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>Árvore de Competências Técnicas (Skills)</span>
              </h3>
              <p className="text-[11px] text-[#5e6382] font-sans mt-0.5">
                Desbloqueie competências usando seus CyberCredits ganhos resolvendo laboratórios.
              </p>
            </div>
            <div className="bg-[#141625] px-3 py-1.5 rounded-sm border border-[#2d314d] text-right">
              <span className="text-[10px] text-[#5e6382] font-mono block uppercase">Créditos Disponíveis</span>
              <span className="text-sm font-bold text-amber-400 font-mono">
                {profile.cyberCredits} CC 🪙
              </span>
            </div>
          </div>

          {/* Skill Blocks Map Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-4">
            {skills.map(sk => {
              const isLocked = isSkillLockState(sk);
              const canAfford = profile.cyberCredits >= sk.cost;

              return (
                <div
                  key={sk.id}
                  className={`p-3.5 rounded-sm border flex flex-col justify-between text-left transition-all relative ${
                    sk.unlocked
                      ? 'bg-cyan-950/20 border-cyan-500/30'
                      : isLocked
                        ? 'bg-[#05060a]/30 border-[#1e2130] opacity-50'
                        : 'bg-[#141625] border-[#2d314d] hover:border-cyan-500/20'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`p-1.5 rounded-sm ${sk.unlocked ? 'bg-cyan-500/25 text-cyan-400' : 'bg-[#05060a] text-[#5e6382]'}`}>
                          {getSkillIcon(sk.icon)}
                        </div>
                        <span className="font-mono text-[11px] font-bold text-zinc-200">
                          {sk.name}
                        </span>
                      </div>
                      {sk.unlocked && (
                        <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded-sm font-mono flex items-center space-x-1 font-semibold border border-emerald-500/25">
                          <Check className="w-3 h-3 text-emerald-500" />
                          <span>Adquirido</span>
                        </span>
                      )}
                    </div>
                    <p className="text-[10.5px] text-zinc-400 font-sans mt-2 leading-relaxed">
                      {sk.description}
                    </p>
                  </div>

                  {/* Purchase Unlock Command Button */}
                  {!sk.unlocked && (
                    <div className="mt-3.5 pt-3 border-t border-[#1e2130] flex items-center justify-between">
                      <span className="text-[9.5px] text-[#5e6382] font-mono">
                        Custo: <strong className="text-[#c0c0cf] font-bold">{sk.cost} CC</strong>
                      </span>
                      {isLocked ? (
                        <span className="text-[9px] text-[#5e6382] font-mono flex items-center space-x-1">
                          <Lock className="w-3 h-3" />
                          <span>Falta Dependência</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => onUnlockSkill(sk.id)}
                          disabled={!canAfford}
                          className={`text-[9.5px] font-mono px-3 py-1 rounded-sm transition w-full sm:w-auto text-center font-bold ${
                            canAfford
                              ? 'bg-amber-500 hover:bg-amber-400 text-black cursor-pointer'
                              : 'bg-[#05060a] text-[#5e6382] cursor-not-allowed border border-[#1e2130]'
                          }`}
                        >
                          Adquirir Skill Node
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ACHIEVEMENTS BLOCK */}
        <div className="bg-[#0a0c16] border border-[#1e2130] rounded-sm p-5">
          <div className="text-left mb-3">
            <h3 className="font-sans font-semibold text-sm text-white flex items-center space-x-1.5 uppercase tracking-wider">
              <Star className="w-4 h-4 text-amber-400" />
              <span>Conquistas e Crachás Digitais</span>
            </h3>
            <p className="text-[11px] text-[#5e6382] font-sans mt-0.5">
              Suas provas acadêmicas e operacionais de superação nas simulações de backbone.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {achievements.map(ach => (
              <div
                key={ach.id}
                className={`p-3 rounded-sm border text-center flex flex-col justify-between h-[105px] transition-all ${
                  ach.unlocked
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.1)]'
                    : 'bg-[#05060a]/30 border-[#1e2130] opacity-40 text-[#5e6382]'
                }`}
              >
                <div className="flex justify-center mb-1">
                  <Award className={`w-6 h-6 ${ach.unlocked ? 'text-amber-400 animate-pulse' : 'text-zinc-700'}`} />
                </div>
                <div>
                  <div className="text-[9.5px] font-mono font-bold truncate">
                    {ach.title}
                  </div>
                  <div className="text-[8px] leading-tight text-[#5e6382] mt-1 line-clamp-2">
                    {ach.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Recruiter Talent Portal (4 cols) */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-[#0a0c16] border border-[#1e2130] rounded-sm p-5 h-full flex flex-col justify-between">
          <div className="text-left pb-4">
            <h3 className="font-sans font-semibold text-sm text-white flex items-center space-x-1.5 uppercase tracking-wider">
              <Briefcase className="w-4 h-4 text-cyan-400" />
              <span>B2B Talent Marketplace</span>
            </h3>
            <p className="text-[11px] text-[#5e6382] font-sans mt-0.5">
              Veja empresas que recrutam profissionais diretamente do simulador com base em suas Skills adquiridas.
            </p>
          </div>

          {/* Job Listings */}
          <div className="space-y-4 flex-1">
            {jobs.map(job => {
              const matchesMinLevel = profile.level >= job.requirements.minLevel;
              const matchingSkillsCount = job.requirements.requiredSkills.filter(reqS => {
                const sNode = skills.find(sn => sn.name === reqS);
                return sNode ? sNode.unlocked : false;
              }).length;
              const matchesSkills = matchingSkillsCount === job.requirements.requiredSkills.length;
              const canApply = matchesMinLevel && matchesSkills;

              return (
                <div
                  key={job.id}
                  className={`p-4 rounded-sm border text-left flex flex-col justify-between transition-all ${
                    job.applied
                      ? 'bg-[#141625]/80 border-[#2d314d] opacity-75'
                      : canApply
                        ? 'bg-[#0d9488]/15 border-[#0d9488]/40'
                        : 'bg-[#05060a]/40 border-[#1e2130]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] bg-[#05060a] text-zinc-400 px-2 py-0.5 rounded-sm border border-[#1e2130] font-mono">
                        {job.companyName}
                      </span>
                      <span className="text-[10px] text-teal-400 font-mono font-bold">
                        {job.salaryRange}
                      </span>
                    </div>
                    <h4 className="font-sans font-semibold text-xs text-white mt-2 font-mono">
                      {job.roleName}
                    </h4>
                    <p className="text-[10px] text-[#c0c0cf] leading-normal font-sans mt-1">
                      {job.description}
                    </p>

                    {/* Requirements Tags block */}
                    <div className="mt-3.5 space-y-1 bg-[#05060a] p-2 rounded-sm border border-[#1e2130]">
                      <div className="text-[8.5px] font-mono text-[#5e6382] uppercase tracking-wider">
                        Reclutamento Mínimo:
                      </div>
                      <div className="flex items-center justify-between text-[9px] font-mono">
                        <span className="text-[#5e6382]">Nível Mínimo:</span>
                        <span className={matchesMinLevel ? 'text-[#10b981]' : 'text-[#ef4444]'}>
                          Level {job.requirements.minLevel} {matchesMinLevel ? '✓' : '(Falta)'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[9px] font-mono">
                        <span className="text-[#5e6382]">Skills Adquiridas:</span>
                        <span className={matchesSkills ? 'text-[#10b981]' : 'text-amber-400'}>
                          {matchingSkillsCount}/{job.requirements.requiredSkills.length} {matchesSkills ? '✓' : ''}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="mt-4">
                    {job.applied ? (
                      <div className="w-full text-center py-1.5 bg-[#141625] border border-[#2d314d] rounded-sm font-mono text-[10px] text-[#10b981] font-bold">
                        ✓ Candidatura Enviada
                      </div>
                    ) : (
                      <button
                        onClick={() => onApplyJob(job.id)}
                        disabled={!canApply}
                        className={`w-full py-2 text-[10px] font-mono text-center rounded-sm transition font-bold ${
                          canApply
                            ? 'bg-teal-500 hover:bg-teal-400 text-black cursor-pointer'
                            : 'bg-[#05060a] text-[#5e6382] cursor-not-allowed border border-[#1e2130]'
                        }`}
                      >
                        {canApply ? 'Enviar Candidatura 🚀' : 'Requisitos Não Atendidos'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recruiters feedback log screen */}
          {messageLog && (
            <div className="mt-4 p-3 bg-cyan-950/20 border border-cyan-500/20 rounded-sm text-[10px] font-mono text-cyan-300 text-left">
              <div className="flex items-center space-x-1 mb-1 font-bold text-cyan-400 uppercase tracking-wide">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Inbox Recruiter Bot</span>
              </div>
              <p>{messageLog}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
