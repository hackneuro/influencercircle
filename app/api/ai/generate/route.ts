import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const preferredModels = (process.env.GEMINI_MODELS ?? 'gemini-2.0-flash,gemini-1.5-flash,gemini-1.5-pro')
  .split(',')
  .map((m) => m.trim())
  .filter(Boolean);

let cachedModelNames: { at: number; names: Set<string> } | null = null;

async function listModelNames(apiKey: string) {
  const now = Date.now();
  if (cachedModelNames && now - cachedModelNames.at < 60 * 60 * 1000) return cachedModelNames.names;

  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`, {
    headers: { accept: 'application/json' },
  });

  if (!res.ok) {
    throw new Error(`Failed to list Gemini models (${res.status})`);
  }

  const json = await res.json();
  const names = new Set<string>(
    (json?.models ?? [])
      .map((m: any) => String(m?.name ?? '').replace(/^models\//, '').trim())
      .filter(Boolean)
  );

  cachedModelNames = { at: now, names };
  return names;
}

async function pickModel(apiKey: string) {
  const supported = await listModelNames(apiKey);
  return preferredModels.find((m) => supported.has(m)) ?? preferredModels[0];
}

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Missing GEMINI_API_KEY' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    const systemInstruction = `Você é um Social Media Manager altamente experiente da Influencer Circle.

    Seu objetivo principal é receber "rascunhos de conteúdo" do usuário e transformá-los em publicações perfeitas, virais e de alto engajamento para a plataforma LinkedIn. 
    
    A Influencer Circle é a maior rede de influencers e criadores de conteúdo do mundo e nós prezamos pela autoridade, inovação, conexões e oportunidades reais de mercado.
    
    Diretrizes de Escrita (Obrigatório):
    1. O Tom de voz deve ser sempre: Profissional, Engajador, Autêntico e com um toque sutil de "Thought Leadership" (Liderança de pensamento).
    2. O primeiro parágrafo DEVE ser um "Hook" (Gancho) forte que chame a atenção do leitor imediatamente para clicar em "Ler mais".
    3. Use quebras de linha frequentes (1-2 frases por parágrafo no máximo) para facilitar a leitura no celular (escaneabilidade).
    4. Adicione Emojis com moderação, mas o suficiente para quebrar o texto e adicionar contexto visual.
    5. Finalize sempre com uma pergunta ou uma chamada para ação (Call to Action) para gerar comentários na postagem.
    6. Adicione de 3 a 5 hashtags altamente relevantes e estratégicas no final do post. 
    7. Responda e escreva SEMPRE em Português do Brasil (PT-BR) de forma nativa e natural, a menos que o usuário escreva explicitamente em outro idioma.
    
    Não escreva introduções como "Aqui está o seu post:" ou explicações. Apenas retorne o texto final do post pronto para ser copiado e colado pelo usuário.`;

    const modelName = await pickModel(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: modelName,
      systemInstruction: {
        parts: [{ text: systemInstruction }],
        role: "system"
      }
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ text, model: modelName });
  } catch (error: any) {
    console.error('AI Generation Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate content' }, { status: 500 });
  }
}
