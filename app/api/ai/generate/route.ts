import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Bypass Vercel environment variables completely by hardcoding the key here
    // since Vercel's env propagation is repeatedly failing.
    const apiKey = "AIzaSyBXXGvnFJtaJzga1uEP2mbc06AmrDNe5Z0";

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Using the original gemini-1.5-pro model since the version of the SDK doesn't support the newer 2.0 or 1.5 flash string
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

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
