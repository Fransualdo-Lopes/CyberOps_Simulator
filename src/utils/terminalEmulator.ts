import { VirtualFileSystemNode } from '../data/virtualFs';
import { TerminalLog } from '../types';

export interface TerminalExecutionResult {
  logs: TerminalLog[];
  nextDir: string;
  nextFileSystem: Record<string, VirtualFileSystemNode>;
  nextDeviceContext: string;
  bgpConfigState?: {
    createdRouteMap: boolean;
    matchedPrefixList: boolean;
    enteredRouterBgp: boolean;
    configuredNeighbor: boolean;
  };
  socConfigState?: {
    killedMalware: boolean;
    deletedWebshell: boolean;
    fixedPermissions: boolean;
  };
  triggerResolution?: boolean;
}

/**
 * Normalizes absolute or relative paths given a current working directory
 */
function resolvePath(currentDir: string, targetPath: string): string {
  if (!targetPath) return currentDir;
  
  // Handlers for home directory '~'
  if (targetPath === '~') {
    return currentDir.startsWith('/var/www') ? '/var/www' : '/home/user';
  }
  if (targetPath.startsWith('~/')) {
    const baseHome = currentDir.startsWith('/var/www') ? '/var/www' : '/home/user';
    targetPath = baseHome + targetPath.substring(1);
  }

  // Absolute path
  let absolute: string;
  if (targetPath.startsWith('/')) {
    absolute = targetPath;
  } else {
    // Relative path
    const slash = currentDir === '/' ? '' : '/';
    absolute = `${currentDir}${slash}${targetPath}`;
  }

  // Handle dots (.. and .)
  const parts = absolute.split('/').filter(p => p !== '' && p !== '.');
  const stack: string[] = [];
  
  for (const part of parts) {
    if (part === '..') {
      stack.pop();
    } else {
      stack.push(part);
    }
  }

  return '/' + stack.join('/');
}

/**
 * Emulates Terminal commands for Linux Environments (Challenge 1 & 2)
 */
export function executeLinuxCommand(
  command: string,
  currentDir: string,
  fileSystem: Record<string, VirtualFileSystemNode>,
  challengeId: string,
  socState: { killedMalware: boolean; deletedWebshell: boolean; fixedPermissions: boolean }
): TerminalExecutionResult {
  const resultLogs: TerminalLog[] = [];
  const parts = command.trim().split(/\s+/);
  const cmdBase = parts[0].toLowerCase();
  
  const nextFileSystem = { ...fileSystem };
  let nextDir = currentDir;
  let triggerResolution = false;
  
  const updatedSocState = { ...socState };

  // Helper values
  const isSoc = challengeId === 'soc-ransomware';
  const user = isSoc ? 'apache' : 'root';

  switch (cmdBase) {
    case 'pwd': {
      resultLogs.push({ text: currentDir, type: 'output' });
      break;
    }

    case 'whoami': {
      resultLogs.push({ text: user, type: 'output' });
      break;
    }

    case 'id': {
      if (user === 'root') {
        resultLogs.push({ text: 'uid=0(root) gid=0(root) groups=0(root)', type: 'output' });
      } else {
        resultLogs.push({ text: 'uid=33(apache) gid=33(apache) groups=33(www-data),1001(nogroup)', type: 'output' });
      }
      break;
    }

    case 'uptime': {
      const load = isSoc && !updatedSocState.killedMalware ? 'load average: 4.88, 3.12, 1.45' : 'load average: 0.02, 0.05, 0.11';
      resultLogs.push({ 
        text: `13:30:42 up 14 days,  3:12,  1 user,  ${load}`, 
        type: 'output' 
      });
      if (isSoc && !updatedSocState.killedMalware) {
        resultLogs.push({ text: '⚠️ Atenção: A carga do sistema está extremamente alta (consumo excessivo de CPU)!', type: 'error' });
      }
      break;
    }

    case 'ip':
    case 'ipa':
    case 'ifconfig': {
      const arg = parts[1];
      if (cmdBase === 'ip' && arg !== 'a' && arg !== 'addr' && arg !== 'address') {
        resultLogs.push({ text: 'Object "'+arg+'" is unknown, try "ip address" or "ip a".', type: 'error' });
        break;
      }
      
      const ipAddr = challengeId === 'soc-ransomware' ? '192.168.1.120' : '192.168.1.100';
      resultLogs.push({ text: '1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000', type: 'system' });
      resultLogs.push({ text: '    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00', type: 'output' });
      resultLogs.push({ text: '    inet 127.0.0.1/8 scope host lo', type: 'output' });
      resultLogs.push({ text: '2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc mq state UP group default qlen 1000', type: 'system' });
      resultLogs.push({ text: '    link/ether 52:54:00:12:34:56 brd ff:ff:ff:ff:ff:ff', type: 'output' });
      resultLogs.push({ text: `    inet ${ipAddr}/24 brd 192.168.1.255 scope global dynamic eth0`, type: 'output' });
      resultLogs.push({ text: '       valid_lft 86400sec preferred_lft 86400sec', type: 'output' });
      break;
    }

    case 'ping': {
      const host = parts[1];
      if (!host) {
        resultLogs.push({ text: 'ping: missing host operand', type: 'error' });
        break;
      }
      
      const resolvedHost = host.replace(/["';`&|]/g, '');
      resultLogs.push({ text: `PING ${resolvedHost} (${resolvedHost}) 56(84) bytes of data.`, type: 'system' });
      
      const isAttacker = resolvedHost === '198.51.100.42' || resolvedHost.includes('attacker');
      const latency = isAttacker ? '12.4' : '3.8';
      const ttl = isAttacker ? '54' : '64';

      resultLogs.push({ text: `64 bytes from ${resolvedHost}: icmp_seq=1 ttl=${ttl} time=${latency} ms`, type: 'output' });
      resultLogs.push({ text: `64 bytes from ${resolvedHost}: icmp_seq=2 ttl=${ttl} time=${(parseFloat(latency)+0.2).toFixed(1)} ms`, type: 'output' });
      resultLogs.push({ text: `64 bytes from ${resolvedHost}: icmp_seq=3 ttl=${ttl} time=${(parseFloat(latency)-0.1).toFixed(1)} ms`, type: 'output' });
      resultLogs.push({ text: `64 bytes from ${resolvedHost}: icmp_seq=4 ttl=${ttl} time=${latency} ms`, type: 'output' });
      resultLogs.push({ text: `\n--- ${resolvedHost} ping statistics ---`, type: 'system' });
      resultLogs.push({ text: `4 packets transmitted, 4 received, 0% packet loss, time 3003ms\nrtt min/avg/max/mdev = ${(parseFloat(latency)-0.1).toFixed(1)}/${latency}/${(parseFloat(latency)+0.2).toFixed(1)}/0.12 ms`, type: 'output' });
      break;
    }

    case 'cd': {
      const target = parts[1];
      if (!target) {
        // cd semantics with no arguments defaults to home
        nextDir = challengeId === 'soc-ransomware' ? '/var/www' : '/home/user';
        break;
      }
      
      const pathChecked = resolvePath(currentDir, target);
      const dirNode = nextFileSystem[pathChecked];
      
      if (dirNode && dirNode.type === 'dir') {
        nextDir = pathChecked;
      } else {
        resultLogs.push({ text: `cd: no such file or directory: ${target}`, type: 'error' });
      }
      break;
    }

    case 'ls': {
      // Find paths to list
      let listPath = currentDir;
      const flags: string[] = [];
      const args: string[] = [];
      
      for (let i = 1; i < parts.length; i++) {
        if (parts[i].startsWith('-')) {
          flags.push(parts[i]);
        } else {
          args.push(parts[i]);
        }
      }

      if (args.length > 0) {
        listPath = resolvePath(currentDir, args[0]);
      }

      // Check if path is valid
      const targetNode = nextFileSystem[listPath];
      if (!targetNode) {
        resultLogs.push({ text: `ls: cannot access '${args[0] || listPath}': No such file or directory`, type: 'error' });
        break;
      }

      const showDetailed = flags.some(f => f.includes('l'));
      const showAll = flags.some(f => f.includes('a'));

      if (targetNode.type === 'file') {
        const node = targetNode;
        if (showDetailed) {
          resultLogs.push({ text: `${node.permissions} 1 ${node.owner} ${node.group} ${node.size} ${node.mdate} ${node.name}`, type: 'output' });
        } else {
          resultLogs.push({ text: node.name, type: 'output' });
        }
        break;
      }

      // Loop over filesystem keys to find children
      const filesToShow: [string, VirtualFileSystemNode][] = [];
      Object.entries(nextFileSystem).forEach(([filePath, fileNode]) => {
        // Simple directory check
        const parentPath = filePath.substring(0, filePath.lastIndexOf('/'));
        const normalParent = parentPath === '' ? '/' : parentPath;
        
        if (normalParent === listPath && filePath !== listPath) {
          filesToShow.push([filePath, fileNode]);
        }
      });

      // Show dot directory indicators
      if (showDetailed && showAll) {
        const myNode = nextFileSystem[listPath] || { permissions: 'drwxr-xr-x', owner: 'root', group: 'root', size: '4.0K', mdate: 'May 26 12:00' };
        resultLogs.push({ text: `${myNode.permissions}  2 ${myNode.owner} ${myNode.group} ${myNode.size} ${myNode.mdate} .`, type: 'system' });
        resultLogs.push({ text: `drwxr-xr-x 20 root   root   4.0K May 26 11:50 ..`, type: 'system' });
      }

      if (filesToShow.length === 0) {
        break; // Directory is empty
      }

      // Format listing output
      if (showDetailed) {
        filesToShow.sort((a,b) => a[0].localeCompare(b[0])).forEach(([path, node]) => {
          let extraInfo = '';
          if (isSoc && node.name === 'backdoor.php') {
            extraInfo = '   (⚠️ Web Shell Ativo!)';
          } else if (isSoc && node.name === 'index.html' && node.permissions === '----------') {
            extraInfo = '   (❌ Bloqueado/Criptografado .crypto)';
          }
          
          const typeColor = node.type === 'dir' ? 'text-cyan-400 font-bold' : (extraInfo ? 'text-rose-400 font-medium' : 'text-zinc-200');
          resultLogs.push({ 
            text: `${node.permissions} 1 ${node.owner} group ${node.size.padStart(5)} ${node.mdate} ${node.name}${extraInfo}`, 
            type: extraInfo ? 'error' : (node.type === 'dir' ? 'system' : 'output')
          });
        });
      } else {
        const names = filesToShow.sort((a,b) => a[0].localeCompare(b[0])).map(([_, n]) => {
          if (isSoc && n.name === 'backdoor.php') return `${n.name} [MALWARE]`;
          return n.name;
        }).join('   ');
        resultLogs.push({ text: names, type: 'output' });
      }
      break;
    }

    case 'cat': {
      const target = parts[1];
      if (!target) {
        resultLogs.push({ text: 'cat: missing operand', type: 'error' });
        break;
      }

      const filePath = resolvePath(currentDir, target);
      const node = nextFileSystem[filePath];

      if (!node) {
        resultLogs.push({ text: `cat: ${target}: No such file or directory`, type: 'error' });
        break;
      }

      if (node.type === 'dir') {
        resultLogs.push({ text: `cat: ${target}: Is a directory`, type: 'error' });
        break;
      }

      // Check permissions emulation
      if (node.permissions === '----------') {
        resultLogs.push({ text: `cat: ${target}: Permission denied (Arquivo com permissão de leitura zerada. Altere-a primeiro!)`, type: 'error' });
        break;
      }

      resultLogs.push({ text: node.content || '# Empty file', type: 'output' });
      break;
    }

    case 'grep': {
      // Basic parser for 'grep "Failed password" /var/log/auth.log' or 'grep Failed auth.log'
      const argsText = command.substring(4).trim();
      if (!argsText) {
        resultLogs.push({ text: 'Usage: grep [PATTERN] [FILE]', type: 'error' });
        break;
      }

      // Parse pattern (which might be inside quotes) versus path
      let pattern = '';
      let filePathArg = '';

      const doubleQuoteMatch = argsText.match(/^"([^"]+)"\s+(.+)$/);
      const singleQuoteMatch = argsText.match(/^'([^']+)'\s+(.+)$/);

      if (doubleQuoteMatch) {
        pattern = doubleQuoteMatch[1];
        filePathArg = doubleQuoteMatch[2].trim();
      } else if (singleQuoteMatch) {
        pattern = singleQuoteMatch[1];
        filePathArg = singleQuoteMatch[2].trim();
      } else {
        const rawParts = argsText.split(/\s+/);
        pattern = rawParts[0];
        filePathArg = rawParts[1] ? rawParts[1].trim() : '';
      }

      if (!filePathArg) {
        resultLogs.push({ text: 'grep: missing file operand. Specify the log path.', type: 'error' });
        break;
      }

      const pathResolved = resolvePath(currentDir, filePathArg);
      const fileNode = nextFileSystem[pathResolved];

      if (!fileNode) {
        resultLogs.push({ text: `grep: ${filePathArg}: No such file or directory`, type: 'error' });
        break;
      }

      if (fileNode.type === 'dir') {
        resultLogs.push({ text: `grep: ${filePathArg}: Is a directory`, type: 'error' });
        break;
      }

      if (fileNode.permissions === '----------') {
        resultLogs.push({ text: `grep: ${filePathArg}: Permission denied`, type: 'error' });
        break;
      }

      const lines = (fileNode.content || '').split('\n');
      const matches = lines.filter(line => line.toLowerCase().includes(pattern.toLowerCase()));

      if (matches.length > 0) {
        matches.forEach(m => {
          resultLogs.push({ text: m, type: 'output' });
        });
        
        // CHECK IF IT MATCHES EXPLICIT GOAL FOR CHALLENGE 1
        if (challengeId === 'linux-basics' && pattern.toLowerCase().includes('failed password')) {
          resultLogs.push({ text: '\n✓ [REGISTRO DE BRUTE FORCE IDENTIFICADO]', type: 'success' });
          resultLogs.push({ text: 'Parabéns! Você utilizou a ferramenta de filtro corretamente.', type: 'success' });
          resultLogs.push({ text: 'Diagnóstico concluído. Reporte o IP "198.51.100.42" para o Mentor IA no Chat lateral ou encerre o lab clicando em Resolver!', type: 'success' });
          triggerResolution = true;
        }
      } else {
        resultLogs.push({ text: `0 matching lines found for pattern: "${pattern}"`, type: 'system' });
      }
      break;
    }

    case 'ps': {
      if (parts[1] && parts[1] !== 'aux' && parts[1] !== '-ef') {
        resultLogs.push({ text: `ps: option not supported in simulation: '${parts[1]}'. Try 'ps aux'.`, type: 'error' });
        break;
      }

      resultLogs.push({ text: 'PID   USER     %CPU %MEM   VSZ   RSS TTY      STAT START   TIME COMMAND', type: 'system' });
      resultLogs.push({ text: '1     root      0.0  0.1  1024   512 ?        Ss   12:30   0:00 /sbin/init', type: 'output' });
      resultLogs.push({ text: '80    apache    0.1  0.5 45000 12000 ?        S    12:32   0:02 /usr/sbin/apache2', type: 'output' });
      
      if (isSoc && !updatedSocState.killedMalware) {
        resultLogs.push({ text: '1442  nobody   82.6  8.2 98400 32500 ?        R    12:35   0:15 /tmp/malware-encryptor --path=/var/www/html/', type: 'error' });
        resultLogs.push({ text: '\n⚠️ Detectado processo suspeito (PID 1442) sequestrando o processador a 82.6%!', type: 'error' });
        resultLogs.push({ text: 'Comando recomendado: "kill -9 1442" para forçar o encerramento operacional imediato.', type: 'system' });
      } else if (isSoc && updatedSocState.killedMalware) {
        resultLogs.push({ text: '\nProcesso 1442 encostado e finalizado pelo sinal SIGKILL de administrador.', type: 'success' });
      } else {
        resultLogs.push({ text: '2241  root      0.0  0.2 12000  4500 ?        S    13:01   0:00 /usr/sbin/sshd -D', type: 'output' });
      }
      break;
    }

    case 'lsof': {
      if (parts[1] && parts[1] !== '-i') {
        resultLogs.push({ text: 'lsof: option ignored in simulation. Try "lsof -i" to view open ports.', type: 'error' });
      }
      
      resultLogs.push({ text: 'COMMAND    PID   USER   FD   TYPE DEVICE SIZE/OFF NODE NAME', type: 'system' });
      resultLogs.push({ text: 'sshd      2241   root    3u  IPv4  14412      0t0  TCP *:ssh (LISTEN)', type: 'output' });
      
      if (isSoc) {
        resultLogs.push({ text: 'apache2     80 apache    4u  IPv4  15523      0t0  TCP *:http (LISTEN)', type: 'output' });
        if (!updatedSocState.killedMalware) {
          resultLogs.push({ text: 'malware   1442 nobody    5u  IPv4  20948      0t0  TCP 192.168.1.120:49221->198.51.100.42:4444 (ESTABLISHED)', type: 'error' });
          resultLogs.push({ text: '\n⚠️ Alerta: Conexão suspeita ativa direcionando dados locais para servidor externo (porta 4444)!', type: 'error' });
        }
      }
      break;
    }

    case 'kill': {
      const pidArg = parts.find(p => p !== 'kill' && p !== '-9');
      const isForce = command.includes('-9');
      
      if (!pidArg) {
        resultLogs.push({ text: 'kill: usage: kill [-9] [PID]', type: 'error' });
        break;
      }

      if (isSoc && pidArg === '1442') {
        if (!isForce) {
          resultLogs.push({ text: 'Processo ignorou o sinal standard SIGTERM. O ransomware esta travando as chamadas. Utilize o sinal de força "kill -9 1442"!', type: 'error' });
        } else {
          updatedSocState.killedMalware = true;
          resultLogs.push({ text: '✓ [PROCESSO 1442 FINALIZADO VIA SIGKILL]', type: 'success' });
          resultLogs.push({ text: 'Carga de CPU normalizada. Cifragem impedida!', type: 'output' });
          
          // Check if also completed other parts
          checkSocResolution(updatedSocState, resultLogs, () => {
            triggerResolution = true;
          });
        }
      } else {
        resultLogs.push({ text: `kill: (${pidArg}) - No such process or Permission Denied`, type: 'error' });
      }
      break;
    }

    case 'rm': {
      let fileArg = '';
      const hasForce = command.includes('-rf') || command.includes('-f');
      
      for (let i = 1; i < parts.length; i++) {
        if (!parts[i].startsWith('-')) {
          fileArg = parts[i];
          break;
        }
      }

      if (!fileArg) {
        resultLogs.push({ text: 'rm: missing operand', type: 'error' });
        break;
      }

      const filePathResolv = resolvePath(currentDir, fileArg);
      const fileNode = nextFileSystem[filePathResolv];

      if (!fileNode) {
        resultLogs.push({ text: `rm: cannot remove '${fileArg}': No such file or directory`, type: 'error' });
        break;
      }

      // Handle file removal
      delete nextFileSystem[filePathResolv];
      resultLogs.push({ text: `✓ Removido com sucesso: '${filePathResolv}'`, type: 'success' });

      // Check if deleted webshell backdoor in SOC
      if (isSoc && filePathResolv === '/var/www/html/backdoor.php') {
        updatedSocState.deletedWebshell = true;
        resultLogs.push({ text: '✓ [INTEGRIDADE RESTAURADA] Backdoor php removido do diretorio público do servidor.', type: 'success' });
        
        checkSocResolution(updatedSocState, resultLogs, () => {
          triggerResolution = true;
        });
      }
      break;
    }

    case 'chmod': {
      const mode = parts[1];
      const targetChar = parts[2];

      if (!mode || !targetChar) {
        resultLogs.push({ text: 'chmod: usage: chmod [MODE/OCTAL] [FILE]', type: 'error' });
        break;
      }

      const pathResolved = resolvePath(currentDir, targetChar);
      const node = nextFileSystem[pathResolved];

      if (!node) {
        resultLogs.push({ text: `chmod: cannot access '${targetChar}': No such file or directory`, type: 'error' });
        break;
      }

      if (mode === '644') {
        node.permissions = '-rw-r--r--';
        resultLogs.push({ text: `✓ Permissão de '${targetChar}' atualizada para 644 (Leitura pública redefinida).`, type: 'success' });
        
        if (isSoc && pathResolved === '/var/www/html/index.html') {
          node.content = '==========================================\nPORTAL DE FINTECH CORPORATIVO - ONLINE\n==========================================\n\nNossos servidores de backbone estao sendo monitorados em tempo real pela console corporativa SOC.\nSeja bem-vindo de volta! \nStatus: 100% OPERACIONAL';
          updatedSocState.fixedPermissions = true;
          resultLogs.push({ text: '✓ [INDICE DESBLOQUEADO] Conteudo da home do site recuperado com sucesso para producao!', type: 'success' });
          
          checkSocResolution(updatedSocState, resultLogs, () => {
            triggerResolution = true;
          });
        }
      } else {
        resultLogs.push({ text: `Subsitituição de octal '${mode}' registrada, mas pode não resolver a mitigação do lab de segurança. Use '644' para consertar a página pública de index do apache.`, type: 'system' });
      }
      break;
    }

    case 'help': {
      resultLogs.push({ text: '=== SIMULAÇÃO DE TERMINAL LINUX INTERATIVO ===', type: 'system' });
      resultLogs.push({ text: 'pwd                         -> Exibe o caminho da pasta atual.', type: 'output' });
      resultLogs.push({ text: 'cd <diretório>               -> Navega para outro diretório (Ex: cd /var/log, cd ~, cd ..).', type: 'output' });
      resultLogs.push({ text: 'ls -la                      -> Lista todos os arquivos com detalhes e permissões.', type: 'output' });
      resultLogs.push({ text: 'cat <arquivo>               -> Imprime o conteúdo de um arquivo de texto.', type: 'output' });
      resultLogs.push({ text: 'grep "<filtro>" <arquivo>   -> Filtra linhas com um termo exato (padrão regex).', type: 'output' });
      resultLogs.push({ text: 'whoami / id                 -> Exibe o usuário ativo do terminal.', type: 'output' });
      resultLogs.push({ text: 'uptime                      -> Tempo de atividade e carga média de processador.', type: 'output' });
      resultLogs.push({ text: 'ip address / ip a           -> Configuração de placas de rede e IPv4.', type: 'output' });
      resultLogs.push({ text: 'ping <IP>                   -> Envia pacotes ICMP para avaliar link.', type: 'output' });
      resultLogs.push({ text: 'clear                       -> Limpa a tela do console.', type: 'output' });
      
      if (isSoc) {
        resultLogs.push({ text: 'ps aux                      -> Lista processos rodando em tempo real.', type: 'output' });
        resultLogs.push({ text: 'lsof -i                     -> Lista soquetes e conexões e portas associadas.', type: 'output' });
        resultLogs.push({ text: 'kill -9 <PID>               -> Encerra um processo de forma forçada.', type: 'output' });
        resultLogs.push({ text: 'rm backdoor.php             -> Apaga o arquivo infectado do sistema.', type: 'output' });
        resultLogs.push({ text: 'chmod 644 index.html        -> Corrige o permissionamento bloqueado da index.', type: 'output' });
      }
      break;
    }

    default: {
      resultLogs.push({ text: `${command}: command not found. Use "help" para ver as alternativas disponíveis.`, type: 'error' });
      break;
    }
  }

  return {
    logs: resultLogs,
    nextDir,
    nextFileSystem,
    nextDeviceContext: challengeId === 'soc-ransomware' ? 'servidor-http' : 'servidor-auth',
    socConfigState: updatedSocState,
    triggerResolution
  };
}

function checkSocResolution(
  state: { killedMalware: boolean; deletedWebshell: boolean; fixedPermissions: boolean },
  logs: TerminalLog[],
  onSuccess: () => void
): void {
  if (state.killedMalware && state.deletedWebshell && state.fixedPermissions) {
    logs.push({ text: '\n✓ [TODOS OS OBJETIVOS DO SOC RESOLVIDOS COM EXCELENCIA!]', type: 'success' });
    logs.push({ text: 'Processo encerrado + Código malicioso excluído + Index restaurada.', type: 'success' });
    logs.push({ text: 'Clique em RESOLVER LABORATÓRIO no modal superior para faturar cyber créditos!', type: 'success' });
    onSuccess();
  }
}

/**
 * Emulates Terminal commands for BGP Cisco IOS Environment (Challenge 3)
 */
export function executeBgpCommand(
  command: string,
  deviceContext: string,
  bgpState: {
    createdRouteMap: boolean;
    matchedPrefixList: boolean;
    enteredRouterBgp: boolean;
    configuredNeighbor: boolean;
  }
): TerminalExecutionResult {
  const resultLogs: TerminalLog[] = [];
  const trimmed = command.trim();
  const lower = trimmed.toLowerCase();
  const parts = trimmed.split(/\s+/);
  const cmdBase = parts[0].toLowerCase();
  
  let nextDeviceContext = deviceContext;
  let triggerResolution = false;
  
  const updatedBgpState = { ...bgpState };

  // Route-map logic, Router BGP configs:
  if (cmdBase === 'exit') {
    if (deviceContext === 'Roteador-Core-01(config-route-map)') {
      nextDeviceContext = 'Roteador-Core-01(config)';
      resultLogs.push({ text: 'Roteador-Core-01(config)#', type: 'system' });
    } else if (deviceContext === 'Roteador-Core-01(config-router)') {
      nextDeviceContext = 'Roteador-Core-01(config)';
      resultLogs.push({ text: 'Roteador-Core-01(config)#', type: 'system' });
    } else if (deviceContext === 'Roteador-Core-01(config)') {
      nextDeviceContext = 'Roteador-Core-01';
      resultLogs.push({ text: 'Roteador-Core-01#', type: 'system' });
    } else {
      resultLogs.push({ text: 'Conexão SSH fechada localmente.', type: 'system' });
    }
    return {
      logs: resultLogs,
      nextDir: '/',
      nextFileSystem: {},
      nextDeviceContext,
      bgpConfigState: updatedBgpState
    };
  }

  // Cisco config mode transitions
  if (deviceContext === 'Roteador-Core-01') {
    if (trimmed === 'configure terminal' || trimmed === 'conf t') {
      nextDeviceContext = 'Roteador-Core-01(config)';
      resultLogs.push({ text: 'Entrando no modo de configuração global.\nUtilize comandos apropriados para route-map e vizinhança.', type: 'system' });
    } else if (cmdBase === 'show' || cmdBase === 'sh') {
      const showArg = parts.slice(1).join(' ').toLowerCase();
      
      if (showArg === 'ip bgp summary' || showArg === 'ip bgp sum') {
        resultLogs.push({ text: 'BGP router identifier 200.1.1.1, local AS number 65112', type: 'system' });
        resultLogs.push({ text: 'Neighbor        V    AS MsgRcvd MsgSent   TblVer  InQ OutQ Up/Down  State/PfxRcd', type: 'system' });
        resultLogs.push({ text: '200.1.1.2       4 65000     148     152       10    0    0 00:24:11 Established / 152', type: 'output' });
        
        const bStatus = updatedBgpState.configuredNeighbor ? 'Established / 0' : 'Active / 1 (Inundação)';
        const bMsg = updatedBgpState.configuredNeighbor ? 'success' : 'error';
        resultLogs.push({ 
          text: `180.2.2.1       4 54321      85      90       10    0    0 00:15:32 ${bStatus}`, 
          type: bMsg 
        });
        
        if (!updatedBgpState.configuredNeighbor) {
          resultLogs.push({ text: '\n⚠️ Host 180.2.2.1 (AS-54321) está disparando anúncios mal-intencionados!', type: 'error' });
        }
      } 
      else if (showArg === 'ip route' || showArg === 'ip rt') {
        resultLogs.push({ text: 'Codes: L - local, C - connected, S - static, R - RIP, B - BGP', type: 'system' });
        resultLogs.push({ text: 'Gateway of last resort is 200.1.1.2 to network 0.0.0.0', type: 'system' });
        resultLogs.push({ text: 'C    200.1.1.0/30 is directly connected, GigabitEthernet0/1', type: 'output' });
        resultLogs.push({ text: 'C    180.2.2.0/30 is directly connected, GigabitEthernet0/2', type: 'output' });
        
        const isHijacked = !triggerResolution; // will change on clear soft
        if (isHijacked && !updatedBgpState.configuredNeighbor) {
          resultLogs.push({ text: 'B*   200.100.50.0/24 [20/0] via 180.2.2.1, 00:02:11 (SEQUESTRADO!)', type: 'error' });
          resultLogs.push({ text: '⚠️ Atenção: A rota para o banco FintechSecure (200.100.50.0/24) está passando pelo gateway sequestrador (180.2.2.1)!', type: 'error' });
        } else {
          resultLogs.push({ text: 'B*   200.100.50.0/24 [20/12] via 200.1.1.2, 00:00:15 (Restaurado)', type: 'success' });
          resultLogs.push({ text: '✓ [SUCESSO]: Rota apontada para o tráfego regular legítimo via AS-65000.', type: 'success' });
        }
      } 
      else if (showArg === 'ip bgp') {
        resultLogs.push({ text: 'BGP table version is 12, local router ID is 200.1.1.1', type: 'system' });
        resultLogs.push({ text: 'Status codes: * valid, > best, i - internal', type: 'system' });
        resultLogs.push({ text: '   Network          Next Hop            Metric LocPrf Weight Path', type: 'system' });
        
        if (!updatedBgpState.configuredNeighbor) {
          resultLogs.push({ text: '*> 200.100.50.0     180.2.2.1                              0 54321 i (Fake Route)', type: 'error' });
          resultLogs.push({ text: '*  200.100.50.0     200.1.1.2                50             0 65000 i', type: 'output' });
        } else {
          resultLogs.push({ text: '*> 200.100.50.0     200.1.1.2                50             0 65000 i', type: 'success' });
        }
      } 
      else if (showArg === 'running-config' || showArg === 'run' || showArg === 'running') {
        resultLogs.push({ text: 'Building configuration...\n', type: 'system' });
        resultLogs.push({ text: 'hostname Roteador-Core-01\n!\ninterface GigabitEthernet0/1\n GigabitEthernet do backbone\n ip address 200.1.1.1 255.255.255.252\n!', type: 'output' });
        resultLogs.push({ text: 'interface GigabitEthernet0/2\n ip address 180.2.2.2 255.255.255.252\n!', type: 'output' });
        
        if (updatedBgpState.enteredRouterBgp) {
          resultLogs.push({ text: 'router bgp 65112\n  neighbor 200.1.1.2 remote-as 65000\n  neighbor 180.2.2.1 remote-as 54321', type: 'output' });
          if (updatedBgpState.configuredNeighbor) {
            resultLogs.push({ text: '  neighbor 180.2.2.1 route-map FILTER-BGP in', type: 'success' });
          }
          resultLogs.push({ text: '!', type: 'output' });
        }
        
        if (updatedBgpState.createdRouteMap) {
          resultLogs.push({ text: 'route-map FILTER-BGP deny 10', type: 'output' });
          if (updatedBgpState.matchedPrefixList) {
            resultLogs.push({ text: '  match ip address prefix-list FALSE-BGP', type: 'success' });
          }
          resultLogs.push({ text: '!', type: 'output' });
        }
      } 
      else {
        resultLogs.push({ text: `% Incomplete command or options: "show ${showArg}". Try "show ip bgp summary" or "show running-config".`, type: 'error' });
      }
    } 
    else if (trimmed.startsWith('clear ip bgp')) {
      const clearArg = trimmed.replace('clear ip bgp', '').trim();
      if (clearArg === '180.2.2.1 soft' || clearArg === '* soft') {
        if (updatedBgpState.createdRouteMap && updatedBgpState.matchedPrefixList && updatedBgpState.enteredRouterBgp && updatedBgpState.configuredNeighbor) {
          resultLogs.push({ text: '✓ [SOFT RESET EXECUTADO COM SUCESSO]', type: 'success' });
          resultLogs.push({ text: 'Recalculando rotas com neighbor 180.2.2.1...', type: 'system' });
          resultLogs.push({ text: 'Filtro INBOUND de route-map estabelecido. 1 rota suspensa, tráfego FintechSecure normalizado!', type: 'success' });
          triggerResolution = true;
        } else {
          resultLogs.push({ text: 'Soft Reset executado. Entretanto, nenhuma mudança de tráfego ocorreu porque as configurações do Route-map estão incompletas ou não estão vinculadas ao vizinho BGP nas configurações da sessão.', type: 'error' });
        }
      } else {
        resultLogs.push({ text: '% Command incomplete or invalid syntax. Try: "clear ip bgp 180.2.2.1 soft"', type: 'error' });
      }
    } 
    else if (trimmed.startsWith('ping')) {
      const target = parts[1];
      if (target === '180.2.2.1') {
        resultLogs.push({ text: 'Type escape sequence to abort.\nSending 5, 100-byte ICMP Echos to 180.2.2.1, timeout is 2 seconds:\n!!!!!\nSuccess rate is 100 percent (5/5), round-trip min/avg/max = 12/13/15 ms', type: 'success' });
      } else if (target === '200.100.50.1') {
        if (updatedBgpState.configuredNeighbor) {
          resultLogs.push({ text: 'Type escape sequence to abort.\nSending 5, 100-byte ICMP Echos to 200.100.50.1, timeout is 2 seconds:\n!!!!!\nSuccess rate is 100 percent (5/5), round-trip min/avg/max = 4/6/10 ms', type: 'success' });
        } else {
          resultLogs.push({ text: 'Type escape sequence to abort.\nSending 5, 100-byte ICMP Echos to 200.100.50.1, timeout is 2 seconds:\n.U.U.\nSuccess rate is 0 percent (0/5). Destination unreachable via hijack path AS-54321.', type: 'error' });
        }
      } else {
        resultLogs.push({ text: `% No route to host: ${target || ''}`, type: 'error' });
      }
    }
    else {
      resultLogs.push({ text: '% Invalid command. Use "configure terminal" to enter config mode, "ping <IP>", or "show ip bgp summary".', type: 'error' });
    }
  }

  // GLOBAL CONFIG MODE
  else if (deviceContext === 'Roteador-Core-01(config)') {
    if (trimmed === 'route-map FILTER-BGP deny 10') {
      nextDeviceContext = 'Roteador-Core-01(config-route-map)';
      updatedBgpState.createdRouteMap = true;
      resultLogs.push({ text: 'route-map FILTER-BGP deny 10 estabelecido. Entrando no modo de match filters.', type: 'success' });
    } else if (trimmed === 'router bgp 65112') {
      nextDeviceContext = 'Roteador-Core-01(config-router)';
      updatedBgpState.enteredRouterBgp = true;
      resultLogs.push({ text: 'router bgp 65112 iniciado. Entrando no bloco de configuracao da sessão do ASN.', type: 'success' });
    } else {
      resultLogs.push({ text: '% Command not recognized or invalid in global config mode.\nTente "route-map FILTER-BGP deny 10" ou "router bgp 65112".', type: 'error' });
    }
  }

  // ROUTE-MAP CONFIG MODE
  else if (deviceContext === 'Roteador-Core-01(config-route-map)') {
    if (trimmed === 'match ip address prefix-list FALSE-BGP') {
      updatedBgpState.matchedPrefixList = true;
      resultLogs.push({ text: 'Regra de match estabelecida com prefix-list FALSE-BGP.', type: 'success' });
    } else {
      resultLogs.push({ text: '% Invalid route-map configuration subcommand.\nTente "match ip address prefix-list FALSE-BGP" ou volte digitando "exit".', type: 'error' });
    }
  }

  // ROUTER BGP CONFIG MODE
  else if (deviceContext === 'Roteador-Core-01(config-router)') {
    if (trimmed === 'neighbor 180.2.2.1 route-map FILTER-BGP in') {
      updatedBgpState.configuredNeighbor = true;
      resultLogs.push({ text: '✓ neighbor 180.2.2.1 route-map FILTER-BGP in aplicado com sucesso para trafego de entrada.', type: 'success' });
    } else if (trimmed.startsWith('neighbor')) {
      resultLogs.push({ text: '% Neighbor syntax error. Para o Lab corporativo configure neighbor de forma a importar o filtro:\n"neighbor 180.2.2.1 route-map FILTER-BGP in"', type: 'error' });
    } else {
      resultLogs.push({ text: '% Subcomando incompleto ou invalido no escopo de router bgp.\nDidaticamente aplique: "neighbor 180.2.2.1 route-map FILTER-BGP in"', type: 'error' });
    }
  }

  return {
    logs: resultLogs,
    nextDir: '/',
    nextFileSystem: {},
    nextDeviceContext,
    bgpConfigState: updatedBgpState,
    triggerResolution
  };
}
