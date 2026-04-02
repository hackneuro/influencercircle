import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 });
    }

    const images: string[] = [];

    // Try Google Custom Search if configured officially
    if (process.env.GOOGLE_SEARCH_API_KEY && process.env.GOOGLE_SEARCH_CX) {
      const gUrl = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&cx=${process.env.GOOGLE_SEARCH_CX}&key=${process.env.GOOGLE_SEARCH_API_KEY}&searchType=image&num=10`;
      const gRes = await fetch(gUrl);
      if (gRes.ok) {
        const data = await gRes.json();
        const gImages = data.items?.map((item: any) => item.link) || [];
        images.push(...gImages);
      }
    }

    // Since Google blocks direct scraping, we use Bing Images as our primary robust engine
    try {
      const bingUrl = `https://www.bing.com/images/search?q=${encodeURIComponent(query)}`;
      const bingRes = await fetch(bingUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36'
        }
      });
      
      if (bingRes.ok) {
        const bingHtml = await bingRes.text();
        const $ = cheerio.load(bingHtml);
        
        $('a.iusc').each((_, el) => {
            const m = $(el).attr('m');
            if (m) {
                try {
                    const data = JSON.parse(m);
                    if (data.murl) images.push(data.murl);
                } catch(e) {}
            }
        });
      }
    } catch (bingErr) {
      console.error('Bing search error:', bingErr);
    }

    // Add DuckDuckGo as secondary mix
    try {
      const ddgUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}&iax=images&ia=images`;
      const ddgRes = await fetch(ddgUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36'
        }
      });
      
      if (ddgRes.ok) {
        const ddgHtml = await ddgRes.text();
        const $ = cheerio.load(ddgHtml);
        
        $('img.tile--img__img').each((_, el) => {
            const src = $(el).attr('src');
            if (src) {
                images.push(src.startsWith('//') ? `https:${src}` : src);
            }
        });
      }
    } catch (ddgErr) {
      console.error('DuckDuckGo search error:', ddgErr);
    }

    // Deduplicate and filter out base64/data URLs
    const finalImages = [...new Set(images)].filter(url => url.startsWith('http'));

    // If all engines fail, provide placeholders
    if (finalImages.length === 0) {
        for (let i = 0; i < 8; i++) {
            finalImages.push(`https://picsum.photos/seed/${encodeURIComponent(query)}${i}/800/600`);
        }
    }

    // Return a healthy mix of top 12 results
    return NextResponse.json({ images: finalImages.slice(0, 12) });
  } catch (error: any) {
    console.error('Image Search Error:', error);
    return NextResponse.json({ error: 'Failed to search images' }, { status: 500 });
  }
}
