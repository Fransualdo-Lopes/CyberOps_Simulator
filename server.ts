import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize GoogleGenAI server-side with strict telemetry User-Agent header
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

// AI Mentor endpoint
app.post('/api/mentor', async (req, res) => {
  const { prompt, challengeTitle, challengeContext, commandHistory, userLevel, currentTier, selectedNode } = req.body;

  if (!ai) {
    return res.json({
      response: "Olá! O Mentor IA está em modo offline pois a chave GEMINI_API_KEY não foi configurada nos segredos da aplicação. Mas você pode resolver os comandos listados na barra de dicas para completar o treinamento!"
    });
  }

  try {
    const systemInstruction = `
Você é o Mentor IA Técnico do CyberOps Simulator (ou Backbone Defense Simulator), um engenheiro de infraestrutura, redes (BGP, OSPF) e cibersegurança (SIEM, SOC, Linux Hardening) extremamente didático, motivador e focado em inclusão social.
Seu objetivo é guiar estudantes de baixa renda para conquistarem vagas de tecnologia de alto impacto prático.

INSTRUÇÕES CRÍTICAS DE RESPOSTA:
1. Responda em Português brasileiro.
2. Seja objetivo, direto e motivador. Evite jargões excessivos sem explicação rápida.
3. NUNCA dê a resposta de bandeja (por exemplo: não diga "digite exatamente o comando kill -9 1442 para ganhar"). Em vez disso, explique COMO raciocinar: "Descubra o PID do processo hostil usando ps aux e use o sinal de terminação forçada 9 do utilitário kill."
4. Adapte sua resposta ao nível do usuário. O nível atual dele é Nível ${userLevel || 1} (${currentTier || 'Suporte N1'}).
5. O estudante está resolvendo o desafio: "${challengeTitle}". Contexto: "${challengeContext}". Ele está focado no equipamento "${selectedNode || 'Termo Geral'}".
6. Histórico de comandos que ele executou neste laboratório até agora: [${(commandHistory || []).join(', ') || 'Nenhum por enquanto'}]. Utilidades do CLI de treino incluem comandos como ls, cat, grep, ps aux, kill, lsof, configure terminal, route-map, router bgp, etc.

Responda curto, no máximo 3 ou 4 parágrafos pequenos, focando na ação imediata que ele pode tomar no terminal.
`;

    const userMsg = `
Minha dúvida/pergunta atual é: "${prompt}"

Histórico de ações no terminal desta sessão: ${JSON.stringify(commandHistory || [])}
Qual a sua orientação profissional curta para o meu próximo passo?
`;

    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { role: 'user', parts: [{ text: systemInstruction + "\n\n" + userMsg }] }
      ]
    });

    res.json({
      response: result.text || "Sem resposta gerada. Tente reformular a pergunta."
    });

  } catch (error: any) {
    console.error("Gemini API error:", error);
    res.status(500).json({
      response: `Houve um erro ao processar sua mentoria via IA: ${error.message || error}`
    });
  }
});

// Setup Vite Pipeline
async function setupVite() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[CyberOps Server] Running on http://0.0.0.0:${PORT} under NODE_ENV=${process.env.NODE_ENV}`);
  });
}

setupVite();
