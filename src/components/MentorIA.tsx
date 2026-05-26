import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, Loader2, Info, BookOpen, AlertCircle } from 'lucide-react';
import { Challenge } from '../types';

interface MentorIAProps {
  challenge: Challenge;
  commandHistory: string[];
  userLevel: number;
  onSendMentorPrompt: (question: string) => Promise<string>;
}

export default function MentorIA({
  challenge,
  commandHistory,
  userLevel,
  onSendMentorPrompt
}: MentorIAProps) {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<{ sender: 'ai' | 'user'; text: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize messages with a custom welcome from the Mentor IA based on the challenge context
  useEffect(() => {
    let initialGreeting = '';
    if (challenge.id === 'linux-basics') {
      initialGreeting = `Seja bem-vindo, recruta! Eu sou seu Mentor Técnico Sênior. Estou observando os sensores do "Servidor-Auth" e noto picos alarmantes. Você precisa navegar no CLI do terminal e inspecionar o arquivo /var/log/auth.log. Dica: use o comando "ls" ou filtre com "grep"!;`;
    } else if (challenge.id === 'soc-ransomware') {
      initialGreeting = `Temos um incidente crítico de Ransomware Nível 2 acontecendo no Servidor-HTTP! Os arquivos se transformaram em .crypto. Use "ps aux" para achar o binário invasor, mate o processo (PID) com kill, delete backdoor.php, e conserte a index! Estou à disposição para te guiar, mas mãos à obra!;`;
    } else if (challenge.id === 'bgp-hijacking') {
      initialGreeting = `Alerta de Hack global! O ASN-54321 desviou tráfego do banco FintechSecure. Um sequestro BGP de alto impacto! Entre na console do "Roteador-Core-01", estude os peers via "show ip bgp summary" e vamos configurar filtros Route-Map de descarte para anular essa jogada!;`;
    } else {
      initialGreeting = `Olá! Qual desafio prático de rede ou segurança cibernética quer desvendar hoje? Pergunte e darei orientações profissionais baseadas em casos operacionais reais!`;
    }

    setMessages([
      {
        sender: 'ai',
        text: initialGreeting
      }
    ]);
  }, [challenge]);

  // Scroll to bottom when conversations update
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const prompt = inputText.trim();
    if (!prompt) return;

    // Append user input
    setMessages(prev => [...prev, { sender: 'user', text: prompt }]);
    setInputText('');
    setLoading(true);

    try {
      const response = await onSendMentorPrompt(prompt);
      setMessages(prev => [...prev, { sender: 'ai', text: response }]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'ai', text: 'Desculpe, ocorreu uma instabilidade de rede temporária na minha central neural. Tente novamente em instantes.' }]);
    } finally {
      setLoading(false);
    }
  };

  // Quick prompt shortcuts triggers
  const handleQuickAction = async (style: 'step' | 'explain' | 'faq') => {
    let prompt = '';
    if (style === 'step') {
      prompt = `Me dê o próximo passo prático para resolver o desafio chamado "${challenge.title}" considerando que agora estou conectado ao equipamento "${challenge.deviceContext}" e executei os seguintes comandos até agora: [${commandHistory.join(', ') || 'Nenhum'}].`;
    } else if (style === 'explain') {
      prompt = `Por favor, explique didaticamente e de modo simplificado os conceitos centrais por trás do desafio chamado "${challenge.title}".`;
    } else {
      prompt = `Como posso verificar se terminei corretamente esta missão de "${challenge.title}" e quais boas práticas de Uptime / MTTR devo me atentar?`;
    }

    setMessages(prev => [...prev, { sender: 'user', text: style === 'step' ? 'Pedir próxima dica 💡' : (style === 'explain' ? 'Explicar conceito da missão 📖' : 'Dúvidas frequentes de infra ❓') }]);
    setLoading(true);

    try {
      const response = await onSendMentorPrompt(prompt);
      setMessages(prev => [...prev, { sender: 'ai', text: response }]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'ai', text: 'Instabilidade técnica na conexão do Mentor IA.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="ai-mentor-panel" className="flex flex-col h-[690px] bg-[#05060a] border border-[#1e2130] rounded-sm overflow-hidden font-sans relative text-left">
      {/* Top Banner Indicator */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0c0d1e]/80 border-b border-[#1e2130]">
        <div className="flex items-center space-x-2">
          <div className="p-1 px-1.5 rounded-sm bg-cyan-500/10 border border-cyan-500/25 text-cyan-400">
            <Bot className="w-4 h-4 animate-bounce" />
          </div>
          <div>
            <div className="text-xs font-bold text-zinc-100 flex items-center space-x-1">
              <span>Mentor IA Técnico</span>
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-[9px] text-cyan-400 font-mono font-bold tracking-wider">Senior Infra & SOC Advisor</div>
          </div>
        </div>
        <div className="flex items-center space-x-1.5 text-[8.5px] font-mono text-[#10b981] bg-[#10b981]/15 px-1.5 py-0.5 rounded-sm border border-[#10b981]/25">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
          <span>Online</span>
        </div>
      </div>

      {/* Messages Feed */}
      <div
        ref={scrollRef}
        className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-zinc-800"
      >
        {messages.map((msg, idx) => (
          <div key={`msg-${idx}`} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] rounded-sm p-3 text-xs leading-relaxed text-left ${
                msg.sender === 'user'
                  ? 'bg-cyan-600 text-black rounded-br-none font-semibold'
                  : 'bg-[#0a0c16] border border-[#1e2130] text-[#c0c0cf] rounded-bl-none font-sans'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-[#0a0c16] border border-[#1e2130] rounded-sm p-3 rounded-bl-none flex items-center space-x-2 text-zinc-400 text-xs">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-405 text-cyan-400" />
              <span className="font-mono">Analisando telemetria operacional...</span>
            </div>
          </div>
        )}
      </div>

      {/* Recommended Quick Actions Row */}
      <div className="p-3.5 bg-[#0c0d1e]/40 border-t border-[#1e2130] grid grid-cols-3 gap-2">
        <button
          onClick={() => handleQuickAction('step')}
          className="flex items-center justify-center space-x-1 py-1.5 px-1 bg-[#0a0c16] border border-[#1e2130] hover:border-cyan-500 hover:bg-[#141625] text-[10px] text-[#c0c0cf] rounded-sm transition font-medium"
        >
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Próximo Passo</span>
        </button>
        <button
          onClick={() => handleQuickAction('explain')}
          className="flex items-center justify-center space-x-1 py-1.5 px-1 bg-[#0a0c16] border border-[#1e2130] hover:border-cyan-500 hover:bg-[#141625] text-[10px] text-[#c0c0cf] rounded-sm transition font-medium"
        >
          <BookOpen className="w-3 h-3 text-blue-400" />
          <span>Explicar Conceito</span>
        </button>
        <button
          onClick={() => handleQuickAction('faq')}
          className="flex items-center justify-center space-x-1 py-1.5 px-1 bg-[#0a0c16] border border-[#1e2130] hover:border-cyan-500 hover:bg-[#141625] text-[10px] text-[#c0c0cf] rounded-sm transition font-medium"
        >
          <AlertCircle className="w-3 h-3 text-teal-400" />
          <span>Conformidade</span>
        </button>
      </div>

      {/* Input Message Form */}
      <form onSubmit={handleSendMessage} className="p-3 bg-[#05060a] border-t border-[#1e2130] flex items-center space-x-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Pergunte sobre comandos, redes ou BGP..."
          className="flex-1 bg-[#0a0c16] border border-[#1e2130] rounded-sm px-3 py-1.5 text-xs text-zinc-200 outline-none focus:border-cyan-500 placeholder-zinc-600"
        />
        <button
          type="submit"
          className="p-1.5 bg-cyan-600 hover:bg-cyan-500 text-black rounded-sm transition flex items-center justify-center cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
