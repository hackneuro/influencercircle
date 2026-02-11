import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, phone } = body;

    // Validate required fields
    if (!email || !name || !phone) {
      return NextResponse.json(
        { error: 'Missing required fields: email, name, phone' },
        { status: 400 }
      );
    }

    const apiKey = "019bfb84-c738-7064-bba6-a9082e8e6140";
    const apiUrl = "https://remote.hackneuro.com/api/public/link/";

    console.log('[LinkedIn Integration] Requesting link for:', { email, name });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000); // 25s server-side timeout

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'X-API-KEY': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        name,
        phone, // Phone should be formatted as needed by the API (e.g., only digits)
        channel: 'linkedin',
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[LinkedIn Integration] API Error:', response.status, errorText);
      return NextResponse.json(
        { error: 'Failed to communicate with integration service', details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('[LinkedIn Integration] Success:', data);
    
    return NextResponse.json(data);

  } catch (error: any) {
    console.error('[LinkedIn Integration] Internal Error:', error);
    
    // Check for fetch errors (timeout, connection refused)
    if (error.name === 'AbortError' || error.cause?.code === 'UND_ERR_CONNECT_TIMEOUT' || error.cause?.code === 'ECONNREFUSED') {
       return NextResponse.json(
        { error: 'Integration service unavailable (Timeout)', details: 'The external link generation service timed out.' },
        { status: 504 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
