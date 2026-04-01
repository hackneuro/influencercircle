import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Return a simulated response if API key is not configured yet
      return NextResponse.json({ 
        text: `[Simulated AI Response - Configure GEMINI_API_KEY in .env.local to enable real AI]\n\n🚀 Exciting update! \n\n${prompt}\n\n#Growth #Success #Innovation` 
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const fullPrompt = `You are an expert LinkedIn ghostwriter. Turn the following thoughts/draft into a professional, highly engaging LinkedIn post. Include appropriate emojis and 3-5 relevant hashtags at the end. Keep the tone authentic and professional.\n\nDraft:\n${prompt}`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ text });
  } catch (error: any) {
    console.error('AI Generation Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate content' }, { status: 500 });
  }
}
