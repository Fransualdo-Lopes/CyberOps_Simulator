import React, { useState, useRef, useEffect } from 'react';
import { TerminalLog } from '../types';
import { Play, RotateCcw, AlertTriangle, Terminal as TerminalIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { VirtualFileSystemNode } from '../data/virtualFs';

interface TerminalProps {
  logs: TerminalLog[];
  deviceContext: string;
  onExecute: (command: string) => void;
  onReset: () => void;
  challengeId: string;
  currentDir?: string;
  terminalFileSystem?: Record<string, VirtualFileSystemNode>;
}

interface TypewriterLogLineProps {
  text: string;
  type: 'input' | 'output' | 'system' | 'error' | 'success';
  colorClass: string;
}

const renderInputLine = (text: string) => {
  const linuxMatch = text.match(/^([a-zA-Z0-9_\-]+)@([a-zA-Z0-9_\-]+):([^$#]*)([$#])(?:\s(.*))?$/);
  if (linuxMatch) {
    const [_, user, host, dir, promptChar, command = ''] = linuxMatch;
    return (
      <span className="font-mono">
        <span className={user === 'root' ? 'text-amber-400 font-semibold' : 'text-emerald-400 font-semibold'}>{user}</span>
        <span className="text-zinc-500">@</span>
        <span className={user === 'root' ? 'text-rose-400/90 font-semibold' : 'text-emerald-400/90 font-semibold'}>{host}</span>
        <span className="text-zinc-500">:</span>
        <span className="text-sky-400 font-semibold">{dir}</span>
        <span className="text-zinc-300 font-semibold">{promptChar} </span>
        <span className="text-zinc-100 font-medium">{command}</span>
      </span>
    );
  }

  const ciscoMatch = text.match(/^(Roteador-Core-01)(.*)#(?:\s(.*))?$/);
  if (ciscoMatch) {
    const [_, host, mode, command = ''] = ciscoMatch;
    return (
      <span className="font-mono">
        <span className="text-zinc-400 font-bold">{host}</span>
        <span className="text-cyan-500 font-normal">{mode}</span>
        <span className="text-zinc-400 font-bold"># </span>
        <span className="text-zinc-100 font-medium">{command}</span>
      </span>
    );
  }

  return <span className="text-cyan-400 font-bold">{text}</span>;
};

const TypewriterLogLine: React.FC<TypewriterLogLineProps> = ({ text, type, colorClass }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    if (type === 'input') {
      setDisplayedText(text);
      return;
    }

    setDisplayedText('');
    
    const totalLength = text.length;
    let step = 1;
    let intervalTime = 12;

    if (totalLength > 400) {
      // Very long text: show immediately to prevent user frustration
      setDisplayedText(text);
      return;
    } else if (totalLength > 150) {
      step = 6;
      intervalTime = 6;
    } else if (totalLength > 50) {
      step = 2;
      intervalTime = 8;
    }

    let currentLength = 0;
    const interval = setInterval(() => {
      currentLength += step;
      if (currentLength >= totalLength) {
        setDisplayedText(text);
        clearInterval(interval);
      } else {
        setDisplayedText(text.slice(0, currentLength));
      }
    }, intervalTime);

    return () => {
      clearInterval(interval);
    };
  }, [text, type]);

  return (
    <div className={`whitespace-pre-wrap leading-relaxed ${colorClass} transition-all duration-75`}>
      {type === 'input' ? renderInputLine(displayedText) : displayedText}
      {displayedText.length < text.length && (
        <span className="inline-block w-1.5 h-3.5 bg-cyan-400 ml-0.5 animate-pulse align-middle" />
      )}
    </div>
  );
}

export default function Terminal({
  logs,
  deviceContext,
  onExecute,
  onReset,
  challengeId,
  currentDir = '/home/user',
  terminalFileSystem
}: TerminalProps) {
  const [inputValue, setInputValue] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isShaking, setIsShaking] = useState(false);

  // Auto-trigger shake animation when the last log contains the operational order violation warning from Mentor IA
  useEffect(() => {
    if (logs.length > 0) {
      const lastLog = logs[logs.length - 1];
      if (lastLog && lastLog.type === 'system' && lastLog.text.includes('💡 [Mentor IA]')) {
        setIsShaking(true);
        const timer = setTimeout(() => setIsShaking(false), 800);
        return () => clearTimeout(timer);
      }
    }
  }, [logs]);

  // Auto scroll terminal logs
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, inputValue]);

  // Focus input automatically on tap
  const handleTerminalClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputValue.trim();
    if (!cmd) return;

    onExecute(cmd);
    setHistory(prev => [cmd, ...prev]);
    setInputValue('');
    setHistoryIdx(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIdx < history.length - 1) {
        const nextIdx = historyIdx + 1;
        setHistoryIdx(nextIdx);
        setInputValue(history[nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx > 0) {
        const nextIdx = historyIdx - 1;
        setHistoryIdx(nextIdx);
        setInputValue(history[nextIdx]);
      } else if (historyIdx === 0) {
        setHistoryIdx(-1);
        setInputValue('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      
      const input = inputValue;
      if (!input.trim()) return;

      const lastSpaceIdx = input.lastIndexOf(' ');
      const beforeLast = lastSpaceIdx >= 0 ? input.substring(0, lastSpaceIdx + 1) : '';
      const lastWord = lastSpaceIdx >= 0 ? input.substring(lastSpaceIdx + 1) : input;

      // Check if challenge is bgp-hijacking
      if (challengeId === 'bgp-hijacking') {
        const suggestions = [
          'show ip bgp summary', 'show running-config', 'show ip route', 'configure terminal', 
          'route-map FILTER-BGP deny 10', 'match ip address prefix-list FALSE-BGP', 
          'router bgp 65112', 'neighbor 180.2.2.1 route-map FILTER-BGP in', 'exit', 
          'clear ip bgp 180.2.2.1 soft', 'ping 180.2.2.1', 'help'
        ];
        
        const match = suggestions.find(s => s.toLowerCase().startsWith(input.toLowerCase()));
        if (match) {
          setInputValue(match);
        }
        return;
      }

      // Linux filesystem autocomplete
      if (terminalFileSystem) {
        let searchDir = currentDir;
        let filePrefix = lastWord;

        // Support absolute paths starting with /
        if (lastWord.startsWith('/')) {
          const lastSlashIdx = lastWord.lastIndexOf('/');
          if (lastSlashIdx === 0) {
            searchDir = '/';
            filePrefix = lastWord.substring(1);
          } else {
            searchDir = lastWord.substring(0, lastSlashIdx);
            filePrefix = lastWord.substring(lastSlashIdx + 1);
          }
        }

        // Gather all direct child nodes of searchDir
        const normDir = searchDir === '/' ? '/' : (searchDir.endsWith('/') ? searchDir : searchDir + '/');
        const children: { name: string; type: 'file' | 'dir' }[] = [];

        for (const [key, val] of Object.entries(terminalFileSystem)) {
          if (key.startsWith(normDir) && key !== normDir) {
            const relative = key.slice(normDir.length);
            // Ensure direct child (no inner slashes)
            if (relative && !relative.includes('/')) {
              children.push({ name: relative, type: val.type });
            }
          }
        }

        const matches = children.filter(c => c.name.toLowerCase().startsWith(filePrefix.toLowerCase()));

        if (matches.length === 1) {
          const match = matches[0];
          const completedWord = match.type === 'dir' ? match.name + '/' : match.name;
          
          let newWord = '';
          if (lastWord.startsWith('/')) {
            const prefixPath = searchDir === '/' ? '/' : searchDir + '/';
            newWord = prefixPath + completedWord;
          } else {
            newWord = completedWord;
          }
          setInputValue(beforeLast + newWord);
        } else if (matches.length > 1) {
          // Multiple matches: try to find the longest common prefix
          let commonPrefix = matches[0].name;
          for (let i = 1; i < matches.length; i++) {
            while (!matches[i].name.toLowerCase().startsWith(commonPrefix.toLowerCase())) {
              commonPrefix = commonPrefix.slice(0, -1);
              if (!commonPrefix) break;
            }
          }
          if (commonPrefix && commonPrefix.length > filePrefix.length) {
            let newWord = '';
            if (lastWord.startsWith('/')) {
              const prefixPath = searchDir === '/' ? '/' : searchDir + '/';
              newWord = prefixPath + commonPrefix;
            } else {
              newWord = commonPrefix;
            }
            setInputValue(beforeLast + newWord);
          }
        } else {
          // Fallback to active suggestions if no file matches
          const suggestions: { [key: string]: string[] } = {
            'linux': [
              'cd /var/log', 'ls -la', 'cat auth.log', 'grep "Failed password" auth.log', 
              'pwd', 'whoami', 'ip a', 'uptime', 'ping 198.51.100.42', 'clear', 'help'
            ],
            'soc': [
              'cd /var/www/html', 'ls -la', 'cat backdoor.php', 'cat index.html', 'ps aux', 
              'kill -9 1442', 'rm backdoor.php', 'chmod 644 index.html', 'whoami', 'ip a', 
              'lsof -i', 'ping 198.51.100.42', 'clear', 'help'
            ]
          };

          const activeList = challengeId === 'linux-basics' ? suggestions.linux : suggestions.soc;
          const match = activeList.find(s => s.toLowerCase().startsWith(input.toLowerCase()));
          if (match) {
            setInputValue(match);
          }
        }
      } else {
        // Fallback if filesystem is not passed
        const suggestions: { [key: string]: string[] } = {
          'linux': [
            'cd /var/log', 'ls -la', 'cat auth.log', 'grep "Failed password" auth.log', 
            'pwd', 'whoami', 'ip a', 'uptime', 'ping 198.51.100.42', 'clear', 'help'
          ],
          'soc': [
            'cd /var/www/html', 'ls -la', 'cat backdoor.php', 'cat index.html', 'ps aux', 
            'kill -9 1442', 'rm backdoor.php', 'chmod 644 index.html', 'whoami', 'ip a', 
            'lsof -i', 'ping 198.51.100.42', 'clear', 'help'
          ]
        };

        const activeList = challengeId === 'linux-basics' ? suggestions.linux : suggestions.soc;
        const match = activeList.find(s => s.toLowerCase().startsWith(input.toLowerCase()));
        if (match) {
          setInputValue(match);
        }
      }
    }
  };

  const getLogColorClass = (type: string) => {
    switch (type) {
      case 'input':
        return 'text-cyan-400 font-bold';
      case 'output':
        return 'text-zinc-300';
      case 'error':
        return 'text-rose-500 font-medium';
      case 'success':
        return 'text-emerald-400 font-bold';
      case 'system':
      default:
        return 'text-cyan-500 font-mono';
    }
  };

  // Helper string to show prompt in input
  const getPromptPrefix = () => {
    if (challengeId === 'bgp-hijacking') {
      if (deviceContext.includes('(config-route-map)')) {
        return 'Roteador-Core-01(config-route-map)# ';
      } else if (deviceContext.includes('(config-router)')) {
        return 'Roteador-Core-01(config-router)# ';
      } else if (deviceContext.includes('(config)')) {
        return 'Roteador-Core-01(config)# ';
      }
      return 'Roteador-Core-01# ';
    }
    
    // Para servidores Linux
    const isSoc = challengeId === 'soc-ransomware';
    const host = isSoc ? 'servidor-http' : 'servidor-auth';
    const user = isSoc ? 'apache' : 'root';
    const homeDir = isSoc ? '/var/www' : '/home/user';
    const promptChar = user === 'root' ? '#' : '$';
    
    let dirDisplay = currentDir;
    if (currentDir === homeDir) {
      dirDisplay = '~';
    } else if (currentDir === '/root' && user === 'root') {
      dirDisplay = '~';
    }
    
    return `${user}@${host}:${dirDisplay}${promptChar} `;
  };

  const renderPromptPrefix = () => {
    if (challengeId === 'bgp-hijacking') {
      let modeText = '';
      if (deviceContext.includes('(config-route-map)')) {
        modeText = '(config-route-map)';
      } else if (deviceContext.includes('(config-router)')) {
        modeText = '(config-router)';
      } else if (deviceContext.includes('(config)')) {
        modeText = '(config)';
      }
      return (
        <span className="font-mono text-zinc-400 font-bold select-none">
          Roteador-Core-01<span className="text-cyan-500 font-normal">{modeText}</span>#<span className="text-zinc-500 ml-1"></span>
        </span>
      );
    }
    
    // Linux Servers
    const isSoc = challengeId === 'soc-ransomware';
    const host = isSoc ? 'servidor-http' : 'servidor-auth';
    const user = isSoc ? 'apache' : 'root';
    const homeDir = isSoc ? '/var/www' : '/home/user';
    const promptChar = user === 'root' ? '#' : '$';
    
    let dirDisplay = currentDir;
    if (currentDir === homeDir) {
      dirDisplay = '~';
    } else if (currentDir === '/root' && user === 'root') {
      dirDisplay = '~';
    }
    
    return (
      <span className="font-mono font-semibold select-none text-[11px]">
        <span className={user === 'root' ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>{user}</span>
        <span className="text-zinc-500">@</span>
        <span className={user === 'root' ? 'text-rose-400/90 font-bold' : 'text-emerald-400/90 font-bold'}>{host}</span>
        <span className="text-zinc-500">:</span>
        <span className="text-sky-400">{dirDisplay}</span>
        <span className="text-zinc-300 ml-1">{promptChar} </span>
      </span>
    );
  };

  const shakeVariants = {
    shake: {
      x: [0, -8, 8, -8, 8, -4, 4, -2, 2, 0],
      borderColor: [
        '#1e2130',
        '#f43f5e',
        '#f43f5e',
        '#f43f5e',
        '#f43f5e',
        '#f43f5e',
        '#f43f5e',
        '#f43f5e',
        '#1e2130'
      ],
      boxShadow: [
        '0 0 0px 0px rgba(244, 63, 94, 0)',
        '0 0 15px 3px rgba(244, 63, 94, 0.4)',
        '0 0 15px 3px rgba(244, 63, 94, 0.3)',
        '0 0 15px 3px rgba(244, 63, 94, 0.4)',
        '0 0 15px 3px rgba(244, 63, 94, 0.3)',
        '0 0 10px 2px rgba(244, 63, 94, 0.2)',
        '0 0 10px 2px rgba(244, 63, 94, 0.2)',
        '0 0 5px 1px rgba(244, 63, 94, 0.1)',
        '0 0 0px 0px rgba(244, 63, 94, 0)'
      ],
      transition: {
        duration: 0.65,
        ease: 'easeInOut'
      }
    },
    idle: {
      x: 0,
      borderColor: '#1e2130',
      boxShadow: '0 0 0px 0px rgba(244, 63, 94, 0)'
    }
  };

  return (
    <motion.div
      id="terminal-card"
      onClick={handleTerminalClick}
      animate={isShaking ? 'shake' : 'idle'}
      variants={shakeVariants}
      className="flex flex-col h-[340px] bg-[#05060a] border border-[#1e2130] rounded-sm font-mono text-xs overflow-hidden select-text relative"
    >
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#0c0d1e]/80 border-b border-[#1e2130]">
        <div className="flex items-center space-x-2">
          <TerminalIcon className="w-4 h-4 text-cyan-400" />
          <span className="font-mono text-[11px] font-semibold text-zinc-400">
            TTY CONSOLE // {deviceContext}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          {/* Quick Tab Tip */}
          <span className="text-[9px] text-[#5e6382] px-2 py-0.5 rounded-sm bg-[#05060a] border border-[#2d314d]">
            [TAB] Auto-completar
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onReset();
            }}
            title="Recomeçar Laboratório"
            className="p-1 hover:bg-[#141625] rounded-sm transition-colors text-[#5e6382] hover:text-[#ef4444]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal Canvas */}
      <div
        ref={scrollRef}
        className="flex-1 p-4 overflow-y-auto space-y-1.5 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent text-left"
      >
        {logs.map((log, idx) => (
          <TypewriterLogLine
            key={`log-${idx}-${log.text.substring(0, 15)}`}
            text={log.text}
            type={log.type}
            colorClass={getLogColorClass(log.type)}
          />
        ))}

        {/* Interactive Command Input line directly inline at the bottom */}
        <form onSubmit={handleSubmit} className="flex items-center pt-1">
          <span className="mr-1 flex-shrink-0 select-none whitespace-nowrap">
            {renderPromptPrefix()}
          </span>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            className="flex-1 bg-transparent border-none outline-none focus:outline-none focus:ring-0 focus:border-none text-[#ffffff] font-mono caret-cyan-400 select-text p-0 m-0"
            style={{ ring: 'none', boxShadow: 'none' }}
          />
          <button
            type="submit"
            className="ml-2 p-1 text-cyan-500 hover:text-cyan-400 opacity-40 hover:opacity-100 transition rounded"
            title="Executar Comando (Enter)"
          >
            <Play className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </motion.div>
  );
}
